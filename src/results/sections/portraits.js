import { LARA_TITLE, DAVID_TITLE } from '../copy.js';

/**
 * TitledPortrait presets. `inset` = where the baked name art's first letter
 * starts, as a % of the image width (measured on the asset), so the title
 * lines up under the name.
 */
export const LARA_PORTRAIT = {
  src: '/assets/results-lara.webp',
  alt: 'Lara Acosta',
  width: 839,
  height: 976,
  title: LARA_TITLE,
  inset: '5.13%', // "ACOSTA" starts 43px into the 839px art
};

export const DAVID_PORTRAIT = {
  src: '/assets/results-david.webp',
  alt: 'David Ledgerwood',
  width: 876,
  height: 1011,
  title: DAVID_TITLE,
  inset: '6.96%', // "DAVID" starts 61px into the 876px art
};
