import type { FC } from "react";
import { Composition } from "remotion";
import { Scene } from "./Scene";

// Promo verticale Pinguino — 1080×1920, 60 fps, 30 s (1800 frames).
export const RemotionRoot: FC = () => {
  return (
    <Composition
      id="Scene"
      component={Scene}
      durationInFrames={1800}
      fps={60}
      width={1080}
      height={1920}
    />
  );
};
