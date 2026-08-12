import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

/**
 * Bright pulsing energy core at the center of the MATRIXZ structure.
 * A small opaque white-violet sphere plus a larger translucent glow shell,
 * both gently pulsing in sync, with a short-range point light to illuminate
 * nearby cubes from the inside.
 */
export function EnergyCore({ reducedMotion = false }: { reducedMotion?: boolean }) {
  const coreRef = useRef<THREE.Mesh>(null);
  const glowRef = useRef<THREE.Mesh>(null);
  const clock = useRef(0);

  useFrame((_, delta) => {
    clock.current += delta;
    const pulse = reducedMotion ? 1 : 1 + Math.sin(clock.current * 2.2) * 0.12;
    coreRef.current?.scale.setScalar(pulse);
    glowRef.current?.scale.setScalar(pulse * 1.4);
  });

  return (
    <group>
      <mesh ref={coreRef}>
        <sphereGeometry args={[0.2, 24, 24]} />
        <meshBasicMaterial color="#f5f3ff" toneMapped={false} />
      </mesh>
      <mesh ref={glowRef}>
        <sphereGeometry args={[0.4, 24, 24]} />
        <meshBasicMaterial color="#a78bfa" transparent opacity={0.32} toneMapped={false} depthWrite={false} />
      </mesh>
      <pointLight color="#c4b5fd" intensity={9} distance={4.5} decay={2} />
    </group>
  );
}
