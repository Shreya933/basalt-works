import ScrollStory from '../components/layout/ScrollStory';
import { story } from '../content/story';
import StoryScene from '../scenes/story/StoryScene';
import { glow } from '../scenes/story/config';

export default function Story() {
  return <ScrollStory content={story} Scene={StoryScene} glow={glow} />;
}
