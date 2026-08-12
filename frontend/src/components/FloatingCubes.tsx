import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

interface FloatCube {
  position: [number, number, number];
  scale: number;
  phase: number;
  speed: number;
  color: string;
}

// Stable positions keep the scene composed rather than explosive.
function pseudoRandom(seed: number) {
  const x = Math.sin(seed) * 43758.5453;
  return x - Math.floor(x);
}

function buildFloaters(count: number): FloatCube[] {
  const colors = ["#8b5cf6", "#3b82f6", "#60a5fa", "#a78bfa"];
  const items: FloatCube[] = [];
  const positions: [number, number, number][] = [[-2.35, 1.05, .2], [2.35, .65, -.4], [-2.15, -.85, .3], [2.2, -1.1, .1], [.2, 1.9, -.2], [-.25, -1.95, .4]];
  for (let i = 0; i < count; i++) {
    const rand1 = pseudoRandom(i * 12.9898 + 1);
    const rand2 = pseudoRandom(i * 78.233 + 7);
    const rand3 = pseudoRandom(i * 37.719 + 13);

    items.push({
      position: positions[i],
      scale: 0.075 + rand2 * 0.09,
      phase: rand1 * Math.PI * 2,
      speed: 0.4 + rand3 * 0.5,
      color: colors[i % colors.length],
    });
  }
  return items;
}

/**
 * 8-15 small cubes scattered around the main structure, each floating and
 * rotating on its own independent phase/speed so the cluster feels alive
 * rather than uniformly animated.
 */
export function FloatingCubes({ compact = false, reducedMotion = false }: { compact?: boolean; reducedMotion?: boolean }) {
  const count = compact ? 4 : 6;
  const cubes = useMemo(() => buildFloaters(count), [count]);
  const refs = useRef<(THREE.Mesh | null)[]>([]);
  const clock = useRef(0);

  useFrame((_, delta) => {
    clock.current += delta;
    const factor = reducedMotion ? 0.2 : 1;
    cubes.forEach((c, i) => {
      const mesh = refs.current[i];
      if (!mesh) return;
      mesh.position.y = c.position[1] + Math.sin(clock.current * c.speed + c.phase) * 0.25 * factor;
      mesh.rotation.x += delta * 0.15 * factor;
      mesh.rotation.y += delta * 0.2 * factor;
    });
  });

  return (
    <>
      {cubes.map((c, i) => (
        <mesh key={i} ref={(el) => (refs.current[i] = el)} position={c.position} scale={c.scale}>
          <boxGeometry args={[1, 1, 1]} />
          <meshStandardMaterial color={c.color} emissive={c.color} emissiveIntensity={0.6} roughness={0.3} metalness={0.5} />
        </mesh>
      ))}
    </>
  );
}
