import { useMemo } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { AdditiveBlending, BufferAttribute, BufferGeometry } from 'three';
import { frame } from '../../lib/frameState';
import { useReducedMotion } from '../../hooks/useReducedMotion';
import { makeDotTexture } from '../../lib/threeUtils';

const SPAN = 24;

/** Rising ember dust that follows the camera, so every stage of the scroll is dusty. */
export default function Embers() {
  const reduce = useReducedMotion();
  const camera = useThree((s) => s.camera);
  const count = useMemo(() => (window.innerWidth < 760 ? 260 : 620), []);
  const map = useMemo(makeDotTexture, []);

  const { geometry, speed, phase } = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const speed = new Float32Array(count);
    const phase = new Float32Array(count);
    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 22;
      pos[i * 3 + 1] = (Math.random() - 0.5) * SPAN * 2;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 14 - 1;
      speed[i] = 0.25 + Math.random() * 0.7;
      phase[i] = Math.random() * 6.28;
    }
    const geometry = new BufferGeometry();
    geometry.setAttribute('position', new BufferAttribute(pos, 3));
    return { geometry, speed, phase };
  }, [count]);

  useFrame(() => {
    const { dt, t } = frame;
    const attr = geometry.attributes.position;
    const arr = attr.array;
    for (let i = 0; i < count; i++) {
      let y = arr[i * 3 + 1] + speed[i] * dt * (reduce ? 0.2 : 1);
      if (y > camera.position.y + SPAN) y -= SPAN * 2;
      else if (y < camera.position.y - SPAN) y += SPAN * 2;
      arr[i * 3 + 1] = y;
      arr[i * 3] += Math.sin(t * 0.6 + phase[i]) * 0.003;
    }
    attr.needsUpdate = true;
  });

  return (
    <points geometry={geometry} frustumCulled={false}>
      <pointsMaterial
        size={0.09} map={map} transparent depthWrite={false} blending={AdditiveBlending}
        color={0xffa050} opacity={0.9} sizeAttenuation fog={false}
      />
    </points>
  );
}
