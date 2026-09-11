import SeamBadge from './parts/SeamBadge.jsx';
import BackLink from './parts/BackLink.jsx';
import HighlightSweep, { sweepToneFor } from '../primitives/HighlightSweep.jsx';
import { ACCENT, CARD, CTA_TONE } from './CaseStudyGolfbays.jsx';
import './QuizScreen.css';
import './CaseStudyGolfbays.css';
import './CaseStudy97.css';

/**
 * Case study 5B — The 97% ("low-optin" route off Q5). Follows the 5B
 * reference for the designed sections and extends the 5A style system
 * for the rest:
 *   1. split hero (problem framing + script band | Case Study phone art)
 *   2. "But what happens When you don't?" + Mary intro
 *   3. After the Compounding RPV™ OS — 4 zigzag numbered cards
 *      (cards 01/04 show the doc screenshots inside the blank laptop)
 *   4. Samar Owais — dark band, Lara panel left, testimonial screenshot
 *   5. Audio-tech SaaS — light band, Lara panel right
 *   6. Eyeballs — infographic + the 3% / 97% / third-door blocks +
 *      Curious → Conversion journey chips
 *   7. Your Turn CTA (same structure as 5A)
 * Shares cs5a__* classes for the hero shell, chips and CTA.
 */
export default function CaseStudy97({ theme, onBack, onContinue }) {
  const themeVars = {
    '--t-left-bg-image': `url(${theme.leftBgImage})`,
    '--t-right-bg': theme.rightBg,
    '--t-back-text': theme.backText,
    '--cs-accent': ACCENT[theme.name] || ACCENT.maroon,
    '--cs-card': CARD[theme.name] || CARD.maroon,
    /* near-black ink for the numbered circles, per the 5B reference */
    '--cs-ink': theme.name === 'maroon' ? '#391129' : '#152638',
  };

  const bulletImg = (
    <img
      className="cs5a__bullet-arrow"
      src="/assets/arrow-white.png"
      alt=""
      aria-hidden="true"
    />
  );

  return (
    <div className={`cs5a cs5b quiz-screen--${theme.name}`} style={themeVars}>
      {/* ============ 1. HERO — split ============ */}
      <section className="cs5a__hero">
        <div className="cs5a__left">
          <SeamBadge src="/assets/circle-doodle-2.png" />
          <div className="question-panel__top">
            <div className="question-panel__logo-box">
              <img src="/assets/nomads-logo-dark.png" alt="Nomads" />
            </div>
            <span className="question-panel__top-line" aria-hidden="true" />
          </div>

          <div className="cs5a__frame">
            <div className="cs5a__left-body">
              <div className="cs5a__mobile-back">
                <BackLink onBack={onBack} />
              </div>

              <p className="cs5b__lead">
                {'If your business is doing less than $10M/year, spending on visibility to stay '}
                <HighlightSweep tone={sweepToneFor(theme.name)}>
                  {'"top of mind"'}
                </HighlightSweep>
                {" while your opt-in rate stays flat is a strategy borrowed from bigger players with deeper pockets. It's not the best use of your marketing budget."}
              </p>

              <span className="cs5a__chip cs5b__problem-chip">The problem</span>

              <p className="cs5b__hero-para">
                {"Many of your potential buyers are already circling your ecosystem. They've seen your ads or content a few times, but they're still blurry on what you do, why it's different, and why it matters right now."}
              </p>

              <p className="cs5b__hero-para">
                {"You're targeting Alex who doesn't believe he needs you and Sam who's actively looking for you exactly the same way."}
              </p>
            </div>

            <div className="cs5a__script-band">your traffic is worth more.</div>
          </div>
        </div>

        <div className="cs5a__right">
          <div className="answer-panel__topbar">
            <BackLink onBack={onBack} />
            <span className="answer-panel__topbar-line" aria-hidden="true" />
            <img
              className="answer-panel__topbar-icon"
              src="/assets/small-nomads-icon.png"
              alt=""
              aria-hidden="true"
            />
          </div>
          <img
            className="cs5a__hero-img"
            src="/assets/cs-5a-golfbays.webp"
            alt="Website preview on a phone under the Case Study script"
          />
        </div>
      </section>

      {/* ============ 2. BUT WHAT HAPPENS ============ */}
      <section className="cs5b__happens">
        <h2 className="cs5b__happens-head">
          {'But what happens'}
          <span className="cs5b__happens-line">
            <span className="cs5b__script-cap" aria-hidden="true">
              W
            </span>
            <span className="cs5b__cap-rest">hen you don't?</span>
          </span>
        </h2>
        <p className="cs5b__happens-para">
          {'Mary an executive coach pulling 60,000+ monthly LinkedIn views had fewer than 500 new email subscribers a month. Every sale for her $5,000 offer depended on lengthy back-and-forth DMs. The moment she stepped back, revenue stepped back with her.'}
        </p>
      </section>

      {/* ============ 3. AFTER THE OS — zigzag cards ============ */}
      <section className="cs5b__after">
        <h2 className="cs5b__after-head">After the Compounding RPV™ OS:</h2>

        <div className="cs5b__cards">
          <div className="cs5b__card cs5b__card--left">
            <span className="cs5b__num" aria-hidden="true">
              01
            </span>
            <span className="cs5a__chip">Quiz opt-in</span>
            <p className="cs5b__card-text">
              {'A quiz converting existing traffic into email subscribers at a '}
              <strong>73–79% opt-in rate</strong>
            </p>
            <img
              className="cs5b__proof cs5b__proof--tablet"
              src="/assets/cs-5b-tablet.webp"
              alt="Quiz platform stats: 1.9K started, 1.4K finished, 1,902 visitors"
            />
          </div>

          <div className="cs5b__card cs5b__card--right">
            <span className="cs5b__num" aria-hidden="true">
              02
            </span>
            <span className="cs5a__chip">Entry point offer</span>
            <p className="cs5b__card-text">
              {'Her membership repositioned as a '}
              <strong>$500/quarter entry point</strong>
              {' into her '}
              <strong>$5,000 offer</strong>
            </p>
          </div>

          <div className="cs5b__card cs5b__card--left">
            <span className="cs5b__num" aria-hidden="true">
              03
            </span>
            <span className="cs5a__chip">Sales without chasing</span>
            <p className="cs5b__card-text">
              {'People were buying within '}
              <strong>7 days</strong>
              {' of taking the quiz without chasing via calls or DMs'}
            </p>
          </div>

          <div className="cs5b__card cs5b__card--right">
            <span className="cs5b__num" aria-hidden="true">
              04
            </span>
            <span className="cs5a__chip">Revenue jump</span>
            <p className="cs5b__card-text">
              {'Revenue moved from '}
              <strong>$14,000 → $51,000/month</strong>
              {' from the same organic traffic'}
            </p>
            <img
              className="cs5b__proof"
              src="/assets/cs-5b-offers-laptop.webp"
              alt="Offers sold: 29, up 61%"
            />
          </div>
        </div>
      </section>

      {/* ============ 4. SAMAR OWAIS — dark band ============ */}
      <section className="cs5b__samar">
        <div className="cs5b__photo-panel cs5b__photo-panel--dark">
          <img src="/assets/cs-5b-samar.webp" alt="" aria-hidden="true" />
        </div>
        <div className="cs5b__samar-content">
          <p className="cs5b__samar-para">
            {"A respected name in SaaS and e-commerce email watched her list grow in three days by what had previously taken six months, after launching the Champion's Challenge™ quiz."}
          </p>
          <p className="cs5b__samar-para">
            <strong>7,706% list growth,</strong>
            {' which directly fuelled her EEBC course sales.'}
          </p>

          <div className="cs5b__testi">
            <div className="cs5b__testi-head">
              <img
                className="cs5b__testi-avatar"
                src="/assets/testi-auroriele.webp"
                alt=""
                aria-hidden="true"
              />
              <div>
                <p className="cs5b__testi-name">Auroriele Hans</p>
                <p className="cs5b__testi-role">Customer Messaging Strategist</p>
              </div>
            </div>
            <p className="cs5b__testi-quote">
              {"Your quiz is so hard, Samar Owais! So glad I bought the eCommerce Email Bootcamp after taking it, though. It really helped me think more like a strategist. Can't wait to tune into this."}
            </p>
          </div>
        </div>
      </section>

      {/* ============ 5. AUDIO-TECH SAAS — light band ============ */}
      <section className="cs5b__audio">
        <div className="cs5b__audio-content">
          <p className="cs5b__audio-para">
            <strong>An audio-tech SaaS</strong>
            {' for gamers was spending heavily on influencer marketing '}
            <strong>140,000 monthly visits</strong>
            {" landing on a website that couldn't answer the one question every gamer was quietly asking:"}
          </p>
          <p className="cs5b__quote">
            {'"If this is similar to Dolby or Sony, why would I switch?"'}
          </p>
          <p className="cs5b__audio-para">
            {"The product was free. But free doesn't convert when visitors haven't yet seen why what they have isn't enough."}
          </p>
          <p className="cs5b__audio-lead">The Disguised Demo™ quiz :</p>
          <div className="cs5b__audio-bullets">
            <div className="cs5b__bullet">
              {bulletImg}
              <p>Educated them on the difference</p>
            </div>
            <div className="cs5b__bullet">
              {bulletImg}
              <p>Challenged their current setup</p>
            </div>
            <div className="cs5b__bullet">
              {bulletImg}
              <p>Walked them through the features as a live demo</p>
            </div>
            <div className="cs5b__bullet">
              {bulletImg}
              <p>
                Personalised to whether they were an immersive gamer or a
                competitive one
              </p>
            </div>
          </div>
          <p className="cs5b__audio-closer">
            The founder estimates this will save $2M/year in ad spend.
          </p>
        </div>
        <div className="cs5b__photo-panel cs5b__photo-panel--dark">
          <img src="/assets/cs-5b-innit-audio.webp" alt="" aria-hidden="true" />
        </div>
      </section>

      {/* ============ 6. EYEBALLS ============ */}
      <section className="cs5b__eyes">
        <h2 className="cs5b__eyes-head">
          {"If you're "}
          <HighlightSweep tone={theme.name === 'maroon' ? 'plum' : 'navy'}>
            already spending
          </HighlightSweep>
          <span className="cs5b__eyes-line">to get eyeballs</span>
        </h2>
        <p className="cs5b__eyes-sub">
          <strong>the question worth sitting with is:</strong>
          {" is each of those eyeballs experiencing something that helps them see why this, why now, and why this over what they're already doing?"}
        </p>

      </section>

      {/* full-bleed split — infographic on dark texture | blocks on lavender */}
      <section className="cs5b__eyes-split">
        <div className="cs5b__eyes-left">
          <img
            className="cs5b__eyes-img"
            src="/assets/pie-chart-doodle.png"
            alt="Out of 100 people, 3% are ready to buy and 97% don't see the problem yet"
          />
        </div>

        <div className="cs5b__eyes-right">
          <div className="cs5b__pool">
            <div className="cs5b__pool-block">
              <p className="cs5b__pool-note">
                Most businesses are fishing in the same crowded 3% pool. The
                ones already convinced they have a problem, already comparing
                solutions, already halfway to a decision. That pool is only 3%
                of your total buyers.
              </p>
            </div>

            <div className="cs5b__pool-block">
              <p className="cs5b__pool-lead">
                {"The other 97% aren't unqualified. They just don't believe they have a problem yet."}
              </p>
              <div className="cs5b__bullet">
                {bulletImg}
                <p>{"They're not comparing"}</p>
              </div>
              <div className="cs5b__bullet">
                {bulletImg}
                <p>{"They're not even considering"}</p>
              </div>
              <p className="cs5b__pool-note">
                {"And a product page won't change that. It'll just confirm what they already thought "}
                <strong>{'"not for me."'}</strong>
              </p>
            </div>

            <div className="cs5b__pool-block">
              <span className="cs5b__pool-chip cs5b__pool-chip--ink">
                But when you open a third door…
              </span>
              <p className="cs5b__pool-note">
                {"One that challenges their current thinking, surfaces the gap they hadn't named, and educates them without pushing a product."}
              </p>
              <p className="cs5b__pool-strong">
                A chunk of that 97% starts considering your solution.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="cs5b__journey-wrap">
        <div className="cs5b__journey" aria-label="Curious to Conversion journey">
          <span className="cs5b__journey-chip">
            <img
              className="cs5b__journey-icon"
              src="/assets/icon-journey-bulb.png"
              alt=""
              aria-hidden="true"
            />
            Curious
          </span>
          <span className="cs5b__journey-arrow" aria-hidden="true">
            <img src="/assets/arrow-white.png" alt="" />
          </span>
          <span className="cs5b__journey-chip">
            <img
              className="cs5b__journey-icon"
              src="/assets/icon-journey-board.png"
              alt=""
              aria-hidden="true"
            />
            Consideration
          </span>
          <span className="cs5b__journey-arrow" aria-hidden="true">
            <img src="/assets/arrow-white.png" alt="" />
          </span>
          <span className="cs5b__journey-chip">
            <img
              className="cs5b__journey-icon"
              src="/assets/icon-journey-bubble.png"
              alt=""
              aria-hidden="true"
            />
            Conversation
          </span>
          <span className="cs5b__journey-arrow" aria-hidden="true">
            <img src="/assets/arrow-white.png" alt="" />
          </span>
          <span className="cs5b__journey-chip">
            <img
              className="cs5b__journey-icon"
              src="/assets/icon-journey-funnel.png"
              alt=""
              aria-hidden="true"
            />
            Conversion
          </span>
        </div>

        <div className="cs5b__journey-pool">
          <span className="cs5a__chip">{"That's the bigger pool."}</span>
          <p className="cs5b__cta-para">
            {"And that's exactly what the "}
            <strong>Compounding RPV™ diagnosis</strong>
            {' is about to show you: '}
            <strong>your revenue potential</strong>
            {" when you stop fishing in the 3% and open a door for the 97% who don't yet believe they need you."}
          </p>
        </div>
      </section>

      {/* ============ 7. YOUR TURN CTA (5A structure) ============ */}
      <section className="cs5a__cta">
        <img
          className="cs5a__turn"
          src="/assets/your-turn-doodle.png"
          alt=""
          aria-hidden="true"
        />

        <div className="cs5a__cta-frame">
          <div className="cs5a__cta-card">
            <p className="cs5b__jiffy">Coming up in a jiffy.</p>

            <h2 className="cs5a__cta-head">
              {'Want to see what it would take you to add an '}
              <HighlightSweep tone={CTA_TONE[theme.name] || 'plum'}>
                extra $125,000+
              </HighlightSweep>
              {' to your MRR with the traffic you already have?'}
            </h2>

            <img
              className="cs5a__cta-arrow"
              src="/assets/curve-white-arrow.png"
              alt=""
              aria-hidden="true"
            />

            <div className="cs5a__cta-row">
              <button
                type="button"
                className="q-btn cs5a__continue"
                onClick={onContinue}
              >
                Follow along
              </button>
            </div>
          </div>

          <div className="cs5a__footer" aria-hidden="true">
            <div className="cs5a__footer-hint" />
            <div className="cs5a__footer-cell">
              <img src="/assets/nomads-icon.png" alt="" />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
