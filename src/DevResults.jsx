import ResultsScreen from './components/results/ResultsScreen.jsx';
import { calculate } from './calc/calculator.js';

/**
 * Dev-only harness to preview the results page in different states without
 * walking the whole quiz. Reached via ?results=<scenario>.
 */
const SCENARIOS = {
  // The build-spec worked fixture (goal reached, with ad module)
  fixture: {
    path: 'slg',
    inputs: { q2: 810000, q7: 30000, q7b: 17500, q7c: 0.65, q8: 3000, q9a: 0.03, q9b: 0.375, q10: 3500, q11: 175000 },
    adAdjustable: false,
  },
  // Small business, capped (Block 5)
  capped: {
    path: 'plg',
    inputs: { q2: 270000, q7: 4000, q7b: null, q7c: undefined, q8: 400, q9a: 0.03, q9b: 0.375, q10: 175, q11: 62500 },
    adAdjustable: false,
  },
  // No email marketing (Block 3)
  noemail: {
    path: 'plg',
    inputs: { q2: 810000, q7: 30000, q7b: null, q7c: undefined, q8: 3000, q9a: 0.03, q9b: 0.375, q10: 175, q11: 0 },
    adAdjustable: false,
  },
  // "Not sure" ad share → slider
  adslider: {
    path: 'plg',
    inputs: { q2: 810000, q7: 30000, q7b: 17500, q7c: 0.5, q8: 3000, q9a: 0.03, q9b: 0.375, q10: 175, q11: 175000 },
    adAdjustable: true,
  },
};

export default function DevResults({ scenario }) {
  const cfg = SCENARIOS[scenario] || SCENARIOS.fixture;
  const result = calculate(cfg.inputs, cfg.path);
  return <ResultsScreen result={result} onBack={() => {}} adAdjustable={cfg.adAdjustable} />;
}
