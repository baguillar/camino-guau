
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { SessionProvider } from '@/components/providers/session-provider';
import { ThemeProvider } from '@/components/theme-provider';
import { PWAInstall } from '@/components/pwa/pwa-install';
import { PushManager } from '@/components/push-notifications/push-manager';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Camino Guau - Tu Pasaporte Digital Perruno',
  description: 'Acompaña a tu perro en una aventura gamificada por el Camino de Santiago. Colecciona sellos, suma kilómetros y desbloquea logros en esta PWA.',
  manifest: '/manifest.json',
  icons: {
    icon: [
      { url: '/images/stamp-8.png', sizes: '192x192', type: 'image/png' },
      { url: '/images/stamp-2.png', sizes: '512x512', type: 'image/png' }
    ],
    apple: { url: '/images/stamp-8.png', sizes: '192x192', type: 'image/png' }
  }
};

export function generateViewport() {
  return {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 1,
    themeColor: '#f97316',
  };
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es" suppressHydrationWarning>
      <head>
        <link rel="manifest" href="/manifest.json" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
      </head>
      <body className={inter.className} suppressHydrationWarning>
        <SessionProvider>
          <ThemeProvider>
            {children}
            <PWAInstall />
            <PushManager />
          </ThemeProvider>
        </SessionProvider>
      </body>
    </html>
  );
}
