import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Atlantica Online - Turn-Based Game',
  description: 'Game turn-based dengan heroes dan mercenaries. Pilih karaktermu dan buktikan kehebatanmu dalam pertarungan strategis!',
  keywords: 'game, turn-based, heroes, mercenaries, atlantica, online, strategy',
  authors: [{ name: 'Atlantica Online Team' }],
  viewport: 'width=device-width, initial-scale=1',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id">
      <body className={inter.className}>
        {children}
      </body>
    </html>
  );
}
