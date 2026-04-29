import type { Config } from 'tailwindcss';
import forms from '@tailwindcss/forms';
import typography from '@tailwindcss/typography';
import { okilChaiPreset } from '@okil-chai/design-tokens/tailwind';

const config: Config = {
  presets: [okilChaiPreset],
  content: [
    './src/**/*.{ts,tsx}',
    '../../packages/ui/src/**/*.{ts,tsx}',
  ],
  plugins: [forms, typography],
};

export default config;
