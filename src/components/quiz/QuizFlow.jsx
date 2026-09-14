import { useEffect, useRef, useState } from 'react';
import QuizScreen from './QuizScreen.jsx';
import BenchmarkScreen from './BenchmarkScreen.jsx';
import TransitionCalcScreen from './TransitionCalcScreen.jsx';
import BeliefTransitionScreen from './BeliefTransitionScreen.jsx';
import AlmostReadyScreen from './AlmostReadyScreen.jsx';
import WelcomeScreen from './WelcomeScreen.jsx';
import DisqualifiedScreen from './DisqualifiedScreen.jsx';
import LoadingScreen from './LoadingScreen.jsx';
import FeedbackLoopScreen from './FeedbackLoopScreen.jsx';
import OptinScreen from './OptinScreen.jsx';
import CaseStudyGolfbays from './CaseStudyGolfbays.jsx';
import CaseStudy97 from './CaseStudy97.jsx';
import CaseStudyCreative from './CaseStudyCreative.jsx';
import CaseStudyLara from './CaseStudyLara.jsx';
import CaseStudyEstelle from './CaseStudyEstelle.jsx';
import Advice12A from './Advice12A.jsx';
import Advice12B from './Advice12B.jsx';
import Advice12C from './Advice12C.jsx';
import Advice12D from './Advice12D.jsx';
import FiveMetricsScreen from './FiveMetricsScreen.jsx';
import HighlightSweep from '../primitives/HighlightSweep.jsx';
import SlideScreen from '../slides/SlideScreen.jsx';
import ResultsPage from '../../results/ResultsPage.jsx';
import { themes } from '../../data/themes.js';
import { QUESTIONS, resolveQuestion, salesModel } from '../../data/questions.js';
import AnswerCheckModal from './AnswerCheckModal.jsx';
import { resolveInputs } from '../../calc/backendValues.js';
import { impossibleCheck } from '../../calc/validation.js';
import { calculate, CEILINGS } from '../../calc/calculator.js';
import { ga } from '../../analytics/ga.js';
import { buildKitFields } from '../../kit/kitPayload.js';
import { pushToKit } from '../../kit/push.js';

/**
 * QuizFlow — the sequencer. Wireframe order: welcome → Q1…Q14 with the
 * non-question slides interleaved → opt-in → results placeholder.
 *
 * This phase: screens + navigation + display routing only
 * (conditionals, disqualify gates, PLG/SLG wording). Calculator,
 * GA4/Clarity/Kit come later.
 */

const QUESTION_INDEX = Object.fromEntries(QUESTIONS.map((q, i) => [q.id, i]));
const byId = Object.fromEntries(QUESTIONS.map((q) => [q.id, q]));

/** Screen list in wireframe order. */
const SCREENS = [
  { type: 'slide', id: 'welcome' },
  { type: 'question', id: 'q1' },
  { type: 'question', id: 'q2a' },
  { type: 'question', id: 'q2b' },
  { type: 'question', id: 'q3' },
  { type: 'question', id: 'q4' },
  { type: 'slide', id: 'benchmark' },
  { type: 'question', id: 'q5' },
  { type: 'slide', id: 'transition-belief' },
  { type: 'slide', id: 'case-study' },
  { type: 'slide', id: 'transition-calculator' },
  { type: 'question', id: 'q6' },
  { type: 'question', id: 'q7a' },
  { type: 'question', id: 'q7b' },
  { type: 'question', id: 'q7c' },
  { type: 'question', id: 'q8' },
  { type: 'question', id: 'q9a' },
  { type: 'question', id: 'q9b' },
  { type: 'question', id: 'q10' },
  { type: 'question', id: 'q11' },
  { type: 'slide', id: 'loading' },
  { type: 'slide', id: 'five-metrics' },
  { type: 'slide', id: 'almost-ready' },
  { type: 'question', id: 'q12' },
  { type: 'slide', id: 'advice' },
  { type: 'question', id: 'q13' },
  { type: 'question', id: 'q14' },
  { type: 'slide', id: 'optin' },
  { type: 'slide', id: 'results' },
];

