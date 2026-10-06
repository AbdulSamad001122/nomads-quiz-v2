import { salesModel } from '../data/questions.js';
import { resolveInputs } from '../calc/backendValues.js';
import { calculate } from '../calc/calculator.js';
import { loadResults, clearResults, resultSignature } from './savedResults.js';

/**
 * The calculator result a finished taker sees for these answers (the same
 * calls QuizFlow's results screen makes), or null when the required numbers
 * are missing.
 */
export function resultFor(answers, manualValues) {
  const path = salesModel(answers);
  const inputs = resolveInputs(answers, manualValues, path);
  if (inputs.q2 == null || inputs.q7 == null) return null;
  return calculate(inputs, path);
}

/**
 * Saved answers that still produce exactly the results the taker saw, or
 * null. A save whose numbers would now come out differently (or that can't be
 * calculated at all) is deleted, so a returning visitor never sees changed
 * figures — they start the quiz again instead.
 */
export function restoreSavedResults(opts) {
  const saved = loadResults(opts);
  if (!saved) return null;
  let result = null;
  try {
    result = resultFor(saved.answers, saved.manualValues);
  } catch {
    result = null;
  }
  if (!result || resultSignature(result) !== saved.sig) {
    clearResults(opts);
    return null;
  }
  return { answers: saved.answers, manualValues: saved.manualValues, sig: saved.sig };
}
