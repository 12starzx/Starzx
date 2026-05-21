import type { FC } from "react";
import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { NeonCircle } from "../components/Backgrounds";
import { PenguinModel } from "../components/PenguinModel";
import { Text3D } from "../components/Text3D";
import { ThreeScene } from "../components/ThreeScene";

/**
 * PLAN 3 · SUR PINGUINO (frames locales 0–150)
 * Le pingouin avance et « pousse » le texte vers le centre, sur fond
 * de cercle néon et d'ondes concentriques.
 */
export const Plan3: FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Pingouin : glisse de x=6 vers x=2 sur toute la durée du plan.
  const penguinX = interpolate(frame, [0, 150], [6, 2]);

  // Texte : pop spring (démarre à la frame 10) + poussée X 400 → 0.
  const textSpring = spring({
    frame: frame - 10,
    fps,
    config: { damping: 8, stiffness: 150 },
  });
  const textScale = 0.3 + textSpring * 0.7;
  const textX = interpolate(frame, [0, 150], [400, 0]);

  return (
    <AbsoluteFill>
      <NeonCircle />

      {/* 3 ondes concentriques, décalées de 30 frames. */}
      <AbsoluteFill style={{ justifyContent: "center", alignItems: "center" }}>
        {[0, 1, 2].map((i) => {
          const phase = ((frame + i * 30) % 90) / 90;
          return (
            <div
              key={`onde-${i}`}
              style={{
                position: "absolute",
                width: 420,
                height: 420,
                borderRadius: "50%",
                border: "2px solid #00E5FF",
                opacity: 0.8 * (1 - phase),
                transform: `scale(${0.5 + phase * 1.5})`,
              }}
            />
          );
        })}
      </AbsoluteFill>

      <ThreeScene>
        <PenguinModel position={[penguinX, -1, 0]} animation="slide" />
      </ThreeScene>

      <div
        style={{
          position: "absolute",
          left: "50%",
          top: "70%",
          width: 980,
          transform: `translate(-50%, -50%) translateX(${textX}px) scale(${textScale})`,
        }}
      >
        <Text3D text={"SUR\nPINGUINO"} />
      </div>
    </AbsoluteFill>
  );
};
