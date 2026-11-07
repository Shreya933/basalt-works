import { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { AdditiveBlending, BufferAttribute, BufferGeometry } from 'three';
import { frame } from '../../lib/frameState';
import { useReducedMotion } from '../../hooks/useReducedMotion';
import { makeDotTexture } from '../../lib/threeUtils';

const N = 90;

/** Welding sparks thrown from `base` while progress is inside `range`, plus a flickering light. */
export default function Sparks({ base, range }) {
  const reduce = useReducedMotion();
  const points = useRef();
  const light = useRef();
  const map = useMemo(makeDotTexture, []);

  const sim = useMemo(() => {
    const pos = new Float32Array(N * 3);
    const vel = new Float32Array(N * 3);
    const life = new Float32Array(N);
    for (let i = 0; i < N; i++) life[i] = Math.random() * 1.2;
    const geometry = new BufferGeometry();
    geometry.setAttribute('position', new BufferAttribute(pos, 3));
    return { pos, vel, life, geometry };
  }, []);

  useFrame(() => {
    const { dt, p } = frame;
    const on = !reduce && p > range[0] && p < range[1];
    const { pos, vel, life, geometry } = sim;
    if (!reduce) {
      for (let i = 0; i < N; i++) {
        life[i] -= dt;
        if (life[i] <= 0) {
          life[i] = 0.5 + Math.random() * 0.8;
          pos[i * 3] = base.x; pos[i * 3 + 1] = base.y; pos[i * 3 + 2] = base.z;
          const a = Math.random() * 6.28, s = 0.8 + Math.random() * 2.2;
          vel[i * 3] = Math.cos(a) * s; vel[i * 3 + 1] = 0.6 + Math.random() * 2.4; vel[i * 3 + 2] = Math.sin(a) * s;
        }
        vel[i * 3 + 1] -= 6 * dt;
        pos[i * 3] += vel[i * 3] * dt; pos[i * 3 + 1] += vel[i * 3 + 1] * dt; pos[i * 3 + 2] += vel[i * 3 + 2] * dt;
      }
      geometry.attributes.position.needsUpdate = true;
    }
    points.current.visible = on;
    light.current.position.copy(base);
    light.current.intensity = on ? 6 + Math.random() * 10 : 0;
  });

  return (
    <>
      <points ref={points} geometry={sim.geometry} frustumCulled={false}>
        <pointsMaterial
          size={0.07} map={map} transparent depthWrite={false} blending={AdditiveBlending}
          color={0xffd9a0} sizeAttenuation fog={false}
        />
      </points>
      <pointLight ref={light} color={0xffa040} intensity={0} distance={9} decay={1.6} />
    </>
  );
}
