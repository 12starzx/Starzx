# VERDÆ — Démonstration WebGL vivante

Landing page premium de **tourisme régénératif**, codée en HTML/CSS/JS vanilla +
**Three.js** (WebGL, ESM via import-map). Aucune étape de build : il suffit de servir le
dossier en HTTP (les modules ES nécessitent un serveur, pas le protocole `file://`).

## Lancer en local

```bash
# depuis la racine du dépôt
npx serve site          # ou :
python3 -m http.server 8000 --directory site
```

Puis ouvrir <http://localhost:8000> (ou le port indiqué).

> ⚠️ Three.js est chargé depuis le CDN unpkg via l'`importmap` du `index.html` —
> une connexion réseau est nécessaire au premier chargement.

## Contenu

| Fichier | Rôle |
|---------|------|
| `index.html` | Structure complète (hero, recherche, expériences, séjours, globe, CTA…) |
| `css/styles.css` | Design system VERDÆ (palette, typographies, glassmorphisme, motion, responsive) |
| `js/scene.js` | Scène 3D Hero — vallée cinématique (montagnes, lac à shader, brume, pollen, parallaxe scroll) |
| `js/globe.js` | Globe terrestre 3D interactif (shader procédural, points de restauration, arcs de flux) |
| `js/data.js` | Contenu (destinations, expériences, refuges, témoignages) |
| `js/main.js` | Orchestration UI (preloader, curseur magnétique, reveals, compteurs, tilt, navigation) |

Le dossier de direction artistique complet est dans [`../docs/DESIGN.md`](../docs/DESIGN.md).

## Compatibilité
Chrome / Edge / Firefox / Safari récents (WebGL2 + import-map + `backdrop-filter`).
`prefers-reduced-motion` et terminaux tactiles sont pris en charge (3D allégée, curseur natif).
