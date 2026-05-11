import type { MetadataRoute } from 'next';

const site =
  typeof process.env.NEXT_PUBLIC_SITE_URL === 'string' && process.env.NEXT_PUBLIC_SITE_URL.length > 0
    ? process.env.NEXT_PUBLIC_SITE_URL.replace(/\/$/, '')
    : 'https://activity-manager.colorsdev.tech';

const scopeExtensionOrigin =
  typeof process.env.NEXT_PUBLIC_PWA_SCOPE_EXTENSION_ORIGIN === 'string' &&
  process.env.NEXT_PUBLIC_PWA_SCOPE_EXTENSION_ORIGIN.length > 0
    ? process.env.NEXT_PUBLIC_PWA_SCOPE_EXTENSION_ORIGIN.replace(/\/$/, '')
    : undefined;

const iarcRatingId =
  typeof process.env.NEXT_PUBLIC_IARC_RATING_ID === 'string' && process.env.NEXT_PUBLIC_IARC_RATING_ID.length > 0
    ? process.env.NEXT_PUBLIC_IARC_RATING_ID
    : undefined;

/**
 * Manifest per PWA / PWABuilder.
 * Alcuni campi avanzati non sono nel tipo `MetadataRoute.Manifest` di Next: cast finale.
 */
export default function manifest(): MetadataRoute.Manifest {
  const manifestBody = {
    id: `${site}/`,
    name: 'Activity Manager',
    short_name: 'Activity',
    description: 'Gestione attività e famiglia — Activity Manager.',
    lang: 'it',
    dir: 'ltr',
    start_url: '/',
    scope: '/',
    display: 'standalone',
    display_override: ['window-controls-overlay', 'tabbed', 'standalone', 'minimal-ui'],
    orientation: 'any',
    background_color: '#0b1220',
    theme_color: '#0b1220',
    categories: ['productivity', 'lifestyle'],
    prefer_related_applications: false,
    related_applications: [] as { platform: string; url: string; id?: string }[],
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
        name: 'Activity Manager',
        short_name: 'Inizio',
        description: 'Pagina iniziale (presentazione)',
        url: '/',
        icons: [{ src: '/pwa/icon-192.png', sizes: '192x192', type: 'image/png' }],
      },
    ],
    /** Riutilizza finestra esistente quando possibile (Chromium). */
    launch_handler: {
      client_mode: 'navigate-existing',
    },
    /** Condivisione verso la root (stessa entry di start_url). */
    share_target: {
      action: `${site}/`,
      method: 'GET',
      params: {
        title: 'title',
        text: 'text',
        url: 'url',
      },
    },
    /** Protocollo custom documentato (gestione UI opzionale in app). */
    protocol_handlers: [
      {
        protocol: 'web+activitymanager',
        url: `${site}/?link=%s`,
      },
    ],
    /** Apre JSON dalla shell/OS verso la root (estensione futura). */
    file_handlers: [
      {
        action: `${site}/`,
        accept: {
          'application/json': ['.json'],
        },
      },
    ],
    /** Microsoft Edge: pannello laterale (larghezza preferita). */
    edge_side_panel: {
      preferred_width: 400,
    },
    ...(scopeExtensionOrigin
      ? {
          scope_extensions: [{ origin: scopeExtensionOrigin }],
        }
      : {}),
    ...(iarcRatingId
      ? {
          iarc_rating_id: iarcRatingId,
        }
      : {}),
  };

  return manifestBody as MetadataRoute.Manifest;
}
