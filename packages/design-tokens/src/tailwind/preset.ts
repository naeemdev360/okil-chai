import type { Config } from 'tailwindcss';
import {
  colors,
  fontFamily,
  boxShadow,
  borderRadius,
  transitionDuration,
  transitionTimingFunction,
} from '../tokens';

export const okilChaiPreset: Partial<Config> = {
  theme: {
    colors: {
      transparent: 'transparent',
      current: 'currentColor',
      white: '#FFFFFF',
      black: '#000000',
      ...colors,
    },
    extend: {
      fontFamily: {
        sans:    [...fontFamily.sans],
        heading: [...fontFamily.heading],
        mono:    [...fontFamily.mono],
      },
      opacity: {
        6:  '0.06',
        8:  '0.08',
        12: '0.12',
        15: '0.15',
        35: '0.35',
      },
      boxShadow,
      borderRadius,
      transitionDuration,
      transitionTimingFunction,
    },
  },
};
