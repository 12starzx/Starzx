import { useThree } from "@react-three/fiber";
import { ThreeCanvas } from "@remotion/three";
import { useMemo } from "react";
import type { FC } from "react";
import {
  AbsoluteFill,
  Easing,
  interpolate,
  random,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";

const BG = "#05060f";

// Drives an orbiting camera that slowly dollies in toward the scene.
const CameraRig: FC = () => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  const camera = useThree((state) => state.camera);

  const progress = frame / durationInFrames;
  const angle = progress * Math.PI * 2;
  const radius = interpolate(frame, [0, durationInFrames], [12, 7.5]);
  const height = Math.sin(progress * Math.PI * 2) * 2.4 + 1.5;

  camera.position.set(
    Math.sin(angle) * radius,
    height,
    Math.cos(angle) * radius,
  );
  camera.lookAt(0, 0, 0);

  return null;
};

const Lights: FC = () => {
  const frame = useCurrentFrame();

  return (
    <>
      <ambientLight intensity={0.4} />
      <directionalLight position={[6, 10, 6]} intensity={2.2} />
      <pointLight
        position={[Math.sin(frame * 0.03) * 9, 5, Math.cos(frame * 0.03) * 9]}
        intensity={420}
        color="#ff5ea8"
      />
      <pointLight
        position={[Math.cos(frame * 0.042) * 9, -5, Math.sin(frame * 0.042) * 9]}
        intensity={420}
        color="#46a8ff"
      />
    </>
  );
};

// The central rotating torus knot with a hue that cycles over time.
const CoreKnot: FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const intro = spring({ frame, fps, config: { damping: 12, mass: 0.8 } });
  const pulse = 1 + Math.sin(frame * 0.08) * 0.05;
  const hue = (frame * 0.4) % 360;

  return (
    <mesh rotation={[frame * 0.012, frame * 0.02, 0]} scale={intro * pulse}>
      <torusKnotGeometry args={[1.5, 0.45, 240, 40]} />
      <meshStandardMaterial
        color={`hsl(${hue}, 70%, 55%)`}
        emissive={`hsl(${hue}, 90%, 45%)`}
        emissiveIntensity={0.55}
        metalness={0.9}
        roughness={0.15}
      />
    </mesh>
  );
};

const SHAPE_COUNT = 10;

// A ring of icosahedra orbiting the core, each entering on a staggered spring.
const OrbitRing: FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  return (
    <group rotation={[0.35, frame * 0.008, 0]}>
      {[...Array(SHAPE_COUNT).keys()].map((i) => {
        const intro = spring({
          frame: frame - i * 3,
          fps,
          config: { damping: 14 },
        });
        const orbit = (i / SHAPE_COUNT) * Math.PI * 2 + frame * 0.018;
        const x = Math.cos(orbit) * 4.6;
        const z = Math.sin(orbit) * 4.6;
        const y = Math.sin(frame * 0.045 + i) * 0.9;
        const hue = ((i / SHAPE_COUNT) * 360 + frame * 0.6) % 360;

        return (
          <mesh
            key={`shape-${i}`}
            position={[x, y, z]}
            rotation={[frame * 0.03 + i, frame * 0.04, i]}
            scale={intro * 0.6}
          >
            <icosahedronGeometry args={[1, 0]} />
            <meshStandardMaterial
              color={`hsl(${hue}, 85%, 62%)`}
              emissive={`hsl(${hue}, 90%, 50%)`}
              emissiveIntensity={0.4}
              metalness={0.6}
              roughness={0.25}
            />
          </mesh>
        );
      })}
    </group>
  );
};

const STAR_COUNT = 1800;

// A deterministic spherical starfield (seeded so it stays stable per frame).
const Starfield: FC = () => {
  const frame = useCurrentFrame();

  const positions = useMemo(() => {
    const arr = new Float32Array(STAR_COUNT * 3);
    for (let i = 0; i < STAR_COUNT; i++) {
      const r = 16 + random(`r${i}`) * 40;
      const theta = random(`t${i}`) * Math.PI * 2;
      const phi = Math.acos(2 * random(`p${i}`) - 1);
      arr[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      arr[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      arr[i * 3 + 2] = r * Math.cos(phi);
    }
    return arr;
  }, []);

  return (
    <points rotation={[0, frame * 0.0015, frame * 0.0008]}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial
        size={0.12}
        color="#9fb8ff"
        sizeAttenuation
        transparent
        opacity={0.9}
      />
    </points>
  );
};

export const Scene: FC = () => {
  const frame = useCurrentFrame();
  const { width, height, durationInFrames } = useVideoConfig();

  const titleOpacity = interpolate(
    frame,
    [12, 38, durationInFrames - 36, durationInFrames - 10],
    [0, 1, 1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
  );
  const titleY = interpolate(frame, [12, 38], [40, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });

  return (
    <AbsoluteFill style={{ backgroundColor: BG }}>
      <ThreeCanvas
        width={width}
        height={height}
        camera={{ fov: 45, position: [0, 1.5, 12] }}
      >
        <color attach="background" args={[BG]} />
        <fog attach="fog" args={["#0a0b1f", 16, 52]} />
        <CameraRig />
        <Lights />
        <CoreKnot />
        <OrbitRing />
        <Starfield />
      </ThreeCanvas>

      <AbsoluteFill
        style={{
          justifyContent: "flex-end",
          alignItems: "center",
          paddingBottom: 120,
          pointerEvents: "none",
        }}
      >
        <div
          style={{
            opacity: titleOpacity,
            transform: `translateY(${titleY}px)`,
            textAlign: "center",
            fontFamily:
              "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
          }}
        >
          <div
            style={{
              fontSize: 28,
              fontWeight: 600,
              letterSpacing: 8,
              color: "rgba(159, 184, 255, 0.85)",
            }}
          >
            REMOTION · THREE.JS
          </div>
          <div
            style={{
              fontSize: 104,
              fontWeight: 800,
              letterSpacing: 2,
              color: "#ffffff",
              textShadow: "0 0 40px rgba(70, 168, 255, 0.55)",
            }}
          >
            3D ANIMATION
          </div>
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
