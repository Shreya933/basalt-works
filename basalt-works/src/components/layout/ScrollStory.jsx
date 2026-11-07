import { useCallback, useState } from 'react';
import Stage from '../scene/Stage';
import Backdrop, { Overlay } from './Backdrop';
import Chapters from './Chapters';
import { Rail, Readout } from './Hud';
import Loader from './Loader';
import Navbar from './Navbar';
import { usePageMeta } from '../../hooks/usePageMeta';
import { useScrollProgress } from '../../hooks/useScrollProgress';

/**
 * One scroll-driven page: a fixed 3D stage with text chapters fading over it as you scroll.
 * Home and Story are both just this component with different content, scene and glow.
 */
export default function ScrollStory({ content, Scene, glow }) {
  const [ready, setReady] = useState(false);
  const onReady = useCallback(() => setReady(true), []);

  usePageMeta(content.title, content.description);
  useScrollProgress(content.anchors);

  return (
    <>
      <Loader ready={ready} label={content.loaderLabel} />
      <Backdrop headline={content.headline} glow={glow} />
      <Stage label={content.canvasLabel} onReady={onReady}><Scene /></Stage>
      <Overlay />
      <Navbar anchors={content.anchors} cta={content.cta} />
      <Rail names={content.names} />
      <Readout />
      <Chapters chapters={content.chapters} fade={content.fade} />
      <div className="scroller" style={{ height: content.scrollHeight }} />
    </>
  );
}
