export const colors = {
  navy: {
    DEFAULT: '#0F1F3D',
    mid:     '#1B2A4A',
    light:   '#2A3F6B',
  },
  gold: {
    DEFAULT: '#C8A84B',
    light:   '#E8C96A',
    pale:    '#FDF6E3',
  },
  cream: '#FAF8F4',
  gray: {
    50:  '#F5F4F1',
    100: '#E8E6E0',
    200: '#D0CEC8',
    400: '#9B9890',
    600: '#5C5A55',
    800: '#2C2B28',
  },
  success:       '#1A6B4A',
  'success-bg':  '#E8F5EE',
  error:         '#B91C1C',
  'error-bg':    '#FEE2E2',
  warning:       '#D97706',
  'warning-bg':  '#FFFBEB',
} as const satisfies Record<string, string | Record<string, string>>;

export type Colors = typeof colors;
