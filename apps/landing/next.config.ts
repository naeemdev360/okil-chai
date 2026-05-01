import type { NextConfig } from 'next';
import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin('./src/i18n/request.ts');

const nextConfig: NextConfig = {
  experimental: {
    // typedRoutes requires all route files to exist; re-enable once all app routes are scaffolded
    typedRoutes: false,
  },
};

export default withNextIntl(nextConfig);
