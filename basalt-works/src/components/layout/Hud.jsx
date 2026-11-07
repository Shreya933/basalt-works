import { useRef } from 'react';
import { useProgressSubscription } from '../../hooks/useProgressSubscription';
import './Hud.css';

/** Vertical progress rail on the right: percentage, fill line and current chapter name. */
export function Rail({ names }) {
  const pct = useRef(null);
  const fill = useRef(null);
  const label = useRef(null);

  useProgressSubscription((p) => {
    fill.current.style.transform = `scaleY(${p.toFixed(4)})`;
    pct.current.textContent = String(Math.round(p * 100)).padStart(2, '0');
    let n = names[0][1];
    for (const [t, text] of names) if (p >= t) n = text;
    label.current.textContent = n;
  });

  return (
    <div className="rail" aria-hidden="true">
      <span ref={pct}>00</span>
      <div className="track"><div className="fill" ref={fill} /></div>
      <b ref={label}>Intro</b>
    </div>
  );
}

export function Readout() {
  return <div className="readout" aria-hidden="true">Heavy civil &amp; industrial <em>/ since 1994</em></div>;
}
