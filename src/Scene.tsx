import type { FC } from "react";
import {
  AbsoluteFill,
  Easing,
  interpolate,
  Sequence,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { ThreeBackground } from "./ThreeBackground";

const BG = "#060812";
const FONT =
  "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif";
const SEG = 90;
const INVITE = "discord.gg/NRsafWSgUr";

type Segment = {
  emoji: string;
  title: string;
  sub: string;
  color: string;
  titleSize?: number;
};

// Promo script — one card per 3 s, accompanying the 3D background.
const SEGMENTS: Segment[] = [
  {
    emoji: "🐧",
    title: "REJOINS PINGUINO",
    sub: "La commu' qui bouge non-stop",
    color: "#36d4ff",
  },
  {
    emoji: "🎙️",
    title: "VOCAUX ACTIFS",
    sub: "Des vocaux animés tous les jours",
    color: "#4a7bff",
  },
  {
    emoji: "🧠",
    title: "STEAL A BRAINROT",
    sub: "Toute l'info, les leaks & les tips",
    color: "#b06bff",
  },
  {
    emoji: "🤝",
    title: "MIDDLEMAN SUR",
    sub: "Tes échanges 100% sécurisés",
    color: "#3ce0a0",
  },
  {
    emoji: "🎁",
    title: "GIVEAWAY GARAMA",
    sub: "Un Garama color exclusif à gagner",
    color: "#ff8a3c",
  },
  {
    emoji: "🔗",
    title: INVITE,
    sub: "Lien en bio — rejoins vite !",
    color: "#ff5ea8",
    titleSize: 58,
  },
];

const TOTAL = SEG * SEGMENTS.length;

// Title that reveals character by character on a staggered spring.
const AnimatedTitle: FC<{
  text: string;
  fontSize: number;
  color: string;
}> = ({ text, fontSize, color }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const words = text.split(" ");
  let charIndex = -1;

  return (
    <div
      style={{
        display: "flex",
        flexWrap: "wrap",
        justifyContent: "center",
        columnGap: fontSize * 0.3,
        rowGap: 8,
        maxWidth: 980,
      }}
    >
      {words.map((word, wi) => (
        <div key={`word-${wi}`} style={{ display: "flex" }}>
          {[...word].map((ch, ci) => {
            charIndex += 1;
            const p = spring({
              frame: frame - 10 - charIndex * 1.5,
              fps,
              config: { damping: 12, mass: 0.6 },
            });
            return (
              <span
                key={`ch-${ci}`}
                style={{
                  display: "inline-block",
                  fontSize,
                  fontWeight: 900,
                  color: "#ffffff",
                  lineHeight: 1.05,
                  opacity: p,
                  transform: `translateY(${(1 - p) * 46}px) scale(${
                    0.55 + 0.45 * p
                  })`,
                  textShadow: `0 0 28px ${color}`,
                }}
              >
                {ch}
              </span>
            );
          })}
        </div>
      ))}
    </div>
  );
};

// One subtitle card: glowing emoji, staggered title, underline, sub-text.
const SubtitleCard: FC<{ seg: Segment }> = ({ seg }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const enter = spring({ frame, fps, config: { damping: 13, mass: 0.7 } });
  const exit = interpolate(frame, [SEG - 16, SEG - 2], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const slideOut = interpolate(frame, [SEG - 16, SEG - 2], [0, -60], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const emojiBob = Math.sin(frame * 0.13) * 14;
  const emojiRot = Math.sin(frame * 0.1) * 0.09;
  const underline = interpolate(frame, [14, 40], [0, 340], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });
  const subP = spring({ frame: frame - 22, fps, config: { damping: 14 } });

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 26,
        padding: "60px 52px",
        borderRadius: 44,
        background: "rgba(8,10,22,0.42)",
        backdropFilter: "blur(10px)",
        WebkitBackdropFilter: "blur(10px)",
        border: `1.5px solid ${seg.color}66`,
        boxShadow: `0 0 70px ${seg.color}33`,
        opacity: enter * exit,
        transform: `translateY(${(1 - enter) * 80 + slideOut}px)`,
      }}
    >
      <div
        style={{
          position: "relative",
          width: 220,
          height: 220,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <div
          style={{
            position: "absolute",
            width: 190,
            height: 190,
            borderRadius: "50%",
            background: `radial-gradient(circle, ${seg.color}66 0%, transparent 70%)`,
            filter: "blur(6px)",
          }}
        />
        {[0, 1, 2].map((d) => {
          const a = frame * 0.06 + (d * Math.PI * 2) / 3;
          return (
            <div
              key={`dot-${d}`}
              style={{
                position: "absolute",
                width: 16,
                height: 16,
                borderRadius: "50%",
                background: seg.color,
                boxShadow: `0 0 16px ${seg.color}`,
                transform: `translate(${Math.cos(a) * 98}px, ${
                  Math.sin(a) * 98
                }px)`,
              }}
            />
          );
        })}
        <div
          style={{
            fontSize: 132,
            transform: `translateY(${emojiBob}px) rotate(${emojiRot}rad)`,
          }}
        >
          {seg.emoji}
        </div>
      </div>

      <AnimatedTitle
        text={seg.title}
        fontSize={seg.titleSize ?? 86}
        color={seg.color}
      />

      <div
        style={{
          width: underline,
          height: 7,
          borderRadius: 4,
          background: `linear-gradient(90deg, transparent, ${seg.color}, transparent)`,
        }}
      />

      <div
        style={{
          fontSize: 38,
          fontWeight: 600,
          color: "rgba(255,255,255,0.92)",
          textAlign: "center",
          opacity: subP,
          transform: `translateY(${(1 - subP) * 24}px)`,
          textShadow: "0 2px 18px rgba(0,0,0,0.6)",
        }}
      >
        {seg.sub}
      </div>
    </div>
  );
};

// Persistent server badge at the top of the frame.
const Header: FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const p = spring({ frame, fps, config: { damping: 14 } });
  const glow = 0.5 + 0.5 * Math.sin(frame * 0.07);

  return (
    <div
      style={{
        position: "absolute",
        top: 104,
        left: 0,
        right: 0,
        display: "flex",
        justifyContent: "center",
        opacity: p,
        transform: `translateY(${(1 - p) * -40}px)`,
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 14,
          padding: "18px 38px",
          borderRadius: 999,
          background: "rgba(8,10,22,0.6)",
          border: `1.5px solid rgba(54,212,255,${0.4 + 0.4 * glow})`,
          boxShadow: `0 0 ${24 + 24 * glow}px rgba(54,212,255,0.4)`,
        }}
      >
        <span style={{ fontSize: 40 }}>🐧</span>
        <span
          style={{
            fontSize: 34,
            fontWeight: 800,
            color: "#ffffff",
            letterSpacing: 3,
          }}
        >
          PINGUINO
        </span>
        <span style={{ fontSize: 30, color: "#36d4ff" }}>•</span>
        <span
          style={{
            fontSize: 30,
            fontWeight: 700,
            color: "#9fb8ff",
            letterSpacing: 2,
          }}
        >
          MIDDLEMAN
        </span>
      </div>
    </div>
  );
};

