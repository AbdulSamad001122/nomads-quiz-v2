import QuestionPanel from './parts/QuestionPanel.jsx';
import AnswerPanel from './parts/AnswerPanel.jsx';
import './QuizScreen.css';

/**
 * The split-screen quiz template.
 * Theme-driven: every color/surface comes from the `theme` object
 * (src/data/themes.js) via CSS custom properties, so new templates
 * (maroon, green…) are pure theme additions — no layout duplication.
 */
export default function QuizScreen({
  theme,
  qid,
  stepNumber,
  label,
  question,
  subline,
  options,
  selectedId,
  selectedIds,
  onSelect,
  onBack,
  progressPercent,
  variant = 'list',
  ...answerExtras
}) {
  const themeVars = {
    '--t-left-bg-image': `url(${theme.leftBgImage})`,
    '--t-question-text': theme.questionText,
    '--t-label-bg': theme.labelBg,
    '--t-label-text': theme.labelText,
    '--t-step-badge-bg': theme.stepBadgeBg,
    '--t-step-badge-text': theme.stepBadgeText,
    '--t-right-bg': theme.rightBg,
    '--t-back-text': theme.backText,
    '--t-option-bg': theme.optionBg,
    '--t-option-text': theme.optionText,
    '--t-option-number-bg': theme.optionNumberBg,
    '--t-option-number-text': theme.optionNumberText,
    '--t-option-selected-bg': theme.optionSelectedBg,
    '--t-option-selected-text': theme.optionSelectedText,
    '--t-media-bg': theme.mediaBg,
    '--t-media-selected-bg': theme.mediaSelectedBg,
    '--t-progress-track': theme.progressTrack,
    '--t-progress-fill': theme.progressFill,
    '--t-progress-label': theme.progressLabel,
  };

  return (
    <div
      className={`quiz-screen quiz-screen--${theme.name} quiz-screen--variant-${variant}${qid ? ` quiz-q-${qid}` : ''}`}
      style={themeVars}
    >
      <QuestionPanel
        stepNumber={stepNumber}
        label={label}
        question={question}
        subline={subline}
        onBack={onBack}
      />
      <AnswerPanel
        options={options}
        selectedId={selectedId}
        selectedIds={selectedIds}
        onSelect={onSelect}
        onBack={onBack}
        progressPercent={progressPercent}
        variant={variant}
        {...answerExtras}
      />
    </div>
  );
}
