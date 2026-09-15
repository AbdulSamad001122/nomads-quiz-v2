import QuizFlow from './components/quiz/QuizFlow.jsx';
import TemplatePreview from './TemplatePreview.jsx';
import DevResults from './DevResults.jsx';
import LoadingScreen from './components/quiz/LoadingScreen.jsx';
import DevSlides from './DevSlides.jsx';
import DevAnswerCheck from './DevAnswerCheck.jsx';
import DevAdCopy from './DevAdCopy.jsx';
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
  // Dev harness routes exist only where explicitly enabled: always in the
  // dev build, and in deployed builds ONLY when VITE_DEV_ROUTES=true was set
  // at build time (meant for Vercel's Preview environment, so the team can
  // open ?results / ?slides on a deployment without walking the quiz).
  // Leave the var unset on Production: before this gate, those params served
  // the whole result page and a 64-link gallery on the live site with no
  // quiz and no email capture — and unset, the harness is tree-shaken out of
  // the bundle entirely. (?goto is gated the same way in devInitialState.)
  if (import.meta.env.DEV || import.meta.env.VITE_DEV_ROUTES === 'true') {
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
