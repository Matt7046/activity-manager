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

/** Store Microsoft (es. 9N…): https://apps.microsoft.com/store/detail/… */
const buildRelatedApplications = (): { platform: string; url: string; id?: string }[] => {
  const out: { platform: string; url: string; id?: string }[] = [];
  const msId = process.env.NEXT_PUBLIC_MS_STORE_PRODUCT_ID?.trim();
  if (msId) {
    out.push({
      platform: 'windows',
      url: `https://apps.microsoft.com/store/detail/${encodeURIComponent(msId)}`,
      id: msId,
    });
  }
  const playUrl = process.env.NEXT_PUBLIC_PLAY_STORE_URL?.trim();
  if (playUrl) {
    out.push({ platform: 'play', url: playUrl });
  }
  return out;
}

/** Origini extra per `scope_extensions` (serve file `.well-known/web-app-origin-association` su ciascuna origine). CSV in NEXT_PUBLIC_PWA_SCOPE_EXTENSIONS. */
const buildScopeExtensions = (): { origin: string }[] | undefined => {
  const csv = process.env.NEXT_PUBLIC_PWA_SCOPE_EXTENSIONS?.trim();
  if (csv) {
    const list: { origin: string }[] = [];
    for (const part of csv.split(',')) {
      const raw = part.trim().replace(/\/$/, '');
      if (!raw) continue;
      try {
        list.push({ origin: new URL(raw).origin });
      } catch {
        /* skip invalid */
      }
    }
    if (list.length) return list;
  }
  if (scopeExtensionOrigin) return [{ origin: scopeExtensionOrigin }];
  return undefined;
}

/**
 * Manifest per PWA / PWABuilder.
 * Campi incubation / Edge oltre il tipo `MetadataRoute.Manifest` di Next: cast finale.
 *
 * Env opzionali (produzione / packaging):
 * - NEXT_PUBLIC_MS_STORE_PRODUCT_ID, NEXT_PUBLIC_PLAY_STORE_URL → related_applications (solo se valorizzati)
 * - NEXT_PUBLIC_IARC_RATING_ID → iarc_rating_id (da questionario IARC / Microsoft Partner)
 * - NEXT_PUBLIC_PWA_SCOPE_EXTENSIONS (CSV origini) o NEXT_PUBLIC_PWA_SCOPE_EXTENSION_ORIGIN → scope_extensions
 */
const manifest = (): MetadataRoute.Manifest => {
  const relatedApplications = buildRelatedApplications();
  const scopeExtensions = buildScopeExtensions();

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
    ...(relatedApplications.length > 0
      ? {
          prefer_related_applications: true as const,
          related_applications: relatedApplications,
        }
      : {}),
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
        src: '/pwa/icon-maskable-192.png',
        sizes: '192x192',
        type: 'image/png',
        purpose: 'maskable',
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
        label: 'Activity Manager — desktop',
      },
      {
        src: '/pwa/screenshot-narrow.png',
        sizes: '390x844',
        type: 'image/png',
        form_factor: 'narrow',
        label: 'Activity Manager — mobile',
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
    /** Edge / Chromium: integrazione “Nuova nota” (campo opzionale PWABuilder). */
    note_taking: {
      new_note_url: `${site}/`,
    },
    /** Apertura link dalla PWA (WICG manifest-incubations). */
    handle_links: 'preferred',
    ...(scopeExtensions?.length
      ? {
          scope_extensions: scopeExtensions,
        }
      : {}),
    ...(iarcRatingId
      ? {
          iarc_rating_id: iarcRatingId,
        }
      : {}),
  };

  return manifestBody as MetadataRoute.Manifest;
};

export default manifest;
