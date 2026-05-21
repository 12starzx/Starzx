import type { FC } from "react";
import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { CssHandStop, DiagonalGrid } from "../components/Backgrounds";
import { Text3D } from "../components/Text3D";
import { FlashOverlay } from "../components/Transitions";

/**
 * PLAN 8 · ZÉRO TOXICITÉ (frames locales 0–150)
 * Une main néon « STOP » descend, tremble, puis remonte.
 */
export const Plan8: FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Texte : entrée « frappe » scale 1.4 → 1.0 (spring fort) dès la frame 10.
  const strike = spring({
    frame: frame - 10,
    fps,
    config: { damping: 6, stiffness: 250 },
  });
  const strikeScale = interpolate(strike, [0, 1], [1.4, 1], {
    extrapolateRight: "clamp",
  });
  const visible = frame >= 10;
  // Oscillation pendant la phase stable.
  const osc = Math.sin(frame * 0.18) * 6;
  // Sortie glitch : décalages horizontaux alternés (frames 138–148).
  const glitchX =
    frame >= 138 && frame <= 148 ? (frame % 2 === 0 ? 20 : -20) : 0;

  return (
    <AbsoluteFill>
      <DiagonalGrid />
      <CssHandStop />
      <div
        style={{
          position: "absolute",
          left: "50%",
          top: "50%",
          width: 980,
          opacity: visible ? 1 : 0,
          transform: `translate(-50%, -50%) translateX(${glitchX}px) translateY(${osc}px) scale(${strikeScale})`,
        }}
      >
        <Text3D text="ZÉRO TOXICITÉ" />
      </div>
      {/* Flash rouge d'entrée. */}
      <FlashOverlay
        color="rgba(255,0,0,0.4)"
        startFrame={0}
        durationFrames={5}
      />
    </AbsoluteFill>
  );
};
