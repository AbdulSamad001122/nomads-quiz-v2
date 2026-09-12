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
          <img src="/assets/results-crps-mockup.webp" alt="Revenue Per Visitor calculator on laptop and tablet" />
        </div>
        <div className="rcta__content">
          <h2 className="rcta__headline">
            {CRPS_CTA.headlineLines[0]}
            <br /> {CRPS_CTA.headlineLines[1]}
          </h2>
          {/* TODO: real CRPS calculator URL when provided */}
          <a className="rcta__btn" href="#" onClick={() => ga.ctaClick('crps_calculator')}>
            {CRPS_CTA.button}
          </a>
          <p className="rcta__sub">
            {CRPS_CTA.subLines[0]}
            <br /> {CRPS_CTA.subLines[1]}
          </p>
        </div>
      </div>
    </section>
  );
}
