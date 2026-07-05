import express from "express";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import Anthropic from "@anthropic-ai/sdk";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DATA_DIR = path.join(__dirname, "data");
const CONFIG_PATH = path.join(__dirname, "config", "merchant.json");

const MODEL = process.env.CLAUDE_MODEL || "claude-opus-4-8";
const PORT = process.env.PORT || 3000;

const app = express();
app.use(express.json({ limit: "1mb" }));
app.use(express.static(path.join(__dirname, "public")));

// ---------------------------------------------------------------------------
// Configuration du commerçant
// ---------------------------------------------------------------------------

function loadMerchant() {
  return JSON.parse(fs.readFileSync(CONFIG_PATH, "utf8"));
}

function buildSystemPrompt(m) {
  const horaires = Object.entries(m.horaires || {})
    .map(([jour, h]) => `- ${jour} : ${h}`)
    .join("\n");
  const produits = (m.produits || [])
    .map((p) => `- ${p.nom} — ${p.prix}${p.description ? ` (${p.description})` : ""}`)
    .join("\n");
  const faq = (m.faq || [])
    .map((f) => `Q : ${f.question}\nR : ${f.reponse}`)
    .join("\n\n");

  return `Tu es l'assistant virtuel de « ${m.nom} » (${m.type}), au service de ses clients.

## Le commerce
${m.description}

Adresse : ${m.adresse}
Téléphone : ${m.telephone}

## Horaires d'ouverture
${horaires}

## Produits et tarifs
${produits}

## Questions fréquentes
${faq}

## Ton rôle
- Réponds aux questions des clients sur le commerce : horaires, produits, prix, services.
- Utilise l'outil creer_reservation pour enregistrer une réservation quand un client le demande, et creer_commande pour enregistrer une commande. Avant d'appeler l'outil, assure-toi d'avoir au minimum le nom du client, un numéro de téléphone et le détail de la demande — pose les questions manquantes une par une.
- Après un appel d'outil réussi, confirme au client ce qui a été enregistré et rappelle que le commerçant le recontactera si besoin.
- Si tu ne connais pas une information (elle n'est ni dans ce contexte ni donnée par le client), dis-le honnêtement et invite le client à appeler le ${m.telephone}. N'invente jamais de prix, d'horaire ou de disponibilité.
- Reste dans le cadre du commerce : décline poliment les demandes hors sujet.
- Ton : ${m.ton}.
${m.instructions_supplementaires ? `\n## Consignes du commerçant\n${m.instructions_supplementaires}` : ""}`;
}

// ---------------------------------------------------------------------------
// Outils (réservations et commandes enregistrées dans data/*.json)
// ---------------------------------------------------------------------------

const TOOLS = [
  {
    name: "creer_reservation",
    description:
      "Enregistre une réservation (table, retrait, rendez-vous) pour le client. À appeler uniquement quand le client a confirmé et que nom, téléphone, date et heure sont connus.",
    input_schema: {
      type: "object",
      properties: {
        nom: { type: "string", description: "Nom du client" },
        telephone: { type: "string", description: "Numéro de téléphone du client" },
        date: { type: "string", description: "Date souhaitée, ex. 2026-07-12" },
        heure: { type: "string", description: "Heure souhaitée, ex. 12h30" },
        nb_personnes: { type: "integer", description: "Nombre de personnes, si pertinent" },
        notes: { type: "string", description: "Précisions utiles (allergies, occasion, etc.)" }
      },
      required: ["nom", "telephone", "date", "heure"]
    }
  },
  {
    name: "creer_commande",
    description:
      "Enregistre une commande de produits pour le client (retrait en boutique). À appeler uniquement quand le client a confirmé et que nom, téléphone et articles sont connus.",
    input_schema: {
      type: "object",
      properties: {
        nom: { type: "string", description: "Nom du client" },
        telephone: { type: "string", description: "Numéro de téléphone du client" },
        articles: {
          type: "array",
          description: "Liste des articles commandés",
          items: {
            type: "object",
            properties: {
              produit: { type: "string" },
              quantite: { type: "integer" }
            },
            required: ["produit", "quantite"]
          }
        },
        date_retrait: { type: "string", description: "Date de retrait souhaitée, ex. 2026-07-12" },
        notes: { type: "string", description: "Précisions utiles (personnalisation, allergies, etc.)" }
      },
      required: ["nom", "telephone", "articles"]
    }
  }
];

function appendRecord(file, record) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
  const filePath = path.join(DATA_DIR, file);
  const list = fs.existsSync(filePath)
    ? JSON.parse(fs.readFileSync(filePath, "utf8"))
    : [];
  const entry = {
    id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    cree_le: new Date().toISOString(),
    ...record
  };
  list.push(entry);
  fs.writeFileSync(filePath, JSON.stringify(list, null, 2));
  return entry;
}

