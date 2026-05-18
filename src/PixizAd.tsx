/**
 * PIXIZ — Publicité vidéo animée (Remotion)
 * ---------------------------------------------------------------------------
 * Format   : 1080 × 1920 vertical (9:16), pensé Reels / TikTok / Shorts
 * Durée    : 18 s à 30 fps  ->  540 frames
 * Rendu    : 100 % code — aucune ressource externe
 *            (formes, dégradés et typographie système uniquement)
 *
 * Timeline narrative (frames absolues) :
 *   Scène 1 — Accroche        0   ->  90    (0 – 3 s)
 *   Scène 2 — Le constat      90  -> 210    (3 – 7 s)
 *   Scène 3 — La réponse      210 -> 360    (7 – 12 s)
 *   Scène 4 — La preuve       360 -> 450    (12 – 15 s)
 *   Scène 5 — Call to action  450 -> 540    (15 – 18 s)
 * ---------------------------------------------------------------------------
 */

import type { CSSProperties, FC, ReactNode } from "react";
import {
  AbsoluteFill,
  Easing,
  interpolate,
  Sequence,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";

/* ===========================================================================
 * IDENTITÉ VISUELLE — noir / blanc / or, sobre et premium
 * ========================================================================= */

const GOLD = "#D4AF37";
const BLACK = "#070707";
const WHITE = "#F4F1EA";
const GREY = "#8C8C8C";

const FONT = '"Helvetica Neue", Helvetica, Arial, sans-serif';

// Easing « premium » : attaque franche, sortie très douce (aucun à-coup).
const EASE = Easing.bezier(0.16, 1, 0.3, 1);

/* ===========================================================================
 * HELPERS D'ANIMATION
 * ========================================================================= */

// Opacité d'entrée (et de sortie) commune à chaque scène — coupe nette.
const useSceneOpacity = (duration: number, fadeOut = true): number => {
  const frame = useCurrentFrame();
  if (!fadeOut) {
    return interpolate(frame, [0, 7], [0, 1], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    });
  }
  return interpolate(
    frame,
    [0, 7, duration - 9, duration - 1],
    [0, 1, 1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
  );
};

// Apparition générique : fondu + glissement (vertical et/ou horizontal).
const Reveal: FC<{
  delay: number;
  children: ReactNode;
  dx?: number;
  dy?: number;
  duration?: number;
  style?: CSSProperties;
}> = ({ delay, children, dx = 0, dy = 26, duration = 22, style }) => {
  const frame = useCurrentFrame();
  const p = interpolate(frame, [delay, delay + duration], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: EASE,
  });
  return (
    <div
      style={{
        opacity: p,
        transform: `translate(${(1 - p) * dx}px, ${(1 - p) * dy}px)`,
        ...style,
      }}
    >
      {children}
    </div>
  );
};

// Mot révélé individuellement (utilisé pour les accroches mot à mot).
const Word: FC<{ delay: number; color?: string; children: ReactNode }> = ({
  delay,
  color = WHITE,
  children,
}) => {
  const frame = useCurrentFrame();
  const p = interpolate(frame, [delay, delay + 20], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: EASE,
  });
  return (
    <span
      style={{
        display: "inline-block",
        color,
        opacity: p,
        transform: `translateY(${(1 - p) * 46}px)`,
      }}
    >
      {children}
    </span>
  );
};

// Trait doré qui se trace horizontalement.
const GoldRule: FC<{ delay: number; width: number }> = ({ delay, width }) => {
  const frame = useCurrentFrame();
  const s = interpolate(frame, [delay, delay + 18], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: EASE,
  });
  return (
    <div
      style={{
        width,
        height: 3,
        backgroundColor: GOLD,
        transform: `scaleX(${s})`,
        transformOrigin: "center",
      }}
    />
  );
};

