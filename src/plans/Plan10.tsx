import type { FC } from "react";
import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { RadialBackground } from "../components/Backgrounds";
import { PenguinModel } from "../components/PenguinModel";
import { Text3D } from "../components/Text3D";
import { ThreeScene } from "../components/ThreeScene";

const TAU = Math.PI * 2;

/**
 * PLAN 10 · REJOINS-NOUS MAINTENANT (frames locales 0–150)
 * Le pingouin pointe le spectateur et s'approche ; le texte zoome
 * vers la caméra puis « explose » en sortie.
 */
export const Plan10: FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const seconds = frame / fps;

  // Pingouin : pointe, s'approche (z 0 → 4), regarde de gauche à droite.
  const penguinZ = interpolate(frame, [0, 150], [0, 4]);
  const penguinRotY = Math.sin(seconds * TAU * 2) * 0.3;

  // Texte : zoom forward agressif puis explosion de sortie.
  const enter = spring({ frame, fps, config: { damping: 8, stiffness: 300 } });
  const enterScale = interpolate(enter, [0, 1], [0.1, 1]);
  const explosionScale = interpolate(frame, [130, 150], [1, 2], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const opacity = interpolate(frame, [130, 150], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const explosionBlur = interpolate(frame, [130, 150], [0, 20], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const osc = Math.sin(seconds * TAU * 1.5) * 6;
  // Glow surdimensionné qui pulse 40px ↔ 80px à 3 Hz.
  const glow = 60 + 20 * Math.sin(seconds * TAU * 3);

  // Halo central pulsant à 3 Hz.
  const haloOpacity = interpolate(
    Math.sin(seconds * TAU * 3),
    [-1, 1],
    [0.6, 1],
  );

  return (
    <AbsoluteFill>
      <AbsoluteFill style={{ filter: "saturate(1.6)" }}>
        <RadialBackground />
      </AbsoluteFill>
      <AbsoluteFill
        style={{
          background:
            "radial-gradient(circle, rgba(255,255,255,0.4) 0%, transparent 40%)",
          opacity: haloOpacity,
        }}
      />
      <ThreeScene>
        <PenguinModel
          position={[0, -0.5, penguinZ]}
          rotation={[0, penguinRotY, 0]}
          animation="point"
        />
      </ThreeScene>
      <div
        style={{
          position: "absolute",
          left: "50%",
          top: "50%",
          width: 1000,
          opacity,
          filter: `blur(${explosionBlur}px)`,
          transform: `translate(-50%, -50%) translateY(${osc}px) scale(${
            enterScale * explosionScale
          })`,
        }}
      >
        <Text3D text="REJOINS-NOUS MAINTENANT" glowBlur={glow} />
      </div>
    </AbsoluteFill>
  );
};
