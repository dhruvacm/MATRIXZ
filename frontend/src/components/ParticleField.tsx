import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

function pseudoRandom(seed: number) {
  const x = Math.sin(seed) * 43758.5453;
  return x - Math.floor(x);
}

/**
 * Subtle spherical particle field surrounding the structure — reads as
 * ambient digital energy rather than a starfield. Uses a single Points
 * object (one draw call) for performance.
 */
export function ParticleField({ compact = false, reducedMotion = false }: { compact?: boolean; reducedMotion?: boolean }) {
  const count = compact ? 75 : 150;
  const pointsRef = useRef<THREE.Points>(null);

  const positions = useMemo(() => {
    const arr = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const rand1 = pseudoRandom(i * 12.345 + 3);
      const rand2 = pseudoRandom(i * 45.678 + 9);
      const rand3 = pseudoRandom(i * 78.912 + 21);

      const radius = 3.0 + rand1 * 1.6;
      const theta = rand2 * Math.PI * 2;
      const phi = Math.acos(2 * rand3 - 1);
      arr[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
      arr[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta) * 0.6;
      arr[i * 3 + 2] = radius * Math.cos(phi);
    }
    return arr;
  }, [count]);

  useFrame((_, delta) => {
    if (!pointsRef.current) return;
    pointsRef.current.rotation.y += delta * (reducedMotion ? 0.008 : 0.025);
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial color="#a78bfa" size={0.02} sizeAttenuation transparent opacity={0.55} depthWrite={false} />
    </points>
  );
}
