# 3D Animation — Remotion + React Three Fiber

A landscape **1920 × 1080**, **10 s at 30 fps** (300 frames) 3D animation
rendered entirely in code with [Remotion](https://remotion.dev) and
[React Three Fiber](https://r3f.docs.pmnd.rs/) — no external assets.

## What's in the scene

- An orbiting camera that slowly dollies in toward the center.
- A central torus knot with a continuously cycling hue.
- A ring of 10 icosahedra orbiting the core, each entering on a staggered spring.
- A seeded 1,800-point starfield with depth fog.
- Two animated colored point lights plus a key directional light.

The whole composition lives in `src/Scene.tsx`.

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
