import { Navigate, Route, Routes, useLocation } from 'react-router-dom';
import Credits from './pages/Credits';
import Home from './pages/Home';
import Story from './pages/Story';

export default function App() {
  const { pathname } = useLocation();
  // keying on the path gives each page a fresh scene and a clean scroll start
  return (
    <Routes key={pathname}>
      <Route path="/" element={<Home />} />
      <Route path="/story" element={<Story />} />
      <Route path="/credits" element={<Credits />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
