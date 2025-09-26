import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { TRPCReactProvider } from "@/trpc/client";
import { Toaster } from "sonner";
import { SessionProvider } from "next-auth/react";
import { auth } from "@/auth";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Golden Hands Spa | Premium Luxury Spa Experience",
  description: "Experience ultimate relaxation and rejuvenation at Golden Hands Spa. Our premium spa services offer luxury treatments, therapeutic massages, and wellness experiences in an elegant, serene environment.",
  keywords: "spa, luxury spa, massage, wellness, relaxation, rejuvenation, premium spa services, therapeutic treatments",
  authors: [{ name: "Golden Hands Spa" }],
  creator: "Golden Hands Spa",
  publisher: "Golden Hands Spa",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('https://goldenhandsspa.com'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: "Golden Hands Spa | Premium Luxury Spa Experience",
    description: "Experience ultimate relaxation and rejuvenation at Golden Hands Spa. Our premium spa services offer luxury treatments, therapeutic massages, and wellness experiences.",
    url: 'https://goldenhandsspa.com',
    siteName: 'Golden Hands Spa',
    images: [
      {
        url: '/logo.png',
        width: 1200,
        height: 630,
        alt: 'Golden Hands Spa Logo',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: "Golden Hands Spa | Premium Luxury Spa Experience",
    description: "Experience ultimate relaxation and rejuvenation at Golden Hands Spa. Our premium spa services offer luxury treatments, therapeutic massages, and wellness experiences.",
    images: ['/logo.png'],
  },
  icons: {
    icon: [
      { url: '/favicon.ico' },
      { url: '/logo.png', type: 'image/png' },
    ],
    apple: '/logo.png',
  },
  manifest: '/site.webmanifest',
  viewport: {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 1,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await auth();
  return (
    <TRPCReactProvider>
      <SessionProvider session={session}>
        <html lang="en" className="scroll-smooth">
          <head>
            <link rel="preconnect" href="https://fonts.googleapis.com" />
            <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
          </head>
          <body
            className={`${geistSans.variable} ${geistMono.variable} antialiased bg-white text-black selection:bg-amber-200 selection:text-black`}
            style={{
              '--gold': '#D4AF37',
              '--gold-light': '#F4E4BC',
              '--gold-dark': '#B8860B',
            } as React.CSSProperties}
          >
            <Toaster 
              position="top-right"
              toastOptions={{
                style: {
                  background: 'var(--gold-light)',
                  color: '#000',
                  border: '1px solid var(--gold)',
                },
              }}
            />
            <main className="min-h-screen">
              {children}
            </main>
          </body>
        </html>
      </SessionProvider>
    </TRPCReactProvider>
  );
}
