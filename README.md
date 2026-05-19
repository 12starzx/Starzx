# Pinguino — Promo verticale néon (Remotion)

Edit promo dynamique **1080 × 1920 (9:16)**, **30 s à 60 fps** (1800 frames),
généré intégralement en React/CSS avec [Remotion](https://remotion.dev) —
aucune dépendance 3D, aucun asset externe.

Style : cyan / bleu électrique, textes 3D biseautés avec glow néon, grille
en perspective, particules lumineuses, transitions flash franches entre les
plans.

## Découpage des 7 plans (60 fps)

| Plan | Frames | Durée | Contenu |
|------|--------|-------|---------|
| 1 — Hook | 0 → 180 | 0–3 s | « SALUT » pop avec rebond sur grille perspective |
| 2 — Accueil | 180 → 360 | 3–6 s | « BIENVENUE » jaillit vers la caméra |
| 3 — Marque | 360 → 600 | 6–10 s | Cercle néon pulsant + « PINGUINO » |
| 4 — Service | 600 → 840 | 10–14 s | « MIDDLE MAN DE CONFIANCE » |
| 5 — Vibes | 840 → 1140 | 14–19 s | Flash : Vocaux actifs / Ambiance non-stop / Communauté sérieuse |
| 6 — CTA | 1140 → 1440 | 19–24 s | Zoom avant « REJOINS-NOUS MAINTENANT » |
| 7 — Lien | 1440 → 1800 | 24–30 s | Cercle néon + « LIEN EN BIO » |

Éléments récurrents sur toute la vidéo : particules cyan en fond, glow
ambiant permanent, léger tremblement des textes au rythme, flash blanc au
début de chaque plan.

Toute la composition tient dans `src/Scene.tsx`.

## Audio

Le projet est sans son volontairement, mais structuré pour pouvoir en
ajouter un facilement. Voir le commentaire au-dessus du composant `Scene`
dans `src/Scene.tsx` : il suffit de dé-commenter deux lignes et déposer un
fichier dans `public/`.

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
npx remotion render Scene out/scene.mp4
```

(raccourci équivalent : `npm run render`)
