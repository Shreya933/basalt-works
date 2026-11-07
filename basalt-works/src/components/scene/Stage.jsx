import { Suspense, useEffect, useMemo } from 'react';
import { Canvas } from '@react-three/fiber';
import { ACESFilmicToneMapping } from 'three';
import FrameDriver from './FrameDriver';
import SceneBoundary from './SceneBoundary';

/** Calls `onReady` once everything inside the Suspense boundary (the models) has loaded. */
function Ready({ onReady }) {
  useEffect(() => {
    const id = setTimeout(onReady, 350);
    return () => clearTimeout(id);
  }, [onReady]);
  return null;
}

/** The fixed full-screen WebGL canvas. Each page passes its own <Scene /> as children. */
export default function Stage({ label, onReady, children }) {
  const dpr = useMemo(() => [1, window.innerWidth < 760 ? 1.5 : 1.75], []);
  return (
    <div className="stage" role="img" aria-label={label}>
      <SceneBoundary onError={onReady}>
        <Canvas
          dpr={dpr}
          camera={{ fov: 32, near: 0.1, far: 200, position: [0, 0, 6] }}
          gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
          onCreated={({ gl }) => {
            gl.setClearColor(0x000000, 0);
            gl.toneMapping = ACESFilmicToneMapping;
            gl.toneMappingExposure = 1.05;
          }}
        >
          <FrameDriver />
          <Suspense fallback={null}>
            {children}
            <Ready onReady={onReady} />
          </Suspense>
        </Canvas>
      </SceneBoundary>
    </div>
  );
}
