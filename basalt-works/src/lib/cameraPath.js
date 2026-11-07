import { CatmullRomCurve3, Vector3 } from 'three';
import { clamp, lerp, smooth } from './math';

/**
 * Turns a list of keyframes into a camera path.
 *   keys:   [progress, [camera x,y,z], [look-at x,y,z]]
 *   shifts: [progress, sideways offset as a fraction of screen width]. This slides the 3D subject
 *           sideways so it never sits behind the text block of the current chapter.
 */
export function makeCameraPath(keys, shifts) {
  const pos = new CatmullRomCurve3(keys.map((k) => new Vector3(...k[1])), false, 'centripetal');
  const tgt = new CatmullRomCurve3(keys.map((k) => new Vector3(...k[2])), false, 'centripetal');

  const curveU = (p) => {
    let i = 0;
    while (i < keys.length - 2 && p > keys[i + 1][0]) i++;
    const f = clamp((p - keys[i][0]) / (keys[i + 1][0] - keys[i][0]));
    return (i + smooth(f)) / (keys.length - 1);
  };

  return {
    sample(p, outPos, outTgt) {
      const u = curveU(p);
      pos.getPoint(u, outPos);
      tgt.getPoint(u, outTgt);
    },
    shiftAt(p) {
      let i = 0;
      while (i < shifts.length - 2 && p > shifts[i + 1][0]) i++;
      const f = smooth(clamp((p - shifts[i][0]) / (shifts[i + 1][0] - shifts[i][0])));
      return lerp(shifts[i][1], shifts[i + 1][1], f);
    },
  };
}
