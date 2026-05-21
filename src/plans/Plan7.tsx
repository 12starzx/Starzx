import type { FC } from "react";
import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { DiagonalGrid } from "../components/Backgrounds";
import { PenguinModel } from "../components/PenguinModel";
import { Text3D } from "../components/Text3D";
import { ThreeScene } from "../components/ThreeScene";
import { FlashOverlay } from "../components/Transitions";

/**
 * PLAN 7 · COMMUNAUTÉ SÉRIEUSE (frames locales 0–150)
 * Trois pingouins saluent ; celui du centre s'avance vers la caméra.
 */
export const Plan7: FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Pingouin central : avance (z 0 → 2) entre les frames 60 et 90.
  const centerZ = interpolate(frame, [60, 90], [0, 2], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Texte : entrée rotation -15°→0° + scale spring 0.5→1.0.
  const enter = spring({ frame, fps, config: { damping: 12, stiffness: 140 } });
  const textScale = 0.5 + enter * 0.5;
  const textRot = interpolate(enter, [0, 1], [-15, 0]);
  // Dérive horizontale lente pendant la phase stable.
  const drift = Math.sin(frame * 0.05) * 15;
  // Fondu de sortie.
  const exitOpacity = interpolate(frame, [145, 150], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill>
      <DiagonalGrid />
      <ThreeScene>
        <PenguinModel position={[-3, -1, 0]} animation="wave" />
        <PenguinModel position={[0, -1, centerZ]} animation="wave" />
        <PenguinModel position={[3, -1, 0]} animation="wave" />
      </ThreeScene>
      {/* Teinte bleue sur toute la surface. */}
      <AbsoluteFill
        style={{ backgroundColor: "rgba(0,119,182,0.15)", pointerEvents: "none" }}
      />
      <div
        style={{
          position: "absolute",
          left: "50%",
          top: "35%",
          width: 980,
          opacity: exitOpacity,
          transform: `translate(-50%, -50%) translateX(${drift}px) rotate(${textRot}deg) scale(${textScale})`,
        }}
      >
        <Text3D text="COMMUNAUTÉ SÉRIEUSE" />
      </div>
      {/* Flash blanc juste avant la coupe. */}
      <FlashOverlay color="#FFFFFF" startFrame={147} durationFrames={3} />
    </AbsoluteFill>
  );
};
