import type { FC } from "react";
import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import {
  CssHand,
  DiagonalGrid,
  RadialBackground,
} from "../components/Backgrounds";
import { Text3D } from "../components/Text3D";
import { FlashOverlay } from "../components/Transitions";

/**
 * PLAN 4 · LE SERVEUR N°1 (frames locales 0–150)
 * Pas de pingouin : une main néon descend pointer le titre, avec
 * éclair zigzag et flash blanc à l'impact.
 */
export const Plan4: FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // "LE SERVEUR" : descend depuis le haut (translateY -300 → 0).
  const serveur = spring({
    frame,
    fps,
    config: { damping: 13, stiffness: 120 },
  });
  const serveurY = interpolate(serveur, [0, 1], [-300, 0]);

  // "N°1" : pop scale 0 → 1.3 → 1.0 (frames 25–40).
  const n1Scale = interpolate(frame, [25, 33, 40], [0, 1.3, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Éclair zigzag : flash bref autour de l'impact.
  const zigzagOpacity = interpolate(frame, [28, 31, 45], [0, 1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill>
      <RadialBackground />
      <AbsoluteFill style={{ opacity: 0.3 }}>
        <DiagonalGrid />
      </AbsoluteFill>

      {/* Éclair zigzag cyan en arrière-plan. */}
      <AbsoluteFill
        style={{
          justifyContent: "center",
          alignItems: "center",
          opacity: zigzagOpacity,
        }}
      >
        <svg width="620" height="1000" viewBox="0 0 620 1000">
          <polyline
            points="340,60 240,360 400,390 250,650 410,680 300,960"
            fill="none"
            stroke="#00E5FF"
            strokeWidth={16}
            strokeLinejoin="round"
            strokeLinecap="round"
            style={{ filter: "drop-shadow(0 0 22px #00E5FF)" }}
          />
        </svg>
      </AbsoluteFill>

      <CssHand />

      <div
        style={{
          position: "absolute",
          left: "50%",
          top: "35%",
          width: 1000,
          transform: `translate(-50%, -50%) translateY(${serveurY}px)`,
        }}
      >
        <Text3D text="LE SERVEUR" />
      </div>

      <div
        style={{
          position: "absolute",
          left: "50%",
          top: "55%",
          width: 600,
          transform: `translate(-50%, -50%) scale(${n1Scale})`,
        }}
      >
        <Text3D text="N°1" />
      </div>

      {/* Flash blanc à l'impact de "N°1". */}
      <FlashOverlay color="#FFFFFF" startFrame={30} durationFrames={5} />
    </AbsoluteFill>
  );
};
