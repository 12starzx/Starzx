import type { FC } from "react";
import {
  AbsoluteFill,
  interpolate,
  random,
  spring,
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
 * `scroll` (défaut false) anime un défilement diagonal continu.
 */
export const DiagonalGrid: FC<{ scroll?: boolean }> = ({ scroll = false }) => {
  const frame = useCurrentFrame();
  const offset = scroll ? (frame * 1.5) % 40 : 0;

  return (
    <AbsoluteFill
      style={{
        backgroundColor: "#000814",
        backgroundImage: `
          repeating-linear-gradient(45deg, rgba(0,229,255,0.2) 0 1px, transparent 1px 40px),
          repeating-linear-gradient(-45deg, rgba(0,229,255,0.2) 0 1px, transparent 1px 40px)
        `,
        backgroundPosition: `${offset}px ${offset}px`,
      }}
    />
  );
};

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

const HAND_GRADIENT = "linear-gradient(140deg, #00E5FF 0%, #0077B6 100%)";

/**
 * Main néon stylisée — index pointé vers le bas — qui descend du haut
 * de l'écran. S'anime elle-même via un spring sur les frames 0–30.
 */
export const CssHand: FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const drop = spring({ frame, fps, config: { damping: 14, stiffness: 110 } });
  const translateY = interpolate(drop, [0, 1], [-100, 20]);
  const bob = Math.sin(frame * 0.15) * 1.5;

  return (
    <div
      style={{
        position: "absolute",
        top: 0,
        left: "50%",
        transform: `translateX(-50%) translateY(calc(${translateY}% + ${bob}px))`,
        filter: "drop-shadow(0 0 40px #00E5FF)",
      }}
    >
      <div style={{ position: "relative", width: 260, height: 470 }}>
        {/* avant-bras */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 92,
            width: 76,
            height: 130,
            background: HAND_GRADIENT,
            borderRadius: "38px 38px 22px 22px",
          }}
        />
        {/* paume */}
        <div
          style={{
            position: "absolute",
            top: 104,
            left: 46,
            width: 168,
            height: 176,
            background: HAND_GRADIENT,
            borderRadius: 48,
          }}
        />
        {/* pouce */}
        <div
          style={{
            position: "absolute",
            top: 150,
            left: 8,
            width: 64,
            height: 60,
            background: HAND_GRADIENT,
            borderRadius: 32,
          }}
        />
        {/* doigts repliés (3 bosses) */}
        <div
          style={{
            position: "absolute",
            top: 250,
            left: 104,
            width: 48,
            height: 60,
            background: HAND_GRADIENT,
            borderRadius: 26,
          }}
        />
        <div
          style={{
            position: "absolute",
            top: 250,
            left: 150,
            width: 48,
            height: 60,
            background: HAND_GRADIENT,
            borderRadius: 26,
          }}
        />
        <div
          style={{
            position: "absolute",
            top: 252,
            left: 196,
            width: 42,
            height: 54,
            background: HAND_GRADIENT,
            borderRadius: 24,
          }}
        />
        {/* index pointé vers le bas */}
        <div
          style={{
            position: "absolute",
            top: 264,
            left: 58,
            width: 54,
            height: 190,
            background: HAND_GRADIENT,
            borderRadius: 28,
          }}
        />
      </div>
    </div>
  );
};

/**
 * Particules cyan ascendantes — `count` points lumineux qui montent en
 * boucle ; position X déterministe (seedée par index, donc stable d'une
 * frame à l'autre).
 */
export const AscendingParticles: FC<{ count?: number }> = ({ count = 10 }) => {
  const frame = useCurrentFrame();
  const period = 150;

  return (
    <AbsoluteFill style={{ pointerEvents: "none" }}>
      {[...Array(count).keys()].map((i) => {
        const x = random(`particle-x-${i}`) * 100;
        const size = 6 + random(`particle-s-${i}`) * 6;
        const cycle = (((frame + i * 15) % period) + period) % period;
        const progress = cycle / period;
        const y = 110 - progress * 120;
        const opacity = Math.sin(progress * Math.PI);
        return (
          <div
            key={`particle-${i}`}
            style={{
              position: "absolute",
              left: `${x}%`,
              top: `${y}%`,
              width: size,
              height: size,
              borderRadius: "50%",
              background: "#00E5FF",
              boxShadow: "0 0 12px #00E5FF",
              opacity,
            }}
          />
        );
      })}
    </AbsoluteFill>
  );
};