const CASE_STUDIES = {
  'cold-traffic': {
    eyebrow: 'Case study · GolfBays',
    body: [
      { em: "Strange thing about ROAS: if you're spending $10k+/mo on ads, ROAS shows you the handful who bought and ignores the potential buyers who clicked, browsed, and bounced (and you paid for every one of them)." },
      'GolfBays went from having a discount opt-in to a quiz opt-in that landed them an additional 530 demos a month and £97,000+ in direct site revenue from the same Shopify traffic they were already paying for.',
      { h: 'Before Compounding RPV™ OS:' },
      { ul: [
        '440,000 Shopify sessions with 1 demo booked for every 2,500 visitors (a 0.04% visitor-to-demo conversion rate) underneath it',
        'Buyers knew they wanted to purchase, but 400+ products created enough decision fatigue that they stalled, and the demos that did get booked were spent on product education instead of closing',
      ] },
      { h: 'After Compounding RPV™ OS:' },
      { ul: [
        'We reverse-engineered hundreds of their best demos into a personalised product recommendation engine, coupled with emotional messaging around the real payoff, such as bonding over Christmas holidays in the room that was of no use before installing a GolfBay',
        "14 out of every 100 quiz takers bought directly without a demo, and the £97,000+ doesn't include a single pound from 530+ additional demos booked through the quiz or quiz takers who then visited the physical store",
      ] },
      "When you build a pre-sales experience that mimics your best sales conversations, the one who wasn't thinking about buying starts thinking about it, and the one who was, feels certain enough to purchase",
      'Want to see what it would take you to add an extra $125,000+ to your MRR with the traffic you already have? Follow along.',
    ],
  },
  'low-optin': {
    eyebrow: 'Case study · The 97%',
    body: [
      { em: 'If your business is doing less than $10M/year, spending on visibility to stay "top of mind"—while your opt-in rate stays flat— is a strategy borrowed from bigger players with deeper pockets. It\'s not the best use of your marketing budget.' },
      "The problem: many of your potential buyers are already circling your ecosystem. They've seen your ads or content a few times, but they're still blurry on what you do, why it's different, and why it matters right now.",
      "You're targeting Alex — who doesn't believe he needs you — and Sam — who's actively looking for you — exactly the same way. But what happens when you don't?",
      'Mary — an executive coach pulling 60,000+ monthly LinkedIn views — had fewer than 500 new email subscribers a month. Every sale for her $5,000 offer depended on lengthy back-and-forth DMs. The moment she stepped back, revenue stepped back with her.',
      { h: 'After the Compounding RPV™ OS:' },
      { ul: [
        'A quiz converting existing traffic into email subscribers at a 73–79% opt-in rate',
      ] },
      { img: '/assets/doc/cs-5b-mary-results.webp', alt: 'Quiz platform stats — 1.9K started, 1.4K finished, 1,902 visitors' },
      { ul: [
        'Her membership repositioned as a $500/quarter entry point into her $5,000 offer',
        'People were buying within 7 days of taking the quiz without chasing via calls or DMs',
        'Revenue moved from $14,000 → $51,000/month from the same organic traffic',
      ] },
      { img: '/assets/doc/cs-5b-graph-1.webp', alt: 'Offers sold: 29, up 61%' },
      "Samar Owais — a respected name in SaaS and e-commerce email — watched her list grow in three days by what had previously taken six months, after launching the Champion's Challenge™ quiz. 7,706% list growth, which directly fuelled her EEBC course sales.",
      { img: '/assets/doc/cs-5b-samar.webp', alt: "LinkedIn comment praising Samar Owais' quiz" },
      'An audio-tech SaaS for gamers was spending heavily on influencer marketing — 140,000 monthly visits landing on a website that couldn\'t answer the one question every gamer was quietly asking: "If this is similar to Dolby or Sony, why would I switch?"',
      "The product was free. But free doesn't convert when visitors haven't yet seen why what they have isn't enough.",
      'The Disguised Demo™ quiz educated them on the difference, challenged their current setup, and walked them through the features as a live demo — personalised to whether they were an immersive gamer or a competitive one.',
      'The founder estimates this will save $2M/year in ad spend.',
      "If you're already spending to get eyeballs, the question worth sitting with is: is each of those eyeballs experiencing something that helps them see why this, why now, and why this over what they're already doing?",
      'Most businesses are fishing in the same crowded 3% pool. The ones already convinced they have a problem, already comparing solutions, already halfway to a decision. That pool is only 3% of your total buyers.',
      'The other 97% aren\'t unqualified. They just don\'t believe they have a problem yet. They\'re not comparing; they\'re not even considering. And a product page won\'t change that. It\'ll just confirm what they already thought: "not for me."',
      'But when you open a third door… one that challenges their current thinking, surfaces the gap they hadn\'t named, and educates them without pushing a product — a chunk of that 97% starts considering your solution. Curious → Consideration → Conversation → Conversion.',
      "That's the bigger pool. And that's exactly what the Compounding RPV™ diagnosis is about to show you: your revenue potential when you stop fishing in the 3% and open a door for the 97% who don't yet believe they need you.",
      'Coming up in a jiffy.',
      'Want to see what it would take you to add an extra $125,000+ to your MRR with the traffic you already have? Follow along.',
    ],
  },
  differentiation: {
    eyebrow: 'Case study · Creative Delivery',
    body: [
      { em: "We keep hearing we're in a trust recession. That buyers are more sceptical than ever. But if that were true, the most trusted creators and celebrities wouldn't launch products that flop. They do. All the time." },
      'Turns out there\'s something that matters more than trust: whether they can tell you apart from the other five tabs they have open. A Contrarian POV™ as we call it.',
      'A Video Mastermind founder went from losing 27 sales calls to closing 29 of the next 31 with a Contrarian POV™.',
      { h: 'Before Contrarian POV™' },
      { ul: [
        'They promised "Videos that get more sales," which boxed them into the same category as their competitors',
        "Trust was there; the founder got 200-300 organic comments on his LinkedIn post, yet people thought they wouldn't buy into the same claim and drop $6000 on the mastermind",
      ] },
      { h: 'The Contrarian POV™' },
      { ul: [
        'We analysed a bunch of sales calls, and one word kept coming up: creativity, so the contrarian POV became: Your videos don\'t need high-level production; they need "Creative Delivery."',
        'All the features of the offer now support the Contrarian POV "Creative Delivery."',
      ] },
      { h: 'Results:' },
      { ul: [
        'Went from $8,000 to $108,000/mo by increasing the close rate from 3.7% to 93.5% with a Contrarian POV that created a "Market of One" for him.',
      ] },
      "Contrarian POV is your stand against the majority of look-alike competitors, so you can become the default choice by creating your ownable category. You're no longer competing with cheaper alternatives or established brands.",
      'Want to see what it would take you to add an extra $125,000+ to your MRR with the traffic you already have? Follow along.',
    ],
  },
  'email-close': {
    eyebrow: 'Case study · Lara Acosta',
    body: [
      { em: 'There was a time when more email subscribers meant more money. That time has passed.' },
      'Lara Acosta, Forbes 30 Under 30 and the number one female LinkedIn creator, was pulling in subscribers at the speed of light, considering her 180,000+ followers.',
      'However, her first launch drew only 30 students and a 6% click-through rate.',
      'We built a full pre-launch, launch, and post-launch belief-shifting email strategy, layered with affiliate collaborations, a masterclass, and behavior-triggered sequences that compounded with every launch.',
      { ul: [
        'Next launch: 70 students',
        'The launch after that: 500 students and half a million dollars in revenue',
      ] },
      'Email is the most profitable channel in her business today. Here\'s another one… The #1 SDR Sales Coach had built a list of 10,000 subscribers through a "Comment X, Get Y" strategy and his emails simply weren\'t converting despite every effort. We ran the exact same sequence, same messaging, same timing, to two lists simultaneously:',
      { ul: [
        'His original 10,000 subscribers — 1 sale',
        '829 Conversion Quiz™ subscribers — 23 sales',
      ] },
      'Same audience. Same emails. The only difference was the frame they joined with. The people who joined to diagnose their gaps were way more likely to buy the solution than those who just wanted a quick freebie.',
      'Three things make email your most profitable channel in your business.',
      { ul: [
        'Why each person joined your list — someone who joined to diagnose a real problem, and how their beliefs are challenged, and objections are handled during the diagnosis, can convert them within the first 14 days.',
        'What happens in the first 14 days — A subscriber is most engaged within the first 10 days of joining your list. Your email strategy should look very different in this window. What happens after 14 days — Are you dumping all non-buyers in the same newsletter pool? Or you\'re planning a lifecycle email strategy with behavior-triggered segmentation that informs the strategy of your affiliate campaigns, seasonal sales, upsells, and cross-sells.',
      ] },
      'Want to see what it would take you to add an extra $125,000+ to your MRR with the traffic you already have? Follow along.',
    ],
  },
  'call-convincing': {
    eyebrow: 'Case study · Estelle Winsett',
    body: [
      { em: '"If we get them on a call, we\'ll close them" isn\'t a flex. It\'s booking you fewer calls and hurting your close rate.' },
      'Estelle Winsett is a former attorney who styles high-performing lawyers from court to cocktails.',
      'She had built an engaged audience of 9000+ women hungry for better presence and positioning through their style.',
      { h: 'Before Compounding RPV OS:' },
      { ul: [
        'She spent hours in LinkedIn DMs nurturing lawyers to book a call with her even if she was writing content daily.',
        "The manual back-and-forth conversations made growth slow, and nonexistent on days when she wasn't active in the DMs.",
        "Her buyers only saw the $5000 price, Estelle's deep process, and her clients' transformations on the call.",
      ] },
      { h: 'After Compounding RPV OS:' },
      { ul: [
        "The Conversion Quiz sits on her profile, under each post, and in a QR when she's delivering talks, so it brings in consistent quiz takers without her being in the DMs",
        '"It\'s not your body, it\'s your clothes" contrarian POV™ that etched Estelle\'s take in her audience\'s mind.',
      ] },
      { img: '/assets/doc/cs-estelle-quiz.webp', alt: 'LinkedIn comment thanking Estelle Winsett for her styling permission-giving' },
      { ul: [
        'In the DMs, instead of back and forth, she points them to the Quiz, and that easily transitions the conversation to a sales call',
        'They see the $5000 offer, her detailed process, and her Contrarian take from other stylists *before* they hop on a call with her',
      ] },
      { h: 'The Results:' },
      { ul: [
        'Five out of every 100 quiz takers book a call with her in the first 10 days of taking the quiz',
      ] },
      { img: '/assets/doc/cs-estelle-results.webp', alt: 'Funnel stats — quiz takers convert 62.8% vs 27.2% for non-quiz takers; 5.2% leads-to-sales' },
      { ul: [
        "She went from 3 sales calls per month to 3 per week, while closing 75% of them, since the convincing doesn't happen on a call.",
      ] },
      "Because the moment someone books a call still unconvinced, you've already added 45 minutes of convincing to your calendar, and weeks of follow-ups to your sales cycle.",
      'Want to see what it would take you to add an extra $125,000+ to your MRR with the traffic you already have? Follow along.',
    ],
  },
};

