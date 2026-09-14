import { useLayoutEffect, useRef, useState } from 'react';
import { PILLARS } from '../copy.js';
import PillarOneIntro from './PillarOneIntro.jsx';
import PillarOneUlcers from './PillarOneUlcers.jsx';
import PillarOneCurious from './PillarOneCurious.jsx';
import PillarOneSamar from './PillarOneSamar.jsx';
import PillarOnePyramid from './PillarOnePyramid.jsx';
import PillarOneFlow from './PillarOneFlow.jsx';
import PillarOneIsolation from './PillarOneIsolation.jsx';
import PillarOneSituations from './PillarOneSituations.jsx';
import PillarOneSituation3 from './PillarOneSituation3.jsx';
import PillarOnePredictable from './PillarOnePredictable.jsx';
import PillarTwoIntro from './PillarTwoIntro.jsx';
import PillarTwoBlending from './PillarTwoBlending.jsx';
import PillarTwoProof from './PillarTwoProof.jsx';
import PillarTwoLoops from './PillarTwoLoops.jsx';
import PillarTwoWorkshop from './PillarTwoWorkshop.jsx';
import PillarFourIntro from './PillarFourIntro.jsx';
import PillarFourTable from './PillarFourTable.jsx';
import PillarFourChris from './PillarFourChris.jsx';
import PillarFourClosing from './PillarFourClosing.jsx';
import './PillarsAccordion.css';

/**
 * Section — the four-pillar accordion. Each bar toggles open; the pillar
 * content sections (doc rows 6–9) mount inside the panels once designed —
 * pass them via the PANELS map below.
 */
const PANELS = {
  '01': (
    <>
      <PillarOneIntro />
      <PillarOneUlcers />
      <PillarOneCurious />
      <PillarOneSamar />
      <PillarOnePyramid />
      <PillarOneFlow />
      <PillarOneIsolation />
      <PillarOneSituations />
      <PillarOneSituation3 />
      <PillarOnePredictable />
    </>
  ),
  '02': (
    <>
      <PillarTwoIntro />
      <PillarTwoBlending />
      <PillarTwoProof />
      <PillarTwoLoops />
      <PillarTwoWorkshop />
    </>
  ),
  '04': (
    <>
      <PillarFourIntro />
      <PillarFourTable />
      <PillarFourChris />
      <PillarFourClosing />
    </>
  ),
};

export default function PillarsAccordion() {
  const [open, setOpen] = useState(null);

  // The open panel runs to ~11,000px. Switching pillars collapses all of that
  // from *above* the bar you tapped, and the browser holds scrollY where it
  // was — so you land thousands of px deeper into the new pillar. Pin the
  // tapped bar to the same viewport position it had before the toggle.
  const pinned = useRef(null);

  useLayoutEffect(() => {
    const p = pinned.current;
    if (!p) return;
    pinned.current = null;
    const delta = p.el.getBoundingClientRect().top - p.top;
    if (delta) window.scrollBy(0, delta);
  }, [open]);

  const toggle = (event, num, isOpen) => {
    const el = event.currentTarget;
    pinned.current = { el, top: el.getBoundingClientRect().top };
    setOpen(isOpen ? null : num);
  };

  return (
    <section className="rpl">
      <div className="rpl__inner">
        <img className="rpl__doodle" src="/assets/results-this-way.png" alt="" aria-hidden="true" />

        <h2 className="rpl__headline">{PILLARS.headline}</h2>
        <p className="rpl__sub">{PILLARS.sub}</p>

        <div className="rpl__list">
        {PILLARS.items.map((p) => {
          const isOpen = open === p.num;
          return (
            <div key={p.num} className={`rpl__item rpl__item--${p.variant}`}>
              <button
                type="button"
                className="rpl__bar"
                aria-expanded={isOpen}
                onClick={(e) => toggle(e, p.num, isOpen)}
              >
                <span className="rpl__num">{p.num}</span>
                <span className="rpl__labels">
                  <span className="rpl__title">{p.title}</span>
                  <span className="rpl__name">{p.name}</span>
                </span>
                <svg
                  className={`rpl__chev${isOpen ? ' rpl__chev--open' : ''}`}
                  viewBox="0 0 20 14"
                  aria-hidden="true"
                >
                  <path d="M2 2 L10 12 L18 2 Z" fill="currentColor" />
                </svg>
              </button>
              {isOpen && PANELS[p.num] && <div className="rpl__panel">{PANELS[p.num]}</div>}
            </div>
          );
        })}
        </div>
      </div>
    </section>
  );
}
