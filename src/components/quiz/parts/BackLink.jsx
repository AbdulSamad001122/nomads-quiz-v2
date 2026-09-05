/** "< Back" navigation link, top of the answer panel. */
export default function BackLink({ onBack }) {
  return (
    <button type="button" className="back-link" onClick={onBack}>
      <span className="back-link__chevron" aria-hidden="true">
        &#8249;
      </span>
      Back
    </button>
  );
}