/**
 * Advice shown after Q12, matched to the chosen option (12A–12D from the
 * copy doc). Shared across PLG/SLG — Q12's a/b/c/d options map to the same
 * four themes (wrong-fit buyers · plateau · inconsistency · price/positioning).
 */
const ADVICE_12 = {
  a: {
    body: [
      { em: 'Put an end to attracting doubtful buyers and tire-kickers by ditching educating buyers on the call.' },
      { img: '/assets/doc/advice-12a.webp', alt: 'Now vs with RPV™ — pre-sales journey comparison from funnel entry to the call' },
      'If you want to bring your close rate up, and shrink your sales cycle:',
      { ul: [
        'Pre-educate before the call — on your process, differentiation, price range. Let the call be for the last few questions, not convince-me-you-are-not-a-knob.',
        'Personalise the pre-sales experience — Alex and Adam have different use cases, different objections, different reasons to buy.',
      ] },
      'Are you showing them relevant features, the right testimonials, and handling their specific objections before they ever speak to you?',
      { ul: [
        'Filter misfits early without lowering your threshold — stop hoping a call will convert someone who was never the right fit. There are enough qualified buyers out there.',
      ] },
      'Let the tire-kickers filter themselves out naturally.',
      'Reserve the calls for buyers to confirm their commitment, not to build it from scratch.',
    ],
  },
  b: {
    body: [
      { em: "Revenue has plateaued even though your traffic hasn't slowed down." },
      { h: 'Revenue Plateaus → Revenue Compounds' },
      { img: '/assets/doc/advice-12b-plateau.webp', alt: 'Customer feedback loop engine — day-10 buyers, non-buyers, and existing buyers feeding optimised sequences and offers' },
      'Three levers break a plateau without adding a single new visitor:',
      { h: 'Are more people buying in the first 10 days?' },
      'Every 100 people who are considering buying from you can give you feedback on why they bought or didn\'t.',
      'Use that to scale from converting 1 in 100 to 5 in 100 by optimising messaging and positioning consistently.',
      { h: 'Are you nurturing non-buyers differently from buyers?' },
      'Non-buyers have unresolved objections. A personalised 5-email objection sequence can close harder than dumping everyone on the same list.',
      { h: 'Are you going back to your existing buyers?' },
      "The easiest revenue you'll ever make is from someone who already bought. Repeat purchases, upsells, cross-sells, affiliate campaigns, seasonal sales — all of it becomes possible when zero-party data tells you what they actually want next instead of you guessing.",
      "Believe it or not, you don't have a traffic problem. You've probably filled enough of Zuckerberg's pockets already. What you need is a system that compounds revenue from the traffic you're already paying for.",
    ],
  },
  c: {
    body: [
      { em: "Good months happen. Then they stop. And you don't know why." },
      'Last year, August was my best sales month (whereas summer is usually a slow season).',
      'I thought it was luck. I am a Scoreapp partner, and I had multiple Scoreapp inquiries.',
      'Later, when we interviewed our customers, the pattern revealed: it was because Daniel Priestly went on the Diary of a CEO podcast. His visibility positively influenced our sales.',
      'The same growth occurred when one of his YouTube videos went viral.',
      "If only I had a feedback loop built-in, I could've immediately sponsored his newsletter or proposed a content partnership.",
      "That's where I could've doubled down on a GOOD MONTH.",
      "But like me, many teams don't know why a good month was good, or a bad month was bad.",
      'Was it a positioning problem, market change, or an industry leader influencing their sales?',
      "That's why now I've built a 14-step feedback loop that helps us get behavioral data from every visitor going through a business's sales ecosystem.",
      'So one can immediately point out why something is working, or not working, and act on it.',
      "Without that loop, you're not making data-led decisions. You're making expensive guesses.",
      "And this is what's usually happening behind the inconsistency:",
      { ul: [
        'Your Head of Content is celebrating and reporting a 30% increase in visibility',
        "The ads strategist is responsible for how many calls or clicks they're producing",
      ] },
      'But does it take the sales team 15 minutes or 3 hours to close the deal? Or did the ads create rage-bait, and now customer service has an influx of refund requests?',
      "Is that a metric that determines the ads' success? Or is it just tracking ROAS?",
      'Inconsistency in revenue happens because marketing, customer success, and sales are not working in sync.',
      'When your teams are tracking in isolation, your good months feel like luck — and your slow months feel like failure.',
      'Neither is true.',
      "You just don't have the number that connects everything.",
      { img: '/assets/doc/advice-12c-1.webp', alt: 'Teams without a feedback loop working in silos — content, ads, sales, customer service, revenue' },
      { img: '/assets/doc/advice-12c-2.webp', alt: 'Data-led feedback loop connecting sales, ads, content, and customer service' },
      'The feedback loop + sales team tells which calls have been the best — which messages and positioning is selling. The ad team creates 5–8 variations of that message, the outlier gets picked by the content team, so now the messages are converting on socials. Each action is in sync and data-led.',
      "That's what we're about to find. Once you know your RPV — your revenue per visitor — you stop guessing which month is a traffic problem, an email problem, or a positioning problem. You start seeing it.",
    ],
  },
  d: {
    body: [
      { em: 'Nobody defaults to the cheapest option when one choice is dominantly clear.' },
      'But when there is no clear differentiation, price becomes the only thing left to compare.',
      "That's a positioning problem.",
      'To own a category, you need a Contrarian POV™. Here\'s why:',
      { ul: [
        'Your offer is asking people to switch or start something new — and nobody does that without a reason. You need a "why switch" that challenges them to reconsider their current approach.',
        'A Contrarian POV creates that contradiction — it makes them question their old way and start seeing your way as the obvious solution.',
        "Your customer's words tell you which category to own. Here are 9 reasons people buy and 7 reasons they don't. Your Contrarian POV is built on research that identifies which specific trigger is most dominant for your buyer and which hesitation is keeping them stuck. One big idea speaks to all of it simultaneously.",
      ] },
      { img: '/assets/doc/advice-12d.webp', alt: 'Brands that challenged their category — Patagonia, Slack, HubSpot, Apple, Oatly' },
      'When your Contrarian POV is doing its job, the question stops being "why should I pick you over them" and starts being "why would I pick anyone else."',
      "Bring your differentiation forward so buying decisions aren't left at the mercy of your competitor's pricing charts!",
    ],
  },
};

