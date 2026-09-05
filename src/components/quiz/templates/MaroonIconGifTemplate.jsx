import QuizScreen from '../QuizScreen.jsx';
import { maroonTheme } from '../../../data/themes.js';

/**
 * Maroon Icon/GIF template — the maroon split-screen design with the
 * 2-column tile grid for questions whose options carry an icon or an
 * animated GIF.
 *
 * Options should carry a `media` field: any image src (png/svg/gif).
 */
export default function MaroonIconGifTemplate(props) {
  return <QuizScreen theme={maroonTheme} variant="media" {...props} />;
}
