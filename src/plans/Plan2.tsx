import type { FC } from "react";
import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { PerspectiveGrid } from "../components/Backgrounds";
import type { PenguinAnimation } from "../components/PenguinModel";
import { PenguinModel } from "../components/PenguinModel";
import { Text3D } from "../components/Text3D";
import { ThreeScene } from "../components/ThreeScene";

/**
 * PLAN 2 · BIENVENUE (frames locales 0–150)
 * Le pingouin saute à l'écran depuis le bas puis s'assoit ; le texte
 * entre depuis la droite et rebondit à l'impact.
 */
export const Plan2: FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Pingouin : saut ressort (frames 0–30) puis position assise.
  const inJump = frame < 30;
  const jump = spring({ frame, fps, config: { damping: 9, stiffness: 120 } });
  const penguinY = inJump ? interpolate(jump, [0, 1], [-6, -1]) : -1;
  const penguinAnim: PenguinAnimation = inJump ? "jump" : "idle";
  const penguinStart = inJump ? 0 : 30;

  // Texte : entrée glissée depuis la droite (translateX 800 → 0).
  const slideIn = spring({
    frame,
    fps,
    config: { damping: 14, stiffness: 100 },
  });
  const enterX = (1 - slideIn) * 800;

  // Rebond du texte à l'impact du pingouin (frames 30–40).
  const impactScale = interpolate(frame, [30, 35, 40], [1, 1.15, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Sortie glitch : décalages horizontaux alternés sur les dernières frames.
  const glitchX = frame >= 142 ? (frame % 2 === 0 ? 15 : -15) : 0;

  return (
    <AbsoluteFill>
      <PerspectiveGrid />
      <ThreeScene>
        <PenguinModel
          position={[0, penguinY, 2]}
          animation={penguinAnim}
          startFrame={penguinStart}
        />
      </ThreeScene>
      <div
        style={{
          position: "absolute",
          left: "50%",
          top: "50%",
          width: 980,
          transform: `translate(-50%, -50%) translateX(${
            enterX + glitchX
          }px) scale(${impactScale})`,
        }}
      >
        <Text3D text="BIENVENUE" />
      </div>
    </AbsoluteFill>
  );
};
