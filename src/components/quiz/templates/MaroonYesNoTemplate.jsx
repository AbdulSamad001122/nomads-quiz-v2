import QuizScreen from '../QuizScreen.jsx';
import { maroonTheme } from '../../../data/themes.js';

/**
 * Maroon Yes/No template — the maroon split-screen design with binary
 * pill options (letter badge + tick/cross icon) for yes/no questions.
 *
 * Options should carry an `icon` field: 'tick' or 'cross'.
 */
export default function MaroonYesNoTemplate(props) {
  return <QuizScreen theme={maroonTheme} variant="binary" {...props} />;
}
