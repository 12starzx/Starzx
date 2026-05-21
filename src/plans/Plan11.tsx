import type { FC } from "react";
import {
  AbsoluteFill,
  interpolate,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { NeonCircle } from "../components/Backgrounds";
import { PenguinModel } from "../components/PenguinModel";
import { Text3D } from "../components/Text3D";
import { ThreeScene } from "../components/ThreeScene";

const TAU = Math.PI * 2;

/**
 * PLAN 11 · LIEN EN BIO (frames locales 0–150)
 * Le cercle néon se rétracte pour révéler le texte ; une flèche
 * cyan pulse en dessous.
 */
export const Plan11: FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const seconds = frame / fps;

  // Révélation : le cercle se rétracte (1.5 → 1.0), le texte apparaît.
  const retract = interpolate(frame, [0, 25], [1.5, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const textOpacity = interpolate(frame, [0, 25], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Flèche : translation verticale + pulsation à 1 Hz.
  const arrowWave = Math.sin(seconds * TAU);
  const arrowY = interpolate(arrowWave, [-1, 1], [0, 30]);
  const arrowScale = interpolate(arrowWave, [-1, 1], [0.95, 1.1]);

  return (
    <AbsoluteFill>
      <AbsoluteFill style={{ transform: `scale(${retract})` }}>
        <NeonCircle glow={100} />
      </AbsoluteFill>

      {/* 5 ondes concentriques rapides. */}
      <AbsoluteFill style={{ justifyContent: "center", alignItems: "center" }}>
        {[0, 1, 2, 3, 4].map((i) => {
          const phase = ((frame + i * 16) % 60) / 60;
          return (
            <div
              key={`onde-${i}`}
              style={{
                position: "absolute",
                width: 380,
                height: 380,
                borderRadius: "50%",
                border: "2px solid #00E5FF",
                opacity: 0.7 * (1 - phase),
                transform: `scale(${0.4 + phase * 1.7})`,
              }}
            />
          );
        })}
      </AbsoluteFill>

      <ThreeScene>
        <PenguinModel position={[0, -2, 0]} animation="point" />
      </ThreeScene>

      <div
        style={{
          position: "absolute",
          left: "50%",
          top: "45%",
          width: 1040,
          opacity: textOpacity,
          transform: "translate(-50%, -50%)",
        }}
      >
        <Text3D text="LIEN EN BIO" glowBlur={60} />
      </div>

      {/* Flèche cyan pointant vers le bas. */}
      <div
        style={{
          position: "absolute",
          left: "50%",
          top: "75%",
          transform: `translate(-50%, -50%) translateY(${arrowY}px) scale(${arrowScale})`,
          filter: "drop-shadow(0 0 40px #00E5FF)",
        }}
      >
        <svg width="200" height="160" viewBox="0 0 200 160">
          <defs>
            <linearGradient id="plan11-arrow" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#00E5FF" />
              <stop offset="100%" stopColor="#0077B6" />
            </linearGradient>
          </defs>
          <polygon points="0,0 200,0 100,160" fill="url(#plan11-arrow)" />
        </svg>
      </div>
    </AbsoluteFill>
  );
};
