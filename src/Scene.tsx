import type { CSSProperties, FC } from "react";
import { useMemo } from "react";
import {
  AbsoluteFill,
  Easing,
  interpolate,
  random,
  Sequence,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";

// --- Constantes ----------------------------------------------------------
const CYAN = "#00e5ff";
const FONT =
  "'Impact', 'Anton', 'Arial Black', 'Helvetica Neue', sans-serif";

// Découpage des sept plans (60 fps → 1800 frames = 30 s).
const PLANS = [
  { from: 0, dur: 180 }, //   P1 0–180     SALUT
  { from: 180, dur: 180 }, // P2 180–360   BIENVENUE
  { from: 360, dur: 240 }, // P3 360–600   PINGUINO + cercle
  { from: 600, dur: 240 }, // P4 600–840   MIDDLE MAN DE CONFIANCE
  { from: 840, dur: 300 }, // P5 840–1140  trois mots-clés
  { from: 1140, dur: 300 }, // P6 1140–1440 REJOINS-NOUS MAINTENANT
  { from: 1440, dur: 360 }, // P7 1440–1800 LIEN EN BIO + cercle
];

// --- Texte 3D biseauté + glow néon --------------------------------------

// Léger tremblement permanent appliqué à chaque Text3D pour donner du
// nerf — combinaison de deux sinusoïdes pour éviter la périodicité.
const getJitter = (frame: number) => ({
  x: Math.sin(frame * 0.8) * 1.6 + Math.cos(frame * 1.1) * 1.4,
  y: Math.cos(frame * 0.7) * 1.4 + Math.sin(frame * 1.3) * 1.2,
});

const TEXT_SHADOW = [
  "0 2px 0 #006a80",
  "0 4px 0 #005468",
  "0 6px 0 #00404f",
  "0 8px 0 #002c38",
  "0 10px 0 #001a22",
  "0 12px 0 #00121a",
  "0 0 30px #00e5ff",
  "0 0 60px #00bcd4",
  "0 0 110px rgba(0,229,255,0.7)",
  "0 0 170px rgba(0,229,255,0.5)",
].join(", ");

const Text3D: FC<{
  text: string;
  fontSize?: number;
  letterSpacing?: number;
  jitter?: { x: number; y: number };
}> = ({ text, fontSize = 200, letterSpacing = -3, jitter = { x: 0, y: 0 } }) => {
  const common: CSSProperties = {
    fontFamily: FONT,
    fontSize,
    fontWeight: 900,
    letterSpacing,
    lineHeight: 0.95,
    whiteSpace: "pre-line",
    textAlign: "center",
    textTransform: "uppercase",
    margin: 0,
  };

  return (
    <div
      style={{
        position: "relative",
        display: "inline-block",
        transform: `translate(${jitter.x}px, ${jitter.y}px)`,
      }}
    >
      <div
        style={{
          ...common,
          position: "absolute",
          inset: 0,
          color: CYAN,
          textShadow: TEXT_SHADOW,
        }}
      >
        {text}
      </div>
      <div
        style={{
          ...common,
          position: "relative",
          background:
            "linear-gradient(180deg, #f4ffff 0%, #c4f4ff 30%, #36d4ff 65%, #00667e 100%)",
          WebkitBackgroundClip: "text",
          backgroundClip: "text",
          WebkitTextFillColor: "transparent",
          color: "transparent",
        }}
      >
        {text}
      </div>
    </div>
  );
};

// --- Élément signature : cercle néon pulsant ----------------------------

const NeonCircle: FC<{ size?: number }> = ({ size = 720 }) => {
  const frame = useCurrentFrame();
  const pulse = 0.5 + 0.5 * Math.sin(frame * 0.18);
  const rot = frame * 0.4;

  return (
    <div style={{ position: "relative", width: size, height: size }}>
      <div
        style={{
          position: "absolute",
          inset: 0,
          borderRadius: "50%",
          border: `${8 + pulse * 6}px solid ${CYAN}`,
          boxShadow: `
            0 0 ${50 + 80 * pulse}px ${CYAN},
            0 0 ${100 + 140 * pulse}px rgba(0,229,255,0.7),
            inset 0 0 ${40 + 60 * pulse}px rgba(0,229,255,0.6)
          `,
        }}
      />
      <div
        style={{
          position: "absolute",
          inset: 26,
          borderRadius: "50%",
          border: "2px dashed rgba(0,229,255,0.55)",
          transform: `rotate(${rot}deg)`,
        }}
      />
      <div
        style={{
          position: "absolute",
          inset: 70,
          borderRadius: "50%",
          border: "1px solid rgba(180,240,255,0.45)",
          transform: `rotate(${-rot * 0.7}deg)`,
        }}
      />
    </div>
  );
};

// --- Fonds récurrents ----------------------------------------------------

// Grille perspective façon plan d'architecte (plans 1 & 2).
const GridFloor: FC = () => {
  const frame = useCurrentFrame();
  const offset = (frame * 5) % 120;

  return (
    <AbsoluteFill
      style={{
        background:
          "radial-gradient(ellipse at center top, #051a26 0%, #02070f 60%, #01030a 100%)",
        overflow: "hidden",
      }}
    >
      <div
        style={{
          position: "absolute",
          left: "-60%",
          right: "-60%",
          bottom: "-25%",
          height: "130%",
          perspective: "900px",
          perspectiveOrigin: "50% 0%",
        }}
      >
        <div
          style={{
            position: "absolute",
            inset: 0,
            transform: "rotateX(72deg)",
            transformOrigin: "center top",
            backgroundImage: `
              linear-gradient(rgba(0,229,255,0.75) 2px, transparent 2px),
              linear-gradient(90deg, rgba(0,229,255,0.75) 2px, transparent 2px)
            `,
            backgroundSize: "120px 120px",
            backgroundPosition: `0 ${offset}px, 0 0`,
            WebkitMaskImage:
              "linear-gradient(180deg, transparent 0%, black 35%, black 80%, transparent 100%)",
            maskImage:
              "linear-gradient(180deg, transparent 0%, black 35%, black 80%, transparent 100%)",
            filter: "drop-shadow(0 0 8px rgba(0,229,255,0.6))",
          }}
        />
      </div>
      <AbsoluteFill
        style={{
          background:
            "radial-gradient(ellipse at center, transparent 25%, rgba(0,0,0,0.55) 75%)",
        }}
      />
    </AbsoluteFill>
  );
};

// Vagues circulaires émanant du centre (plans 3 & 7).
const Waves: FC = () => {
  const frame = useCurrentFrame();
  const ring = 6;

  return (
    <AbsoluteFill style={{ justifyContent: "center", alignItems: "center" }}>
      {[...Array(ring).keys()].map((i) => {
        const span = 240;
        const t = ((frame + i * 40) % span) / span;
        const scale = 0.15 + t * 2.4;
        const opacity = (1 - t) * 0.55;
        return (
          <div
            key={`wave-${i}`}
            style={{
              position: "absolute",
              width: 900,
              height: 900,
              borderRadius: "50%",
              border: `3px solid ${CYAN}`,
              transform: `scale(${scale})`,
              opacity,
              boxShadow: `0 0 60px ${CYAN}, inset 0 0 40px rgba(0,229,255,0.5)`,
            }}
          />
        );
      })}
    </AbsoluteFill>
  );
};

// Fond énergique : gradient + diagonales animées (plans 4 & 5).
const EnergyFloor: FC = () => {
  const frame = useCurrentFrame();
  const offset = (frame * 6) % 90;

  return (
    <AbsoluteFill
      style={{
        background:
          "linear-gradient(180deg, #001827 0%, #003a55 50%, #001020 100%)",
      }}
    >
      <AbsoluteFill
        style={{
          backgroundImage: `repeating-linear-gradient(
            55deg,
            rgba(0,229,255,0.18) 0px,
            rgba(0,229,255,0.18) 3px,
            transparent 3px,
            transparent 60px
          )`,
          backgroundPosition: `${offset}px 0`,
          opacity: 0.9,
        }}
      />
      <AbsoluteFill
        style={{
          backgroundImage: `repeating-linear-gradient(
            -55deg,
            rgba(0,229,255,0.12) 0px,
            rgba(0,229,255,0.12) 2px,
            transparent 2px,
            transparent 80px
          )`,
          backgroundPosition: `${-offset}px 0`,
        }}
      />
      <AbsoluteFill
        style={{
          background:
            "radial-gradient(ellipse at center, rgba(0,229,255,0.18) 0%, transparent 60%)",
        }}
      />
    </AbsoluteFill>
  );
};

// Fond saturé + zoom pour le plan 6.
const SaturatedFloor: FC = () => {
  const frame = useCurrentFrame();
  const offset = (frame * 4) % 100;

  return (
    <AbsoluteFill
      style={{
        background:
          "radial-gradient(ellipse at center, #00b2d6 0%, #004a78 35%, #001020 80%)",
        filter: "saturate(1.6)",
      }}
    >
      <AbsoluteFill
        style={{
          backgroundImage: `repeating-radial-gradient(
            circle at center,
            rgba(255,255,255,0.06) 0px,
            rgba(255,255,255,0.06) 2px,
            transparent 2px,
            transparent 18px
          )`,
          backgroundPosition: `${offset}px ${offset}px`,
        }}
      />
    </AbsoluteFill>
  );
};

// Fond final néon (plan 7) — cyan dense.
const FinalFloor: FC = () => (
  <AbsoluteFill
    style={{
      background:
        "radial-gradient(ellipse at center, #008aa8 0%, #003855 45%, #00121e 100%)",
    }}
  />
);

// --- Particules persistantes --------------------------------------------

const PARTICLE_COUNT = 90;

const Particles: FC = () => {
  const frame = useCurrentFrame();
  const { width, height } = useVideoConfig();

  const particles = useMemo(
    () =>
      [...Array(PARTICLE_COUNT).keys()].map((i) => ({
        x: random(`px-${i}`) * width,
        baseY: random(`py-${i}`) * height,
        speed: 0.4 + random(`ps-${i}`) * 2.2,
        size: 2 + random(`pz-${i}`) * 5,
        phase: random(`pf-${i}`) * Math.PI * 2,
      })),
    [width, height],
  );

  return (
    <AbsoluteFill style={{ pointerEvents: "none" }}>
      {particles.map((p, i) => {
        let y = (p.baseY - frame * p.speed) % height;
        if (y < 0) y += height;
        const twinkle =
          0.25 + 0.75 * Math.abs(Math.sin(frame * 0.07 + p.phase));
        return (
          <div
            key={`p-${i}`}
            style={{
              position: "absolute",
              left: p.x,
              top: y,
              width: p.size,
              height: p.size,
              borderRadius: "50%",
              background: CYAN,
              boxShadow: `0 0 ${p.size * 5}px ${CYAN}`,
              opacity: twinkle,
            }}
          />
        );
      })}
    </AbsoluteFill>
  );
};

// --- Glow d'ambiance permanent ------------------------------------------

const AmbientGlow: FC = () => (
  <AbsoluteFill
    style={{
      background:
        "radial-gradient(ellipse at center, rgba(0,229,255,0.12) 0%, transparent 65%)",
      pointerEvents: "none",
    }}
  />
);

// --- Flash de transition au début de chaque plan ------------------------

const PlanFlash: FC = () => {
  const frame = useCurrentFrame();
  const op = interpolate(frame, [0, 10], [0.9, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  return (
    <AbsoluteFill
      style={{
        backgroundColor: "#ffffff",
        opacity: op,
        pointerEvents: "none",
      }}
    />
  );
};

// =========================================================================
// PLANS
// =========================================================================

// Plan 1 — SALUT, pop avec rebond.
const Plan1: FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const scale = spring({ frame, fps, config: { damping: 6, mass: 0.7 } });

  return (
    <AbsoluteFill>
      <GridFloor />
      <AbsoluteFill style={{ justifyContent: "center", alignItems: "center" }}>
        <div style={{ transform: `scale(${scale})` }}>
          <Text3D text="SALUT" fontSize={300} jitter={getJitter(frame)} />
        </div>
      </AbsoluteFill>
      <PlanFlash />
    </AbsoluteFill>
  );
};

// Plan 2 — BIENVENUE, jaillit vers la caméra.
const Plan2: FC = () => {
  const frame = useCurrentFrame();
  const scale = interpolate(frame, [0, 18, 36], [0.15, 1.55, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });
  const blur = interpolate(frame, [0, 18, 36], [12, 3, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill>
      <GridFloor />
      <AbsoluteFill style={{ justifyContent: "center", alignItems: "center" }}>
        <div
          style={{
            transform: `scale(${scale})`,
            filter: `blur(${blur}px)`,
          }}
        >
          <Text3D text="BIENVENUE" fontSize={190} jitter={getJitter(frame)} />
        </div>
      </AbsoluteFill>
      <PlanFlash />
    </AbsoluteFill>
  );
};

// Plan 3 — PINGUINO + cercle néon, ondes circulaires.
const Plan3: FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const circleIn = spring({ frame, fps, config: { damping: 13 } });
  const textIn = spring({
    frame: frame - 16,
    fps,
    config: { damping: 11 },
  });

  return (
    <AbsoluteFill style={{ backgroundColor: "#01060f" }}>
      <Waves />
      <AbsoluteFill style={{ justifyContent: "center", alignItems: "center" }}>
        <div style={{ transform: `scale(${circleIn})` }}>
          <NeonCircle size={760} />
        </div>
      </AbsoluteFill>
      <AbsoluteFill
        style={{
          justifyContent: "flex-end",
          alignItems: "center",
          paddingBottom: 260,
        }}
      >
        <div
          style={{
            opacity: textIn,
            transform: `translateY(${(1 - textIn) * 60}px) scale(${textIn})`,
          }}
        >
          <Text3D text="PINGUINO" fontSize={200} jitter={getJitter(frame)} />
        </div>
      </AbsoluteFill>
      <PlanFlash />
    </AbsoluteFill>
  );
};

// Plan 4 — MIDDLE MAN DE CONFIANCE, lignes qui glissent.
const Plan4: FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const line1 = spring({ frame, fps, config: { damping: 13 } });
  const line2 = spring({
    frame: frame - 16,
    fps,
    config: { damping: 13 },
  });
  const shake = Math.sin(frame * 0.6) * 4;

  return (
    <AbsoluteFill>
      <EnergyFloor />
      <AbsoluteFill
        style={{
          justifyContent: "center",
          alignItems: "center",
          flexDirection: "column",
          gap: 32,
          transform: `translateX(${shake}px)`,
        }}
      >
        <div
          style={{
            opacity: line1,
            transform: `translateX(${(1 - line1) * -260}px)`,
          }}
        >
          <Text3D text="MIDDLE MAN" fontSize={150} jitter={getJitter(frame)} />
        </div>
        <div
          style={{
            opacity: line2,
            transform: `translateX(${(1 - line2) * 260}px)`,
          }}
        >
          <Text3D
            text="DE CONFIANCE"
            fontSize={150}
            jitter={getJitter(frame + 20)}
          />
        </div>
      </AbsoluteFill>
      <PlanFlash />
    </AbsoluteFill>
  );
};

// Plan 5 — 3 mots-clés successifs avec flash.
const KEYWORDS = ["VOCAUX\nACTIFS", "AMBIANCE\nNON-STOP", "COMMUNAUTÉ\nSÉRIEUSE"];

const Plan5: FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const wordDur = 100;
  const idx = Math.min(Math.floor(frame / wordDur), KEYWORDS.length - 1);
  const local = frame - idx * wordDur;

  const enter = spring({
    frame: local,
    fps,
    config: { damping: 8, mass: 0.55 },
  });
  const fadeOut = interpolate(local, [wordDur - 18, wordDur - 4], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const flash = interpolate(local, [0, 8], [0.95, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill>
      <EnergyFloor />
      <AbsoluteFill style={{ justifyContent: "center", alignItems: "center" }}>
        <div
          style={{
            transform: `scale(${enter})`,
            opacity: fadeOut,
          }}
        >
          <Text3D
            text={KEYWORDS[idx]}
            fontSize={170}
            jitter={getJitter(frame)}
          />
        </div>
      </AbsoluteFill>
      <AbsoluteFill
        style={{
          backgroundColor: CYAN,
          opacity: flash * 0.55,
          mixBlendMode: "screen",
          pointerEvents: "none",
        }}
      />
      <PlanFlash />
    </AbsoluteFill>
  );
};

// Plan 6 — REJOINS-NOUS MAINTENANT, zoom avant continu.
const Plan6: FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const zoom = interpolate(frame, [0, 300], [0.65, 1.2], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.quad),
  });
  const opacity = spring({ frame, fps, config: { damping: 14 } });
  const shake = Math.sin(frame * 0.9) * 3 + Math.cos(frame * 1.4) * 2;

  return (
    <AbsoluteFill>
      <SaturatedFloor />
      <AbsoluteFill style={{ justifyContent: "center", alignItems: "center" }}>
        <div
          style={{
            transform: `scale(${zoom}) translate(${shake}px, ${shake * 0.6}px)`,
            opacity,
          }}
        >
          <Text3D
            text={"REJOINS-NOUS\nMAINTENANT"}
            fontSize={135}
            jitter={getJitter(frame)}
          />
        </div>
      </AbsoluteFill>
      <PlanFlash />
    </AbsoluteFill>
  );
};

