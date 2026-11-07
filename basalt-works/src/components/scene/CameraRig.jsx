import { useMemo } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { Vector3 } from 'three';
import { frame } from '../../lib/frameState';
import { clamp, smooth } from '../../lib/math';
import { pointer } from '../../lib/pointer';

/**
 * Moves the camera along the page's path as you scroll.
 *   path        from makeCameraPath()
 *   aspectBoost pulls the camera back on tall (phone) screens so the subject still fits
 *   heroEnd     the intro range where the pointer nudges the camera
 *   mobileLift  { from, span, amount }: on phones, lifts the subject above the text block
 */
export default function CameraRig({ path, aspectBoost, heroEnd, mobileLift }) {
  const camera = useThree((s) => s.camera);
  const size = useThree((s) => s.size);
  const tmp = useMemo(() => ({ pos: new Vector3(), tgt: new Vector3() }), []);

  useFrame(() => {
    const { p } = frame;
    const { width: w, height: h } = size;
    const aspect = w / h;
    const aspectK = aspect < 1 ? 1 + (1 - aspect) * aspectBoost : 1;

    path.sample(p, tmp.pos, tmp.tgt);
    tmp.pos.sub(tmp.tgt).multiplyScalar(aspectK).add(tmp.tgt);
    if (p < heroEnd) {
      tmp.pos.x += pointer.sx * 0.35 * (1 - p / heroEnd);
      tmp.pos.y -= pointer.sy * 0.2 * (1 - p / heroEnd);
    }
    camera.position.copy(tmp.pos);
    camera.lookAt(tmp.tgt);

    // desktop: slide the subject sideways, away from the text. phone: lift it up.
    if (w >= 760) camera.setViewOffset(w, h, -path.shiftAt(p) * w, 0, w, h);
    else camera.setViewOffset(w, h, 0, smooth(clamp((p - mobileLift.from) / mobileLift.span)) * mobileLift.amount * h, w, h);
  });

  return null;
}
