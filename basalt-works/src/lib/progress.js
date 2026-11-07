/**
 * Scroll progress store (0 → 1 down the page).
 *
 * `target` follows the real scroll position, `cur` is the eased value that the 3D scene and the
 * DOM overlays read. Components subscribe instead of using React state, so a scroll tick never
 * re-renders the tree.
 */
const listeners = new Set();

export const progress = { target: 0, cur: 0 };

export const subscribe = (fn) => {
  listeners.add(fn);
  return () => listeners.delete(fn);
};
export const emit = () => listeners.forEach((fn) => fn(progress.cur));

export const prefersReducedMotion = () => matchMedia('(prefers-reduced-motion: reduce)').matches;
export const maxScroll = () => document.documentElement.scrollHeight - innerHeight;

/** Scroll the page so the story sits at progress `p`. */
export const goTo = (p, smoothly = false) =>
  scrollTo({ top: maxScroll() * p, behavior: smoothly && !prefersReducedMotion() ? 'smooth' : 'auto' });
