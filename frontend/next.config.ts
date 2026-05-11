import type { NextConfig } from 'next';

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
