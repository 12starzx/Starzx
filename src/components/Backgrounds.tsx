import type { FC } from "react";
import {
  AbsoluteFill,
  interpolate,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";

const TAU = Math.PI * 2;

/**
 * Grille cyan en perspective façon plan d'architecte.
 * `animateZ` (défaut true) fait défiler la grille pour une illusion
 * d'avancée continue.
 */
export const PerspectiveGrid: FC<{ animateZ?: boolean }> = ({
  animateZ = true,
}) => {
  const frame = useCurrentFrame();
  const offset = animateZ ? (frame * 4) % 80 : 0;

  return (
    <AbsoluteFill style={{ backgroundColor: "#000000", overflow: "hidden" }}>
      <div
        style={{
          position: "absolute",
          left: "-50%",
          right: "-50%",
          bottom: "-15%",
          height: "120%",
          transform: "perspective(800px) rotateX(60deg)",
          transformOrigin: "center bottom",
          backgroundImage: `
            linear-gradient(rgba(0,184,212,0.4) 2px, transparent 2px),
            linear-gradient(90deg, rgba(0,184,212,0.4) 2px, transparent 2px)
          `,
          backgroundSize: "80px 80px",
          backgroundPosition: `0 ${offset}px, 0 0`,
        }}
      />
    </AbsoluteFill>
  );
};

/**
 * Grand cercle néon central, légèrement pulsant (scale 0.95 ↔ 1.05 à 2 Hz).
 */
export const NeonCircle: FC = () => {
  const frame = useCurrentFrame();
  const { fps, width } = useVideoConfig();
  const seconds = frame / fps;

  const scale = interpolate(
    Math.sin(seconds * TAU * 2),
    [-1, 1],
    [0.95, 1.05],
  );
  const size = width * 0.6;

  return (
    <AbsoluteFill
      style={{
        background: "radial-gradient(circle, #0A1929 0%, #000000 100%)",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <div
        style={{
          width: size,
          height: size,
          borderRadius: "50%",
          border: "4px solid #00E5FF",
          boxShadow: "0 0 60px #00E5FF, inset 0 0 40px #00B8D4",
          transform: `scale(${scale})`,
        }}
      />
    </AbsoluteFill>
  );
};

/**
 * Trame diagonale fine cyan sur fond noir profond.
 */
export const DiagonalGrid: FC = () => (
  <AbsoluteFill
    style={{
      backgroundColor: "#000814",
      backgroundImage: `
        repeating-linear-gradient(45deg, rgba(0,229,255,0.2) 0 1px, transparent 1px 40px),
        repeating-linear-gradient(-45deg, rgba(0,229,255,0.2) 0 1px, transparent 1px 40px)
      `,
    }}
  />
);

/**
 * Dégradé radial bleu électrique, du centre lumineux vers les bords sombres.
 */
export const RadialBackground: FC = () => (
  <AbsoluteFill
    style={{
      background:
        "radial-gradient(circle, #0077B6 0%, #001F3F 60%, #000814 100%)",
    }}
  />
);
