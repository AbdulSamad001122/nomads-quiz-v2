import QuizFlow from './components/quiz/QuizFlow.jsx';
import TemplatePreview from './TemplatePreview.jsx';
import DevResults from './DevResults.jsx';
import LoadingScreen from './components/quiz/LoadingScreen.jsx';
import DevSlides from './DevSlides.jsx';
import DevAnswerCheck from './DevAnswerCheck.jsx';
import DevAdCopy from './DevAdCopy.jsx';
import { themes } from './data/themes.js';
import { DEV_ROUTES_ENABLED } from './devRoutes.js';

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
  // Dev harness routes: always in local dev; on deployed builds they follow
  // the one switch in src/devRoutes.js (user-controlled — see the warning
  // there, and flip it OFF before launch).
  if (import.meta.env.DEV || DEV_ROUTES_ENABLED) {
    if (params.has('slides')) return <DevSlides />;
    // ?check=subs | email → the impossible-answer confirmation on its own, so
    // it can be reviewed without walking the quiz to Q8/Q11.
    if (params.has('check')) return <DevAnswerCheck which={params.get('check')} />;
    // ?copy=ad → the ad-spend module's full copy as a flat sheet, for design work.
    if (params.has('copy')) return <DevAdCopy />;
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
  }
  return <QuizFlow />;
}
