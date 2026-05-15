import { okilChaiPreset } from '@repo/design-tokens/tailwind';
import forms from '@tailwindcss/forms';
import type { Config } from 'tailwindcss';

const config: Config = {
  presets: [okilChaiPreset],
  content: [
    './index.html',
    './src/**/*.{ts,tsx}',
    '../../packages/ui/src/**/*.{ts,tsx}',
  ],
  plugins: [forms],
};

export default config;
