import { DoubleSide } from 'three';

/** Thin ember rings on the floor under a subject. `radii` is [[radius, width, opacity], …]. */
export default function StageRings({ position, radii }) {
  return (
    <group position={position}>
      {radii.map(([r, w, o]) => (
        <mesh key={r} rotation-x={-Math.PI / 2}>
          <ringGeometry args={[r, r + w, 160]} />
          <meshBasicMaterial color={0xff7a1a} transparent opacity={o} side={DoubleSide} fog={false} />
        </mesh>
      ))}
    </group>
  );
}
