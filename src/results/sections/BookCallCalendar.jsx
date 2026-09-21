import TidyCalEmbed from './TidyCalEmbed.jsx';
import './BookCallCalendar.css';

/**
 * Standalone booking-calendar band (user, Sep 21) — the live TidyCal widget
 * on the maroon-crumple texture, its own section after the Two Paths closer.
 * No height cap: the widget renders at its natural size (the earlier 640px
 * cap put a scrollbar inside the card, which read badly).
 */
export default function BookCallCalendar() {
  return (
    <section className="rbc">
      <div className="rbc__inner">
        <TidyCalEmbed />
      </div>
    </section>
  );
}
