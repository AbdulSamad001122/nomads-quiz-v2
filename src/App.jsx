import QuizFlow from './components/quiz/QuizFlow.jsx';
import TemplatePreview from './TemplatePreview.jsx';
import DevResults from './DevResults.jsx';
import LoadingScreen from './components/quiz/LoadingScreen.jsx';
import DevSlides from './DevSlides.jsx';
import { themes } from './data/themes.js';

/**
 * Default: the real quiz flow (welcome → Q1…Q14 → opt-in → results).
 * ?preview            → the original 9-template preview page.
 * ?results=<scenario> → dev preview of the results page. One scenario per
 *   conditional case; see SCENARIOS in DevResults.jsx, or ?slides for links.
 * ?loading            → dev preview of the loading slide (stays on screen).
 * (dev harness routes — removed before launch)
 */
export default function App() {
  const params = new URLSearchParams(window.location.search);
  if (params.has('slides')) return <DevSlides />;
  if (params.has('preview')) return <TemplatePreview />;
  if (params.has('results')) return <DevResults scenario={params.get('results')} />;
  if (params.has('loading'))
    return (
      <LoadingScreen
        theme={themes[params.get('loading')] || themes.blue}
        onDone={() => {}}
        durationMs={999999}
      />
    );
  return <QuizFlow />;
}
