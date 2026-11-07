import { Link } from 'react-router-dom';
import Navbar from '../components/layout/Navbar';
import { credits } from '../content/credits';
import { usePageMeta } from '../hooks/usePageMeta';
import './Credits.css';

export default function Credits() {
  usePageMeta('Credits — Basalt Works', 'Credits for the 3D models used on this site.');
  return (
    <>
      <Navbar anchors={[]} cta={{ label: 'Start a project' }} />
      <main className="credits">
        <h1>Credits</h1>
        <p>
          The 3D models on this site are licensed under{' '}
          <a href="https://creativecommons.org/licenses/by/4.0/">CC BY 4.0</a> and come from Sketchfab.
        </p>
        <ul>
          {credits.map((c) => (
            <li key={c.title}>
              <a href={c.url}>{c.title}</a>
              <span>by {c.author}</span>
            </li>
          ))}
        </ul>
        <Link to="/">← Back home</Link>
      </main>
    </>
  );
}
