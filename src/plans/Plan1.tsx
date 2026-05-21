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
 * PLAN 1 · SALUT (frames locales 0–150)
 * Le pingouin glisse depuis la gauche, salue, puis ressort à droite.
 */
export const Plan1: FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Pingouin : 3 phases — entrée glissée / salut / sortie glissée.
  let penguinAnim: PenguinAnimation;
  let penguinStart: number;
  let penguinX: number;
  let penguinRotY = 0;

  if (frame < 30) {
    penguinAnim = "slide";
    penguinStart = 0;
    penguinX = interpolate(frame, [0, 30], [-6, -2]);
  } else if (frame < 130) {
    penguinAnim = "wave";
    penguinStart = 30;
    penguinX = -2;
    // Désamorce en douceur la rotation accumulée pendant le slide.
    penguinRotY = interpolate(frame, [30, 48], [0.3, 0], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    });
  } else {
    penguinAnim = "slide";
    penguinStart = 130;
    penguinX = interpolate(frame, [130, 150], [-2, 6]);
  }

  // Texte SALUT : pop d'entrée (spring 0.3 → 1.0) puis pop de sortie.
  const enter = spring({ frame, fps, config: { damping: 12, stiffness: 200 } });
  const enterScale = 0.3 + enter * 0.7;
  const exitScale = interpolate(frame, [135, 150], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const scale = enterScale * exitScale;

  return (
    <AbsoluteFill>
      <PerspectiveGrid />
      <ThreeScene>
        <PenguinModel
          position={[penguinX, 0, 0]}
          rotation={[0, penguinRotY, 0]}
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
          transform: `translate(-50%, -50%) scale(${scale})`,
        }}
      >
        <Text3D text="SALUT" />
      </div>
    </AbsoluteFill>
  );
};