function screenVisible(screen, answers) {
  if (screen.type === 'question') {
    const q = byId[screen.id];
    return q.showIf ? q.showIf(answers) : true;
  }
  return true;
}

/**
 * DEV ONLY — `?goto=<screenId>` jumps straight to a screen with realistic
 * prefilled answers, so themes/branches/data render correctly without
 * clicking through the quiz. Variant params: `path=plg`, `gate=1`, `ads=1`,
 * `q5=a..e` (case study), `q12=a..e` (advice). `?goto=dq` shows the
 * disqualification screen. Part of the dev harness — removed before launch.
 */
function devInitialState() {
  if (!import.meta.env.DEV) return null;
  const p = new URLSearchParams(window.location.search);
  if (!p.has('goto')) return null;
  const g = p.get('goto');

  const gate = p.get('gate') === '1' || g === 'q2b';
  const ads = p.get('ads') === '1' || g === 'q7b' || g === 'q7c';
  const path = p.get('path') === 'plg' ? 'plg' : 'slg';
  const CS = {
    a: 'cold-traffic',
    b: 'low-optin',
    c: 'differentiation',
    d: 'email-close',
    e: 'call-convincing',
  };

  const answers = {
    q1: 'founder',
    q2a: gate ? 'under-10k' : '35k-100k',
    ...(gate ? { q2b: 'yes' } : {}),
    q3: 'agency',
    q4: path === 'plg' ? 'self-serve' : 'calls',
    q5: CS[p.get('q5')] || 'cold-traffic',
    q6: ads ? ['paid-ads', 'seo'] : ['seo'],
    q7a: '10001-50000',
    ...(ads ? { q7b: '10k-25k', q7c: '45-55' } : {}),
    q8: '1000-5000',
    q9a: '1-5',
    q9b: '25-50',
    q10: path === 'plg' ? '100-250' : '2000-5000',
    q11: '25k-100k',
    q12: p.get('q12') || 'a',
    q13: ['paid-ads'],
  };

  if (g === 'dq') return { index: 0, answers, dq: 'traffic_gate' };
  const idx = SCREENS.findIndex((s) => s.id === g);
  return idx >= 0 ? { index: idx, answers, dq: null } : null;
}

