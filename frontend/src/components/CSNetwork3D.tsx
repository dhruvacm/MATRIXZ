import { Canvas, useFrame } from '@react-three/fiber';
import { Line, MeshDistortMaterial } from '@react-three/drei';
import { Component, type ReactNode, useEffect, useMemo, useRef, useState } from 'react';
import * as THREE from 'three';
import type { Group } from 'three';
import './CSNetwork3D.css';

export interface CSNetwork3DProps {
  /** Optional class applied to the responsive canvas wrapper. */
  className?: string;
  /** Reduce geometry and pixel ratio for especially constrained devices. */
  quality?: 'low' | 'high';
}

type OrbitalNode = { position: [number, number, number]; radius: number; tone: string };

function supportsWebGL2() {
  if (typeof document === 'undefined') return false;
  try {
    return Boolean(document.createElement('canvas').getContext('webgl2'));
  } catch {
    return false;
  }
}

class CanvasErrorBoundary extends Component<
  { children: ReactNode; fallback: ReactNode },
  { hasError: boolean }
> {
  state = { hasError: false };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  render() {
    return this.state.hasError ? this.props.fallback : this.props.children;
  }
}

const orbitalNodes: OrbitalNode[] = [
  { position: [-2.04, 1.16, 0.08], radius: 0.105, tone: '#3b8058' },
  { position: [-1.36, 1.87, -0.22], radius: 0.074, tone: '#789b77' },
  { position: [-0.02, 2.13, 0.18], radius: 0.095, tone: '#4b825c' },
  { position: [1.39, 1.78, 0.28], radius: 0.11, tone: '#36764f' },
  { position: [2.05, 0.52, -0.12], radius: 0.07, tone: '#789b77' },
  { position: [1.46, -1.60, 0.25], radius: 0.11, tone: '#36764f' },
  { position: [0.03, -2.04, -0.2], radius: 0.09, tone: '#4b825c' },
  { position: [-1.38, -1.66, 0.18], radius: 0.105, tone: '#36764f' },
  { position: [-2.10, -0.35, -0.2], radius: 0.08, tone: '#789b77' },
  { position: [-2.8, 0.12, 0.04], radius: 0.19, tone: '#285b3e' },
  { position: [2.82, -0.06, 0.22], radius: 0.17, tone: '#285b3e' },
  { position: [-0.05, 2.75, -0.16], radius: 0.15, tone: '#285b3e' },
  { position: [0.08, -2.72, 0.1], radius: 0.17, tone: '#285b3e' },
  { position: [-1.30, 0.02, 0.85], radius: 0.13, tone: '#397a50' },
  { position: [1.26, 0.04, -0.80], radius: 0.13, tone: '#397a50' },
  { position: [-0.68, 0.88, 0.7], radius: 0.055, tone: '#8ca68a' },
  { position: [0.76, -0.91, -0.55], radius: 0.06, tone: '#8ca68a' },
  { position: [0.28, 1.12, -0.7], radius: 0.05, tone: '#8ca68a' },
  { position: [-0.45, -1.08, 0.56], radius: 0.055, tone: '#8ca68a' },
];

