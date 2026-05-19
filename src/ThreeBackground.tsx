import { useThree } from "@react-three/fiber";
import { ThreeCanvas } from "@remotion/three";
import { useMemo } from "react";
import type { FC } from "react";
import {
  interpolate,
  random,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";

const BG = "#060812";

// Orbiting camera that slowly dollies in toward the scene.
const CameraRig: FC = () => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  const camera = useThree((state) => state.camera);

  const progress = frame / durationInFrames;
  const angle = progress * Math.PI * 2;
  const radius = interpolate(frame, [0, durationInFrames], [10.5, 7]);
  const height = Math.sin(progress * Math.PI * 2) * 2.2 + 1.4;

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
      <ambientLight intensity={0.45} />
      <directionalLight position={[6, 10, 6]} intensity={2.2} />
      <pointLight
        position={[Math.sin(frame * 0.03) * 9, 5, Math.cos(frame * 0.03) * 9]}
        intensity={440}
        color="#36d4ff"
      />
      <pointLight
        position={[Math.cos(frame * 0.042) * 9, -5, Math.sin(frame * 0.042) * 9]}
        intensity={440}
        color="#ff5ea8"
      />
    </>
  );
};

// Central rotating torus knot with a continuously cycling hue.
const CoreKnot: FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const intro = spring({ frame, fps, config: { damping: 12, mass: 0.8 } });
  const pulse = 1 + Math.sin(frame * 0.08) * 0.05;
  const hue = (frame * 0.5) % 360;

  return (
    <mesh rotation={[frame * 0.012, frame * 0.02, 0]} scale={intro * pulse}>
      <torusKnotGeometry args={[1.3, 0.4, 240, 40]} />
      <meshStandardMaterial
        color={`hsl(${hue}, 75%, 58%)`}
        emissive={`hsl(${hue}, 90%, 48%)`}
        emissiveIntensity={0.6}
        metalness={0.9}
        roughness={0.15}
      />
    </mesh>
  );
};

const SHAPE_COUNT = 10;

// A ring of icosahedra orbiting the core, each on a staggered entrance.
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
        const x = Math.cos(orbit) * 4;
        const z = Math.sin(orbit) * 4;
        const y = Math.sin(frame * 0.045 + i) * 0.9;
        const hue = ((i / SHAPE_COUNT) * 360 + frame * 0.6) % 360;

        return (
          <mesh
            key={`shape-${i}`}
            position={[x, y, z]}
            rotation={[frame * 0.03 + i, frame * 0.04, i]}
            scale={intro * 0.55}
          >
            <icosahedronGeometry args={[1, 0]} />
            <meshStandardMaterial
              color={`hsl(${hue}, 85%, 62%)`}
              emissive={`hsl(${hue}, 90%, 50%)`}
              emissiveIntensity={0.45}
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
        size={0.13}
        color="#9fb8ff"
        sizeAttenuation
        transparent
        opacity={0.9}
      />
    </points>
  );
};

// Full-bleed animated 3D scene used as the video background.
export const ThreeBackground: FC = () => {
  const { width, height } = useVideoConfig();

  return (
    <ThreeCanvas
      width={width}
      height={height}
      camera={{ fov: 50, position: [0, 1.5, 10] }}
    >
      <color attach="background" args={[BG]} />
      <fog attach="fog" args={["#0a0b1f", 14, 46]} />
      <CameraRig />
      <Lights />
      <CoreKnot />
      <OrbitRing />
      <Starfield />
    </ThreeCanvas>
  );
};
