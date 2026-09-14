import { CRPS_CTA } from '../copy.js';
import { ga } from '../../analytics/ga.js';
import './CrpsCalculatorCta.css';

/**
 * Section — CRPS calculator CTA: cream card on the navy texture with the
 * laptop/tablet mockup (doodle baked into the asset), headline, pink CTA
 * button and supporting lines.
 */
export default function CrpsCalculatorCta() {
  return (
    <section className="rcta">
      <div className="rcta__card">
        <div className="rcta__media">
          {/* Quiz.gif (37MB) served as a muted looping video — same visual,
              ~2MB. Poster is the first frame. */}
          <video
            className="rcta__video"
            autoPlay
            muted
            loop
            playsInline
            poster="/assets/results-crps-quiz-poster.webp"
            aria-label="Revenue Per Visitor calculator on laptop and tablet"
            width="1400"
            height="929"
          >
            <source src="/assets/results-crps-quiz.webm" type="video/webm" />
            <source src="/assets/results-crps-quiz.mp4" type="video/mp4" />
          </video>
        </div>
        <div className="rcta__content">
          <h2 className="rcta__headline">{CRPS_CTA.headlineLines.join(' ')}</h2>
          {/* TODO: real CRPS calculator URL when provided */}
          <a className="rcta__btn" href="#" onClick={() => ga.ctaClick('crps_calculator')}>
            {CRPS_CTA.button}
          </a>
          <p className="rcta__sub">{CRPS_CTA.subLines.join(' ')}</p>
        </div>
      </div>
    </section>
  );
}
