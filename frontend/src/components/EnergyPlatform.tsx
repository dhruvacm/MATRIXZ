/**
 * Dark circular platform beneath the MATRIXZ structure, with a bright
 * violet outer ring, a softer blue inner ring, and a broad soft glow disc
 * so the structure reads as floating just above it.
 */
export function EnergyPlatform() {
  return (
    <group position={[0, -1.65, 0]} rotation={[-Math.PI / 2, 0, 0]}>
      <mesh position={[0, 0, -0.02]}>
        <circleGeometry args={[1.9, 64]} />
        <meshBasicMaterial color="#8b5cf6" transparent opacity={0.12} toneMapped={false} depthWrite={false} />
      </mesh>
      <mesh>
        <circleGeometry args={[1.55, 64]} />
        <meshBasicMaterial color="#0a0a14" transparent opacity={0.65} />
      </mesh>
      <mesh>
        <ringGeometry args={[1.5, 1.58, 64]} />
        <meshBasicMaterial color="#8b5cf6" transparent opacity={0.7} toneMapped={false} />
      </mesh>
      <mesh>
        <ringGeometry args={[1.15, 1.19, 64]} />
        <meshBasicMaterial color="#3b82f6" transparent opacity={0.5} toneMapped={false} />
      </mesh>
    </group>
  );
}
