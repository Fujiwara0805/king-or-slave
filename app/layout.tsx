import './globals.css';
import type { Metadata } from 'next';
import { Playfair_Display } from 'next/font/google';
import { Toaster } from '@/components/ui/sonner';

const playfair = Playfair_Display({ subsets: ['latin'] });

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
    <html lang="ja">
      <body className={`${playfair.className} bg-[#1a0f0f]`}>
        {children}
        <Toaster />
      </body>
    </html>
  );
}
