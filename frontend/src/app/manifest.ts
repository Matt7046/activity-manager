import type { MetadataRoute } from 'next';

/** Aiuta Chrome / PWA e riduce ambiguità su quale sia l’icona “ufficiale” del sito. */
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Activity Manager',
    short_name: 'Activity',
    description: 'Activity Manager',
    start_url: '/',
    display: 'standalone',
    background_color: '#0b1220',
    theme_color: '#404040',
    icons: [
      {
        src: '/logo-colorsdev.ico',
        sizes: '48x48',
        type: 'image/x-icon',
        purpose: 'any',
      },
      {
        src: '/logo-colorsdev.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'any',
      },
      {
        src: '/logo-colorsdev.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'maskable',
      },
    ],
  };
}
