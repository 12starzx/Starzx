import type { FC } from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { AscendingParticles, DiagonalGrid } from "../components/Backgrounds";
import { PenguinModel } from "../components/PenguinModel";
import { Text3D } from "../components/Text3D";
import { ThreeScene } from "../components/ThreeScene";

const TYPED_TEXT = "AMBIANCE NON-STOP";

/**
 * PLAN 5 · AMBIANCE NON-STOP (frames locales 0–150)
 * Deux pingouins dansent en opposition de phase ; le texte apparaît
 * en machine à écrire puis vibre, et sort par le haut.
 */
export const Plan5: FC = () => {
  const frame = useCurrentFrame();

  // Machine à écrire : 1 lettre par frame jusqu'à révélation complète.
  const visibleCount = Math.min(Math.floor(frame), TYPED_TEXT.length);
  const visibleText = TYPED_TEXT.slice(0, visibleCount);
  const complete = visibleCount >= TYPED_TEXT.length;

  // Vibration rotation Z ±0.5° une fois le texte complet.
  const vibration = complete ? Math.sin(frame * 0.8) * 0.5 : 0;

  // Sortie : poussée verticale vers le haut (frames 140–150).
  const exitY = interpolate(frame, [140, 150], [0, -1000], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill>
      <DiagonalGrid scroll />
      <AscendingParticles count={10} />

      <ThreeScene>
        <PenguinModel position={[-3, 0, 0]} animation="dance" />
        {/* Décalage de 10 frames → danse en opposition de phase. */}
        <PenguinModel position={[3, 0, 0]} animation="dance" startFrame={10} />
      </ThreeScene>

      <div
        style={{
          position: "absolute",
          left: "50%",
          top: "50%",
          width: 980,
          transform: `translate(-50%, -50%) translateY(${exitY}px) rotate(${vibration}deg)`,
        }}
      >
        <Text3D text={visibleText} oscillate={complete} />
      </div>
    </AbsoluteFill>
  );
};
