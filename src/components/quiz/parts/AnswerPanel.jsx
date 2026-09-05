import BackLink from './BackLink.jsx';
import OptionCard from './OptionCard.jsx';
import BinaryOptionCard from './BinaryOptionCard.jsx';
import MediaOptionCard from './MediaOptionCard.jsx';
import ProgressBar from './ProgressBar.jsx';

const LETTERS = ['A', 'B', 'C', 'D', 'E', 'F'];

const MANUAL_PLACEHOLDER = {
  number: 'Type the exact number — e.g. 12500',
  currency: 'Type the exact amount — e.g. 7500',
  percent: 'Type the exact percentage — e.g. 12.5',
  text: 'Type your answer here',
};

/**
 * Right panel: back link, answer options, progress bar.
 *
 * `variant` picks the option style:
 *  - 'list'   → numbered option cards (default)
 *  - 'binary' → Yes/No pills with letter badges + tick/cross icons
 *  - 'media'  → 2-column tile grid with icon/gif circles
 *  - 'text'   → free-text area (Q14)
 *
 * Selection: single via `selectedId`, or multi via `selectedIds` (array).
 * `manualOpen` reveals the exact-number input under the options;
 * `onContinue` renders the Continue button (multi/manual/text screens).
 */
export default function AnswerPanel({
  options,
  selectedId,
  selectedIds,
  onSelect,
  onBack,
  progressPercent,
  variant = 'list',
  manualOpen = false,
  manualType = 'number',
  manualValue = '',
  onManualChange,
  textValue = '',
  onTextChange,
  allowSkip = false,
  onSkip,
  onContinue,
  continueLabel = 'Continue →',
  continueDisabled = false,
}) {
  const isSelected = (id) =>
    selectedIds ? selectedIds.includes(id) : selectedId === id;

  return (
    <section className={`answer-panel answer-panel--${variant}`}>
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
      <div
        className={`answer-panel__options answer-panel__options--${variant}`}
      >
        {variant === 'binary' &&
          options.map((opt, i) => (
            <BinaryOptionCard
              key={opt.id}
              letter={LETTERS[i]}
              label={opt.label}
              icon={opt.icon}
              selected={isSelected(opt.id)}
              onSelect={() => onSelect(opt.id)}
            />
          ))}
        {variant === 'media' &&
          options.map((opt, i) => (
            <MediaOptionCard
              key={opt.id}
              number={String(i + 1).padStart(2, '0')}
              label={opt.label}
              media={opt.media}
              selected={isSelected(opt.id)}
              onSelect={() => onSelect(opt.id)}
            />
          ))}
        {variant === 'list' &&
          options.map((opt, i) => (
            <OptionCard
              key={opt.id}
              number={String(i + 1).padStart(2, '0')}
              label={opt.label}
              selected={isSelected(opt.id)}
              onSelect={() => onSelect(opt.id)}
            />
          ))}
        {variant === 'text' && (
          <textarea
            className="qa-textarea"
            value={textValue}
            onChange={(e) => onTextChange?.(e.target.value)}
            placeholder="Tell us in your own words…"
            rows={6}
          />
        )}

        {manualOpen ? (
          <div className="qa-manual">
            <span className="qa-manual__label">
              {manualType === 'text' ? 'Tell us more' : 'Your exact number'}
            </span>
            <input
              className="qa-manual__input"
              type="text"
              inputMode="decimal"
              value={manualValue}
              onChange={(e) => onManualChange?.(e.target.value)}
              placeholder={MANUAL_PLACEHOLDER[manualType] || MANUAL_PLACEHOLDER.number}
              autoFocus
            />
          </div>
        ) : null}

        {(onContinue || allowSkip) && (
          <div className="qa-actions">
            {onContinue ? (
              <button
                type="button"
                className="q-btn qa-continue"
                onClick={onContinue}
                disabled={continueDisabled}
              >
                {continueLabel}
              </button>
            ) : null}
            {allowSkip ? (
              <button type="button" className="qa-skip" onClick={onSkip}>
                Skip this question
              </button>
            ) : null}
          </div>
        )}
      </div>
      <ProgressBar percent={progressPercent} />
      <div className="answer-panel__mobile-footer" aria-hidden="true">
        <div className="answer-panel__mobile-hint">
          <span className="answer-panel__mobile-hint-text">
            Pick what fits best.
          </span>
          <img src="/assets/double-arrows-dark.png" alt="" />
        </div>
        <div className="answer-panel__mobile-cell">
          <img src="/assets/nomads-icon-dark.png" alt="" />
        </div>
      </div>
    </section>
  );
}