function OrbitingNodes({ reducedMotion }: { reducedMotion: boolean }) {
  const group = useRef<Group>(null);
  const nodes = useMemo(() => orbitalNodes, []);
  useFrame(({ clock, pointer }) => {
    if (!group.current) return;
    const t = clock.getElapsedTime();
    group.current.rotation.y = reducedMotion ? 0 : t * 0.045 + pointer.x * 0.09;
    group.current.rotation.x = reducedMotion ? 0 : pointer.y * 0.055 + Math.sin(t * 0.22) * 0.018;
    group.current.position.y = reducedMotion ? 0 : Math.sin(t * 0.48) * 0.035;
  });
  return (
    <group ref={group}>
      <mesh>
        <sphereGeometry args={[0.73, 48, 48]} />
        <MeshDistortMaterial color="#123e2e" roughness={0.31} metalness={0.2} distort={0.045} speed={0.35} />
      </mesh>
      <mesh scale={0.76}>
        <sphereGeometry args={[0.73, 32, 32]} />
        <meshBasicMaterial color="#9bb29a" wireframe transparent opacity={0.11} />
      </mesh>
      <mesh scale={0.79}>
        <sphereGeometry args={[0.73, 8, 8]} />
        <meshBasicMaterial color="#c1d0bc" wireframe transparent opacity={0.13} />
      </mesh>
      {nodes.map((node, index) => (
        <mesh key={`node-${index}`} position={node.position} castShadow>
          <sphereGeometry args={[node.radius, 24, 24]} />
          <meshPhysicalMaterial color={node.tone} roughness={0.2} metalness={0.18} clearcoat={0.8} clearcoatRoughness={0.14} />
        </mesh>
      ))}
      <NetworkConnections />
    </group>
  );
}

function NetworkConnections() {
  const paths = useMemo(() => [
    [[-2.8, 0.12, 0.04], [-1.3, 0.02, 0.85], [0, 0, 0], [1.26, 0.04, -0.8], [2.82, -0.06, 0.22]],
    [[-1.36, 1.87, -0.22], [-0.68, 0.88, 0.7], [0, 0, 0], [0.76, -0.91, -0.55], [1.46, -1.60, 0.25]],
    [[-1.38, -1.66, 0.18], [-0.45, -1.08, 0.56], [0, 0, 0], [0.28, 1.12, -0.7], [1.39, 1.78, 0.28]],
    [[-2.04, 1.16, 0.08], [-1.3, 0.02, 0.85], [-0.02, 2.13, 0.18]],
    [[2.05, 0.52, -0.12], [1.26, 0.04, -0.8], [0.03, -2.04, -0.2]],
  ], []);
  return (
    <>
      {paths.map((points, index) => (
        <Line key={`link-${index}`} points={points as [number, number, number][]} color="#78927c" transparent opacity={0.48} lineWidth={0.7} />
      ))}
      {orbitalNodes.slice(0, 14).map((node, index) => (
        <Line
          key={`spoke-${index}`}
          points={[[0, 0, 0], node.position]}
          color="#8fa391"
          transparent
          opacity={index % 2 ? 0.17 : 0.29}
          lineWidth={0.6}
        />
      ))}
    </>
  );
}

function OrbitalRings() {
  return (
    <group>
      <mesh rotation={[Math.PI / 2.12, 0.12, 0]}>
        <torusGeometry args={[2.12, 0.007, 8, 180]} />
        <meshBasicMaterial color="#6f8d73" transparent opacity={0.68} />
      </mesh>
      <mesh rotation={[0.18, 0.15, Math.PI / 2.55]}>
        <torusGeometry args={[2.06, 0.006, 8, 180]} />
        <meshBasicMaterial color="#819781" transparent opacity={0.56} />
      </mesh>
      <mesh rotation={[Math.PI / 2.25, 0.1, Math.PI / 2.15]}>
        <torusGeometry args={[2.34, 0.004, 6, 180]} />
        <meshBasicMaterial color="#a4b19f" transparent opacity={0.56} />
      </mesh>
      <mesh rotation={[0.22, 0.1, 0.3]}>
        <torusGeometry args={[1.03, 0.004, 6, 160]} />
        <meshBasicMaterial color="#718a73" transparent opacity={0.5} />
      </mesh>
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.9, 0.003, 6, 144]} />
        <meshBasicMaterial color="#9cad98" transparent opacity={0.42} />
      </mesh>
    </group>
  );
}

function TechnicalDots({ count }: { count: number }) {
  const positions = useMemo(() => {
    const values = new Float32Array(count * 3);
    for (let i = 0; i < count; i += 1) {
      const angle = i * 2.39996;
      const radius = 2.48 + (i % 7) * 0.13;
      values[i * 3] = Math.cos(angle) * radius;
      values[i * 3 + 1] = Math.sin(angle) * radius;
      values[i * 3 + 2] = ((i % 9) - 4) * 0.055;
    }
    return values;
  }, [count]);
  return (
    <points>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial color="#66816c" size={0.022} sizeAttenuation transparent opacity={0.72} />
    </points>
  );
}

