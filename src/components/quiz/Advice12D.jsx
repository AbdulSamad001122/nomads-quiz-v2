import SeamBadge from './parts/SeamBadge.jsx';
import BackLink from './parts/BackLink.jsx';
import HighlightSweep from '../primitives/HighlightSweep.jsx';
import './QuizScreen.css';
import './Advice12A.css';
import './Advice12D.css';
import ScrollNudge, { scrollToNextSection } from './parts/ScrollNudge.jsx';

/* Brands table content, verbatim from the doc's original table image
   (user, Oct 2 — it fixes Oatly's boxes, which the designed version had
   repeating Apple's copy, and adds the "What they all did differently"
   footer). The designed version's last ($) column stays dropped. */
const BRANDS = [
  {
    name: 'Patagonia',
    sub: 'Retail / DTC',
    blue: {
      quote: '"Premium outdoor gear. Durable. Eco-friendly."',
      note: 'Every outdoor brand said the same thing.',
    },
    pink: {
      quote: '"Don\'t buy this jacket."',
      note: 'Challenged consumption itself. Became the only brand with a moral POV.',
    },
    peach: [
      { text: 'Revenue up 30% the year after.' },
      { text: '$415M to $543M.', bold: true },
      { text: 'Hit $1B by 2017. No price comparison possible anymore.' },
    ],
  },
  {
    name: 'Slack',
    sub: 'SaaS',
    blue: {
      quote: '"A messaging app for teams. Faster than email."',
      note: 'Hipchat, Campfire, and Teams said the same.',
    },
    pink: {
      quote: '"Email is where work goes to die. Slack is where work actually happens."',
      note: 'Named the enemy. Created a new category.',
    },
    peach: [
      { text: '$1B valuation in 8 months.' },
      { text: 'Fastest growing SaaS ever.' },
      { text: 'Acquired by Salesforce for $27.7B.', bold: true },
    ],
  },
  {
    name: 'HubSpot',
    sub: 'B2B SaaS',
    blue: {
      quote: '"Marketing software to generate more leads faster."',
      note: 'Every CRM and marketing tool said this.',
    },
    pink: {
      quote: '"Outbound marketing is broken. Stop interrupting. Start attracting."',
      note: 'Created the inbound marketing category.',
    },
    peach: [
      { text: '3 customers in 2006 to $20B+ company.', bold: true },
      { text: 'Own 38% of global marketing automation market share.' },
    ],
  },
  {
    name: 'Apple',
    sub: 'Tech',
    blue: {
      quote: '"Faster processors, more RAM, better specs than IBM."',
      note: 'Competing on features nobody cared about.',
    },
    pink: {
      quote: '"Technology should feel human. Here\'s to the crazy ones who think different."',
      note: 'Sold identity, not specs. No comparison possible.',
    },
    peach: [
      { text: 'Stock tripled in 12 months.' },
      { text: 'Market cap $1.6B to $6B in one year.', bold: true },
      { text: 'Now the most valuable company on earth.' },
    ],
  },
  {
    name: 'Oatly',
    sub: 'FMCG / DTC',
    blue: {
      quote: '"A dairy-free milk alternative. Better for the lactose intolerant."',
      note: 'Every alt-milk brand said the same thing.',
    },
    pink: {
      quote: '"It\'s like milk, but made for humans. Dairy is weird if you think about it."',
      note: 'Challenged dairy itself. Became a cult brand.',
    },
    peach: [
      { text: 'Revenue grew from $200M to $700M+ in 3 years.' },
      { text: '$10B IPO valuation.', bold: true },
      { text: 'Most recognized alt-milk brand in the world.' },
    ],
  },
];

/**
 * Advice slide 12D ("price wars / differentiation" answer on Q12) —
 * same fixed blue-family layout as 12A–12C (shared a12__ classes). Like
 * 12C, its brands table sits in the body flow (after the three cards), not
 * straddling the hero — built in code (.brt) since Oct 2, no longer an
 * image.
 */