// Plan 7 — LIEN EN BIO, cercle néon final.
const Plan7: FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const circleIn = spring({ frame, fps, config: { damping: 14 } });
  const textIn = spring({
    frame: frame - 22,
    fps,
    config: { damping: 11 },
  });
  const breathe = 1 + Math.sin(frame * 0.12) * 0.025;

  return (
    <AbsoluteFill>
      <FinalFloor />
      <Waves />
      <AbsoluteFill style={{ justifyContent: "center", alignItems: "center" }}>
        <div style={{ transform: `scale(${circleIn * breathe})` }}>
          <NeonCircle size={820} />
        </div>
      </AbsoluteFill>
      <AbsoluteFill style={{ justifyContent: "center", alignItems: "center" }}>
        <div
          style={{
            transform: `scale(${textIn})`,
            opacity: textIn,
          }}
        >
          <Text3D
            text={"LIEN\nEN BIO"}
            fontSize={210}
            jitter={getJitter(frame)}
          />
        </div>
      </AbsoluteFill>
      <PlanFlash />
    </AbsoluteFill>
  );
};

// =========================================================================
// COMPOSITION
// =========================================================================

const PLAN_COMPONENTS = [Plan1, Plan2, Plan3, Plan4, Plan5, Plan6, Plan7];

export const Scene: FC = () => {
  // Audio désactivé pour le moment.
  // Pour en ajouter plus tard, dé-commenter la ligne ci-dessous et
  // déposer le fichier dans /public.
  //
  //   import { Audio, staticFile } from "remotion";
  //   <Audio src={staticFile("musique.mp3")} />

  return (
    <AbsoluteFill style={{ backgroundColor: "#01030a", fontFamily: FONT }}>
      {/* Glow cyan permanent */}
      <AmbientGlow />

      {/* Particules animées en fond, présentes sur tout le clip */}
      <Particles />

      {/* Plans séquentiels */}
      {PLANS.map((p, i) => {
        const PlanComp = PLAN_COMPONENTS[i];
        return (
          <Sequence
            key={`plan-${i}`}
            from={p.from}
            durationInFrames={p.dur}
          >
            <PlanComp />
          </Sequence>
        );
      })}
    </AbsoluteFill>
  );
};
