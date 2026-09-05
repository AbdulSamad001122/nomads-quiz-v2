import QuizScreen from '../QuizScreen.jsx';
import { greenTheme } from '../../../data/themes.js';

/**
 * Green template — the split-screen quiz design on the teal-green map
 * texture with the white answer panel and pale-ice option cards.
 */
export default function GreenTemplate(props) {
  return <QuizScreen theme={greenTheme} {...props} />;
}
