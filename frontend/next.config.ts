import { existsSync } from 'fs';
import { resolve } from 'path';
import dotenv from 'dotenv';
import type { NextConfig } from 'next';

const root = process.cwd();
const envFile = resolve(root, '.env');
const localEnvFile = resolve(root, 'local.env');
// Anche `npm run dev` precarica env via scripts/run-dev.cjs (.env → local.env). Qui serve per `next build` / `next start` senza quello script.
// Produzione: tipicamente solo .env. Locale: .env + opzionale local.env (override).
if (existsSync(envFile)) {
  dotenv.config({ path: envFile });
}
if (existsSync(localEnvFile)) {
  dotenv.config({ path: localEnvFile, override: true });
}

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
