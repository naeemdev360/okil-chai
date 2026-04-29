import type { Config } from 'tailwindcss';
import forms from '@tailwindcss/forms';
import { okilChaiPreset } from '@okil-chai/design-tokens/tailwind';

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
