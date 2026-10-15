import type { Metadata } from 'next';
import { Be_Vietnam_Pro, Archivo_Narrow, JetBrains_Mono } from 'next/font/google';
import Script from 'next/script';
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
    default: 'Nhận gửi hàng từ Hà Nội & TP.HCM đi Mỹ, Nhật Bản, Trung Quốc, Úc, Canada, Anh, EU, Hàn Quốc, Đài Loan và nhiều quốc gia khác',
    template: '%s | GIA LONG LOGISTICS',
  },
  description:
    'Dịch vụ gửi hàng đi nước ngoài uy tín - giá rẻ TP.HCM | 15 năm kinh nghiệm. CÔNG TY TNHH GIA LONG LOGISTICS VIỆT NAM — GIA LONG LOGISTICS.',
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
        {/* Google Tag Manager (noscript) */}
        <noscript>
          <iframe
            src="https://www.googletagmanager.com/ns.html?id=GTM-P98H348B"
            height="0"
            width="0"
            style={{ display: 'none', visibility: 'hidden' }}
          />
        </noscript>
        {/* End Google Tag Manager (noscript) */}
        <AppProviders>{children}</AppProviders>
        {/* Google Tag Manager */}
        <Script id="google-tag-manager" strategy="afterInteractive">
          {`(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','GTM-P98H348B');`}
        </Script>
        {/* End Google Tag Manager */}
      </body>
    </html>
  );
}