// Petit intitulé doré encadré de losanges (libellé de section).
const Kicker: FC<{ children: ReactNode }> = ({ children }) => {
  const diamond: CSSProperties = {
    width: 7,
    height: 7,
    backgroundColor: GOLD,
    transform: "rotate(45deg)",
  };
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 14,
        color: GOLD,
        fontSize: 23,
        fontWeight: 600,
        letterSpacing: 4,
      }}
    >
      <span style={diamond} />
      <span>{children}</span>
      <span style={diamond} />
    </div>
  );
};

/* ===========================================================================
 * DÉCOR PERMANENT — fond + repères « monteur » présents sur toute la pub
 * ========================================================================= */

// Fond noir profond, lueur dorée qui dérive lentement, vignette de cadrage.
const Background: FC = () => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  const glowY = interpolate(frame, [0, durationInFrames], [40, 60]);
  return (
    <AbsoluteFill style={{ backgroundColor: BLACK }}>
      <AbsoluteFill
        style={{
          background: `radial-gradient(60% 40% at 50% ${glowY}%, rgba(212,175,55,0.16), rgba(7,7,7,0) 70%)`,
        }}
      />
      <AbsoluteFill
        style={{
          background:
            "radial-gradient(72% 62% at 50% 46%, rgba(0,0,0,0) 38%, rgba(0,0,0,0.80) 100%)",
        }}
      />
    </AbsoluteFill>
  );
};

// Timecode discret en haut à droite — rappelle l'univers du montage.
const Timecode: FC = () => {
  const frame = useCurrentFrame();
  const { durationInFrames, fps } = useVideoConfig();
  const format = (f: number): string => {
    const total = Math.floor(f / fps);
    const m = Math.floor(total / 60);
    const s = total % 60;
    return `${m < 10 ? "0" : ""}${m}:${s < 10 ? "0" : ""}${s}`;
  };
  const blink = 0.35 + 0.65 * Math.abs(Math.sin(frame / 8));
  return (
    <div
      style={{
        position: "absolute",
        top: 70,
        right: 80,
        display: "flex",
        alignItems: "center",
        gap: 12,
        fontFamily: FONT,
        fontSize: 22,
        letterSpacing: 2,
        color: "rgba(244,241,234,0.45)",
      }}
    >
      <span
        style={{
          width: 9,
          height: 9,
          borderRadius: "50%",
          backgroundColor: GOLD,
          opacity: blink,
        }}
      />
      <span>
        {format(frame)} / {format(durationInFrames)}
      </span>
    </div>
  );
};

// Barre de progression + tête de lecture, comme dans un logiciel de montage.
const Timeline: FC = () => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  const progress = interpolate(frame, [0, durationInFrames - 1], [0, 1], {
    extrapolateRight: "clamp",
  });
  return (
    <div style={{ position: "absolute", left: 80, right: 80, bottom: 96, height: 4 }}>
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundColor: "rgba(244,241,234,0.12)",
          borderRadius: 4,
        }}
      />
      <div
        style={{
          position: "absolute",
          top: 0,
          bottom: 0,
          left: 0,
          width: `${progress * 100}%`,
          backgroundColor: GOLD,
          borderRadius: 4,
        }}
      />
      <div
        style={{
          position: "absolute",
          top: "50%",
          left: `${progress * 100}%`,
          width: 14,
          height: 14,
          marginLeft: -7,
          marginTop: -7,
          borderRadius: "50%",
          backgroundColor: WHITE,
          boxShadow: `0 0 16px ${GOLD}`,
        }}
      />
    </div>
  );
};

// Style de base partagé par chaque scène (colonne centrée).
const screen: CSSProperties = {
  justifyContent: "center",
  alignItems: "center",
  flexDirection: "column",
  textAlign: "center",
  padding: "0 90px",
  fontFamily: FONT,
};

/* ===========================================================================
 * SCÈNE 1 — ACCROCHE (0 – 3 s)
 * Frapper sur le problème : une idée mal montée est une idée perdue.
 * ========================================================================= */

