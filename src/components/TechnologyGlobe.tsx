import { Canvas, useFrame } from "@react-three/fiber";
import { Environment, Lightformer, Line } from "@react-three/drei";
import { useEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";

type Palette = {
  ink: string;
  primary: string;
  accent: string;
  paper: string;
};

const NETWORK_POINTS = [
  [1.05, 0.76, 0.42],
  [0.62, 1.08, -0.52],
  [-0.34, 1.16, 0.68],
  [-1.04, 0.55, 0.62],
  [-1.1, -0.4, 0.58],
  [-0.42, -1.14, 0.64],
  [0.68, -1.02, 0.58],
  [1.16, -0.24, -0.4],
  [0.34, 0.18, 1.28],
  [-0.72, 0.1, -1.12],
] as const;

const CONNECTIONS = [
  [0, 1], [1, 2], [2, 3], [3, 4], [4, 5], [5, 6], [6, 7], [7, 0],
  [0, 8], [2, 8], [4, 9], [6, 8], [1, 9],
] as const;

function curveBetween(start: readonly number[], end: readonly number[]) {
  const a = new THREE.Vector3(start[0], start[1], start[2]);
  const b = new THREE.Vector3(end[0], end[1], end[2]);
  const midpoint = a.clone().add(b).multiplyScalar(0.5).normalize().multiplyScalar(1.62);
  return new THREE.QuadraticBezierCurve3(a, midpoint, b).getPoints(24);
}

function NetworkGlobe({ palette, reducedMotion }: { palette: Palette; reducedMotion: boolean }) {
  const globe = useRef<THREE.Group>(null);
  const target = useRef({ x: 0, y: 0 });
  const arcs = useMemo(
    () => CONNECTIONS.map(([a, b]) => ({ key: `${a}-${b}`, points: curveBetween(NETWORK_POINTS[a], NETWORK_POINTS[b]) })),
    [],
  );

  useFrame((state, rawDelta) => {
    const group = globe.current;
    if (!group || reducedMotion) return;
    const delta = Math.min(rawDelta, 0.05);
    const ease = 1 - Math.exp(-3.4 * delta);
    group.rotation.y += 0.11 * delta;
    group.rotation.x = THREE.MathUtils.lerp(group.rotation.x, target.current.y * 0.12, ease);
    group.rotation.z = THREE.MathUtils.lerp(group.rotation.z, -target.current.x * 0.08, ease);
    state.camera.position.x = THREE.MathUtils.lerp(state.camera.position.x, target.current.x * 0.25, ease);
    state.camera.position.y = THREE.MathUtils.lerp(state.camera.position.y, target.current.y * 0.18, ease);
    state.camera.lookAt(0, 0, 0);
  });

  return (
    <group
      ref={globe}
      rotation={[0.14, -0.45, -0.08]}
      onPointerMove={(event) => {
        target.current = { x: event.pointer.x, y: event.pointer.y };
      }}
      onPointerLeave={() => {
        target.current = { x: 0, y: 0 };
      }}
    >
      <mesh>
        <icosahedronGeometry args={[1.34, 4]} />
        <meshPhysicalMaterial
          color={palette.ink}
          metalness={0.7}
          roughness={0.28}
          clearcoat={0.72}
          clearcoatRoughness={0.26}
        />
      </mesh>
      <mesh scale={1.012}>
        <icosahedronGeometry args={[1.34, 2]} />
        <meshBasicMaterial color={palette.primary} wireframe transparent opacity={0.34} />
      </mesh>
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[1.58, 0.008, 5, 128]} />
        <meshBasicMaterial color={palette.accent} transparent opacity={0.6} />
      </mesh>
      <mesh rotation={[0.2, 0, Math.PI / 2]}>
        <torusGeometry args={[1.47, 0.005, 5, 128]} />
        <meshBasicMaterial color={palette.paper} transparent opacity={0.24} />
      </mesh>

      {arcs.map(({ key, points }, index) => (
        <Line
          key={key}
          points={points}
          color={index % 3 === 0 ? palette.paper : palette.accent}
          transparent
          opacity={index % 3 === 0 ? 0.42 : 0.68}
          lineWidth={0.72}
        />
      ))}

      {NETWORK_POINTS.map((position, index) => (
        <mesh key={index} position={position}>
          <sphereGeometry args={[index === 8 ? 0.055 : 0.035, 10, 10]} />
          <meshStandardMaterial
            color={index === 8 ? palette.paper : palette.accent}
            emissive={palette.accent}
            emissiveIntensity={index === 8 ? 1.2 : 0.65}
          />
        </mesh>
      ))}
    </group>
  );
}

function readPalette(element: HTMLElement): Palette {
  const styles = getComputedStyle(element);
  const resolve = (token: string) => styles.getPropertyValue(token).trim();
  return {
    ink: resolve("--globe-ink"),
    primary: resolve("--globe-primary"),
    accent: resolve("--globe-accent"),
    paper: resolve("--globe-paper"),
  };
}

export default function TechnologyGlobe() {
  const container = useRef<HTMLDivElement>(null);
  const [palette, setPalette] = useState<Palette>();
  const [active, setActive] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    const element = container.current;
    if (!element) return;

    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const syncMotion = () => setReducedMotion(media.matches);
    const observer = new IntersectionObserver(
      ([entry]) => setActive(Boolean(entry?.isIntersecting) && !document.hidden),
      { rootMargin: "160px" },
    );
    const syncVisibility = () => setActive(!document.hidden && element.getBoundingClientRect().bottom > 0);

    setPalette(readPalette(element));
    syncMotion();
    observer.observe(element);
    media.addEventListener("change", syncMotion);
    document.addEventListener("visibilitychange", syncVisibility);
    return () => {
      observer.disconnect();
      media.removeEventListener("change", syncMotion);
      document.removeEventListener("visibilitychange", syncVisibility);
    };
  }, []);

  return (
    <div ref={container} className="technology-globe relative h-[24rem] w-full sm:h-[30rem] lg:h-[36rem]">
      {palette && (
        <Canvas
          aria-label="Interactive global technology network"
          dpr={[1, 1.35]}
          frameloop={active && !reducedMotion ? "always" : "demand"}
          camera={{ position: [0, 0, 4.25], fov: 42 }}
          gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
        >
          <ambientLight intensity={0.65} />
          <directionalLight position={[4, 5, 6]} intensity={2.2} color={palette.paper} />
          <pointLight position={[-4, -2, 3]} intensity={3} color={palette.accent} />
          <Environment resolution={64}>
            <Lightformer intensity={2.4} color={palette.paper} position={[0, 4, 2]} scale={[5, 1, 1]} />
            <Lightformer intensity={1.8} color={palette.accent} position={[-4, 0, 1]} rotation-y={Math.PI / 2} scale={[4, 2, 1]} />
          </Environment>
          <NetworkGlobe palette={palette} reducedMotion={reducedMotion} />
        </Canvas>
      )}
    </div>
  );
}