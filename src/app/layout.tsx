import type { Metadata } from 'next';
import { Providers } from '@/store/provider';
import localFont from 'next/font/local';
import './globals.css';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { Suspense } from 'react';

const geistSans = localFont({
  src: './fonts/GeistVF.woff',
  variable: '--font-geist-sans',
  weight: '100 900',
});

const geistMono = localFont({
  src: './fonts/GeistMonoVF.woff',
  variable: '--font-geist-mono',
  weight: '100 900',
});

export const metadata: Metadata = {
  title: 'MockAI - Master Your Coding Interviews',
  description:
    'Practice real coding interviews with AI-powered feedback and real-time guidance.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        suppressHydrationWarning
      >
        <Providers>
          <Suspense fallback={null}>
            <GoogleOAuthProvider
              clientId={process.env.NEXT_PUBLIC_GOOGLE_CLIENT_SECRET as string}
            >
              {children}
            </GoogleOAuthProvider>
          </Suspense>
        </Providers>
      </body>
    </html>
  );
}
