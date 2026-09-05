import QuizScreen from '../QuizScreen.jsx';
import { greenTheme } from '../../../data/themes.js';

/**
 * Green Icon/GIF template — the green split-screen design with the
 * 2-column tile grid for questions whose options carry an icon or an
 * animated GIF.
 *
 * Options should carry a `media` field: any image src (png/svg/gif).
 */
export default function GreenIconGifTemplate(props) {
  return <QuizScreen theme={greenTheme} variant="media" {...props} />;
}
