import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

interface RingConfig {
  radius: number;
  tube: number;
  tilt: [number, number, number];
  color: string;
  speed: number;
  opacity: number;
}

const RINGS: RingConfig[] = [
  { radius: 1.9, tube: 0.008, tilt: [Math.PI / 2.3, 0, 0.3], color: "#8b5cf6", speed: 0.06, opacity: 0.48 },
  { radius: 2.18, tube: 0.006, tilt: [Math.PI / 2.6, 0.4, -0.2], color: "#3b82f6", speed: -0.045, opacity: 0.38 },
  { radius: 1.62, tube: 0.007, tilt: [Math.PI / 1.9, 0.2, -0.5], color: "#a78bfa", speed: -0.07, opacity: 0.38 },
];

/**
 * 3-4 thin, partially transparent orbit rings around the main structure,
 * each tilted differently and rotating slowly at its own speed so they
 * weave in front of and behind the cube cluster.
 */
export function OrbitRings({ reducedMotion = false }: { reducedMotion?: boolean }) {
  const refs = useRef<(THREE.Mesh | null)[]>([]);

  useFrame((_, delta) => {
    const factor = reducedMotion ? 0.15 : 1;
    refs.current.forEach((mesh, i) => {
      if (!mesh) return;
      mesh.rotation.z += RINGS[i].speed * delta * factor;
    });
  });

  return (
    <>
      {RINGS.map((ring, i) => (
        <mesh key={i} ref={(el) => (refs.current[i] = el)} rotation={ring.tilt}>
          <torusGeometry args={[ring.radius, ring.tube, 8, 96]} />
          <meshBasicMaterial color={ring.color} transparent opacity={ring.opacity} toneMapped={false} />
        </mesh>
      ))}
    </>
  );
}
