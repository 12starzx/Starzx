import type { FC } from "react";
import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { AscendingParticles, DiagonalGrid } from "../components/Backgrounds";
import { PenguinModel } from "../components/PenguinModel";
import { Text3D } from "../components/Text3D";
import { ThreeScene } from "../components/ThreeScene";

const TAU = Math.PI * 2;

/**
 * PLAN 6 · VOCAUX ACTIFS 24/7 (frames locales 0–150)
 * Le pingouin « parle », équipé d'un casque et d'un micro en
 * géométries Three.js.
 */
export const Plan6: FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // "VOCAUX ACTIFS" : entrée glissée depuis la gauche.
  const vocaux = spring({ frame, fps, config: { damping: 14, stiffness: 90 } });
  const vocauxX = interpolate(vocaux, [0, 1], [-800, 0]);

  // "24/7" : pop scale (démarre à la frame 20).
  const v247 = spring({
    frame: frame - 20,
    fps,
    config: { damping: 12, stiffness: 140 },
  });

  // Grand cercle cyan transparent pulsant à 1,5 Hz.
  const pulse = interpolate(
    Math.sin((frame / fps) * TAU * 1.5),
    [-1, 1],
    [0.9, 1.1],
  );

  return (
    <AbsoluteFill>
      <DiagonalGrid />
      <AscendingParticles count={10} />

      {/* Grand cercle cyan pulsant. */}
      <AbsoluteFill style={{ justifyContent: "center", alignItems: "center" }}>
        <div
          style={{
            width: 600,
            height: 600,
            borderRadius: "50%",
            border: "3px solid rgba(0,229,255,0.4)",
            transform: `scale(${pulse})`,
          }}
        />
      </AbsoluteFill>

      <ThreeScene>
        {/* Pingouin + accessoires regroupés. */}
        <group position={[0, -1, 0]}>
          <PenguinModel position={[0, 0, 0]} animation="speak" />

          {/* Casque audio : 2 écouteurs torus + arceau cylindre. */}
          <group position={[0, 0.85, 0]} rotation={[0, 0, 0.08]}>
            <mesh position={[-0.6, 0, 0]} rotation={[0, Math.PI / 2, 0]}>
              <torusGeometry args={[0.3, 0.05, 16, 32]} />
              <meshStandardMaterial color="#00E5FF" />
            </mesh>
            <mesh position={[0.6, 0, 0]} rotation={[0, Math.PI / 2, 0]}>
              <torusGeometry args={[0.3, 0.05, 16, 32]} />
              <meshStandardMaterial color="#00E5FF" />
            </mesh>
            <mesh position={[0, 0.18, 0]} rotation={[0, 0, Math.PI / 2]}>
              <cylinderGeometry args={[0.05, 0.05, 1.2]} />
              <meshStandardMaterial color="#00E5FF" />
            </mesh>
          </group>

          {/* Micro flottant : tige cylindre + bonnette sphère. */}
          <group position={[0.65, 0, 0.5]}>
            <mesh rotation={[0, 0, Math.PI / 4]}>
              <cylinderGeometry args={[0.05, 0.05, 0.8]} />
              <meshStandardMaterial color="#00E5FF" />
            </mesh>
            <mesh position={[0.3, -0.3, 0]}>
              <sphereGeometry args={[0.15, 16, 16]} />
              <meshStandardMaterial color="#0A1929" />
            </mesh>
          </group>
        </group>
      </ThreeScene>

      <div
        style={{
          position: "absolute",
          left: "50%",
          top: "25%",
          width: 980,
          transform: `translate(-50%, -50%) translateX(${vocauxX}px)`,
        }}
      >
        <Text3D text="VOCAUX ACTIFS" />
      </div>

      <div
        style={{
          position: "absolute",
          left: "50%",
          top: "75%",
          width: 600,
          transform: `translate(-50%, -50%) scale(${v247})`,
        }}
      >
        <Text3D text="24/7" />
      </div>
    </AbsoluteFill>
  );
};
