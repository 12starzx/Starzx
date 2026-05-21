import type { FC } from "react";
import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { AscendingParticles, PerspectiveGrid } from "../components/Backgrounds";
import type { PenguinAnimation } from "../components/PenguinModel";
import { PenguinModel } from "../components/PenguinModel";
import { Text3D } from "../components/Text3D";
import { ThreeScene } from "../components/ThreeScene";

/**
 * PLAN 12 · À TOUT DE SUITE (frames locales 0–150)
 * Le pingouin salue puis sort de l'écran en patinant ; la grille
 * zoome en avant et le texte se referme sur un fondu.
 */
export const Plan12: FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Grille : zoom forward continu (scale 1 → 1.5).
  const gridScale = interpolate(frame, [0, 150], [1, 1.5]);

  // Pingouin : salut puis sortie glissée + rotation.
  let penguinAnim: PenguinAnimation;
  let penguinStart: number;
  let penguinX = 0;
  let penguinRotY = 0;
  if (frame < 120) {
    penguinAnim = "wave";
    penguinStart = 0;
  } else {
    penguinAnim = "slide";
    penguinStart = 120;
    penguinX = interpolate(frame, [120, 150], [0, 8]);
    penguinRotY = interpolate(frame, [120, 150], [0, Math.PI]);
  }

  // Texte : pop d'entrée, grossissement progressif, fondu de sortie.
  const enter = spring({ frame, fps, config: { damping: 11, stiffness: 160 } });
  const baseScale = interpolate(frame, [20, 130, 150], [1, 1.15, 0.5], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const opacity = interpolate(frame, [130, 150], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill>
      <AbsoluteFill style={{ transform: `scale(${gridScale})` }}>
        <PerspectiveGrid />
      </AbsoluteFill>
      <AscendingParticles count={10} periodFrames={75} />
      <ThreeScene>
        <PenguinModel
          position={[penguinX, -1, 0]}
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
          opacity,
          transform: `translate(-50%, -50%) scale(${enter * baseScale})`,
        }}
      >
        <Text3D text="À TOUT DE SUITE" />
      </div>
    </AbsoluteFill>
  );
};