// Segmented progress bar tracking the six cards.
const ProgressBar: FC = () => {
  const frame = useCurrentFrame();
  const current = Math.floor(frame / SEG);

  return (
    <div
      style={{
        position: "absolute",
        bottom: 156,
        left: 0,
        right: 0,
        display: "flex",
        justifyContent: "center",
        gap: 12,
      }}
    >
      {SEGMENTS.map((s, i) => {
        const fill =
          i < current ? 1 : i === current ? (frame - i * SEG) / SEG : 0;
        return (
          <div
            key={`bar-${i}`}
            style={{
              width: 108,
              height: 9,
              borderRadius: 6,
              background: "rgba(255,255,255,0.14)",
              overflow: "hidden",
            }}
          >
            <div
              style={{
                width: `${fill * 100}%`,
                height: "100%",
                background: s.color,
                boxShadow: `0 0 12px ${s.color}`,
              }}
            />
          </div>
        );
      })}
    </div>
  );
};

// Animated corner brackets, glowing border and a travelling scan line.
const AnimatedFrame: FC = () => {
  const frame = useCurrentFrame();
  const { fps, height } = useVideoConfig();
  const draw = spring({ frame, fps, config: { damping: 16 } });
  const pulse = 0.5 + 0.5 * Math.sin(frame * 0.07);
  const inset = 30;
  const len = 116;
  const th = 6;
  const cyan = "#36d4ff";
  const off = (1 - draw) * 54;
  const glow = `drop-shadow(0 0 9px ${cyan})`;

  return (
    <>
      <div
        style={{
          position: "absolute",
          inset,
          borderRadius: 36,
          border: `2px solid rgba(54,212,255,${0.18 + 0.3 * pulse})`,
          boxShadow: `0 0 ${30 + 40 * pulse}px rgba(54,212,255,0.25), inset 0 0 ${
            20 + 30 * pulse
          }px rgba(54,212,255,0.12)`,
          opacity: draw,
        }}
      />
      <div
        style={{
          position: "absolute",
          left: inset,
          right: inset,
          height: 3,
          top: inset + ((frame * 7) % (height - 2 * inset)),
          background:
            "linear-gradient(90deg, transparent, rgba(54,212,255,0.7), transparent)",
          opacity: 0.5 * draw,
        }}
      />
      <div
        style={{
          position: "absolute",
          top: inset,
          left: inset,
          width: len,
          height: len,
          borderTop: `${th}px solid ${cyan}`,
          borderLeft: `${th}px solid ${cyan}`,
          borderTopLeftRadius: 36,
          filter: glow,
          opacity: draw,
          transform: `translate(${-off}px, ${-off}px)`,
        }}
      />
      <div
        style={{
          position: "absolute",
          top: inset,
          right: inset,
          width: len,
          height: len,
          borderTop: `${th}px solid ${cyan}`,
          borderRight: `${th}px solid ${cyan}`,
          borderTopRightRadius: 36,
          filter: glow,
          opacity: draw,
          transform: `translate(${off}px, ${-off}px)`,
        }}
      />
      <div
        style={{
          position: "absolute",
          bottom: inset,
          left: inset,
          width: len,
          height: len,
          borderBottom: `${th}px solid ${cyan}`,
          borderLeft: `${th}px solid ${cyan}`,
          borderBottomLeftRadius: 36,
          filter: glow,
          opacity: draw,
          transform: `translate(${-off}px, ${off}px)`,
        }}
      />
      <div
        style={{
          position: "absolute",
          bottom: inset,
          right: inset,
          width: len,
          height: len,
          borderBottom: `${th}px solid ${cyan}`,
          borderRight: `${th}px solid ${cyan}`,
          borderBottomRightRadius: 36,
          filter: glow,
          opacity: draw,
          transform: `translate(${off}px, ${off}px)`,
        }}
      />
    </>
  );
};

export const Scene: FC = () => {
  return (
    <AbsoluteFill style={{ backgroundColor: BG, fontFamily: FONT }}>
      <ThreeBackground />

      <AbsoluteFill
        style={{
          background:
            "linear-gradient(180deg, rgba(6,8,18,0.92) 0%, rgba(6,8,18,0.34) 26%, rgba(6,8,18,0.30) 60%, rgba(6,8,18,0.95) 100%)",
        }}
      />

      <AnimatedFrame />
      <Header />

      {SEGMENTS.map((seg, i) => (
        <Sequence key={`seg-${i}`} from={i * SEG} durationInFrames={SEG}>
          <AbsoluteFill
            style={{ justifyContent: "center", alignItems: "center" }}
          >
            <SubtitleCard seg={seg} />
          </AbsoluteFill>
        </Sequence>
      ))}

      <ProgressBar />
    </AbsoluteFill>
  );
};

export { TOTAL };
