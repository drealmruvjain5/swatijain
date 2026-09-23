import type { Metadata } from 'next';
import { Inter, Lora, Noto_Serif_Devanagari, Noto_Sans_Devanagari } from 'next/font/google';
import './globals.css';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

const lora = Lora({
  subsets: ['latin'],
  variable: '--font-lora',
  display: 'swap',
});

const notoSerifDevanagari = Noto_Serif_Devanagari({
  subsets: ['devanagari', 'latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-noto-serif-devanagari',
  display: 'swap',
});

const notoSansDevanagari = Noto_Sans_Devanagari({
  subsets: ['devanagari', 'latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-noto-sans-devanagari',
  display: 'swap',
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: 'Swati Jain | Personal Literary Website',
  description: 'A quiet corner of the internet for poems, blogs, essays, and stories traversing the gentle rhythms of life. Explore the writings of Swati Jain.',
  keywords: ['Swati Jain', 'Literature', 'Poetry', 'Hindi Poems', 'Essays', 'Stories'],
  authors: [{ name: 'Swati Jain' }],
  openGraph: {
    title: 'Swati Jain | Personal Literary Website',
    description: 'A quiet corner of the internet for poems, blogs, essays, and stories.',
    type: 'website',
  }
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${lora.variable} ${notoSerifDevanagari.variable} ${notoSansDevanagari.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <Header />
        <main className="flex-1 flex flex-col">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
