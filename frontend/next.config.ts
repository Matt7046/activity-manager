
/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ['@mui/system', '@mui/material', '@mui/styled-engine'],
  modularizeImports: {
    '@mui/material': {
      transform: '@mui/material/{{member}}',
    },
    '@mui/icons-material': {
      transform: '@mui/icons-material/{{member}}',
    },
  },
  // Altre configurazioni...
};

export default nextConfig;
