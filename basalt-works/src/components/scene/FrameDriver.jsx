import { useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import { frame } from '../../lib/frameState';
import { progress } from '../../lib/progress';
import { smoothPointer, trackPointer } from '../../lib/pointer';

/** Runs first every frame: publishes time, eased scroll progress and the smoothed pointer. */
export default function FrameDriver() {
  useEffect(trackPointer, []);
  useFrame((state, delta) => {
    frame.dt = Math.min(delta, 0.05);
    frame.t = state.clock.elapsedTime;
    frame.p = progress.cur;
    smoothPointer(frame.dt);
  }, -2);
  return null;
}
