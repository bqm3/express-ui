import type { Metadata } from 'next';
import { Be_Vietnam_Pro, Archivo_Narrow, JetBrains_Mono } from 'next/font/google';
import AppProviders from '@/components/providers/AppProviders';
import './globals.css';

const beVietnamPro = Be_Vietnam_Pro({
  subsets: ['latin', 'vietnamese'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-be-vietnam-pro',
  display: 'swap',
});

const archivoNarrow = Archivo_Narrow({
  subsets: ['latin', 'latin-ext'],
  weight: ['500', '600', '700'],
  variable: '--font-archivo-narrow',
  display: 'swap',
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin', 'latin-ext'],
  weight: ['400', '500'],
  variable: '--font-jetbrains-mono',
  display: 'swap',
});

export const metadata: Metadata = {
  title: {
    default: 'Dịch vụ gửi hàng đi nước ngoài, Mỹ, Úc, Âu bao thuế | Gllogistics',
    template: '%s | Gllogistics',
  },
  description:
    'Dịch vụ gửi hàng đi nước ngoài uy tín - giá rẻ TP.HCM | 15 năm kinh nghiệm. CÔNG TY TNHH GIA LONG LOGISTICS VIỆT NAM — GLLOGISTICS.',
  icons: {
    icon: '/logo.png',
    shortcut: '/logo.png',
    apple: '/logo.png',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi">
      <body
        className={`${beVietnamPro.variable} ${archivoNarrow.variable} ${jetbrainsMono.variable}`}
      >
        <AppProviders>{children}</AppProviders>
      </body>
    </html>
  );
}
