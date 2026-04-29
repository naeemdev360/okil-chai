export const fontFamily = {
  sans:    ['DM Sans', 'system-ui', 'sans-serif'],
  heading: ['Playfair Display', 'Georgia', 'serif'],
  mono:    ['JetBrains Mono', 'monospace'],
} as const satisfies Record<string, readonly string[]>;

export type FontFamily = typeof fontFamily;
