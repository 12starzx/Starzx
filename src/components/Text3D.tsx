import type { FC } from "react";
import { useCurrentFrame, useVideoConfig } from "remotion";

const TAU = Math.PI * 2;

export interface Text3DProps {
  /** Texte à afficher. Les retours à la ligne `\n` sont respectés. */
  text: string;
  /** Si vrai (défaut), le texte oscille verticalement en continu. */
  oscillate?: boolean;
  /**
   * Force le rayon (px) du glow néon. Si omis, le glow pulse de
   * 20px à 40px à 2 Hz (comportement par défaut).
   */
  glowBlur?: number;
}

/**
 * Texte CSS pseudo-3D : remplissage dégradé, biseau par text-shadow
 * empilés et glow néon cyan pulsant.
 *
 * Animations pilotées par `useCurrentFrame` de Remotion — aucune
 * dépendance à une boucle d'animation externe.
 */
export const Text3D: FC<Text3DProps> = ({
  text,
  oscillate = true,
  glowBlur,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const seconds = frame / fps;

  // Glow externe : blur oscillant 20px ↔ 40px à 2 Hz (sauf override).
  const blur = glowBlur ?? 30 + 10 * Math.sin(seconds * TAU * 2);

  // Oscillation verticale ±4px à 1,5 Hz.
  const offsetY = oscillate ? Math.sin(seconds * TAU * 1.5) * 4 : 0;

  // Biseau : 5 ombres empilées décalées en bas-droite (1px → 5px).
  const bevel = [
    "1px 1px 0 #003544",
    "2px 2px 0 #003544",
    "3px 3px 0 #003544",
    "4px 4px 0 #003544",
    "5px 5px 0 #003544",
  ].join(", ");

  return (
    <div
      style={{
        fontFamily: "'Impact', 'Anton', sans-serif",
        fontWeight: 900,
        fontSize: 180,
        lineHeight: 1.05,
        textAlign: "center",
        whiteSpace: "pre-line",
        margin: 0,
        background: "linear-gradient(180deg, #E0F7FF 0%, #00B8D4 100%)",
        backgroundClip: "text",
        WebkitBackgroundClip: "text",
        color: "transparent",
        WebkitTextFillColor: "transparent",
        textShadow: bevel,
        filter: `drop-shadow(0 0 ${blur}px #00E5FF)`,
        transform: `translateY(${offsetY}px)`,
      }}
    >
      {text}
    </div>
  );
};
