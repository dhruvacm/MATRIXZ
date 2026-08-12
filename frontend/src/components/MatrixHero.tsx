import { Suspense, useMemo, type CSSProperties } from "react";
import { Canvas } from "@react-three/fiber";
import { EffectComposer, Bloom } from "@react-three/postprocessing";
import * as THREE from "three";
import { MatrixScene } from "./MatrixScene";

function canUseWebGL() {
  if (typeof window === "undefined" || typeof document === "undefined") return false;
  try {
    const canvas = document.createElement("canvas");
    if (!window.WebGLRenderingContext) return false;
    const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: false });
    renderer.dispose();
    return true;
  } catch {
    return false;
  }
}

function MatrixFallback() {
  const blocks = Array.from({ length: 27 }, (_, index) => ({
    x: index % 3,
    y: Math.floor(index / 3) % 3,
    z: Math.floor(index / 9),
    accent: index === 13 || index === 4 || index === 22,
  }));

  return (
    <div className="matrix-fallback" role="img" aria-label="MATRIXZ voxel cube">
      <div className="matrix-fallback-orbit matrix-fallback-orbit-a" />
      <div className="matrix-fallback-orbit matrix-fallback-orbit-b" />
      <div className="matrix-fallback-cube">
        <div className="matrix-fallback-core" />
        {blocks.map((block) => (
          <span
            key={`${block.x}-${block.y}-${block.z}`}
            className={`matrix-fallback-block${block.accent ? " matrix-fallback-block-accent" : ""}`}
            style={
              {
                "--x": block.x,
                "--y": block.y,
                "--z": block.z,
              } as CSSProperties
            }
          />
        ))}
      </div>
      <div className="matrix-fallback-platform">
        <span />
      </div>
      <div className="matrix-fallback-float matrix-fallback-float-a" />
      <div className="matrix-fallback-float matrix-fallback-float-b" />
    </div>
  );
}

/**
 * The hero's 3D MATRIXZ structure — an r3f Canvas containing a procedural
 * cube cluster, energy core, orbit rings, floating cubes, particle field,
 * and platform. Drop-in replacement for the previous flat SVG cube; usage
 * is unchanged for the rest of the page (just render <MatrixHero /> inside
 * a sized container).
 */
export function MatrixHero({ className = "" }: { className?: string }) {
  const prefersReducedMotion = useMemo(
    () => typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches,
    []
  );
  const isCompact = useMemo(() => typeof window !== "undefined" && window.innerWidth < 768, []);
  const webglAvailable = useMemo(() => canUseWebGL(), []);

  return (
    <div className={className}>
      {webglAvailable ? (
        <Canvas
          dpr={[1, isCompact ? 1.25 : 1.75]}
          camera={{ position: [0, 0.4, 6.2], fov: 42 }}
          gl={{ antialias: true, alpha: true }}
          style={{ background: "transparent" }}
        >
          <Suspense fallback={null}>
            <MatrixScene reducedMotion={prefersReducedMotion} compact={isCompact} />
            <EffectComposer multisampling={0} enableNormalPass={false}>
              <Bloom intensity={0.42} luminanceThreshold={0.24} luminanceSmoothing={0.38} mipmapBlur radius={0.42} />
            </EffectComposer>
          </Suspense>
        </Canvas>
      ) : (
        <MatrixFallback />
      )}
    </div>
  );
}
