import { Fragment, useRef } from 'react';
import Action from '../ui/Action';
import { useProgressSubscription } from '../../hooks/useProgressSubscription';
import { clamp, smooth } from '../../lib/math';
import './Chapters.css';

const Lines = ({ lines }) =>
  lines.map((l, i) => <Fragment key={l}>{l}{i < lines.length - 1 && <br />}</Fragment>);

function ChapterBody({ c }) {
  if (c.variant === 'hero') {
    return (
      <>
        <div><p>{c.body}</p></div>
        <div className="cue"><i />{c.cue}</div>
      </>
    );
  }
  return (
    <>
      <div>
        <div className="kick">{c.kicker}</div>
        <h2><Lines lines={c.title} /></h2>
        {c.body && <p>{c.body}</p>}
        {c.specs && (
          <div className="spec">
            {c.specs.map((s) => <div key={s.label}><b>{s.value}</b>{s.label}</div>)}
          </div>
        )}
      </div>
      {c.actions && (
        <div className="acts">
          {c.actions.map((a) => <Action key={a.label} to={a.to} contact={a.contact} ghost={a.ghost}>{a.label}</Action>)}
        </div>
      )}
    </>
  );
}

/**
 * The text chapters. Each one is visible between progress `a` and `b`, fading in and out over
 * `fade`. Opacity is written straight to the DOM on every scroll tick.
 */
export default function Chapters({ chapters, fade }) {
  const els = useRef([]);

  useProgressSubscription((p) => {
    chapters.forEach((c, i) => {
      const el = els.current[i];
      if (!el) return;
      const fin = c.a < 0 ? 1 : smooth(clamp((p - c.a) / fade));
      const fout = c.b > 1 ? 1 : 1 - smooth(clamp((p - (c.b - fade)) / fade));
      const o = Math.min(fin, fout);
      el.style.opacity = o.toFixed(3);
      el.style.transform = `translateY(${((1 - o) * 26 * (fin < fout ? 1 : -1)).toFixed(1)}px)`;
      el.classList.toggle('on', o > 0.6);
    });
  });

  return chapters.map((c, i) => (
    <section key={c.id} id={`chapter-${c.id}`} className={`chap chap--${c.variant}`} ref={(el) => (els.current[i] = el)}>
      <ChapterBody c={c} />
    </section>
  ));
}
