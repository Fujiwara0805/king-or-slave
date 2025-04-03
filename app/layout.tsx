import './globals.css';
import type { Metadata } from 'next';
import { Inter, Roboto } from 'next/font/google';
import { Toaster } from '@/components/ui/sonner';
import BackgroundMusic from '@/components/audio/BackgroundMusic';

const inter = Inter({ subsets: ['latin'] });
const roboto = Roboto({ weight: '400', subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'King or Slave - Strategic Card Game',
  description: 'A thrilling card game of strategy and chance',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ja" className={inter.className}>
      <body>
        {children}
        <BackgroundMusic />
        <Toaster />
      </body>
    </html>
  );
}
