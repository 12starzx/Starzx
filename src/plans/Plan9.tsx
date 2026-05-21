import type { FC } from "react";
import {
  AbsoluteFill,
  interpolate,
  random,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { AscendingParticles, RadialBackground } from "../components/Backgrounds";
import type { PenguinAnimation } from "../components/PenguinModel";
import { PenguinModel } from "../components/PenguinModel";
import { Text3D } from "../components/Text3D";
import { ThreeScene } from "../components/ThreeScene";

const WORDS: { text: string; top: string; delay: number }[] = [
  { text: "ÉVÉNEMENTS", top: "30%", delay: 0 },
  { text: "CHAQUE", top: "50%", delay: 8 },
  { text: "SEMAINE", top: "70%", delay: 16 },
];

/**
 * PLAN 9 · ÉVÉNEMENTS CHAQUE SEMAINE (frames locales 0–150)
 * Pingouin sauteur, confettis et révélation des mots en cascade.
 */
export const Plan9: FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Pingouin : deux sauts (0–40 et 70–110), idle entre les deux.
  let penguinAnim: PenguinAnimation;
  let penguinStart: number;
  if (frame < 40) {
    penguinAnim = "jump";
    penguinStart = 0;
  } else if (frame < 70) {
    penguinAnim = "idle";
    penguinStart = 40;
  } else if (frame < 110) {
    penguinAnim = "jump";
    penguinStart = 70;
  } else {
    penguinAnim = "idle";
    penguinStart = 110;
  }

  // Pulsation finale du bloc de texte (frames 100–130).
  const pulse = interpolate(frame, [100, 115, 130], [1, 1.08, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill>
      <RadialBackground />
      {/* Halo central lumineux. */}
      <AbsoluteFill
        style={{
          background:
            "radial-gradient(circle, rgba(255,255,255,0.25) 0%, transparent 45%)",
        }}
      />
      <AscendingParticles count={20} />

      {/* 20 confettis cyan/blancs en chute tournoyante. */}
      <AbsoluteFill style={{ pointerEvents: "none" }}>
        {[...Array(20).keys()].map((i) => {
          const x = random(`confetti-x-${i}`) * 100;
          const dur = 120 + Math.floor(random(`confetti-d-${i}`) * 120);
          const cycle = (((frame + i * 9) % dur) + dur) % dur;
          const y = -10 + (cycle / dur) * 120;
          const color = i % 2 === 0 ? "#00E5FF" : "#FFFFFF";
          return (
            <div
              key={`confetti-${i}`}
              style={{
                position: "absolute",
                left: `${x}%`,
                top: `${y}%`,
                width: 8,
                height: 4,
                background: color,
                boxShadow: `0 0 6px ${color}`,
                transform: `rotate(${frame * 5 + i * 40}deg)`,
              }}
            />
          );
        })}
      </AbsoluteFill>

      <ThreeScene>
        <PenguinModel
          position={[0, 0, 0]}
          animation={penguinAnim}
          startFrame={penguinStart}
        />
      </ThreeScene>

      {/* Trois mots révélés en cascade, avec pulsation finale. */}
      <AbsoluteFill style={{ transform: `scale(${pulse})` }}>
        {WORDS.map((w) => {
          const wordScale = spring({
            frame: frame - w.delay,
            fps,
            config: { damping: 10, stiffness: 180 },
          });
          return (
            <div
              key={w.text}
              style={{
                position: "absolute",
                left: "50%",
                top: w.top,
                width: 980,
                transform: `translate(-50%, -50%) scale(${wordScale})`,
              }}
            >
              <Text3D text={w.text} />
            </div>
          );
        })}
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
