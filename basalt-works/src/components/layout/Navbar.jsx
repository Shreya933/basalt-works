import { NavLink, useLocation } from 'react-router-dom';
import Action from '../ui/Action';
import { goTo } from '../../lib/progress';
import './Navbar.css';

const ROUTES = [
  { to: '/', label: 'Home' },
  { to: '/story', label: 'Our story' },
];

/** Site nav: the two pages, then this page's own section links, then the call to action. */
export default function Navbar({ anchors, cta }) {
  const { pathname } = useLocation();
  const toTop = (to) => (e) => { if (pathname === to) { e.preventDefault(); goTo(0, true); } };

  return (
    <nav className="nav" aria-label="Main">
      <NavLink to="/" className="logo" aria-label="Basalt Works, home" onClick={toTop('/')}>
        <i /> Basalt Works
      </NavLink>
      <div className="links">
        {ROUTES.map((r) => (
          <NavLink key={r.to} to={r.to} end className="route" onClick={toTop(r.to)}>{r.label}</NavLink>
        ))}
        <span className="sep" aria-hidden="true" />
        {anchors.map((a) => (
          <a
            key={a.hash}
            href={`${pathname}#${a.hash}`}
            onClick={(e) => {
              e.preventDefault();
              goTo(a.p, true);
              history.replaceState(null, '', `#${a.hash}`);
            }}
          >
            {a.label}
          </a>
        ))}
        <Action contact>{cta.label}</Action>
      </div>
    </nav>
  );
}
