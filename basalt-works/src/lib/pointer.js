import { lerp } from './math';

/** Normalised pointer position (-1…1) plus a smoothed copy for parallax. */
export const pointer = { x: 0, y: 0, sx: 0, sy: 0 };

export function trackPointer() {
  const move = (e) => {
    pointer.x = (e.clientX / innerWidth) * 2 - 1;
    pointer.y = (e.clientY / innerHeight) * 2 - 1;
  };
  addEventListener('pointermove', move, { passive: true });
  return () => removeEventListener('pointermove', move);
}

export function smoothPointer(dt) {
  pointer.sx = lerp(pointer.sx, pointer.x, 1 - Math.pow(0.02, dt));
  pointer.sy = lerp(pointer.sy, pointer.y, 1 - Math.pow(0.02, dt));
}
