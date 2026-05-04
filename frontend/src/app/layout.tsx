// src/app/layout.tsx
import { UserProvider } from '@/context/UserContext';
import { LinguiClientProvider } from '@/lingui/I18nProvider';
import '@fortawesome/fontawesome-free/css/all.min.css';
import './globals.css';

export const metadata = {
  title: 'Activity Manager',
  description: 'Activity Manager',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="it">
      <body>
        <LinguiClientProvider>
          <UserProvider>
            {children}
          </UserProvider>
        </LinguiClientProvider>
      </body>
    </html>
  );
}