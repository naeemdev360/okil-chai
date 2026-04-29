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
      boxShadow,
      borderRadius,
      transitionDuration,
      transitionTimingFunction,
    },
  },
};
