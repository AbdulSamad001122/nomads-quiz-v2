import { BEYOND } from '../copy.js';
import './BeyondFourteenDays.css';

/**
 * Section — "Your Revenue per Visitor™ beyond the first 14-day window".
 * Dark keyline banner (brush-script R, down-arrows doodle) over an ice-blue
 * body: divider rule with the Nomads compass, intro, big question, plum tape
 * chip, closing lines.
 */
export default function BeyondFourteenDays() {
  const [l1, l2, l3] = BEYOND.bannerLines;
  // Brush-script capital R on "Revenue" (line 1), stone accent span (line 3)
  const [beforeR, afterR] = l1.split(/R(?=evenue)/);
  const accentStart = l3.indexOf(BEYOND.bannerAccent);
  const l3Before = l3.slice(0, accentStart);

  const [i1, i2] = splitAfter(BEYOND.intro, BEYOND.introBreakAfter);

  return (
    <section className="rb" id="beyond-14-days">
      <div className="rb__banner">
        <div className="rb__keyline" aria-hidden="true" />
        <img
          className="rb__arrows"
          src="/assets/results-down-arrows.png"
          alt=""
          aria-hidden="true"
        />
        <h2 className="rb__headline">
          {beforeR}
          <span className="rb__brush-r">R</span>
          {afterR}
          <br />
          {l2}
          <br />
          {l3Before}
          <span className="rb__accent">{BEYOND.bannerAccent}</span>
        </h2>
      </div>

      <div className="rb__body">
        <div className="rb__rule" aria-hidden="true">
          <span className="rb__rule-line" />
          <img className="rb__rule-icon" src="/assets/nomads-icon-dark.png" alt="" />
        </div>

        <p className="rb__intro">
          {i1}
          <br /> {i2}
        </p>

        <h3 className="rb__question">
          {BEYOND.questionLines[0]}
          <br /> {BEYOND.questionLines[1]}
        </h3>

        <p className="rb__tape">{BEYOND.tape}</p>

        <p className="rb__closing">
          {BEYOND.closingLines[0]}
          <br /> {BEYOND.closingLines[1]}
        </p>
      </div>
    </section>
  );
}

function splitAfter(text, marker) {
  const idx = text.indexOf(marker) + marker.length;
  return [text.slice(0, idx), text.slice(idx).trimStart()];
}
