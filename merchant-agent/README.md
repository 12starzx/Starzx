# Agent IA pour commerçants

Assistant virtuel prêt à l'emploi pour un commerce de proximité, propulsé par
l'API Claude. Les clients du commerçant discutent avec l'assistant dans une
page web ; l'assistant répond sur les horaires, les produits et les prix, et
peut **enregistrer des réservations et des commandes** que le commerçant
retrouve dans son espace admin.

## Fonctionnalités

- 💬 **Chat client en streaming** — les réponses s'affichent mot à mot.
- 🏪 **Entièrement configurable** via `config/merchant.json` : nom, horaires,
  produits, FAQ, ton, consignes. Aucun code à toucher pour changer de commerce.
- 📅 **Prise de réservations** et 🧾 **prise de commandes** via le *tool use*
  de Claude — enregistrées dans `data/reservations.json` et `data/commandes.json`.
- 🗂 **Espace commerçant** (`/admin.html`) : tableau des réservations et
  commandes reçues.
- 🔒 L'assistant ne répond que dans le cadre du commerce et n'invente ni prix
  ni disponibilité (consignes système strictes).
- ⚡ Prompt caching activé sur le prompt système pour réduire coût et latence.

## Démarrage

```console
cd merchant-agent
npm install
export ANTHROPIC_API_KEY=sk-ant-...   # votre clé sur https://platform.claude.com
npm start
```

Puis ouvrez :

- **Chat client** : http://localhost:3000/
- **Espace commerçant** : http://localhost:3000/admin.html

## Configuration du commerce

Tout se passe dans [`config/merchant.json`](config/merchant.json). Le fichier
livré contient un exemple complet (boulangerie). Champs :

| Champ | Rôle |
|---|---|
| `nom`, `type`, `description` | Identité du commerce |
| `adresse`, `telephone` | Coordonnées (le téléphone sert de repli quand l'IA ne sait pas) |
| `horaires` | Objet `{ jour: plage }` |
| `produits` | Liste `{ nom, prix, description }` |
| `faq` | Liste `{ question, reponse }` |
| `instructions_supplementaires` | Consignes libres du commerçant |
| `ton` | Style de réponse souhaité |

Le serveur relit le fichier à chaque requête : modifiez-le et testez sans
redémarrer.

## Variables d'environnement

| Variable | Défaut | Rôle |
|---|---|---|
| `ANTHROPIC_API_KEY` | — | **Obligatoire.** Clé API Claude. |
| `CLAUDE_MODEL` | `claude-opus-4-8` | Modèle utilisé. |
| `PORT` | `3000` | Port HTTP. |

## Architecture

```
merchant-agent/
├── server.js            # Express + boucle agentique Claude (streaming, tool use)
├── config/merchant.json # Profil du commerce (modifiable à chaud)
├── data/                # reservations.json / commandes.json (créés à la volée)
└── public/
    ├── index.html       # Chat client
    └── admin.html       # Espace commerçant
```

Le serveur expose :

- `POST /api/chat` — corps `{ messages: [{role, content}] }`, réponse en
  NDJSON streamé (`{type:"text"|"tool"|"done"|"error"}` par ligne).
- `GET /api/reservations`, `GET /api/commandes` — lecture des enregistrements.
- `GET /api/config` — infos publiques du commerce pour l'interface.

## Pistes d'évolution

- Multi-commerçants : un profil + une base par commerçant (Supabase/Postgres).
- Authentification de l'espace admin.
- Canal WhatsApp Business ou Instagram via l'API Meta/Twilio.
- Notifications (e-mail/SMS) au commerçant à chaque réservation.
