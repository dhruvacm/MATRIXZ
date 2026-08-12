import { useMemo } from "react";
import * as THREE from "three";

interface CubeInstance {
  position: [number, number, number];
  scale: number;
  rotation: [number, number, number];
}

function buildCluster(compact: boolean) {
  const base: CubeInstance[] = [];
  const emissive: CubeInstance[] = [];

  const size = compact ? 5 : 7;
  const offset = (size - 1) / 2;
  const step = compact ? 0.47 : 0.42;

  for (let x = 0; x < size; x++) {
    for (let y = 0; y < size; y++) {
      for (let z = 0; z < size; z++) {
        const edge =
          x === 0 ||
          y === 0 ||
          z === 0 ||
          x === size - 1 ||
          y === size - 1 ||
          z === size - 1;

        if (!edge) continue;

        const centralFrontCavity =
          z === size - 1 &&
          Math.abs(x - offset) <= 1 &&
          Math.abs(y - offset) <= 1;

        if (centralFrontCavity) continue;

        const sparse =
          (x * 7 + y * 11 + z * 13) % 5 === 0;

        if (
          sparse &&
          x !== 0 &&
          y !== 0 &&
          z !== 0 &&
          x !== size - 1 &&
          y !== size - 1 &&
          z !== size - 1
        ) {
          continue;
        }

        const position: [number, number, number] = [
          (x - offset) * step,
          (y - offset) * step,
          (z - offset) * step,
        ];

        /*
         * Only a small number of blocks glow.
         * This creates the same dark-cube/neon-accent
         * appearance as the reference design.
         */
        const isAccent =
          (x + y * 2 + z * 3) % 11 === 0;

        (isAccent ? emissive : base).push({
          position,
          scale: step * 0.88,
          rotation: [0, 0, 0],
        });
      }
    }
  }

  return { base, emissive };
}

function useInstancedRef(items: CubeInstance[]) {
  const dummy = useMemo(
    () => new THREE.Object3D(),
    []
  );

  return (mesh: THREE.InstancedMesh | null) => {
    if (!mesh) return;

    items.forEach((cube, index) => {
      dummy.position.set(...cube.position);
      dummy.rotation.set(...cube.rotation);
      dummy.scale.setScalar(cube.scale);

      dummy.updateMatrix();

      mesh.setMatrixAt(index, dummy.matrix);
    });

    mesh.instanceMatrix.needsUpdate = true;
  };
}

export function MatrixStructure({
  compact = false,
}: {
  compact?: boolean;
}) {
  const { base, emissive } = useMemo(
    () => buildCluster(compact),
    [compact]
  );

  const setBaseInstances =
    useInstancedRef(base);

  const setEmissiveInstances =
    useInstancedRef(emissive);

  return (
    <group>

      {/* =========================================
          DARK METALLIC CUBES
          ========================================= */}

      <instancedMesh
        ref={setBaseInstances}
        args={[
          undefined,
          undefined,
          base.length,
        ]}
      >
        <boxGeometry args={[1, 1, 1]} />

        <meshStandardMaterial
  color="#1b2142"
  roughness={0.31}
  metalness={0.78}
  emissive="#252b5a"
  emissiveIntensity={0.24}
/>
      </instancedMesh>


      {/* =========================================
          PURPLE NEON ACCENT CUBES
          ========================================= */}

      <instancedMesh
        ref={setEmissiveInstances}
        args={[
          undefined,
          undefined,
          emissive.length,
        ]}
      >
        <boxGeometry args={[1, 1, 1]} />

        <meshStandardMaterial
          color="#38245f"
          roughness={0.18}
          metalness={0.72}

          emissive="#9b5cff"
          emissiveIntensity={2.4}
        />
      </instancedMesh>

    </group>
  );
}