function executeTool(name, input) {
  if (name === "creer_reservation") {
    const entry = appendRecord("reservations.json", input);
    return JSON.stringify({ statut: "enregistrée", reference: entry.id });
  }
  if (name === "creer_commande") {
    const entry = appendRecord("commandes.json", input);
    return JSON.stringify({ statut: "enregistrée", reference: entry.id });
  }
  throw new Error(`Outil inconnu : ${name}`);
}

// ---------------------------------------------------------------------------
// API chat — streaming NDJSON ({type:"text"|"tool"|"done"|"error"} par ligne)
// ---------------------------------------------------------------------------

let anthropic = null;
function getClient() {
  if (!anthropic) anthropic = new Anthropic(); // lit ANTHROPIC_API_KEY
  return anthropic;
}

function sanitizeMessages(raw) {
  if (!Array.isArray(raw)) return [];
  return raw
    .filter(
      (m) =>
        m &&
        (m.role === "user" || m.role === "assistant") &&
        typeof m.content === "string" &&
        m.content.trim().length > 0
    )
    .slice(-40) // borne l'historique envoyé par le navigateur
    .map((m) => ({ role: m.role, content: m.content }));
}

app.post("/api/chat", async (req, res) => {
  const incoming = sanitizeMessages(req.body?.messages);
  if (incoming.length === 0 || incoming[incoming.length - 1].role !== "user") {
    return res.status(400).json({ error: "messages invalides" });
  }

  res.setHeader("Content-Type", "application/x-ndjson; charset=utf-8");
  res.setHeader("Cache-Control", "no-cache");
  const send = (obj) => res.write(JSON.stringify(obj) + "\n");

  const merchant = loadMerchant();
  const system = [
    {
      type: "text",
      text: buildSystemPrompt(merchant),
      cache_control: { type: "ephemeral" }
    }
  ];

  const messages = incoming;

  try {
    const client = getClient();

    // Boucle agentique : on continue tant que Claude demande des outils.
    for (let step = 0; step < 6; step++) {
      const stream = client.messages.stream({
        model: MODEL,
        max_tokens: 8192,
        system,
        tools: TOOLS,
        messages
      });

      stream.on("text", (delta) => send({ type: "text", text: delta }));

      const message = await stream.finalMessage();

      if (message.stop_reason !== "tool_use") break;

      messages.push({ role: "assistant", content: message.content });

      const toolResults = [];
      for (const block of message.content) {
        if (block.type !== "tool_use") continue;
        send({ type: "tool", name: block.name });
        let content;
        let isError = false;
        try {
          content = executeTool(block.name, block.input);
        } catch (err) {
          content = `Erreur : ${err.message}`;
          isError = true;
        }
        toolResults.push({
          type: "tool_result",
          tool_use_id: block.id,
          content,
          ...(isError ? { is_error: true } : {})
        });
      }
      messages.push({ role: "user", content: toolResults });
    }

    send({ type: "done" });
  } catch (error) {
    let msg = "Une erreur est survenue. Merci de réessayer.";
    if (error instanceof Anthropic.AuthenticationError) {
      msg = "Clé API invalide ou absente : définissez ANTHROPIC_API_KEY côté serveur.";
    } else if (error instanceof Anthropic.RateLimitError) {
      msg = "Trop de demandes en ce moment, merci de patienter quelques secondes.";
    } else if (error instanceof Anthropic.APIError) {
      msg = `Erreur API (${error.status}) : ${error.message}`;
    } else if (error?.message?.includes("apiKey")) {
      msg = "Clé API absente : définissez la variable d'environnement ANTHROPIC_API_KEY.";
    }
    console.error("Erreur /api/chat :", error);
    send({ type: "error", message: msg });
  } finally {
    res.end();
  }
});

// ---------------------------------------------------------------------------
// API admin (lecture des réservations/commandes) + config publique
// ---------------------------------------------------------------------------

function readRecords(file) {
  const filePath = path.join(DATA_DIR, file);
  if (!fs.existsSync(filePath)) return [];
  return JSON.parse(fs.readFileSync(filePath, "utf8"));
}

app.get("/api/config", (_req, res) => {
  const { nom, type, adresse, telephone } = loadMerchant();
  res.json({ nom, type, adresse, telephone });
});

app.get("/api/reservations", (_req, res) => res.json(readRecords("reservations.json")));
app.get("/api/commandes", (_req, res) => res.json(readRecords("commandes.json")));

app.listen(PORT, () => {
  const merchant = loadMerchant();
  console.log(`✔ Agent IA de « ${merchant.nom} » démarré`);
  console.log(`  Chat client : http://localhost:${PORT}/`);
  console.log(`  Admin       : http://localhost:${PORT}/admin.html`);
  console.log(`  Modèle      : ${MODEL}`);
  if (!process.env.ANTHROPIC_API_KEY) {
    console.warn("⚠ ANTHROPIC_API_KEY n'est pas définie — le chat renverra une erreur tant qu'elle manque.");
  }
});
