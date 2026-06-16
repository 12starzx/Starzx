# VERDÆ — Dossier de Direction Artistique & Produit
### « Voyager en laissant la Terre plus belle. »

> Plateforme premium de **tourisme régénératif**. Un mélange assumé de **Pixar** (chaleur,
> émotion, lumière), **Apple** (rigueur, silence, hiérarchie), **Airbnb** (confiance, désir
> de partir), **Unreal Engine 5** (densité, photoréalisme stylisé) et des **plus beaux sites
> WebGL du monde** (immersion, motion, profondeur).

Ce document est le dossier de concours. Le code de la démonstration vivante est dans
[`/site`](../site) — une landing page WebGL réelle (Three.js, scrollytelling, globe 3D
interactif). Voir [`/site/README.md`](../site/README.md) pour la lancer.

---

## 0 · Positionnement — la thèse à un million d'euros

Le tourisme « durable » se contente de **réduire les dégâts**. VERDÆ change le récit :
chaque séjour rend la planète **mesurablement plus belle** — hectares replantés, CO₂
séquestré net, biodiversité recensée, le tout **suivi en direct** depuis la poche du
voyageur. On ne vend pas une bonne conscience, on vend une **empreinte positive prouvée**
et un voyage spectaculaire.

| Axe | Promesse | Preuve dans le produit |
|-----|----------|------------------------|
| Émotion | « J'ai envie de partir là, maintenant » | Hero WebGL cinématique, son, lumière dorée |
| Confiance | « C'est sérieux et mesuré » | Dashboard satellite, passeport régénératif infalsifiable |
| Innovation | « Ça vient du futur » | Voyage virtuel 3D, IA Sylvie, AR terrain |
| Désir | « C'est beau et rare » | Refuges signature, collection éditorialisée |

---

## 1 · Direction Artistique

### 1.1 Concept créatif — « Forêt cinématique × luxe nordique »
Une lumière de fin de journée, une brume qui flotte sur un lac glaciaire, des crêtes
sombres en silhouette. Le luxe n'est pas l'or clinquant : c'est **le silence, l'espace
négatif et la matière**. On compose comme un chef opérateur, pas comme une agence web.

### 1.2 Palette de couleurs
Système « **nuit-forêt + lumière vivante** ». Fond profond pour faire briller la 3D, accents
rares et précieux.

| Rôle | Nom | Hex | Usage |
|------|-----|-----|-------|
| Fond nuit | `forest-deep` | `#06140E` | Arrière-plans, fondus 3D |
| Fond principal | `forest` | `#0A1F17` | Body, brume Three.js |
| Surface | `forest-2` | `#0E2A1E` | Cartes, glassmorphisme |
| Vert vivant | `canopy` | `#2F7D52` | CTA, données positives |
| Sauge | `sage` | `#86B79A` | Texte secondaire, labels |
| **Menthe glaciaire** | `glacier` | `#9FE7D2` | **Accent signature**, halos, néons |
| **Or solaire** | `sun` | `#F0C778` | Lumière, soleil 3D, dégradés titres |
| Blanc chaud | `mist` | `#F4F1E7` | Texte principal |

**Règle d'or :** 70 % nuit-forêt, 20 % blanc chaud + sauge, 10 % accents (glacier/sun).
Les accents ne servent **jamais** de fond — uniquement lumière, contour, donnée vivante.

### 1.3 Typographies
Duo **éditorial × technique** :
- **Fraunces** (serif optique, display) — titres, chiffres-clés, citations. Élégance Pixar/Apple,
  graisses 300–500, optical sizing activé. Les `<em>` passent en italique Fraunces sur dégradé
  `sun → glacier`.
- **Manrope** (grotesque géométrique) — corps, UI, navigation, labels. Lisible, neutre, premium.

Échelle fluide `clamp()` : Hero jusqu'à `128px`, H2 `34→76px`, corps `16–21px`.
Interlettrage négatif sur les grands titres (`-0.02em`), positif et capitales sur les
labels (`+0.24em`).

### 1.4 Style visuel & matière
- **Glassmorphisme maîtrisé** : `backdrop-filter: blur(16px)`, bordures `rgba(glacier, .14)`,
  ombres longues et basses (`0 30px 80px -30px`).
- **Grain & lumière** : halos radiaux flous derrière les CTA, god-rays dorés dans le hero.
- **Coins généreux** (22–34px) pour la douceur Airbnb/Pixar, mais alignements stricts Apple.
- **Iconographie** : glyphes géométriques fins (◐ ✶ ⬡ ◉ ⟁ ❖), jamais d'icônes « stock ».

