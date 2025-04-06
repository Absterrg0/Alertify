
import type { Metadata } from "next";
import localFont from "next/font/local";
import { Poppins } from "next/font/google";
import "./globals.css";
import { SessionProvider } from "next-auth/react";
import { Toaster } from "@/components/ui/toaster";
import Head from "next/head";
import { Analytics } from "@vercel/analytics/react";
import { Suspense } from "react";
// Google Font - Poppins
const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "600", "700"],
  variable: "--font-poppins",
});

// Local Fonts
const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

// Metadata Configuration for SEO and Open Graph
export const metadata: Metadata = {
  metadataBase: new URL('https://droplert.abstergo.dev'),
  title: {
    template: '%s | Droplert',
    default: 'Droplert',
  },
  description: "Free real-time website notifications to notify users effortlessly",
  applicationName: 'Droplert',
  keywords: [
    'notifications', 'real-time', 'website alerts', 'user engagement', 'web service'
  ],
  authors: [{ name: 'Your Name', url: 'https://abstergo.dev' }],
  creator: 'Abstergo',
  publisher: 'Abstergo',
  robots: {
    index: true,
    follow: true,
    nocache: false,
    googleBot: {
      index: true,
      follow: true,
      noimageindex: false,
    },
  },
  openGraph: {
    title: "Droplert",
    description: "Free real-time website notifications to notify users effortlessly",
    url: "https://droplert.abstergo.dev",
    siteName: "Droplert",
    images: [
      {
        url: "/DarkLogo.png",
        width: 1200,
        height: 630,
        alt: "Droplert Logo",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Droplert",
    description: "Free real-time website notifications to notify users effortlessly",
    images: ["/DarkLogo.png"],
    site: "@Absterrg0",
    creator: "@Absterrg0",
  },
  verification: {
    google: 'ZGlLzOHfT3u0RGIUcIUDuqSK11VHxNvhnrRFMDpQs-8',
  },
  alternates: {
    canonical: 'https://droplert.abstergo.dev',
  },
  icons: {
    icon: '/favicon.ico',
    shortcut: '/favicon.ico',
    apple: '/apple-touch-icon.png',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <Head>
        <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <meta name="theme-color" content="#ffffff" />
      </Head>
      <body className={`${geistSans.variable} ${geistMono.variable} ${poppins.variable} antialiased`}>
        <SessionProvider>
          <Suspense>

          {children}
          </Suspense>
          <Analytics />
          <Toaster />
        </SessionProvider>
      </body>
    </html>
  );
}
