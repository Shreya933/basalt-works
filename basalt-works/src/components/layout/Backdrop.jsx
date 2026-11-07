import { useRef } from 'react';
import { useProgressSubscription } from '../../hooks/useProgressSubscription';
import { clamp, smooth } from '../../lib/math';
import './Backdrop.css';

/** Warm glow + the big outlined headline behind the 3D scene. `glow(p)` is supplied per page. */
export default function Backdrop({ headline, glow }) {
  const bg = useRef(null);
  const title = useRef(null);

  useProgressSubscription((p) => {
    bg.current.style.setProperty('--glow', glow(p).toFixed(3));
    const k = smooth(clamp(p / headline.travel));
    title.current.style.opacity = (1 - smooth(clamp((p - headline.fadeStart) / headline.fadeSpan))).toFixed(3);
    title.current.style.transform = `translateY(${(-k * 60).toFixed(1)}px) scale(${(1 + k * 0.06).toFixed(3)})`;
  });

  return (
    <>
      <div className="layer bg" ref={bg} />
      <div className="layer headline" ref={title} aria-hidden="true">
        <span className="o">{headline.lines[0]}</span>
        <span className="s">{headline.lines[1]}</span>
      </div>
    </>
  );
}

/** Vignette + film grain drawn over the 3D scene. */
export function Overlay() {
  return (
    <>
      <div className="layer vig" />
      <div className="layer grain" />
    </>
  );
}