export default function Advice12D({ onBack, onContinue }) {
  return (
    <div className="a12 a12--d">
      <ScrollNudge tone="ice" />
      {/* ---------- dark top ---------- */}
      <section className="a12__top">
        <SeamBadge src="/assets/circle-doodle-2.png" />
        <div className="question-panel__top">
          <div className="question-panel__logo-box">
            <img src="/assets/nomads-logo-dark.png" alt="Nomads" />
          </div>
          <span className="question-panel__top-line" aria-hidden="true" />
        </div>

        <div className="a12__frame">
          <div className="a12__back">
            <BackLink onBack={onBack} />
          </div>
          <h1 className="a12__headline">
            {'Nobody defaults to the cheapest option when one choice is '}
            <HighlightSweep tone="iceblue">dominantly clear.</HighlightSweep>
          </h1>
          <p className="a12__subline">
            But when there is no clear differentiation, price becomes the
            only thing left to compare.
          </p>
          {/* directly under the line it answers (Yemi, Sep 26) */}
          <p className="a12__subline">{"That's a positioning problem."}</p>
          <div className="a12__frame-cta">
            <button
              type="button"
              className="q-btn q-btn--onDark a12__frame-continue"
              onClick={scrollToNextSection}
            >
              Follow along
            </button>
          </div>
        </div>
      </section>

      {/* ---------- ice-blue body ---------- */}
      {/* No infographic up here on 12D: the brands table sits after the three
          cards, before "When your Contrarian POV™ is doing its job…" (copy
          doc order; Yemi, Quiz Changes Doc row 20). */}
      <section className="a12__body">
        <h2 className="a12__mid-head">
          {'To own a category, you need a '}
          <HighlightSweep tone="navy">Contrarian POV™.</HighlightSweep>
          {" Here's why:"}
        </h2>

        <div className="a12__cards">
          <div className="a12__card a12__card--lavender">
            <span className="a12__icon">
              <img src="/assets/icon-12d-signpost.png" alt="" aria-hidden="true" />
            </span>
            <h3 className="a12__card-title">{'The "why switch"'}</h3>
            <p className="a12__card-text">
              {'Your offer is asking people to switch or start something new and nobody does that without a reason. You need a "why switch" that challenges them to reconsider their current approach.'}
            </p>
          </div>

          <div className="a12__card a12__card--plum">
            <span className="a12__icon">
              <img src="/assets/icon-12d-puzzle.svg" alt="" aria-hidden="true" />
            </span>
            <h3 className="a12__card-title">The contradiction</h3>
            <p className="a12__card-text">
              A Contrarian POV™ creates that contradiction it makes them
              question their old way and start seeing your way as the obvious
              solution.
            </p>
          </div>

          <div className="a12__card a12__card--navy">
            <span className="a12__icon">
              <img src="/assets/icon-12d-microphone.png" alt="" aria-hidden="true" />
            </span>
            <h3 className="a12__card-title">{"Your customer's words"}</h3>
            <p className="a12__card-text">
              {"Your customer's words tell you which category to own. Here are 9 reasons people buy and 7 reasons they don't. Your Contrarian POV™ is built on research that identifies which specific trigger is most dominant for your buyer and which hesitation is keeping them stuck. One big idea speaks to all of it simultaneously."}
            </p>
          </div>
        </div>

        <div className="brt">
          {BRANDS.map((b) => (
            <div className="brt__co" key={b.name}>
              <div className="brt__name">
                <span className="brt__brand">{b.name}</span>
                <span className="brt__sub">{b.sub}</span>
              </div>
              <div className="brt__box brt__box--blue">
                <p className="brt__quote">{b.blue.quote}</p>
                <p className="brt__note">{b.blue.note}</p>
              </div>
              <div className="brt__box brt__box--pink">
                <p className="brt__quote">{b.pink.quote}</p>
                <p className="brt__note">{b.pink.note}</p>
              </div>
              <div className="brt__box brt__box--peach">
                {b.peach.map((l) => (
                  <p
                    className={`brt__peach-line${l.bold ? ' brt__peach-line--bold' : ''}`}
                    key={l.text}
                  >
                    {l.text}
                  </p>
                ))}
              </div>
            </div>
          ))}

          <div className="brt__foot">
            <p className="brt__foot-head">What they all did differently</p>
            <p className="brt__foot-text">
              {"They didn't compete on features. They challenged the category. Price stopped being the comparison. None of them were the cheapest. All of them became the only obvious choice."}
            </p>
          </div>
        </div>

        <h2 className="a12__closing">
          {'When your Contrarian POV™ is doing its job, the question stops being "why should I pick you over them" and starts being "why would I pick anyone else."'}
        </h2>
      </section>

      {/* ---------- Your Turn CTA (case-study language) ---------- */}
      <section className="a12__cta">
        <img
          className="a12__turn"
          src="/assets/your-turn-doodle-navy.png"
          alt=""
          aria-hidden="true"
        />
        <div className="a12__cta-frame">
          <div className="a12__cta-card">
            <h2 className="a12__cta-head">
              {'Bring your '}
              <HighlightSweep tone="navy">
                differentiation forward
              </HighlightSweep>
              {" so buying decisions aren't left at the mercy of your competitor's pricing charts!"}
            </h2>
            <img
              className="a12__cta-arrow"
              src="/assets/curve-white-arrow.png"
              alt=""
              aria-hidden="true"
            />
            <div className="a12__cta-row">
              <button type="button" className="q-btn" onClick={onContinue}>
                Continue to next question
              </button>
            </div>
          </div>
          <div className="a12__footer" aria-hidden="true">
            <div className="a12__footer-hint" />
            <div className="a12__footer-cell">
              <img src="/assets/nomads-icon.png" alt="" />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
