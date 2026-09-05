import QuizScreen from '../QuizScreen.jsx';
import { blueTheme } from '../../../data/themes.js';

/**
 * Blue template — the split-screen quiz design on the navy textured
 * background with the #e4fbff answer panel.
 */
export default function BlueTemplate(props) {
  return <QuizScreen theme={blueTheme} {...props} />;
}
