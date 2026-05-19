import type { FC } from "react";
import { Composition } from "remotion";
import { Scene, TOTAL } from "./Scene";

// Pinguino — promo Discord verticale 1080×1920, 18 s à 30 fps (540 frames).
export const RemotionRoot: FC = () => {
  return (
    <Composition
      id="Scene"
      component={Scene}
      durationInFrames={TOTAL}
      fps={30}
      width={1080}
      height={1920}
    />
  );
};
