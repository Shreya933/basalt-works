import { lerp, smooth } from '../../lib/math';

/** [progress, camera position, look-at]. Camera flies from the gears, down through haze, to an orbit of the machine. */
export const cameraKeys = [
  [0.00, [0.0, 0.15, 5.6],     [0.0, 0.0, 0.0]],
  [0.12, [2.2, 0.55, 4.6],     [0.0, 0.0, 0.0]],
  [0.22, [1.2, 2.0, 5.0],      [0.0, 1.2, 0.0]],
  [0.30, [0.0, -9.0, 9.0],     [0.0, -14.0, 0.0]],
  [0.38, [7.5, -26.0, 15.0],   [0.0, -30.0, 0.0]],
  [0.46, [11.5, -27.8, 6.5],   [0.0, -30.3, 0.0]],
  [0.56, [-1.0, -29.2, 11.5],  [0.0, -30.4, 0.0]],
  [0.64, [-11.0, -28.0, 6.0],  [0.0, -30.3, 0.0]],
  [0.74, [-5.0, -29.8, -9.5],  [0.0, -30.5, 0.0]],
  [0.84, [9.0, -27.6, -4.0],   [0.0, -30.4, 0.0]],
  [0.92, [3.5, -27.4, 12.0],   [-0.5, -30.2, 0.0]],
  [1.00, [0.0, -27.8, 14.5],   [-0.3, -30.2, 0.0]],
];

/** Sideways shift of the subject as a fraction of screen width, so it stays clear of each text block. */
export const shifts = [
  [0, 0], [0.2, 0], [0.3, 0.12], [0.4, 0.2], [0.52, 0.2], [0.545, -0.2],
  [0.66, -0.2], [0.685, 0.2], [0.8, 0.2], [0.86, 0.2], [1, 0.2],
];

export const rig = { aspectBoost: 1.6, heroEnd: 0.2, mobileLift: { from: 0.3, span: 0.1, amount: 0.2 } };

/** Strength of the warm backdrop glow at progress p. */
export const glow = (p) => (p < 0.2 ? 0.34 : p < 0.38 ? lerp(0.34, 0.12, smooth((p - 0.2) / 0.18)) : 0.12 + 0.05 * Math.sin(p * 20));