const DEV_INIT = devInitialState();

export default function QuizFlow() {
  const [index, setIndex] = useState(DEV_INIT ? DEV_INIT.index : 0);
  const [answers, setAnswers] = useState(DEV_INIT ? DEV_INIT.answers : {});
  const [manualValues, setManualValues] = useState({});
  const [otherText, setOtherText] = useState('');
  const [vocText, setVocText] = useState('');
  const [dqReason, setDqReason] = useState(DEV_INIT?.dq ?? null);
  // Impossible-answer check currently on screen, and the questions the taker
  // pushed past with "Keep my answers" (Quiz Logics.docx · Manual entry &
  // validation). Overrides tag the Kit record unverified.
  const [answerCheck, setAnswerCheck] = useState(null);
  const [overrides, setOverrides] = useState([]);
  const advanceTimer = useRef(null);

  const totalQuestions = QUESTIONS.length;

  const goTo = (from, dir, ans = answers) => {
    let i = from + dir;
    while (i >= 0 && i < SCREENS.length && !screenVisible(SCREENS[i], ans)) {
      i += dir;
    }
    if (i >= 0 && i < SCREENS.length) setIndex(i);
  };

  const next = () => goTo(index, 1);

  /**
   * Quiz Logics.docx · Manual entry & validation: "Two impossible-answer
   * checks fire on advancing." Runs the check against the answers as they
   * will be, and either shows the confirmation or advances. Both of the
   * modal's routes preserve what the taker typed.
   */
  const advanceChecked = (qid, ans = answers, man = manualValues) => {
    const trip = impossibleCheck(qid, resolveInputs(ans, man, salesModel(ans)));
    if (trip) {
      setAnswerCheck({ ...trip, qid, ans, man });
      return;
    }
    goTo(index, 1, ans);
  };

  // "Keep my answers" — the doc says it advances, clamps at the ceiling and
  // tags the record unverified. Writing the capped figure back as a manual
  // value is what makes the clamp real everywhere downstream.
  //
  // "at ceiling" = the doc's own ceilings table, not the raw comparison value.
  // For Q8 that is the opt-in ceiling (0.60 of visitors). Clamping to visitors
  // instead would leave q8 === q7, which still satisfies the doc's own ">="
  // trip condition — evidence that the metric ceiling is what it means.
  // Q11's check is "> total revenue", so total revenue itself already clears.
  // FLAGGED: the doc says "ceiling" without naming which.
  const CLAMP_TO = {
    q8: (i) => Math.round(i.q7 * CEILINGS.optIn),
    q11: (i) => i.q2,
  };

  const keepAnswers = () => {
    const { qid, ans, man } = answerCheck;
    const cap = CLAMP_TO[qid]?.(resolveInputs(ans, man, salesModel(ans)));
    const nextAns = { ...ans, [qid]: 'manual' };
    const nextMan = { ...man, [qid]: String(cap) };
    setAnswers(nextAns);
    setManualValues(nextMan);
    setOverrides((o) => (o.includes(qid) ? o : [...o, qid]));
    setAnswerCheck(null);
    goTo(index, 1, nextAns);
  };
  const back = () => {
    if (dqReason) {
      setDqReason(null);
      return;
    }
    goTo(index, -1);
  };

  const screen = SCREENS[index];

  const percentFor = (qid) =>
    Math.round((QUESTION_INDEX[qid] / totalQuestions) * 100);

  // Theme alternates blue → maroon → green across the SPLIT-SCREEN slides the
  // taker actually sees — questions plus the benchmark and
  // transition-to-calculator slides (skipped conditionals don't consume a
  // colour, so the alternation never breaks when Q2B / Q7B / Q7C are routed
  // around).
  const THEMED_SLIDES = ['benchmark', 'transition-belief', 'case-study', 'transition-calculator', 'loading', 'almost-ready', 'optin'];
  const themeCycle = ['blue', 'maroon', 'green'];
  const themeAt = (idx) => {
    const seenPosition = SCREENS.slice(0, idx + 1).filter(
      (s) =>
        (s.type === 'question' || THEMED_SLIDES.includes(s.id)) &&
        screenVisible(s, answers)
    ).length;
    return themes[themeCycle[(seenPosition - 1) % 3]];
  };

  /* ---------- GA4 view/outcome events (fire when a screen appears) ---------- */
  useEffect(() => {
    if (dqReason) {
      ga.disqualified(dqReason);
      return;
    }
    const s = SCREENS[index];
    if (s.type === 'question' && screenVisible(s, answers)) {
      const raw = byId[s.id];
      ga.questionView(
        { id: raw.id, stepNumber: raw.stepNumber, label: raw.label, variant: raw.variant },
        salesModel(answers)
      );
    } else if (s.id === 'results') {
      const inputs = resolveInputs(answers, manualValues, salesModel(answers));
      if (inputs.q2 != null && inputs.q7 != null) {
        const result = calculate(inputs, salesModel(answers));
        ga.quizComplete(result);
        ga.resultsView(result);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [index, dqReason]);

  /* ---------- disqualification ---------- */
  if (dqReason) {
    return (
      <DisqualifiedScreen
        onBack={back}
        onWorkshop={() => {
          ga.ctaClick('dq_workshop');
          // TODO: workshop link pending from the team
        }}
        onWebsite={() => {
          ga.ctaClick('dq_website');
          window.open('https://nomadsmarketing.co', '_blank', 'noopener');
        }}
      />
    );
  }

  /* ---------- question screens ---------- */
  if (screen.type === 'question') {
    const raw = byId[screen.id];
    const q = resolveQuestion(raw, answers);
    const theme = themeAt(index);
    const value = answers[q.id];

    const optLabel = (id) => (q.options.find((o) => o.id === id) || {}).label;

    const selectSingle = (optId) => {
      const nextAnswers = { ...answers, [q.id]: optId };
      setAnswers(nextAnswers);

      if (q.manualEntry && optId === 'manual') return; // wait for input + Continue
      ga.questionAnswer(q, optId, optLabel(optId), salesModel(nextAnswers));
      if (q.disqualifyIf && q.disqualifyIf(nextAnswers)) {
        setDqReason(q.dqReason);
        return;
      }
      clearTimeout(advanceTimer.current);
      advanceTimer.current = setTimeout(
        () => advanceChecked(q.id, nextAnswers),
        350
      );
    };

    // Answer event for multi / manual / text screens (fired on Continue).
    const fireDeferredAnswer = () => {
      const val = answers[q.id];
      if (q.variant === 'text') {
        ga.questionAnswer(q, 'text', '(free text)', salesModel(answers));
      } else if (isMulti) {
        const ids = Array.isArray(val) ? val : [];
        ga.questionAnswer(q, ids.join('|'), ids.map(optLabel).join(', '), salesModel(answers));
      } else if (manualOpen) {
        ga.questionAnswer(q, 'manual', 'exact number entered', salesModel(answers));
      }
    };

    const toggleMulti = (optId) => {
      const current = Array.isArray(value) ? value : [];
      const nextSel = current.includes(optId)
        ? current.filter((x) => x !== optId)
        : [...current, optId];
      setAnswers({ ...answers, [q.id]: nextSel });
    };

    const isMulti = !!q.multi;
    const manualOpen =
      (q.manualEntry && value === 'manual') ||
      (q.otherEntry && Array.isArray(value) && value.includes('other'));

    const needsContinue =
      isMulti || manualOpen || q.variant === 'text' || q.allowSkip;

    const continueDisabled =
      q.variant === 'text'
        ? vocText.trim().length === 0
        : isMulti
          ? !Array.isArray(value) || value.length === 0
          : manualOpen
            ? !(manualValues[q.id] || '').trim() && !q.otherEntry
            : value == null;

    // Q14 has its own designed screen (photo + brush "Haaaa!" layout);
    // same theme rotation, same free-text state and Continue rules.
    if (q.id === 'q14') {
      return (
        <FeedbackLoopScreen
          theme={theme}
          value={vocText}
          onChange={setVocText}
          onBack={back}
          onContinue={() => {
            fireDeferredAnswer();
            next();
          }}
          continueDisabled={continueDisabled}
        />
      );
    }

    return (
      <>
      {answerCheck ? (
        <AnswerCheckModal
          message={answerCheck.message}
          onBack={() => setAnswerCheck(null)}
          onKeep={keepAnswers}
        />
      ) : null}
      <QuizScreen
        theme={theme}
        qid={q.id}
        variant={q.variant === 'text' ? 'text' : q.variant}
        stepNumber={q.stepNumber}
        label={q.label}
        question={q.question}
        subline={q.subline}
        options={q.options}
        selectedId={isMulti ? undefined : value}
        selectedIds={isMulti ? (Array.isArray(value) ? value : []) : undefined}
        onSelect={isMulti ? toggleMulti : selectSingle}
        onBack={back}
        progressPercent={percentFor(q.id)}
        manualOpen={manualOpen}
        manualType={q.otherEntry ? 'text' : q.manualType}
        manualValue={
          q.otherEntry ? otherText : manualValues[q.id] || ''
        }
        onManualChange={(v) =>
          q.otherEntry
            ? setOtherText(v)
            : setManualValues({ ...manualValues, [q.id]: v })
        }
        textValue={vocText}
        onTextChange={setVocText}
        allowSkip={q.allowSkip}
        onSkip={() => {
          setAnswers({ ...answers, [q.id]: null });
          goTo(index, 1);
        }}
        onContinue={
          needsContinue
            ? () => {
                fireDeferredAnswer();
                advanceChecked(q.id);
              }
            : undefined
        }
        continueDisabled={continueDisabled}
      />
      </>
    );
  }

  /* ---------- slide screens ---------- */
  const path = salesModel(answers);

  switch (screen.id) {
    case 'welcome':
      return (
        <WelcomeScreen
          onStart={() => {
            ga.quizStart();
            next();
          }}
        />
      );

    case 'benchmark':
      return (
        <BenchmarkScreen
          theme={themeAt(index)}
          isSlg={path === 'slg'}
          onBack={back}
          onContinue={next}
          progressPercent={percentFor('q5')}
        />
      );

    case 'transition-belief':
      return (
        <BeliefTransitionScreen
          theme={themeAt(index)}
          onBack={back}
          onContinue={next}
        />
      );

    case 'case-study': {
      const csKey = answers.q5 || 'cold-traffic';
      // 5A (GolfBays) has its designed screen; other variants keep the
      // placeholder until their references arrive.
      if (csKey === 'cold-traffic') {
        return (
          <CaseStudyGolfbays
            theme={themeAt(index)}
            onBack={back}
            onContinue={next}
          />
        );
      }
      if (csKey === 'low-optin') {
        return (
          <CaseStudy97 theme={themeAt(index)} onBack={back} onContinue={next} />
        );
      }
      if (csKey === 'differentiation') {
        return (
          <CaseStudyCreative
            theme={themeAt(index)}
            onBack={back}
            onContinue={next}
          />
        );
      }
      if (csKey === 'email-close') {
        return (
          <CaseStudyLara
            theme={themeAt(index)}
            onBack={back}
            onContinue={next}
          />
        );
      }
      if (csKey === 'call-convincing') {
        return (
          <CaseStudyEstelle
            theme={themeAt(index)}
            onBack={back}
            onContinue={next}
          />
        );
      }
      const cs = CASE_STUDIES[csKey] || CASE_STUDIES['cold-traffic'];
      return (
        <SlideScreen
          eyebrow={cs.eyebrow}
          body={cs.body}
          cta="Follow along →"
          onCta={next}
          onBack={back}
        />
      );
    }

    case 'transition-calculator':
      return (
        <TransitionCalcScreen
          theme={themeAt(index)}
          onBack={back}
          onContinue={next}
          progressPercent={percentFor('q6')}
        />
      );

    case 'loading':
      return <LoadingScreen theme={themeAt(index)} onDone={next} durationMs={1500} />;

    case 'five-metrics':
      return <FiveMetricsScreen onBack={back} onContinue={next} />;

    case 'almost-ready':
      return (
        <AlmostReadyScreen
          theme={themeAt(index)}
          onBack={back}
          onContinue={next}
        />
      );

    case 'advice': {
      // SLG has five Q12 options but the doc has four advice slides (12A–12D):
      // option d (can't tell which channels drive revenue) shares 12C's
      // tracking/feedback-loop advice; option e (price wars) gets 12D.
      const adviceKey =
        path === 'slg'
          ? { a: 'a', b: 'b', c: 'c', d: 'c', e: 'd' }[answers.q12] || 'a'
          : answers.q12 || 'a';
      // 12A has its designed screen; the rest keep the placeholder until
      // their references arrive.
      if (adviceKey === 'a') {
        return <Advice12A onBack={back} onContinue={next} />;
      }
      if (adviceKey === 'b') {
        return <Advice12B onBack={back} onContinue={next} />;
      }
      if (adviceKey === 'c') {
        return <Advice12C onBack={back} onContinue={next} />;
      }
      return <Advice12D onBack={back} onContinue={next} />;
    }

    case 'optin':
      return (
        <OptinScreen
          theme={themeAt(index)}
          onBack={back}
          onSubmit={({ firstName, email } = {}) => {
            ga.leadSubmit(path);

            // Push everything to Kit (answers + computed results). Fire and
            // forget — a Kit hiccup must never block the results screen.
            if (email) {
              let result = null;
              const inputs = resolveInputs(answers, manualValues, path);
              if (inputs.q2 != null && inputs.q7 != null) {
                result = calculate(inputs, path);
              }
              pushToKit({
                email,
                firstName,
                fields: buildKitFields({
                  answers,
                  manualValues,
                  otherText,
                  vocText,
                  result,
                  overrides,
                }),
              });
            }

            next();
          }}
        />
      );

    case 'results': {
      const inputs = resolveInputs(answers, manualValues, path);
      if (inputs.q2 == null || inputs.q7 == null) {
        return (
          <SlideScreen
            kind="results"
            eyebrow="Results"
            title="We're missing a couple of numbers."
            lines={[
              'Some required answers (revenue or visitors) came through empty, so we can’t calculate your RPV yet. Head back and complete them.',
            ]}
            onBack={back}
          />
        );
      }
      const result = calculate(inputs, path);
      // Logic Doc · 7: 'Slider (only if Q7c = "Not sure")'. A skipped Q7c gets
      // no ad section at all (resolveInputs leaves q7c undefined), so "Not
      // sure" is the only case that needs the adjustable share.
      const adGuessed = inputs.q7c != null && answers.q7c === 'not-sure';
      return (
        <ResultsPage
          result={result}
          onBack={back}
          adAdjustable={adGuessed}
        />
      );
    }

    default:
      return null;
  }
}
