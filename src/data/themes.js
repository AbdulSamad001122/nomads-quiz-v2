/**
 * Quiz template themes.
 * Each theme maps to CSS custom properties consumed by QuizScreen.css.
 * Adding a new template (maroon/green) = adding one object here.
 */

export const blueTheme = {
  name: 'blue',
  /* Left panel */
  leftBgImage: '/assets/blue-bg.webp',
  questionText: '#ffffff',
  stepBadgeBg: '#f2e6d8', /* warm cream circle behind the step number */
  stepBadgeText: '#152638',
  labelBg: '#f2e6d8', /* mono label strip under the step number */
  labelText: '#152638',
  /* Right panel */
  rightBg: '#e4fbff',
  backText: '#152638',
  /* Option cards */
  optionBg: '#ffffff',
  optionText: '#152638',
  optionNumberBg: '#152638',
  optionNumberText: '#ffffff',
  optionSelectedBg: '#152638',
  optionSelectedText: '#ffffff',
  mediaBg: '#ffffff', /* icon/gif tile body (unselected) */
  mediaSelectedBg: '#e4fbff', /* icon/gif tile body when selected */
  /* Progress */
  progressTrack: '#9ba8b3',
  progressFill: '#152638',
  progressLabel: '#152638',
};

export const greenTheme = {
  name: 'green',
  /* Left panel */
  leftBgImage: '/assets/green-bg.webp',
  questionText: '#ffffff',
  stepBadgeBg: '#f2e6d8', /* warm cream circle behind the step number */
  stepBadgeText: '#152638',
  labelBg: '#f2e6d8', /* mono label strip under the step number */
  labelText: '#152638',
  /* Right panel */
  rightBg: '#ffffff',
  backText: '#5d1b4e', /* plum accent, per the green reference */
  /* Option cards — pale ice fill on the white panel */
  optionBg: '#e4fbff',
  optionText: '#152638',
  optionNumberBg: '#152638',
  optionNumberText: '#ffffff',
  optionSelectedBg: '#152638',
  optionSelectedText: '#ffffff',
  mediaBg: '#ffffff', /* icon/gif tile body (unselected) */
  mediaSelectedBg: '#e4fbff', /* icon/gif tile body when selected */
  /* Progress */
  progressTrack: '#9ba8b3',
  progressFill: '#152638',
  progressLabel: '#152638',
};

export const maroonTheme = {
  name: 'maroon',
  /* Left panel */
  leftBgImage: '/assets/maroon-bg.webp',
  questionText: '#f4ede6',
  stepBadgeBg: '#5d1b4e', /* plum circle behind the step number */
  stepBadgeText: '#ffffff',
  labelBg: '#f4ede6', /* mono label strip under the step number */
  labelText: '#152638',
  /* Right panel */
  rightBg: '#f2e5f6',
  backText: '#5d1b4e',
  /* Option cards — white with plum text; plum fill when selected */
  optionBg: '#ffffff',
  optionText: '#5d1b4e',
  optionNumberBg: '#5d1b4e',
  optionNumberText: '#ffffff',
  optionSelectedBg: '#5d1b4e',
  optionSelectedText: '#ffffff',
  mediaBg: '#ffffff', /* icon/gif tile body (unselected) */
  mediaSelectedBg: '#f2e5f6', /* icon/gif tile body when selected */
  /* Progress */
  progressTrack: '#c3a6bf',
  progressFill: '#5d1b4e',
  progressLabel: '#5d1b4e',
};

export const themes = {
  blue: blueTheme,
  green: greenTheme,
  maroon: maroonTheme,
};
