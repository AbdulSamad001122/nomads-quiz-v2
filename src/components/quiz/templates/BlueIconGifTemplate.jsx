import QuizScreen from '../QuizScreen.jsx';
import { blueTheme } from '../../../data/themes.js';

/**
 * Blue Icon/GIF template — same blue split-screen design, but the answer
 * panel renders a 2-column grid of tile cards, each with a circular media
 * area. Used for every question that pairs its options with an icon OR an
 * animated GIF.
 *
 * Options should carry a `media` field: any image src (png/svg/gif).
 */
export default function BlueIconGifTemplate(props) {
  return <QuizScreen theme={blueTheme} variant="media" {...props} />;
}
