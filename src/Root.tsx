import type { FC } from "react";
import { Composition } from "remotion";
import { PixizAd } from "./PixizAd";

// Publicité Pixiz — format vertical 1080×1920, 18 s à 30 fps (540 frames).
export const RemotionRoot: FC = () => {
  return (
    <Composition
      id="PixizAd"
      component={PixizAd}
      durationInFrames={540}
      fps={30}
      width={1080}
      height={1920}
    />
  );
};
