import { createRequire } from 'node:module';
import type { NextConfig } from 'next';

// main → .env + local.env; production / FRONTEND_USE_LOCAL_ENV=0 → solo .env (vedi scripts/load-frontend-env.cjs)
const require = createRequire(import.meta.url);
require('./scripts/load-frontend-env.cjs').loadFrontendEnv(process.cwd());

const nextConfig: NextConfig = {
  transpilePackages: ['@mui/system', '@mui/material', '@mui/styled-engine'],
  modularizeImports: {
    '@mui/material': {
      transform: '@mui/material/{{member}}',
    },
    '@mui/icons-material': {
      transform: '@mui/icons-material/{{member}}',
    },
  },
  /** SW: cache controllata + scope massimo (aiuta tool tipo PWABuilder / installabilità). */
  headers: async () => [
    {
      source: '/sw.js',
      headers: [
        { key: 'Cache-Control', value: 'public, max-age=0, must-revalidate' },
        { key: 'Service-Worker-Allowed', value: '/' },
      ],
    },
  ],
};

export default nextConfig;
