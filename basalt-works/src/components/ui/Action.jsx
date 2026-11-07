import { Link, useLocation } from 'react-router-dom';
import { site } from '../../config/site';
import { goTo } from '../../lib/progress';
import './Button.css';

/**
 * One button/link component for every call to action.
 *   to       → another route (scrolls to the top if you are already there)
 *   contact  → mailto: if site.contactEmail is set, otherwise scrolls to the end of the story
 *   ghost    → outlined style
 */
export default function Action({ to, contact, ghost, className = '', children }) {
  const { pathname } = useLocation();
  const cls = `btn${ghost ? ' ghost' : ''} ${className}`.trim();

  if (contact && site.contactEmail) {
    return <a className={cls} href={`mailto:${site.contactEmail}`}>{children}</a>;
  }
  if (contact) {
    return (
      <a className={cls} href={`${pathname}#start`} onClick={(e) => { e.preventDefault(); goTo(1, true); }}>
        {children}
      </a>
    );
  }
  return (
    <Link
      className={cls}
      to={to}
      onClick={(e) => { if (pathname === to) { e.preventDefault(); goTo(0, true); } }}
    >
      {children}
    </Link>
  );
}
