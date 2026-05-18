# Pixiz — Publicité vidéo animée (Remotion)

Publicité verticale **1080 × 1920 (9:16)**, **18 s à 30 fps** (540 frames),
générée intégralement en code avec [Remotion](https://remotion.dev) — aucune
ressource externe (formes, dégradés et typographie système uniquement).

## Structure narrative

| Scène | Frames | Durée | Contenu |
|-------|--------|-------|---------|
| 1 — Accroche | 0 → 90 | 0–3 s | Une idée mal montée est une idée perdue |
| 2 — Le constat | 90 → 210 | 3–7 s | Le montage décide de la rétention |
| 3 — La réponse | 210 → 360 | 7–12 s | Pixiz et ses 6 compétences clés |
| 4 — La preuve | 360 → 450 | 12–15 s | +50 vidéos, 1 an ½ d'expérience |
| 5 — Call to action | 450 → 540 | 15–18 s | Promesse + invitation à contacter |

Toute la composition tient dans `src/PixizAd.tsx`.

## Commandes

**Installer les dépendances**

```console
npm install
```

**Aperçu dans le Studio Remotion**

```console
npm run dev
```

**Rendre la vidéo en MP4**

```console
npx remotion render PixizAd out/pixiz.mp4
```

(raccourci équivalent : `npm run render`)
