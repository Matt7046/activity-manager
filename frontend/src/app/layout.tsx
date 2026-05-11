// src/app/layout.tsx
import { ServiceWorkerRegistration } from '@/app/ServiceWorkerRegistration';
import { UserProvider } from '@/context/UserContext';
import { LinguiClientProvider } from '@/lingui/I18nProvider';
import '@fortawesome/fontawesome-free/css/all.min.css';
import type { Metadata } from 'next';
import './globals.css';
import MuiThemeProvider from './MuiThemeProvider';

const metadataBaseRaw =
  typeof process.env.NEXT_PUBLIC_SITE_URL === 'string' && process.env.NEXT_PUBLIC_SITE_URL.length > 0
    ? process.env.NEXT_PUBLIC_SITE_URL.replace(/\/$/, '')
    : undefined;

/** Base URL opzionale (es. https://colorsdev.tech) per icone/Open Graph assolute in produzione. */
const metadataBase = metadataBaseRaw ? new URL(metadataBaseRaw) : undefined;

export const metadata: Metadata = {
  metadataBase,
  title: 'Activity Manager',
  description: 'Activity Manager',
  icons: {
    /* Prima il favicon opaco: Chrome usa spesso il primo per il tab (evita alone grigio su PNG trasparenti) */
    icon: [
      { url: '/favicon.png', sizes: '128x128', type: 'image/png' },
      { url: '/pwa/icon-192.png', sizes: '192x192', type: 'image/png' },
      { url: '/pwa/icon-512.png', sizes: '512x512', type: 'image/png' },
    ],
    shortcut: '/favicon.png',
    apple: '/apple-touch-icon.png',
  },
  openGraph: {
    title: 'Activity Manager',
    description: 'Activity Manager',
    images: ['/logo-colorsdev-v2.png'],
  },
  twitter: {
    card: 'summary',
    images: ['/logo-colorsdev-v2.png'],
  },
};

const RootLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <html lang="it" suppressHydrationWarning data-theme="dark">
      <body>
        <ServiceWorkerRegistration />
        <MuiThemeProvider>
          <LinguiClientProvider>
            <UserProvider>
              {children}
            </UserProvider>
          </LinguiClientProvider>
        </MuiThemeProvider>
      </body>
    </html>
  );
}
export default RootLayout;