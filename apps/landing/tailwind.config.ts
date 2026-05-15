import type { Config } from 'tailwindcss';
import forms from '@tailwindcss/forms';
import typography from '@tailwindcss/typography';
import animate from 'tailwindcss-animate';
import { okilChaiPreset } from '@repo/design-tokens/tailwind';

const config: Config = {
  presets: [okilChaiPreset],
  content: [
    './src/**/*.{ts,tsx}',
    '../../packages/ui/src/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        // Use CSS variables injected by next/font/google so fonts are
        // served from the same origin (no external Google Fonts round-trip).
        heading: ['var(--font-heading)', 'Georgia', 'serif'],
        sans:    ['var(--font-body)', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [forms, typography, animate],
};

export default config;
