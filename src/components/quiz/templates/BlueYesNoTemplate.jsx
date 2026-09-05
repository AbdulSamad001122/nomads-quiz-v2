import QuizScreen from '../QuizScreen.jsx';
import { blueTheme } from '../../../data/themes.js';

/**
 * Blue Yes/No template — same blue split-screen design, but the answer
 * panel renders binary pill options (letter badge + tick/cross icon)
 * for yes/no style questions.
 *
 * Options should carry an `icon` field: 'tick' or 'cross'.
 */
export default function BlueYesNoTemplate(props) {
  return <QuizScreen theme={blueTheme} variant="binary" {...props} />;
}
