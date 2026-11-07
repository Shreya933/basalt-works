import { useLayoutEffect } from 'react';
import { clamp, lerp } from '../lib/math';
import { emit, goTo, maxScroll, prefersReducedMotion, progress } from '../lib/progress';

/**
 * Drives the scroll story for one page.
 *  - opens the page at the top, or at a #section deep link (e.g. /story#hall)
 *  - eases `progress.cur` towards the real scroll position every frame
 * `anchors` is the page's list of { hash, p } in-page links.
 */
export function useScrollProgress(anchors) {
  useLayoutEffect(() => {
    const reduce = prefersReducedMotion();
    const read = () => {
      const max = maxScroll();
      progress.target = max > 0 ? clamp(scrollY / max) : 0;
    };

    const hash = window.location.hash.slice(1);
    const start = anchors.find((a) => a.hash === hash);
    goTo(start ? start.p : 0);
    read();
    progress.cur = progress.target;
    emit();

    // editing only the #section in the address bar (same page) should scroll there too
    const onHash = () => {
      const a = anchors.find((x) => x.hash === window.location.hash.slice(1));
      if (a) goTo(a.p, true);
    };

    addEventListener('scroll', read, { passive: true });
    addEventListener('resize', read);
    addEventListener('hashchange', onHash);

    let last = performance.now();
    let raf = requestAnimationFrame(function tick(now) {
      const dt = Math.min((now - last) / 1000, 0.05);
      last = now;
      const next = reduce ? progress.target : lerp(progress.cur, progress.target, 1 - Math.pow(0.0015, dt));
      if (Math.abs(next - progress.cur) > 1e-6) {
        progress.cur = next;
        emit();
      }
      raf = requestAnimationFrame(tick);
    });

    // handy for screenshots/testing: open the site with ?debug and call window.__basalt.setP(0.5)
    if (window.location.search.includes('debug')) {
      window.__basalt = {
        setP(p) {
          goTo(p);
          progress.target = progress.cur = p;
          emit();
        },
      };
    }

    return () => {
      cancelAnimationFrame(raf);
      removeEventListener('scroll', read);
      removeEventListener('resize', read);
      removeEventListener('hashchange', onHash);
    };
  }, [anchors]);
}
