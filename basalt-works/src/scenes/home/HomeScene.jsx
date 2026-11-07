import { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Vector3 } from 'three';
import CameraRig from '../../components/scene/CameraRig';
import Embers from '../../components/scene/Embers';
import LightRig from '../../components/scene/LightRig';
import RoomEnv from '../../components/scene/RoomEnv';
import StageRings from '../../components/scene/StageRings';
import { useReducedMotion } from '../../hooks/useReducedMotion';
import { makeCameraPath } from '../../lib/cameraPath';
import { frame } from '../../lib/frameState';
import { clamp, smooth } from '../../lib/math';
import { pointer } from '../../lib/pointer';
import { spinGears } from '../../lib/threeUtils';
import { preloadModels, useFittedModel, useGearSet } from '../useFittedModel';
import { cameraKeys, rig, shifts } from './config';

preloadModels('gears', 'machine');

const GEAR_STAGE = new Vector3(0, 0, 0);
const MACHINE_STAGE = new Vector3(0, -30, 0);
const MACHINE_SIZE = 5.4;

/** Hero gears: big in the intro, lift away on scroll, then return small beside the machine. */
function Gears() {
  const reduce = useReducedMotion();
  const group = useRef();
  const set = useGearSet(3.2);

  useFrame(() => {
    const { p, t } = frame;
    const g = group.current;
    const rise = smooth(clamp((p - 0.17) / 0.14));
    const back = smooth(clamp((p - 0.86) / 0.1));
    const late = p > 0.6;
    if (!late) {
      g.position.set(0, rise * 4.5, -rise * 2);
      g.scale.setScalar(Math.max(0.0001, 1 - rise));
      g.visible = rise < 0.995;
    } else {
      g.position.set(-3.6, -28.6 + (1 - back) * 3 + Math.sin(t * 0.9) * 0.12, 3.2);
      g.scale.setScalar(Math.max(0.0001, 0.62 * back));
      g.visible = back > 0.005;
    }
    // the model lies flat: tilt it toward the camera and spin each gear on its own axis
    spinGears(set.spinners, t, p, reduce);
    g.rotation.x = 1.12 + pointer.sy * 0.14 + (late ? 0 : rise * 0.3);
    g.rotation.y = pointer.sx * 0.3;
    g.rotation.z = late ? -0.15 : 0;
  });

  return <group ref={group}><primitive object={set.wrap} /></group>;
}

function Machine() {
  const reduce = useReducedMotion();
  const sway = useRef();
  const { wrap, height } = useFittedModel('machine', MACHINE_SIZE);

  useFrame(() => { sway.current.rotation.y = reduce ? 0 : Math.sin(frame.t * 0.15) * 0.05; });

  return (
    <group position={MACHINE_STAGE}>
      <group ref={sway}><primitive object={wrap} /></group>
      <StageRings position={[0, -height / 2 + 0.02, 0]} radii={[[4.4, 0.012, 0.9], [5.6, 0.008, 0.45], [7.2, 0.006, 0.25]]} />
    </group>
  );
}

export default function HomeScene() {
  const fog = useRef();
  const path = useMemo(() => makeCameraPath(cameraKeys, shifts), []);
  useFrame(() => { fog.current.density = frame.p < 0.3 ? 0.02 : 0.026; });

  return (
    <>
      <fogExp2 ref={fog} attach="fog" args={[0x0b0c0e, 0.02]} />
      <RoomEnv />
      <LightRig center={GEAR_STAGE} />
      <LightRig center={MACHINE_STAGE} />
      <Gears />
      <Machine />
      <Embers />
      <CameraRig path={path} {...rig} />
    </>
  );
}
