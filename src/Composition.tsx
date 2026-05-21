import type { FC } from "react";
import { AbsoluteFill, interpolate, Sequence, useCurrentFrame } from "remotion";
import {
  FlashOverlay,
  GlitchOverlay,
  WipeOverlay,
} from "./components/Transitions";
import { Plan1 } from "./plans/Plan1";
import { Plan2 } from "./plans/Plan2";
import { Plan3 } from "./plans/Plan3";
import { Plan4 } from "./plans/Plan4";
import { Plan5 } from "./plans/Plan5";
import { Plan6 } from "./plans/Plan6";
import { Plan7 } from "./plans/Plan7";
import { Plan8 } from "./plans/Plan8";
import { Plan9 } from "./plans/Plan9";
import { Plan10 } from "./plans/Plan10";
import { Plan11 } from "./plans/Plan11";
import { Plan12 } from "./plans/Plan12";

// --- Paramètres globaux de la vidéo -------------------------------------
export const VIDEO_FPS = 60;
export const VIDEO_WIDTH = 1080;
export const VIDEO_HEIGHT = 1920;
export const VIDEO_DURATION_IN_FRAMES = 1800;

/** Durée d'un plan : 150 frames (2,5 s). 12 plans × 150 = 1800 frames. */
export const PLAN_DURATION = 150;

/**
 * Composition principale "Scene" — 12 plans enchaînés + transitions.
 *
 * Les overlays de transition sont placés au niveau de la composition
 * (frames absolues), au-dessus des Sequence. Le zoom de composition
 * couvre les transitions 2→3, 9→10 et 11→12.
 */
export const Scene: FC = () => {
  const frame = useCurrentFrame();

  // Zoom appliqué à toute la composition (produit de 3 fenêtres :
  // chaque interpolate vaut 1 hors de sa plage, donc neutre).
  const compositionScale =
    interpolate(frame, [292, 300, 308], [1, 1.3, 1], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    }) *
    interpolate(frame, [1345, 1349, 1353], [1, 1.2, 1], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    }) *
    interpolate(frame, [1645, 1650, 1655], [1, 0.8, 1], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    });

  return (
    <AbsoluteFill style={{ backgroundColor: "#000000" }}>
      {/*
        AUDIO — aucune piste pour l'instant.
        Pour en ajouter une : déposer le fichier dans public/, importer
        { Audio, staticFile } depuis 'remotion' et insérer ici :
          <Audio src={staticFile('musique.mp3')} />
      */}

      {/* Contenu des 12 plans (soumis au zoom de composition). */}
      <AbsoluteFill style={{ transform: `scale(${compositionScale})` }}>
        {/* ───── PLAN 1 · SALUT · frames 0–150 ───── */}
        <Sequence durationInFrames={PLAN_DURATION} name="P01 · SALUT">
          <Plan1 />
        </Sequence>

        {/* ───── PLAN 2 · BIENVENUE · frames 150–300 ───── */}
        <Sequence from={150} durationInFrames={PLAN_DURATION} name="P02 · BIENVENUE">
          <Plan2 />
        </Sequence>

        {/* ───── PLAN 3 · SUR PINGUINO · frames 300–450 ───── */}
        <Sequence from={300} durationInFrames={PLAN_DURATION} name="P03 · SUR PINGUINO">
          <Plan3 />
        </Sequence>

        {/* ───── PLAN 4 · LE SERVEUR N°1 · frames 450–600 ───── */}
        <Sequence from={450} durationInFrames={PLAN_DURATION} name="P04 · LE SERVEUR N°1">
          <Plan4 />
        </Sequence>

        {/* ───── PLAN 5 · AMBIANCE NON-STOP · frames 600–750 ───── */}
        <Sequence from={600} durationInFrames={PLAN_DURATION} name="P05 · AMBIANCE NON-STOP">
          <Plan5 />
        </Sequence>

        {/* ───── PLAN 6 · VOCAUX ACTIFS 24/7 · frames 750–900 ───── */}
        <Sequence from={750} durationInFrames={PLAN_DURATION} name="P06 · VOCAUX ACTIFS 24/7">
          <Plan6 />
        </Sequence>

        {/* ───── PLAN 7 · COMMUNAUTÉ SÉRIEUSE · frames 900–1050 ───── */}
        <Sequence from={900} durationInFrames={PLAN_DURATION} name="P07 · COMMUNAUTÉ SÉRIEUSE">
          <Plan7 />
        </Sequence>

        {/* ───── PLAN 8 · ZÉRO TOXICITÉ · frames 1050–1200 ───── */}
        <Sequence from={1050} durationInFrames={PLAN_DURATION} name="P08 · ZÉRO TOXICITÉ">
          <Plan8 />
        </Sequence>

        {/* ───── PLAN 9 · ÉVÉNEMENTS CHAQUE SEMAINE · frames 1200–1350 ───── */}
        <Sequence from={1200} durationInFrames={PLAN_DURATION} name="P09 · ÉVÉNEMENTS">
          <Plan9 />
        </Sequence>

        {/* ───── PLAN 10 · REJOINS-NOUS MAINTENANT · frames 1350–1500 ───── */}
        <Sequence from={1350} durationInFrames={PLAN_DURATION} name="P10 · REJOINS-NOUS">
          <Plan10 />
        </Sequence>

        {/* ───── PLAN 11 · LIEN EN BIO · frames 1500–1650 ───── */}
        <Sequence from={1500} durationInFrames={PLAN_DURATION} name="P11 · LIEN EN BIO">
          <Plan11 />
        </Sequence>

        {/* ───── PLAN 12 · À TOUT DE SUITE · frames 1650–1800 ───── */}
        <Sequence from={1650} durationInFrames={PLAN_DURATION} name="P12 · À TOUT DE SUITE">
          <Plan12 />
        </Sequence>
      </AbsoluteFill>

      {/* ───── Transitions inter-plans (frames absolues) ───── */}
      {/* 1→2 : flash cyan */}
      <FlashOverlay color="#00E5FF" startFrame={145} durationFrames={10} />
      {/* 2→3 : flash blanc (+ zoom géré par compositionScale) */}
      <FlashOverlay color="#FFFFFF" startFrame={292} durationFrames={16} />
      {/* 3→4 : coupe sèche (flash noir très subtil) */}
      <FlashOverlay
        color="#000000"
        startFrame={445}
        durationFrames={10}
        maxOpacity={0.5}
      />
      {/* 4→5 : balayage vertical */}
      <WipeOverlay direction="vertical" startFrame={595} />
      {/* 5→6 : glitch RGB */}
      <GlitchOverlay startFrame={745} />
      {/* 6→7 : flash blanc */}
      <FlashOverlay color="#FFFFFF" startFrame={895} durationFrames={5} />
      {/* 7→8 : flash rouge (lié au "ZÉRO TOXICITÉ") */}
      <FlashOverlay color="#FF0000" startFrame={1047} durationFrames={5} />
      {/* 8→9 : balayage horizontal */}
      <WipeOverlay direction="horizontal" startFrame={1195} />
      {/* 9→10 : zoom forward (compositionScale) */}
      {/* 10→11 : géré par l'explosion du plan 10 + le cercle du plan 11 */}
      {/* 11→12 : zoom out (compositionScale) */}
    </AbsoluteFill>
  );
};
