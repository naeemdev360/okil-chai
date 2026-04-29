import type { UserConfig } from 'vitest/config';

export const baseVitestConfig = {
  test: {
    globals: true,
    environment: 'jsdom',
    coverage: {
      provider: 'v8',
      // CLAUDE.md §7: 80% minimum coverage on services
      thresholds: {
        lines: 80,
        functions: 80,
        branches: 75,
        statements: 80,
      },
      exclude: [
        '**/node_modules/**',
        '**/dist/**',
        '**/*.config.*',
        '**/*.d.ts',
        '**/index.ts',
      ],
    },
  },
} satisfies UserConfig;
