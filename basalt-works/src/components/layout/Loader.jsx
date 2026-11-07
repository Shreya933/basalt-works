import { useProgress } from '@react-three/drei';
import './Loader.css';

/** Full-screen loading counter. `ready` flips once the 3D scene has mounted. */
export default function Loader({ ready, label }) {
  const { progress } = useProgress();
  const pct = ready ? 100 : Math.round(progress);
  return (
    <div className={`loader${ready ? ' done' : ''}`} role="status" aria-live="polite">
      <div className="n"><span>{pct}</span><small>%</small></div>
      <div className="bar"><i style={{ width: `${pct}%` }} /></div>
      <span className="label">{label}</span>
    </div>
  );
}
