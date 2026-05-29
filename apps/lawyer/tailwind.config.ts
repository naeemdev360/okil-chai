import type { Config } from 'tailwindcss';
import forms from '@tailwindcss/forms';
import animate from 'tailwindcss-animate';
import { okilChaiPreset } from '@repo/design-tokens/tailwind';

const config: Config = {
  presets: [okilChaiPreset],
  content: [
    './index.html',
    './src/**/*.{ts,tsx}',
    '../../packages/ui/src/**/*.{ts,tsx}',
  ],
  plugins: [forms, animate],
};

export default config;
