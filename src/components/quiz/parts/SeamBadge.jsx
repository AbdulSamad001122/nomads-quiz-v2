/**
 * "Gamified Customer Journey" circle doodle on a white disc,
 * straddling the seam between the two panels.
 */
export default function SeamBadge({ src = '/assets/circle-doodle.png' }) {
  return (
    <div className="seam-badge" aria-hidden="true">
      <img src={src} alt="" />
    </div>
  );
}
