import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { ClerkProvider } from '@clerk/nextjs';

import { Toaster } from '@/components/ui/toaster';
import { EdgeStoreProvider } from '@/lib/edgestore';
import ModalProvider from '@/providers/modal-provider';

import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.APP_URL
      ? `${process.env.APP_URL}`
      : process.env.VERCEL_URL
      ? `https://${process.env.VERCEL_URL}`
      : `http://localhost:${process.env.PORT || 3000}`
  ),
  title:
    'Photorio',
  description:
    'Share your images and become a part of Photorio',
  openGraph: {
    url: '/',
    title:
      'Photorio',
    description:
      'Share your images and become a part of Photorio'
  },
  twitter: {
    card: 'summary_large_image',
    title:
      'Photorio',
    description:
      'Share your images and become a part of Photorio'
  }
};

export default async function RootLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <ClerkProvider>
      <html lang='en'>
        <body className={inter.className}>
          <EdgeStoreProvider>{children}</EdgeStoreProvider>
          <Toaster />
          <ModalProvider />
        </body>
      </html>
    </ClerkProvider>
  );
}
