import type { FC } from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";

export interface FlashOverlayProps {
  /** Couleur du flash (ex. "#FFFFFF", "#00E5FF", "#FF0000"). */
  color: string;
  /** Frame (locale au contexte de rendu) du début du flash. */
  startFrame: number;
  /** Durée totale du flash en frames. */
  durationFrames: number;
  /** Opacité maximale atteinte au pic (défaut 1). */
  maxOpacity?: number;
}

/**
 * Flash plein écran : opacité 0 → maxOpacity → 0 sur `durationFrames`.
 */
export const FlashOverlay: FC<FlashOverlayProps> = ({
  color,
  startFrame,
  durationFrames,
  maxOpacity = 1,
}) => {
  const frame = useCurrentFrame();
  const opacity = interpolate(
    frame,
    [
      startFrame,
      startFrame + durationFrames / 2,
      startFrame + durationFrames,
    ],
    [0, maxOpacity, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
  );

  if (opacity <= 0) {
    return null;
  }

  return (
    <AbsoluteFill
      style={{ backgroundColor: color, opacity, pointerEvents: "none" }}
    />
  );
};

export interface GlitchOverlayProps {
  /** Frame (locale à la Sequence) du début du glitch. */
  startFrame: number;
}

/**
 * Glitch : 3 couches RGB décalées rapidement sur 8 frames.
 */
export const GlitchOverlay: FC<GlitchOverlayProps> = ({ startFrame }) => {
  const frame = useCurrentFrame();
  const local = frame - startFrame;

  if (local < 0 || local > 8) {
    return null;
  }

  const shift = (local % 2 === 0 ? 1 : -1) * 6;

  return (
    <AbsoluteFill style={{ pointerEvents: "none", mixBlendMode: "screen" }}>
      <AbsoluteFill
        style={{
          backgroundColor: "rgba(255,0,0,0.25)",
          transform: `translateX(${shift}px)`,
        }}
      />
      <AbsoluteFill
        style={{
          backgroundColor: "rgba(0,255,0,0.25)",
          transform: `translateX(${-shift}px)`,
        }}
      />
      <AbsoluteFill
        style={{
          backgroundColor: "rgba(0,0,255,0.25)",
          transform: `translateX(${shift * 0.5}px)`,
        }}
      />
    </AbsoluteFill>
  );
};

export interface WipeOverlayProps {
  /** Frame (locale à la Sequence) du début du balayage. */
  startFrame: number;
  /** Sens du balayage. */
  direction: "horizontal" | "vertical";
}

/**
 * Balayage : une bande cyan lumineuse traverse l'écran sur 10 frames.
 */
export const WipeOverlay: FC<WipeOverlayProps> = ({
  startFrame,
  direction,
}) => {
  const frame = useCurrentFrame();
  const local = frame - startFrame;

  if (local < 0 || local > 10) {
    return null;
  }

  const pos = interpolate(local, [0, 10], [-120, 120], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const vertical = direction === "vertical";

  return (
    <AbsoluteFill style={{ pointerEvents: "none", overflow: "hidden" }}>
      <div
        style={{
          position: "absolute",
          inset: 0,
          opacity: 0.85,
          background: vertical
            ? "linear-gradient(180deg, transparent 35%, #00E5FF 50%, transparent 65%)"
            : "linear-gradient(90deg, transparent 35%, #00E5FF 50%, transparent 65%)",
          transform: vertical
            ? `translateY(${pos}%)`
            : `translateX(${pos}%)`,
        }}
      />
    </AbsoluteFill>
  );
};
