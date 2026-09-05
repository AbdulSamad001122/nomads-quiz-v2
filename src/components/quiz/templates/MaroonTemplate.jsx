import QuizScreen from '../QuizScreen.jsx';
import { maroonTheme } from '../../../data/themes.js';

/**
 * Maroon template — the split-screen quiz design on the deep maroon
 * texture with the pale lavender (#f2e5f6) answer panel and plum
 * (#5d1b4e) selection styling.
 */
export default function MaroonTemplate(props) {
  return <QuizScreen theme={maroonTheme} {...props} />;
}
