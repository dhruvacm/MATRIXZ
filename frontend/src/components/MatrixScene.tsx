import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { MatrixStructure } from "./MatrixStructure";
import { EnergyCore } from "./EnergyCore";
import { OrbitRings } from "./OrbitRings";
import { FloatingCubes } from "./FloatingCubes";
import { ParticleField } from "./ParticleField";
import { EnergyPlatform } from "./EnergyPlatform";

interface MatrixSceneProps {
  reducedMotion: boolean;
  compact: boolean;
}

/**
 * MATRIXZ hero scene.
 *
 * Keeps the original geometry and animation but uses
 * brighter cinematic lighting so the voxel structure
 * remains visible against the dark background.
 */
export function MatrixScene({
  reducedMotion,
  compact,
}: MatrixSceneProps) {
  const rig = useRef<THREE.Group>(null);
  const clock = useRef(0);

  useFrame((state, delta) => {
    if (!rig.current) return;

    clock.current += delta;

    const spin = reducedMotion ? 0.025 : 0.09;

    rig.current.rotation.y += delta * spin;

    rig.current.position.y =
      Math.sin(clock.current * 0.6) * 0.18;

    const targetX = state.pointer.y * 0.12;
    const targetZ = -state.pointer.x * 0.12;

    rig.current.rotation.x +=
      (targetX - rig.current.rotation.x) * 0.04;

    rig.current.rotation.z +=
      (targetZ - rig.current.rotation.z) * 0.04;
  });

  return (
    <>
      {/* Ambient fill */}
      {/* Very subtle ambient fill.
    Keeps the cube dark. */}
<ambientLight intensity={0.18} />

{/* Purple key light.
    Creates the neon highlights on selected faces. */}
<pointLight
  position={[2.8, 2.8, 3.5]}
  color="#8b5cf6"
  intensity={18}
  distance={9}
  decay={2}
/>

{/* Bright central purple light */}
<pointLight
  position={[0, 0.2, 2.8]}
  color="#c084fc"
  intensity={28}
  distance={6}
  decay={2}
/>

{/* Blue rim light */}
<pointLight
  position={[-4, 0, 2]}
  color="#297cf4"
  intensity={16}
  distance={10}
  decay={2}
/>

{/* Purple back rim */}
<pointLight
  position={[3, -2, -3]}
  color="#7c3aed"
  intensity={12}
  distance={9}
  decay={2}
/>

{/* Soft top highlight */}
<directionalLight
  position={[-4, 5, 4]}
  intensity={0.55}
  color="#8b7cff"
/>

      {/* Blue back rim */}
      <directionalLight
        position={[-5, 2, -4]}
        intensity={0.75}
        color="#60a5fa"
      />

      <group ref={rig}>
  {/* Main MATRIX cube
      Slightly smaller and lifted above the platform */}
  <group
    scale={0.78}
    position={[0, 0.38, 0]}
  >
    <MatrixStructure compact={compact} />
    <EnergyCore reducedMotion={reducedMotion} />
    <OrbitRings reducedMotion={reducedMotion} />
  </group>

  {/* Floating decorative cubes stay independent */}
  <FloatingCubes
    compact={compact}
    reducedMotion={reducedMotion}
  />
</group>

      <ParticleField
        compact={compact}
        reducedMotion={reducedMotion}
      />

      <EnergyPlatform />
    </>
  );
}