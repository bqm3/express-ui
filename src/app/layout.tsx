import type { Metadata } from 'next';
import { Hanken_Grotesk, Inter, JetBrains_Mono } from 'next/font/google';
import AppProviders from '@/components/providers/AppProviders';
import './globals.css';

const hankenGrotesk = Hanken_Grotesk({
  subsets: ['latin', 'latin-ext', 'vietnamese'],
  weight: ['500', '600', '700', '800'],
  variable: '--font-hanken-grotesk',
  display: 'swap',
});

const inter = Inter({
  subsets: ['latin', 'latin-ext', 'vietnamese'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-inter',
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
    default: 'Dịch vụ gửi hàng đi nước ngoài, Mỹ, Úc, Âu bao thuế | Glexpress',
    template: '%s | Glexpress',
  },
  description:
    'Dịch vụ gửi hàng đi nước ngoài uy tín - giá rẻ TP.HCM | 15 năm kinh nghiệm. Chuyển phát nhanh Ánh Sáng Toàn Cầu — GLEXPRESS.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi">
      <body
        className={`${hankenGrotesk.variable} ${inter.variable} ${jetbrainsMono.variable}`}
      >
        <AppProviders>{children}</AppProviders>
      </body>
    </html>
  );
}
