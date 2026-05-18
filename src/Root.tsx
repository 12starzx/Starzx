import type { FC } from "react";
import { Composition } from "remotion";
import { Scene } from "./Scene";

// 3D animation — 1920×1080 landscape, 10 s at 30 fps (300 frames).
export const RemotionRoot: FC = () => {
  return (
    <Composition
      id="Scene"
      component={Scene}
      durationInFrames={300}
      fps={30}
      width={1920}
      height={1080}
    />
  );
};
