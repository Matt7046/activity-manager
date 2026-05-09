// src/app/layout.tsx
import { MuiThemeProvider } from '@/app/MuiThemeProvider';
import { UserProvider } from '@/context/UserContext';
import { LinguiClientProvider } from '@/lingui/I18nProvider';
import '@fortawesome/fontawesome-free/css/all.min.css';
import type { Metadata } from 'next';
import './globals.css';

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
  openGraph: {
    title: 'Activity Manager',
    description: 'Activity Manager',
    images: ['/logo-colorsdev.png'],
  },
  twitter: {
    card: 'summary',
    images: ['/logo-colorsdev.png'],
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="it">
      <body>
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