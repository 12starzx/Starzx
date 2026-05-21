import type { FC } from "react";
import { Composition } from "remotion";
import {
  Scene,
  VIDEO_DURATION_IN_FRAMES,
  VIDEO_FPS,
  VIDEO_HEIGHT,
  VIDEO_WIDTH,
} from "./Composition";

// Promo Pinguino — verticale 1080×1920, 60 fps, 30 s (1800 frames).
export const RemotionRoot: FC = () => {
  return (
    <Composition
      id="Scene"
      component={Scene}
      durationInFrames={VIDEO_DURATION_IN_FRAMES}
      fps={VIDEO_FPS}
      width={VIDEO_WIDTH}
      height={VIDEO_HEIGHT}
    />
  );
};
