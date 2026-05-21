import type { FC } from "react";
import { AbsoluteFill, Sequence } from "remotion";

// --- Paramètres globaux de la vidéo -------------------------------------
export const VIDEO_FPS = 60;
export const VIDEO_WIDTH = 1080;
export const VIDEO_HEIGHT = 1920;
export const VIDEO_DURATION_IN_FRAMES = 1800;

/** Durée d'un plan : 150 frames (2,5 s). 12 plans × 150 = 1800 frames. */
export const PLAN_DURATION = 150;

/**
 * Composition principale "Scene".
 *
 * Les 12 Sequence sont vides pour l'instant. Leur contenu sera ajouté :
 *   - bloc 2 → plans 1 à 6
 *   - bloc 3 → plans 7 à 12
 */
export const Scene: FC = () => {
  return (
    <AbsoluteFill style={{ backgroundColor: "#000000" }}>
      {/*
        AUDIO — aucune piste pour l'instant.
        Pour en ajouter une : déposer le fichier dans public/, importer
        { Audio, staticFile } depuis 'remotion' et insérer ici :
          <Audio src={staticFile('musique.mp3')} />
      */}

      {/* ───── PLAN 1 · SALUT · frames 0–150 ───── */}
      <Sequence durationInFrames={PLAN_DURATION} name="P01 · SALUT">
        {/* Contenu ajouté au bloc 2 */}
      </Sequence>

      {/* ───── PLAN 2 · BIENVENUE · frames 150–300 ───── */}
      <Sequence from={150} durationInFrames={PLAN_DURATION} name="P02 · BIENVENUE">
        {/* Contenu ajouté au bloc 2 */}
      </Sequence>

      {/* ───── PLAN 3 · SUR PINGUINO · frames 300–450 ───── */}
      <Sequence from={300} durationInFrames={PLAN_DURATION} name="P03 · SUR PINGUINO">
        {/* Contenu ajouté au bloc 2 */}
      </Sequence>

      {/* ───── PLAN 4 · LE SERVEUR N°1 · frames 450–600 ───── */}
      <Sequence from={450} durationInFrames={PLAN_DURATION} name="P04 · LE SERVEUR N°1">
        {/* Contenu ajouté au bloc 2 */}
      </Sequence>

      {/* ───── PLAN 5 · AMBIANCE NON-STOP · frames 600–750 ───── */}
      <Sequence from={600} durationInFrames={PLAN_DURATION} name="P05 · AMBIANCE NON-STOP">
        {/* Contenu ajouté au bloc 2 */}
      </Sequence>

      {/* ───── PLAN 6 · VOCAUX ACTIFS 24/7 · frames 750–900 ───── */}
      <Sequence from={750} durationInFrames={PLAN_DURATION} name="P06 · VOCAUX ACTIFS 24/7">
        {/* Contenu ajouté au bloc 2 */}
      </Sequence>

      {/* ───── PLAN 7 · COMMUNAUTÉ SÉRIEUSE · frames 900–1050 ───── */}
      <Sequence from={900} durationInFrames={PLAN_DURATION} name="P07 · COMMUNAUTÉ SÉRIEUSE">
        {/* Contenu ajouté au bloc 3 */}
      </Sequence>

      {/* ───── PLAN 8 · ZÉRO TOXICITÉ · frames 1050–1200 ───── */}
      <Sequence from={1050} durationInFrames={PLAN_DURATION} name="P08 · ZÉRO TOXICITÉ">
        {/* Contenu ajouté au bloc 3 */}
      </Sequence>

      {/* ───── PLAN 9 · ÉVÉNEMENTS CHAQUE SEMAINE · frames 1200–1350 ───── */}
      <Sequence from={1200} durationInFrames={PLAN_DURATION} name="P09 · ÉVÉNEMENTS">
        {/* Contenu ajouté au bloc 3 */}
      </Sequence>

      {/* ───── PLAN 10 · REJOINS-NOUS MAINTENANT · frames 1350–1500 ───── */}
      <Sequence from={1350} durationInFrames={PLAN_DURATION} name="P10 · REJOINS-NOUS">
        {/* Contenu ajouté au bloc 3 */}
      </Sequence>

      {/* ───── PLAN 11 · LIEN EN BIO · frames 1500–1650 ───── */}
      <Sequence from={1500} durationInFrames={PLAN_DURATION} name="P11 · LIEN EN BIO">
        {/* Contenu ajouté au bloc 3 */}
      </Sequence>

      {/* ───── PLAN 12 · À TOUT DE SUITE · frames 1650–1800 ───── */}
      <Sequence from={1650} durationInFrames={PLAN_DURATION} name="P12 · À TOUT DE SUITE">
        {/* Contenu ajouté au bloc 3 */}
      </Sequence>
    </AbsoluteFill>
  );
};
