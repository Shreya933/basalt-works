import ScrollStory from '../components/layout/ScrollStory';
import { home } from '../content/home';
import HomeScene from '../scenes/home/HomeScene';
import { glow } from '../scenes/home/config';

export default function Home() {
  return <ScrollStory content={home} Scene={HomeScene} glow={glow} />;
}
