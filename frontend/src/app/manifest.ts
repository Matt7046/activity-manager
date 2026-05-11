import type { MetadataRoute } from 'next';

const site =
  typeof process.env.NEXT_PUBLIC_SITE_URL === 'string' && process.env.NEXT_PUBLIC_SITE_URL.length > 0
    ? process.env.NEXT_PUBLIC_SITE_URL.replace(/\/$/, '')
    : 'https://activity-manager.colorsdev.tech';

/** Manifest canonico per PWA / PWABuilder (icone PNG 192+512, niente .ico). */
export default function manifest(): MetadataRoute.Manifest {
  return {
    id: `${site}/`,
    name: 'Activity Manager',
    short_name: 'Activity',
    description: 'Gestione attività e famiglia — Activity Manager.',
    lang: 'it',
    dir: 'ltr',
    start_url: '/',
    scope: '/',
    display: 'standalone',
    display_override: ['standalone', 'minimal-ui'],
    orientation: 'any',
    background_color: '#0b1220',
    theme_color: '#0b1220',
    categories: ['productivity', 'lifestyle'],
    prefer_related_applications: false,
    icons: [
      {
        src: '/pwa/icon-192.png',
        sizes: '192x192',
        type: 'image/png',
        purpose: 'any',
      },
      {
        src: '/pwa/icon-512.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'any',
      },
      {
        src: '/pwa/icon-maskable-512.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'maskable',
      },
    ],
    screenshots: [
      {
        src: '/pwa/screenshot-wide.png',
        sizes: '1280x720',
        type: 'image/png',
        form_factor: 'wide',
      },
      {
        src: '/pwa/screenshot-narrow.png',
        sizes: '390x844',
        type: 'image/png',
        form_factor: 'narrow',
      },
    ],
    shortcuts: [
      {
        name: 'Home',
        short_name: 'Home',
        description: 'Schermata principale',
        url: '/home',
        icons: [{ src: '/pwa/icon-192.png', sizes: '192x192', type: 'image/png' }],
      },
    ],
  };
}
