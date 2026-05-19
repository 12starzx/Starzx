# Pinguino — Promo Discord (Remotion + React Three Fiber)

Vertical promo video **1080 × 1920 (9:16)**, **18 s at 30 fps** (540 frames),
built entirely in code with [Remotion](https://remotion.dev) and
[React Three Fiber](https://r3f.docs.pmnd.rs/) — no external assets.

Designed to drive traffic to the **Pinguino | MiddleMan** Discord:
`discord.gg/NRsafWSgUr`.

## Structure

A live 3D scene (orbiting camera, hue-cycling torus knot, ring of icosahedra,
seeded starfield) plays behind an overlay layer: an animated corner-bracket
frame, a server badge, a segmented progress bar, and six subtitle cards.

| Card | Frames | Message |
|------|--------|---------|
| 1 — Hook | 0 → 90 | Rejoins Pinguino |
| 2 — Vocaux | 90 → 180 | Vocaux actifs tous les jours |
| 3 — Brainrot | 180 → 270 | Infos & leaks Steal a Brainrot |
| 4 — Service | 270 → 360 | Middleman sécurisé |
| 5 — Giveaway | 360 → 450 | Un Garama color à gagner |
| 6 — CTA | 450 → 540 | discord.gg/NRsafWSgUr — lien en bio |

Each subtitle card animates: glowing emoji with orbiting dots, a
character-by-character title reveal, a growing underline and a sub-line.

The composition lives in `src/Scene.tsx`; the 3D background in
`src/ThreeBackground.tsx`.

## Commands

**Install dependencies**

```console
npm install
```

**Preview in Remotion Studio**

```console
npm run dev
```

**Render the video to MP4**

```console
npx remotion render Scene out/scene.mp4
```

(equivalent shortcut: `npm run render`)

To edit the script, message text or colors, change the `SEGMENTS` array at the
top of `src/Scene.tsx`.