### 1.5 Ambiance générale
Calme, ample, respirante. Le mouvement est **lent et organique** (courbes
`cubic-bezier(.16,1,.3,1)`), jamais nerveux. Le son (optionnel) est un field-recording de
forêt à l'aube. On vise l'émotion du **premier plan d'un film Pixar**.

### 1.6 Moodboard détaillé
1. **Lumière** — heure dorée, contre-jour, brume volumétrique, rayons à travers les sapins.
2. **Matière** — bois brut, lin écru, verre dépoli, eau noire, mousse, neige.
3. **Forme** — silhouettes de crêtes, reflets sur lac, cabanes minimales sur pilotis.
4. **Mouvement** — pollen qui flotte, vagues lentes, caméra qui descend dans la vallée.
5. **Références** — *Soul*/*Luca* (Pixar), Apple AirPods Pro (page produit), Airbnb 2022
   rebrand, Bruno Simon, Lusion, Active Theory, Unreal Engine *Valley of the Ancient*.

---

## 2 · Expérience Utilisateur (UX)

### 2.1 Parcours utilisateur complet
```
ENVIE ──► IMMERSION ──► CONFIANCE ──► RÉSERVATION ──► VOYAGE ──► PREUVE ──► AMBASSADEUR
```
1. **Envie** — Hero émotionnel : on tombe amoureux d'un lieu en 2 secondes.
2. **Immersion** — Recherche par envie (« silence et forêt brumeuse ») → cartes destinations →
   survol 3D photoréaliste de la vallée.
3. **Confiance** — Données d'impact, refuges signature, témoignages, note 4,96/5.
4. **Réservation** — Mobilité douce intégrée (train + vélo + navette), un seul flux.
5. **Voyage** — AR terrain, IA Sylvie en guide, navigation hors-ligne.
6. **Preuve** — Empreinte positive en direct, hectares géolocalisés à son nom.
7. **Ambassadeur** — Passeport régénératif partageable → boucle d'acquisition virale.

### 2.2 Navigation
- **Barre flottante** translucide qui se condense au scroll (`scrolled`).
- 5 ancres claires : *Concept · Explorer · Expériences · Séjours · Carte 3D*.
- **Bouton magnétique** « Commencer » toujours présent (conversion).
- Mobile : plein écran, gros tap targets, menu burger animé.
- **Fil de progression** dégradé en haut de page (repère + plaisir).

### 2.3 Hiérarchie de l'information
Une idée par section, un verbe par titre. Rythme **respiration → tension → respiration** :
Hero (désir) → Concept (raison) → Explorer (action) → Expériences (preuve) → Séjours (désir) →
Globe (échelle) → Features (futur) → Stats (crédibilité) → Témoignages (social proof) → CTA.

### 2.4 Optimisation mobile & desktop
- **Desktop** : 3D plein écran, parallaxe souris, curseur magnétique, tilt sur cartes.
- **Mobile** : 3D allégée (moins de particules, pixel ratio plafonné à 2), curseur natif,
  colonnes empilées, sticky désactivé, `100svh` pour gérer la barre d'URL.
- **Performance** : `IntersectionObserver` pour révéler/animer à la demande,
  `prefers-reduced-motion` respecté partout, `setAnimationLoop` Three.js (pause onglet caché).
- **Accessibilité** : contrastes AA sur le texte, focus visibles, `aria-label`, ordre logique,
  fallback de révélation après 4 s si le WebGL échoue.

---

## 3 · Conception 3D Avancée

La scène hero (`/site/js/scene.js`) est une **vallée temps réel** composée en couches, comme
un décor de cinéma :

| Élément 3D | Technique | Interaction |
|------------|-----------|-------------|
| **Ciel** | Dôme `SphereGeometry` + shader dégradé vertical (horizon→zénith) | Statique, sert de toile |
| **Soleil** | `CircleGeometry` + shader halo (cœur + diffusion) | Monte/descend au scroll |
| **Montagnes** | 4 plans `PlaneGeometry` déplacés par bruit de crêtes, `flatShading` low-poly | **Parallaxe différentielle** à la souris |
| **Lac** | Plan 120×120 + **shader de vagues** (somme de sinus) + reflet solaire fresnel + estompage brume | Vagues animées en continu |
| **Pollen / lucioles** | 420 `Points` + shader additif, taille fonction de la profondeur | Flottement organique, scintillement |
| **Brume** | `FogExp2` + estompage shader dans l'eau | Fond les couches entre elles |

**Direction caméra** : descente douce dans la vallée pilotée par le scroll
(`camera.position.y/z`), dérive latérale au mouvement de souris, `lookAt` qui plonge — on a
l'impression de **marcher vers le lac**. Tout est lissé (`+= delta * 0.08`) pour une inertie
cinématographique.

**Le globe** (`/site/js/globe.js`) : sphère à shader **sans aucune texture** — les continents
sont générés par **fbm (bruit fractal)** dans le fragment shader, l'atmosphère par un halo
fresnel additif. Points de restauration pulsants (lat/lon → sphère), **arcs de Bézier** entre
sites avec particules voyageuses animées, rotation **draggable** avec inertie.

---

## 4 · Landing Page Premium — section par section

| # | Section | Intention | Détail signature |
|---|---------|-----------|------------------|
| **Hero** | Désir immédiat | Titre Fraunces 128px en *rise* masqué, lead, double CTA, 3 stats animées, coordonnées GPS du lieu, indicateur de scroll | Vallée WebGL plein écran derrière le texte |
| **Navigation** | Orientation | Barre flottante condensable, liens à soulignement animé, CTA magnétique, fil de progression | Glassmorphisme au scroll |
| **Marquee** | Respiration / rythme | Bandeau défilant des piliers (forêts, lacs, refuges, mobilité, faune) | Serif + étoiles or |
| **Concept** | La raison | 3 cartes (restauration mesurée, immersion, IA) avec halo au survol | Tilt 3D + glow radial |
| **Explorer** | L'action | Barre de recherche « par envie » (champ brillant animé) + grille de 8 destinations | Cartes à dégradé, zoom au survol, badge impact |
| **Expériences** | La preuve vivante | 6 expériences notées sur leur **impact régénératif réel** (barre animée) | Scores au lieu de slogans |
| **Séjours** | Le désir | Liste sticky de refuges signature ↔ visuel qui change à la sélection, badge « énergie positive 117 % » | Sticky scroll synchronisé |
| **Globe 3D** | L'échelle | Globe interactif draggable + compteur « hectares en régénération » + légende | Arcs de flux temps réel |
| **Features** | Le futur | 6 technologies différenciantes en grille | Icônes glyphes, tilt |
| **Statistiques** | La crédibilité | 4 chiffres-clés en compteurs animés (ha, %, t CO₂, note) | Formatage FR, décimales |
| **Témoignages** | Social proof | Rail scroll-snap de citations Fraunces, avatars dégradés | Voix de voyageurs « revenus changés » |
| **Call To Action** | La conversion | Promesse émotionnelle + capture e-mail (état succès animé) + halo lumineux | « Et si votre voyage guérissait un bout de monde ? » |
| **Footer** | La structure | Marque + 3 colonnes (Explorer / Plateforme / Agence) + signature « Fait avec WebGL » | Glassmorphisme sombre |

---

## 5 · Objets 3D — concepts détaillés

- **Montagnes 3D** — crêtes low-poly `flatShading`, 4 plans superposés en parallaxe, teintes
  qui s'éclaircissent vers le fond (perspective atmosphérique). *Implémenté.*
- **Forêts 3D** — sapins en cônes instanciés (`InstancedMesh`) sur les versants, légère
  ondulation au vent ; en hero, suggérées par les silhouettes + pollen. *Roadmap visuelle décrite.*
- **Lacs 3D** — plan à shader de vagues, reflet solaire fresnel, profondeur estompée par la
  brume, scintillement procédural. *Implémenté.*
- **Chalets 3D** — refuges signature en glTF léger (cabane canopée, dôme aurora, ponton lac) ;
  posés sans béton, démontables. Représentés ici par la collection « Séjours » à visuels
  dynamiques + survol 3D à venir.
- **Véhicules écologiques 3D** — train régional, vélo électrique, navette solaire ; modèles
  low-poly animés pour le module « mobilité douce intégrée ».
- **Animaux 3D** — faune discrète (cerf, renard, rapace) en silhouettes animées pour le safari
  « faune douce » ; jamais intrusive, fidèle au manifeste éthique.
- **Cartes interactives 3D** — survol de vallée photoréaliste avant réservation (terrain
  déplacé + sentiers + points d'intérêt cliquables).
- **Globe terrestre 3D** — sphère shader procédurale, halo atmosphérique, points pulsants,
  arcs de Bézier de flux voyageurs, rotation draggable à inertie. *Implémenté.*

---

## 6 · Animations

- **Entrée** — preloader (feuille tracée en SVG + barre + compteur), puis titres en *rise*
  masqué ligne par ligne, fondu des sections.
- **Effets de scroll** — `IntersectionObserver` révèle chaque bloc (`translateY + opacity`),
  caméra 3D pilotée par le scroll, fil de progression, condensation de la nav.
- **Effets de profondeur** — `FogExp2`, perspective atmosphérique des montagnes, tailles de
  pollen dépendantes de la profondeur, halos flous.
- **Parallaxe** — montagnes à facteurs différentiels (souris), soleil et caméra (scroll),
  cartes à tilt 3D.
- **Hover** — boutons magnétiques (attraction du curseur), soulignement de liens, glow radial
  des cartes, zoom des destinations, rotation du bouton recherche.
- **Interactions souris** — curseur personnalisé lissé qui grossit sur les zones actives
  (`mix-blend-mode: difference`), dérive de caméra, drag du globe.
- **Interactions tactiles** — drag/inertie du globe au doigt, curseur natif rétabli, 3D
  allégée, cibles tactiles ≥ 44px, scroll-snap des témoignages.

Toutes les courbes partagent l'`--ease cubic-bezier(.16,1,.3,1)` pour une signature de
mouvement cohérente. `prefers-reduced-motion` désactive les animations non essentielles.

---

## 7 · Fonctionnalités Innovantes

1. **Carte 3D interactive** — globe vivant + survol de vallée photoréaliste avant réservation.
2. **Voyage virtuel immersif** — téléportation WebGL temps réel dans chaque site (lumière du
   jour réelle, son spatialisé) pour réserver en confiance.
3. **Assistant IA « Sylvie »** — compose un itinéraire **bas-carbone** en langage naturel,
   ajusté à la météo, à la capacité d'accueil et aux envies.
4. **Planification intelligente** — mobilité douce (train + vélo + navette solaire) réservée en
   un flux unique, sans rupture, sans voiture.
5. **Réalité augmentée terrain** — caméra pointée → noms d'espèces, sentiers, histoire
   géologique surgissent du réel.
6. **Recommandations personnalisées** — moteur qui apprend des envies et de l'empreinte visée.
7. **Empreinte en direct** *(signature)* — capteurs satellite + IoT : l'impact positif se met à
   jour pendant et après le séjour.
8. **Passeport régénératif** *(boucle virale)* — carnet vivant certifiant chaque hectare
   restauré au nom du voyageur, partageable et infalsifiable.

---

## 8 · Présentation Finale

### 8.1 Pour les **investisseurs**
- **Marché** : tourisme mondial > 9 000 Md$, segment durable en croissance à deux chiffres.
- **Différenciation** : seule plateforme à **prouver une empreinte positive** mesurée, avec une
  expérience produit de niveau Apple/Pixar — barrière à l'entrée technologique (WebGL, IA, IoT).
- **Acquisition** : le passeport régénératif partageable = **viralité organique** (CAC réduit).
- **Monétisation** : commission sur séjours premium, abonnement « Cercle régénérateur »,
  partenariats refuges signature, API impact pour entreprises (voyages d'affaires neutres+).
- **Traction démontrée** (mock) : 4,96/5 sur 31k avis, 92 % de voyageurs devenus ambassadeurs.

### 8.2 Pour les **clients**
« Ne partez plus malgré la planète. Partez **pour** elle. Vivez un voyage spectaculaire et
repartez avec des hectares de forêt à votre nom. » Démonstration : hero → survol 3D → impact
en direct. L'émotion d'abord, la preuve ensuite.

### 8.3 Pour l'**équipe de développement**
- **Stack démo** : HTML/CSS vanilla + **Three.js (WebGL, ESM via import-map)**, zéro build —
  ouvrable directement. Modules découplés : `data` · `scene` · `globe` · `main`.
- **Stack cible** : React + **React Three Fiber** + Drei + `@react-three/postprocessing`,
  `lenis` (smooth-scroll), `GSAP`/Framer Motion, glTF + Draco pour les modèles lourds.
- **Perf** : LOD, instancing, lazy-load des scènes par section, pixel ratio plafonné,
  fallback non-WebGL, budget < 2,5 s LCP.
- **Architecture** : design tokens centralisés (variables CSS / thème), composants atomiques,
  API impact temps réel (satellite + IoT), CMS headless pour les destinations.

> Le repo héberge aussi un projet **Remotion / React Three Fiber** (`/src`) : la publicité
> vidéo animée peut servir de **teaser de campagne** cohérent avec cette identité.

---

## 9 · Vision Premium — sans compromis

VERDÆ n'est pas un site, c'est un **manifeste rendu interactif**. Chaque pixel défend une
thèse : *on peut voyager en rendant le monde plus beau, et le prouver*. La 3D n'est pas un
gadget — elle crée le **désir** (tomber amoureux d'un lieu) et la **confiance** (voir avant de
réserver, voir son impact après). Le motion design donne le **souffle d'un film**, l'UI la
**rigueur d'un produit Apple**, le récit la **chaleur de Pixar**.

C'est ainsi qu'on gagne un concours international : non pas en empilant des effets, mais en
faisant **ressentir une idée juste**, magnifiquement, à chaque scroll.

**VERDÆ — Voyager en laissant la Terre plus belle.**
