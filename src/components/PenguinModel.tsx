import { useGLTF } from "@react-three/drei";
import type { FC } from "react";
import { useMemo } from "react";
import { staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import type { Mesh, MeshStandardMaterial } from "three";

const PENGUIN_URL = staticFile("models/penguin.glb");

// Préchargement du modèle dès l'évaluation du module.
useGLTF.preload(PENGUIN_URL);

const TAU = Math.PI * 2;

export type PenguinAnimation =
  | "idle"
  | "wave"
  | "jump"
  | "slide"
  | "point"
  | "dance"
  | "speak";

export interface PenguinModelProps {
  position?: [number, number, number];
  rotation?: [number, number, number];
  scale?: number;
  animation?: PenguinAnimation;
  /** Frame (locale à la Sequence) à laquelle l'animation démarre. */
  startFrame?: number;
}

/**
 * Pingouin 3D chargé depuis `public/models/penguin.glb`.
 *
 * Toutes les animations sont déterministes : elles dérivent de
 * `useCurrentFrame` de Remotion + trigonométrie, jamais de `useFrame`
 * de React Three Fiber (incompatible avec le rendu image par image).
 *
 * Le pingouin n'embarque aucun éclairage : il est éclairé par les
 * lumières de `ThreeScene`.
 */
export const PenguinModel: FC<PenguinModelProps> = ({
  position = [0, 0, 0],
  rotation = [0, 0, 0],
  scale = 1,
  animation = "idle",
  startFrame = 0,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const { scene } = useGLTF(PENGUIN_URL);

  // Clone indépendant : autorise plusieurs pingouins dans une même
  // scène. On corrige aussi le `baseColorFactor` noir du GLB exporté,
  // sinon la texture est multipliée par zéro et le modèle rend noir.
  const model = useMemo(() => {
    const cloned = scene.clone(true);
    cloned.traverse((obj) => {
      const mesh = obj as Mesh;
      if (mesh.isMesh) {
        const mat = mesh.material as MeshStandardMaterial;
        if (mat?.color) {
          mat.color.set("#ffffff");
        }
      }
    });
    return cloned;
  }, [scene]);

  const local = Math.max(0, frame - startFrame);
  const t = local / fps;

  const [px, py, pz] = position;
  const [rx, ry, rz] = rotation;
  let posY = py;
  let rotX = rx;
  let rotY = ry;
  let rotZ = rz;

  switch (animation) {
    case "idle":
      // Respiration verticale douce ±0.1 à 1,5 Hz.
      posY += Math.sin(t * TAU * 1.5) * 0.1;
      break;
    case "wave":
      // Balancement rotation Z ±0.3 rad à 3 Hz.
      rotZ += Math.sin(t * TAU * 3) * 0.3;
      posY += Math.sin(t * TAU * 1.5) * 0.05;
      break;
    case "jump": {
      // Arc parabolique sur 30 frames, suivi d'un petit rebond.
      const jp = Math.min(local, 30) / 30;
      posY += Math.sin(jp * Math.PI) * 3;
      if (local > 30 && local < 48) {
        posY += Math.sin(((local - 30) / 18) * Math.PI) * 0.4;
      }
      break;
    }
    case "slide":
      // Rotation Y croissante + léger ballant (le déplacement X est
      // fourni par le parent via la prop `position`).
      rotY += local * 0.01;
      posY += Math.sin(t * TAU * 2) * 0.05;
      break;
    case "point":
      // Rotation Z penchée vers le bas, oscillant entre -0.4 et -0.1.
      rotZ += -0.25 + Math.sin(t * TAU * 2) * 0.15;
      break;
    case "dance":
      // Alternance rotation Z ±0.3 à 3 Hz + petits sauts.
      rotZ += Math.sin(t * TAU * 3) * 0.3;
      posY += Math.abs(Math.sin(t * TAU * 3)) * 0.15;
      break;
    case "speak":
      // Oscillation avant/arrière rotation X ±0.15 à 4 Hz.
      rotX += Math.sin(t * TAU * 4) * 0.15;
      break;
    default:
      break;
  }

  return (
    <primitive
      object={model}
      position={[px, posY, pz]}
      rotation={[rotX, rotY, rotZ]}
      scale={scale}
    />
  );
};