const SceneHook: FC = () => {
  const opacity = useSceneOpacity(90);
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // « PERDUE. » surgit par ressort pour marquer le coup.
  const pop = spring({ frame: frame - 36, fps, config: { damping: 13, mass: 0.8 } });
  const underline = interpolate(frame, [50, 70], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: EASE,
  });

  return (
    <AbsoluteFill style={{ ...screen, opacity }}>
      <Reveal delay={2} dy={0} duration={14} style={{ marginBottom: 46 }}>
        <Kicker>LE MONTAGE — CE QUI CHANGE TOUT</Kicker>
      </Reveal>

      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "center",
          columnGap: 22,
          rowGap: 4,
          fontWeight: 600,
          fontSize: 62,
          letterSpacing: 0.5,
          lineHeight: 1.05,
        }}
      >
        <Word delay={8}>UNE</Word>
        <Word delay={13}>IDÉE</Word>
        <Word delay={18}>MAL</Word>
        <Word delay={23}>MONTÉE,</Word>
      </div>

      <Reveal
        delay={30}
        dy={20}
        duration={18}
        style={{
          marginTop: 26,
          fontWeight: 400,
          fontSize: 38,
          letterSpacing: 7,
          color: GREY,
        }}
      >
        C&apos;EST UNE IDÉE
      </Reveal>

      <div style={{ position: "relative", marginTop: 8 }}>
        <div
          style={{
            fontWeight: 800,
            fontSize: 172,
            letterSpacing: -3,
            color: GOLD,
            transform: `scale(${interpolate(pop, [0, 1], [0.72, 1])})`,
            opacity: Math.min(1, Math.max(0, pop)),
          }}
        >
          PERDUE.
        </div>
        <div
          style={{
            position: "absolute",
            left: "7%",
            right: "16%",
            bottom: 32,
            height: 7,
            backgroundColor: GOLD,
            transform: `scaleX(${underline})`,
            transformOrigin: "left",
          }}
        />
      </div>
    </AbsoluteFill>
  );
};

/* ===========================================================================
 * SCÈNE 2 — LE CONSTAT (3 – 7 s)
 * Le montage décide de la rétention. C'est là que tout se joue.
 * ========================================================================= */

