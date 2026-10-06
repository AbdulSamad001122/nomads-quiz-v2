import { useEffect, useState } from 'react';
import QuizFlow from '../components/quiz/QuizFlow.jsx';
import { restoreSavedResults } from './restoreResults.js';
import { START_PATH } from '../routes.js';

/**
 * /diagnostic-results opened directly (refresh, bookmark, coming back later).
 * Shows the taker's saved results; with nothing valid saved (another device,
 * expired, a new attempt started, storage blocked) it sends them to the start
 * of the quiz, keeping any query string such as utm tags.
 */
export default function SavedResultsRoute() {
  const [saved] = useState(() => restoreSavedResults());

  useEffect(() => {
    if (!saved) window.location.replace(START_PATH + window.location.search);
  }, [saved]);

  return saved ? <QuizFlow restored={saved} /> : null;
}
