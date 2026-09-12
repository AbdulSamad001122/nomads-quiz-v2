import ResultsNav from './sections/ResultsNav.jsx';
import HeroSection from './sections/HeroSection.jsx';
import MetricsSection from './sections/MetricsSection.jsx';
import StopOrPush from './sections/StopOrPush.jsx';
import WhatIfYouDid from './sections/WhatIfYouDid.jsx';
import BeyondFourteenDays from './sections/BeyondFourteenDays.jsx';
import CompoundingIntro from './sections/CompoundingIntro.jsx';
import CrpsCalculatorCta from './sections/CrpsCalculatorCta.jsx';
import AdSpendSection from './sections/AdSpendSection.jsx';
import PromiseBanner from './sections/PromiseBanner.jsx';
import BehindTheNumber from './sections/BehindTheNumber.jsx';
import WorkshopInvite from './sections/WorkshopInvite.jsx';
import GamePlanCta from './sections/GamePlanCta.jsx';
import TheCatch from './sections/TheCatch.jsx';
import TeamApproach from './sections/TeamApproach.jsx';
import GamePlanIntro from './sections/GamePlanIntro.jsx';
import ClientDavid from './sections/ClientDavid.jsx';
import WalkAwayWith from './sections/WalkAwayWith.jsx';
import WeakestPillar from './sections/WeakestPillar.jsx';
import LaraStory from './sections/LaraStory.jsx';
import YourCall from './sections/YourCall.jsx';
import PillarsAccordion from './sections/PillarsAccordion.jsx';
import SameProblemIntro from './sections/SameProblemIntro.jsx';
import RelateQuotes from './sections/RelateQuotes.jsx';
import InCommon from './sections/InCommon.jsx';
import BounceRates from './sections/BounceRates.jsx';
import NotJustSite from './sections/NotJustSite.jsx';
import TwoPaths from './sections/TwoPaths.jsx';
import { resolveTokens } from './resolveTokens.js';
import './results.css';

/**
 * The designed results page. Every section lives in src/results/sections/,
 * assembled here in doc order. Receives the live calculator result from
 * QuizFlow (or DevResults via ?results=<scenario>).
 */
export default function ResultsPage({ result, onBack, adAdjustable = false }) {
  const tokens = resolveTokens(result);

  return (
    <div className="results-page">
      <ResultsNav />
      <HeroSection tokens={tokens} />
      <MetricsSection result={result} tokens={tokens} />
      <StopOrPush tokens={tokens} />
      <WhatIfYouDid result={result} tokens={tokens} />
      {/* TODO (doc order): Blocks 4–7 capped outcome copy slots in here
          once its design arrives. */}
      <BeyondFourteenDays />
      {/* TODO: Block 3 no-email conditional (Logic Doc) adapts the RPS story
          here when RPS = $0. */}
      <CompoundingIntro />
      <CrpsCalculatorCta />
      {/* Ad module is conditional — doc: only when the taker answered the
          ad-spend questions (result.ad exists). */}
      {result.ad && <AdSpendSection result={result} />}
      <PromiseBanner />
      <BehindTheNumber />
      <WorkshopInvite tokens={tokens} />
      <GamePlanCta />
      <TheCatch />
      <TeamApproach />
      <GamePlanIntro />
      <ClientDavid />
      <WalkAwayWith />
      <WeakestPillar />
      <LaraStory />
      <YourCall />
      {/* Pillar content sections (doc rows 6–9) mount inside the accordion
          panels as they're designed. */}
      <PillarsAccordion />
      <SameProblemIntro />
      <RelateQuotes />
      <InCommon />
      <BounceRates />
      <NotJustSite />
      <TwoPaths />
      {/* Next sections land here as they're designed. */}
    </div>
  );
}
