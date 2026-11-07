import { useMemo } from 'react';
import { DirectionalLight, Group, PointLight, SpotLight } from 'three';

/** The warm key / cool fill / ember bounce / white top light set, centred on a stage position. */
export default function LightRig({ center }) {
  const rig = useMemo(() => {
    const g = new Group();
    const key = new SpotLight(0xff8a2a, 90, 40, 0.7, 0.8, 1.6);
    key.position.set(4, 3.5, -3.5);
    key.target.position.copy(center);
    const cool = new DirectionalLight(0x9db8ff, 1.1);
    cool.position.set(-5, 3, 4);
    const warm = new PointLight(0xff6a10, 18, 14, 1.8);
    warm.position.set(1.5, -1.8, 2.5);
    const top = new SpotLight(0xffffff, 55, 40, 0.55, 0.9, 1.6);
    top.position.set(0, 8, 2.5);
    top.target.position.copy(center);
    for (const l of [key, cool, warm, top]) l.position.add(center);
    g.add(key, key.target, cool, warm, top, top.target);
    return g;
  }, [center]);
  return <primitive object={rig} />;
}
