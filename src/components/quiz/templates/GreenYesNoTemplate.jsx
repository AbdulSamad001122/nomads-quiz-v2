import QuizScreen from '../QuizScreen.jsx';
import { greenTheme } from '../../../data/themes.js';

/**
 * Green Yes/No template — the green split-screen design with binary
 * pill options (letter badge + tick/cross icon) for yes/no questions.
 *
 * Options should carry an `icon` field: 'tick' or 'cross'.
 */
export default function GreenYesNoTemplate(props) {
  return <QuizScreen theme={greenTheme} variant="binary" {...props} />;
}
