import { useEffect, useRef, useState } from 'react';
import { DATA_NERDS } from '../copy.js';
import { emphasize } from '../emphasize.jsx';
import { ga } from '../../analytics/ga.js';
import './DataNerds.css';

const wait = (ms) => new Promise((r) => setTimeout(r, ms));

/**
 * "For the data nerds" — QC row 3 (Oct 2026), Alefiya's "Data Nerds
 * Calculator Peek" design: the section's own copy on the left, and a
 * looping sneak peek of the Compounding RPV™ OS calculator on the right — it
 * types a channel into the four fields, presses "Add this channel" and drops
 * the row into the channel ledger. The last column stays blurred and locked;
 * the most / least profitable pair is always visible. Renders for every taker
 * (its own section, outside the ad module). Reduced motion: the finished
 * ledger, no typing.
 */
export default function DataNerds() {
  const c = DATA_NERDS;
  const full = c.example.map((d) => ({ d, isNew: false }));
  // starts filled with the last example, as the design does
  const [fields, setFields] = useState(c.example[c.example.length - 1].slice(0, 4));
  const [active, setActive] = useState(-1);
  const [press, setPress] = useState(false);
  const [rows, setRows] = useState(full);
  const [tinted, setTinted] = useState(true);
  const winRef = useRef(null);

  useEffect(() => {
    if (window.matchMedia?.('(prefers-reduced-motion: reduce)').matches) return undefined;
    let alive = true;
    let visible = false;
    const io = new IntersectionObserver(([e]) => (visible = e.isIntersecting));
    if (winRef.current) io.observe(winRef.current);
    const until = async () => {
      while (alive && !visible) await wait(400);
    };
    const type = async (i, text) => {
      setActive(i);
      for (let n = 1; n <= text.length && alive; n += 1) {
        setFields((f) => f.map((v, k) => (k === i ? text.slice(0, n) : v)));
        await wait(30);
      }
      await wait(60);
      setActive(-1);
    };
    (async () => {
      await wait(6000);
      while (alive) {
        await until();
        setRows([]);
        setTinted(false);
        setFields(['', '', '', '']);
        await wait(500);
        for (const d of c.example) {
          if (!alive) return;
          setFields(['', '', '', '']);
          for (let i = 0; i < 4 && alive; i += 1) await type(i, d[i]);
          setPress(true);
          await wait(220);
          setPress(false);
          setRows((r) => [...r, { d, isNew: true }]);
          await wait(350);
        }
        setTinted(true);
        await wait(4500);
      }
    })();
    return () => {
      alive = false;
      io.disconnect();
    };
  }, [c.example]);

  // the row tints follow the design: least profitable red, most green
  const tint = (d) => (!tinted ? '' : d[1] === 'LinkedIn' ? ' rdn__tr--low' : d[1] === 'Newsletter' ? ' rdn__tr--top' : '');

  return (
    <section className="rdn">
      <div className="rdn__grid">
        <div className="rdn__copy">
          <span className="rdn__k">{c.title}</span>
          <h2 className="rdn__h2">{c.p1}</h2>
          <p className="rdn__p">{emphasize(c.p2, c.p2Bold)}</p>
          <div className="rdn__chips">
            {c.channels.map((ch) => (
              <span key={ch}>{ch}</span>
            ))}
            <span className="rdn__any">{c.chip}</span>
          </div>
        </div>

        <div className="rdn__peek">
          <div className="rdn__win" ref={winRef} role="img" aria-label={c.winLabel}>
            <div className="rdn__winbar">
              <i aria-hidden="true" />
              {c.winTitle}
            </div>
            <div className="rdn__wbody">
              <div className="rdn__wq">{c.winQuestion}</div>
              <div className="rdn__form">
                {c.fields.map((label, i) => (
                  <div className="rdn__f" key={label}>
                    <span className="rdn__flabel">{label}</span>
                    <div className={`rdn__box${active === i ? ' rdn__box--on' : ''}`}>{fields[i]}</div>
                  </div>
                ))}
                <span className={`rdn__add${press ? ' rdn__add--press' : ''}`}>{c.addButton}</span>
              </div>
              <div className="rdn__ledger">
                <h4 className="rdn__lh">{c.ledgerHead}</h4>
                <div className="rdn__tw">
                  <table>
                    <thead>
                      <tr>
                        {c.cols.map((h) => (
                          <th key={h}>{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {rows.map(({ d, isNew }) => (
                        <tr key={d[1]} className={`${isNew ? 'rdn__tr--new' : ''}${tint(d)}`}>
                          <td>{`${d[0]} · ${d[1]}`}</td>
                          <td>{d[2]}</td>
                          <td>{d[3]}</td>
                          <td className="rdn__rpv">{d[4]}</td>
                          <td className="rdn__lock">
                            <span>{d[5]}</span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
          <div className="rdn__verdict">
            <div className="rdn__vd rdn__vd--best">
              <span className="rdn__vt">{c.best.label}</span>
              <span className="rdn__vc">{c.best.channel}</span>
              <span className="rdn__vn">{c.best.rpv}</span>
            </div>
            <div className="rdn__vd rdn__vd--worst">
              <span className="rdn__vt">{c.worst.label}</span>
              <span className="rdn__vc">{c.worst.channel}</span>
              <span className="rdn__vn">{c.worst.rpv}</span>
            </div>
          </div>
          <p className="rdn__cap">{c.caption}</p>
        </div>
      </div>

      <div className="rdn__cta">
        <a
          className="rdn__btn"
          href={c.buttonHref}
          target="_blank"
          rel="noopener"
          onClick={() => ga.ctaClick('rpv_by_channel')}
        >
          {c.button}
        </a>
      </div>
    </section>
  );
}
