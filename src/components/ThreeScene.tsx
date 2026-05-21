import { ThreeCanvas } from "@remotion/three";
import type { FC, ReactNode } from "react";
import { Suspense } from "react";
import { useVideoConfig } from "remotion";

export interface ThreeSceneProps {
  children: ReactNode;
}

/**
 * Wrapper Three.js pour Remotion.
 *
 * Utilise `ThreeCanvas` de `@remotion/three` (et non le `Canvas` brut de
 * React Three Fiber) car il synchronise le rendu WebGL avec la timeline
 * Remotion image par image.
 *
 * Fond transparent : les composants de `Backgrounds.tsx` se placent
 * derrière ce canvas dans l'arbre DOM.
 */
export const ThreeScene: FC<ThreeSceneProps> = ({ children }) => {
  const { width, height } = useVideoConfig();

  return (
    <ThreeCanvas
      width={width}
      height={height}
      camera={{ position: [0, 0, 8], fov: 50 }}
      style={{ position: "absolute", top: 0, left: 0 }}
    >
      {/* Lumières de la scène — le pingouin n'a aucun éclairage interne. */}
      <ambientLight intensity={0.6} color="#404060" />
      <directionalLight position={[5, 5, 5]} intensity={1.5} color="#00E5FF" />
      <pointLight position={[0, 0, -5]} intensity={0.8} color="#00B8D4" />

      {/* Suspense : attend le chargement du modèle GLTF avant le rendu. */}
      <Suspense fallback={null}>{children}</Suspense>
    </ThreeCanvas>
  );
};
