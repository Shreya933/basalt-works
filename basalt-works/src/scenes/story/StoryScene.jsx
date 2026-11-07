import { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { AnimationMixer, Vector3 } from 'three';
import CameraRig from '../../components/scene/CameraRig';
import Embers from '../../components/scene/Embers';
import LightRig from '../../components/scene/LightRig';
import RoomEnv from '../../components/scene/RoomEnv';
import Sparks from '../../components/scene/Sparks';
import StageRings from '../../components/scene/StageRings';
import { useReducedMotion } from '../../hooks/useReducedMotion';
import { makeCameraPath } from '../../lib/cameraPath';
import { frame } from '../../lib/frameState';
import { pointer } from '../../lib/pointer';
import { spinGears } from '../../lib/threeUtils';
import { preloadModels, useFittedModel, useGearSet } from '../useFittedModel';
import { cameraKeys, rig, shifts } from './config';

preloadModels('walker', 'welder', 'gears');

const GATE = new Vector3(0, 0, 0);     // the worker
const HALL = new Vector3(0, -28, 0);   // the welder
const YARD = new Vector3(0, -56, 0);   // the gears
const RINGS = [[2.3, 0.01, 0.9], [3.2, 0.007, 0.45], [4.4, 0.006, 0.25]];
const SPARK_OFFSET = new Vector3(0.5, 0.2, 1.0);

/** Walks in place while the gate chapter is on screen. */
function Walker() {
  const reduce = useReducedMotion();
  const { wrap, height, root, animations } = useFittedModel('walker', 3.5);

  const mixer = useMemo(() => {
    if (!animations[0]) return null;
    const clip = animations[0].clone();
    // pin the hips so the body walks on the spot instead of travelling off the stage
    for (const tr of clip.tracks) {
      if (/Hips.*\.position$/.test(tr.name)) {
        const v = tr.values, x0 = v[0], z0 = v[2];
        for (let i = 0; i < v.length; i += 3) { v[i] = x0; v[i + 2] = z0; }
      }
    }
    const m = new AnimationMixer(root);
    m.clipAction(clip).play();
    return m;
  }, [animations, root]);

  useFrame(() => { if (mixer && frame.p < 0.42) mixer.update(reduce ? 0 : frame.dt); });

  return (
    <group position={GATE}>
      <primitive object={wrap} />
      <StageRings position={[0, -height / 2 + 0.02, 0]} radii={RINGS} />
    </group>
  );
}

function Welder() {
  const reduce = useReducedMotion();
  const sway = useRef();
  const { wrap, height } = useFittedModel('welder', 3.5);
  const sparkBase = useMemo(() => HALL.clone().add(SPARK_OFFSET), []);

  useFrame(() => { sway.current.rotation.y = reduce ? 0 : Math.sin(frame.t * 0.4) * 0.08; });

  return (
    <>
      <group position={HALL}>
        <group ref={sway}><primitive object={wrap} /></group>
        <StageRings position={[0, -height / 2 + 0.02, 0]} radii={RINGS} />
      </group>
      <Sparks base={sparkBase} range={[0.36, 0.7]} />
    </>
  );
}

function Gears() {
  const reduce = useReducedMotion();
  const group = useRef();
  const set = useGearSet(4.6);

  useFrame(() => {
    const { p, t } = frame;
    group.current.rotation.x = 1.12 + pointer.sy * 0.12;
    group.current.rotation.y = pointer.sx * 0.25;
    spinGears(set.spinners, t, p, reduce);
  });

  return <group ref={group} position={YARD}><primitive object={set.wrap} /></group>;
}

export default function StoryScene() {
  const path = useMemo(() => makeCameraPath(cameraKeys, shifts), []);
  return (
    <>
      <fogExp2 attach="fog" args={[0x0b0c0e, 0.02]} />
      <RoomEnv />
      <LightRig center={GATE} />
      <LightRig center={HALL} />
      <LightRig center={YARD} />
      <Walker />
      <Welder />
      <Gears />
      <Embers />
      <CameraRig path={path} {...rig} />
    </>
  );
}
