export const clamp = (x, a = 0, b = 1) => Math.min(b, Math.max(a, x));
export const smooth = (x) => x * x * (3 - 2 * x);
export const lerp = (a, b, t) => a + (b - a) * t;