function Scene({ reducedMotion, quality }: { reducedMotion: boolean; quality: 'low' | 'high' }) {
  return (
    <>
      <ambientLight intensity={1.25} />
      <directionalLight position={[4, 5, 5]} intensity={2.2} castShadow />
      <pointLight position={[-4, -2, 3]} color="#c4d4b6" intensity={38} distance={11} />
      <pointLight position={[2, 3, -4]} color="#85a68a" intensity={19} distance={10} />
      <group rotation={[0.08, 0.08, -0.08]}>
        <OrbitalRings />
        <OrbitingNodes reducedMotion={reducedMotion} />
        <TechnicalDots count={quality === 'low' ? 72 : 144} />
      </group>
    </>
  );
}

export default function CSNetwork3D({ className = '', quality = 'high' }: CSNetwork3DProps) {
  const [reducedMotion, setReducedMotion] = useState(false);
  const [canvasUnavailable, setCanvasUnavailable] = useState(() => !supportsWebGL2());
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const media = window.matchMedia('(prefers-reduced-motion: reduce)');
    const update = () => setReducedMotion(media.matches);
    update();
    media.addEventListener('change', update);
    return () => media.removeEventListener('change', update);
  }, []);

  useEffect(() => {
    const wrapper = wrapperRef.current;
    if (!wrapper) return;
    const onContextLost = () => setCanvasUnavailable(true);
    const onContextRestored = () => setCanvasUnavailable(false);
    wrapper.addEventListener('webglcontextlost', onContextLost);
    wrapper.addEventListener('webglcontextrestored', onContextRestored);
    return () => {
      wrapper.removeEventListener('webglcontextlost', onContextLost);
      wrapper.removeEventListener('webglcontextrestored', onContextRestored);
    };
  }, []);

  return (
    <div
      ref={wrapperRef}
      className={`cs-network3d ${className}`.trim()}
      role="img"
      aria-label="Interactive three-dimensional orbital computer science network, with a forest-green central sphere, satellite nodes, and intersecting orbital rings."
      data-testid="visual-orbital-network"
    >
      {canvasUnavailable ? (
        <div className="cs-network3d-fallback" role="status">
          <span className="fallback-orbit" aria-hidden="true" />
          <span className="fallback-label">3D orbital network</span>
          <span className="fallback-note">WebGL is unavailable in this browser.</span>
        </div>
      ) : (
        <CanvasErrorBoundary
          fallback={
            <div className="cs-network3d-fallback" role="status">
              <span className="fallback-orbit" aria-hidden="true" />
              <span className="fallback-label">3D orbital network</span>
              <span className="fallback-note">WebGL is unavailable in this browser.</span>
            </div>
          }
        >
          <Canvas
            camera={{ position: [0, 0, 7.7], fov: 37, near: 0.1, far: 40 }}
            dpr={quality === 'low' ? [1, 1.35] : [1, 1.75]}
            shadows={quality === 'high'}
            gl={{ antialias: quality === 'high', alpha: true, powerPreference: 'high-performance' }}
            onCreated={({ gl }) => {
              gl.setClearColor('#e9eade', 0);
              gl.toneMapping = THREE.ACESFilmicToneMapping;
              gl.toneMappingExposure = 1.12;
            }}
            fallback={<div className="cs-network3d-fallback" role="status">WebGL is not supported by this browser.</div>}
          >
            <Scene reducedMotion={reducedMotion} quality={quality} />
          </Canvas>
        </CanvasErrorBoundary>
      )}
      <span className="cs-network3d-screen-reader">Pointer movement subtly shifts the viewing angle. Motion is reduced when your system preference requests it.</span>
    </div>
  );
}