// Courbe de rétention : haute au départ, chute brutale ensuite.
const RetentionGraph: FC<{ progress: number }> = ({ progress }) => {
  const W = 760;
  const H = 330;
  const curve = `M0,${H * 0.16} C${W * 0.2},${H * 0.16} ${W * 0.24},${H * 0.21} ${W * 0.37},${H * 0.35} C${W * 0.47},${H * 0.47} ${W * 0.5},${H * 0.79} ${W * 0.63},${H * 0.89} C${W * 0.75},${H * 0.97} ${W * 0.87},${H * 0.98} ${W},${H * 0.99}`;
  const area = `${curve} L${W},${H} L0,${H} Z`;
  return (
    <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`}>
      <defs>
        <linearGradient id="retention-fill" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={GOLD} stopOpacity="0.30" />
          <stop offset="100%" stopColor={GOLD} stopOpacity="0" />
        </linearGradient>
        <clipPath id="retention-clip">
          <rect x="0" y="0" width={W * progress} height={H} />
        </clipPath>
      </defs>

      {/* cadre et lignes de repère */}
      <rect
        x="0"
        y="0"
        width={W}
        height={H}
        fill="none"
        stroke="rgba(244,241,234,0.12)"
        strokeWidth="1.5"
      />
      {[0.25, 0.5, 0.75].map((g) => (
        <line
          key={g}
          x1="0"
          y1={H * g}
          x2={W}
          y2={H * g}
          stroke="rgba(244,241,234,0.07)"
          strokeWidth="1"
        />
      ))}

      {/* aire et courbe, dévoilées de gauche à droite */}
      <path d={area} fill="url(#retention-fill)" clipPath="url(#retention-clip)" />
      <path
        d={curve}
        fill="none"
        stroke={GOLD}
        strokeWidth="5"
        strokeLinecap="round"
        strokeLinejoin="round"
        pathLength={1}
        strokeDasharray={1}
        strokeDashoffset={1 - progress}
      />

      <text x="8" y="30" fill={GREY} fontSize="20" fontFamily={FONT} letterSpacing="2">
        ATTENTION
      </text>
      <text
        x={W - 8}
        y={H - 14}
        fill={GREY}
        fontSize="20"
        fontFamily={FONT}
        letterSpacing="2"
        textAnchor="end"
      >
        TEMPS
      </text>
    </svg>
  );
};

const SceneInsight: FC = () => {
  const opacity = useSceneOpacity(120);
  const frame = useCurrentFrame();
  const draw = interpolate(frame, [30, 86], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: EASE,
  });

  return (
    <AbsoluteFill style={{ ...screen, opacity }}>
      <Reveal delay={2} dy={0} duration={14} style={{ marginBottom: 40 }}>
        <Kicker>LE CONSTAT</Kicker>
      </Reveal>

      <div style={{ fontWeight: 700, fontSize: 66, lineHeight: 1.14, letterSpacing: 0.5 }}>
        <Reveal delay={8} dy={28}>
          LE MONTAGE DÉCIDE
        </Reveal>
        <Reveal delay={15} dy={28} style={{ color: GOLD }}>
          DE LA RÉTENTION.
        </Reveal>
      </div>

      <Reveal delay={26} dy={30} style={{ marginTop: 56 }}>
        <RetentionGraph progress={draw} />
      </Reveal>

      <Reveal delay={86} dy={22} style={{ marginTop: 50 }}>
        <div style={{ fontWeight: 600, fontSize: 42, color: WHITE }}>
          C&apos;est là que tout se joue.
        </div>
      </Reveal>
    </AbsoluteFill>
  );
};

/* ===========================================================================
 * SCÈNE 3 — LA RÉPONSE (7 – 12 s)
 * Présenter Pixiz et ses compétences clés, animées une par une.
 * ========================================================================= */

const SKILLS: string[] = [
  "Reels, TikTok & YouTube Shorts",
  "YouTube long format, structuré",
  "Color grading — finition cinéma",
  "Sound design, calage & mixage",
  "Motion design & habillage animé",
  "Sous-titrage dynamique & accroches",
];

const SkillRow: FC<{ index: number; label: string }> = ({ index, label }) => (
  <div style={{ display: "flex", alignItems: "center", gap: 30 }}>
    <span style={{ fontSize: 30, fontWeight: 800, color: GOLD }}>{`0${index}`}</span>
    <span style={{ width: 34, height: 2, backgroundColor: "rgba(212,175,55,0.55)" }} />
    <span style={{ fontSize: 42, fontWeight: 600, color: WHITE, letterSpacing: 0.3 }}>
      {label}
    </span>
  </div>
);

const SceneAnswer: FC = () => {
  const opacity = useSceneOpacity(150);
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // La signature « PIXIZ » apparaît plein écran puis remonte en titre.
  const intro = spring({ frame: frame - 4, fps, config: { damping: 14, mass: 0.9 } });
  const move = interpolate(frame, [30, 50], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: EASE,
  });
  const nameSize = interpolate(move, [0, 1], [188, 86]);
  const nameY = interpolate(move, [0, 1], [0, -612]);

  return (
    <AbsoluteFill style={{ ...screen, opacity }}>
      {/* Bloc signature — centré puis déplacé vers le haut */}
      <AbsoluteFill style={{ justifyContent: "center", alignItems: "center" }}>
        <div style={{ textAlign: "center", transform: `translateY(${nameY}px)` }}>
          <div
            style={{
              fontSize: nameSize,
              fontWeight: 800,
              letterSpacing: interpolate(move, [0, 1], [6, 3]),
              color: WHITE,
              transform: `scale(${interpolate(intro, [0, 1], [0.85, 1])})`,
              opacity: Math.min(1, Math.max(0, intro)),
            }}
          >
            PIXIZ
          </div>
          <Reveal delay={14} dy={16} duration={16} style={{ marginTop: 18 }}>
            <div style={{ display: "flex", justifyContent: "center" }}>
              <Kicker>MONTEUR VIDÉO FREELANCE</Kicker>
            </div>
          </Reveal>
        </div>
      </AbsoluteFill>

      {/* Liste des compétences clés, dévoilées une par une */}
      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          top: 610,
          display: "flex",
          justifyContent: "center",
        }}
      >
        <div style={{ display: "flex", flexDirection: "column", gap: 50, textAlign: "left" }}>
          {SKILLS.map((skill, i) => (
            <Reveal key={skill} delay={52 + i * 12} dx={-54} dy={0} duration={20}>
              <SkillRow index={i + 1} label={skill} />
            </Reveal>
          ))}
        </div>
      </div>
    </AbsoluteFill>
  );
};

/* ===========================================================================
 * SCÈNE 4 — LA PREUVE (12 – 15 s)
 * Ce qui le rend performant : chiffres, rythme, codes maîtrisés, livraison.
 * ========================================================================= */

const statBlock: CSSProperties = {
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
};

const statNumber: CSSProperties = {
  fontSize: 142,
  fontWeight: 800,
  letterSpacing: -2,
  lineHeight: 1,
  color: GOLD,
};

const statLabel: CSSProperties = {
  marginTop: 12,
  fontSize: 27,
  fontWeight: 600,
  letterSpacing: 4,
  color: GREY,
};

const ProofPoint: FC<{ children: ReactNode }> = ({ children }) => (
  <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
    <span style={{ color: GOLD, fontSize: 30, fontWeight: 800 }}>—</span>
    <span style={{ color: WHITE, fontSize: 34, fontWeight: 500 }}>{children}</span>
  </div>
);

const PROOF_POINTS: string[] = [
  "Le rythme travaillé image par image",
  "Les codes de chaque plateforme maîtrisés",
  "Une livraison rapide, sans rien sacrifier",
];

const SceneProof: FC = () => {
  const opacity = useSceneOpacity(90);
  const frame = useCurrentFrame();

  // Compteur animé : de 0 à 50 vidéos livrées.
  const count = Math.round(
    interpolate(frame, [10, 46], [0, 50], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
      easing: EASE,
    }),
  );
  const divider = interpolate(frame, [20, 38], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: EASE,
  });

  return (
    <AbsoluteFill style={{ ...screen, opacity }}>
      <Reveal delay={2} dy={0} duration={14} style={{ marginBottom: 64 }}>
        <Kicker>LA PREUVE</Kicker>
      </Reveal>

      <div style={{ display: "flex", alignItems: "center", gap: 58 }}>
        <Reveal delay={8} dy={26} style={statBlock}>
          <div style={statNumber}>{`+${count}`}</div>
          <div style={statLabel}>VIDÉOS LIVRÉES</div>
        </Reveal>

        <div
          style={{
            width: 2,
            height: 190,
            backgroundColor: "rgba(212,175,55,0.6)",
            transform: `scaleY(${divider})`,
          }}
        />

        <Reveal delay={20} dy={26} style={statBlock}>
          <div style={statNumber}>1 AN ½</div>
          <div style={statLabel}>D&apos;EXPÉRIENCE</div>
        </Reveal>
      </div>

      <div style={{ marginTop: 86, display: "flex", flexDirection: "column", gap: 26 }}>
        {PROOF_POINTS.map((point, i) => (
          <Reveal key={point} delay={46 + i * 7} dx={-40} dy={0} duration={18}>
            <ProofPoint>{point}</ProofPoint>
          </Reveal>
        ))}
      </div>
    </AbsoluteFill>
  );
};

/* ===========================================================================
 * SCÈNE 5 — CALL TO ACTION (15 – 18 s)
 * Nom + promesse + invitation à contacter — fin nette et premium.
 * ========================================================================= */

const ctaPill: CSSProperties = {
  border: `2px solid ${GOLD}`,
  borderRadius: 100,
  padding: "26px 46px",
  color: WHITE,
  fontSize: 29,
  fontWeight: 700,
  letterSpacing: 1.4,
  backgroundColor: "rgba(212,175,55,0.07)",
};

const SceneCTA: FC = () => {
  // Pas de fondu de sortie : la pub se fige sur le call to action.
  const opacity = useSceneOpacity(90, false);
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const namePop = spring({ frame: frame - 4, fps, config: { damping: 14, mass: 0.9 } });
  // Légère respiration du bouton pour attirer l'œil sur le CTA.
  const pulse = 1 + 0.022 * Math.sin(Math.max(0, frame - 54) / 5);

  return (
    <AbsoluteFill style={{ ...screen, opacity }}>
      <div
        style={{
          fontSize: 198,
          fontWeight: 800,
          letterSpacing: 8,
          color: WHITE,
          transform: `scale(${interpolate(namePop, [0, 1], [0.8, 1])})`,
          opacity: Math.min(1, Math.max(0, namePop)),
        }}
      >
        PIXIZ
      </div>

      <div style={{ marginTop: 30, display: "flex", justifyContent: "center" }}>
        <GoldRule delay={16} width={150} />
      </div>

      <div
        style={{
          marginTop: 46,
          fontWeight: 600,
          fontSize: 46,
          lineHeight: 1.32,
          maxWidth: 840,
        }}
      >
        <Reveal delay={24} dy={22}>
          Des montages qui captent{" "}
          <span style={{ color: GOLD }}>dès la première seconde</span>
        </Reveal>
        <Reveal delay={32} dy={22}>
          — et font regarder jusqu&apos;au bout.
        </Reveal>
      </div>

      <Reveal delay={48} dy={26} style={{ marginTop: 70 }}>
        <div style={{ ...ctaPill, transform: `scale(${pulse})` }}>
          CONFIEZ-MOI VOTRE PROCHAIN MONTAGE
        </div>
      </Reveal>

      <Reveal delay={58} dy={20} style={{ marginTop: 38 }}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 14,
            color: GOLD,
            fontSize: 34,
            fontWeight: 700,
            letterSpacing: 2,
          }}
        >
          <span>LE SITE EST EN BIO</span>
          <span>↗</span>
        </div>
      </Reveal>
    </AbsoluteFill>
  );
};

/* ===========================================================================
 * COMPOSITION PRINCIPALE — assemblage des 5 scènes sur 540 frames
 * ========================================================================= */

export const PixizAd: FC = () => {
  return (
    <AbsoluteFill style={{ backgroundColor: BLACK }}>
      <Background />

      {/* Scène 1 — Accroche : 0 -> 90 */}
      <Sequence durationInFrames={90} name="1 — Accroche">
        <SceneHook />
      </Sequence>

      {/* Scène 2 — Le constat : 90 -> 210 */}
      <Sequence from={90} durationInFrames={120} name="2 — Le constat">
        <SceneInsight />
      </Sequence>

      {/* Scène 3 — La réponse : 210 -> 360 */}
      <Sequence from={210} durationInFrames={150} name="3 — La réponse">
        <SceneAnswer />
      </Sequence>

      {/* Scène 4 — La preuve : 360 -> 450 */}
      <Sequence from={360} durationInFrames={90} name="4 — La preuve">
        <SceneProof />
      </Sequence>

      {/* Scène 5 — Call to action : 450 -> 540 */}
      <Sequence from={450} durationInFrames={90} name="5 — Call to action">
        <SceneCTA />
      </Sequence>

      {/* Repères « monteur » présents sur toute la durée */}
      <Timecode />
      <Timeline />
    </AbsoluteFill>
  );
};
