import { useLayoutEffect, useRef } from 'react';
import { progress, subscribe } from '../lib/progress';

/**
 * Run `cb(p)` on every progress change (and once on mount) without re-rendering React.
 * Uses a layout effect so a page's subscribers are removed in the same commit that unmounts it,
 * before the next page announces its first progress value.
 */
export function useProgressSubscription(cb) {
  const ref = useRef(cb);
  ref.current = cb;
  useLayoutEffect(() => {
    ref.current(progress.cur);
    return subscribe((p) => ref.current(p));
  }, []);
}
