
import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { SessionProvider } from "next-auth/react";
import { Toaster } from "@/components/ui/toaster";
import { Analytics } from "@vercel/analytics/react";
import { Suspense } from "react";
import { ThemeProvider } from "@/components/theme-provider"

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
  description: "Durable, scheduled website campaigns delivered through a lightweight SDK and HTTP feed.",
  applicationName: 'Droplert',
  keywords: [
    'website campaigns', 'scheduled announcements', 'website alerts', 'developer tools', 'HTTP feed'
  ],
  authors: [{ name: 'Abstergo', url: 'https://abstergo.dev' }],
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
    description: "Durable, scheduled website campaigns delivered through a lightweight SDK and HTTP feed.",
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
    description: "Durable, scheduled website campaigns delivered through a lightweight SDK and HTTP feed.",
    images: ["/DarkLogo.png"],
    site: "@Absterrg0",
    creator: "@Absterrg0",
  },
  verification: {
    google: 'ZGlLzOHfT3u0RGIUcIUDuqSK11VHxNvhnrRFMDpQs-8',
    // other verification methods if applicable
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

export const viewport = {
  themeColor: '#07090d',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
      <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
      >
        <SessionProvider>
          <Suspense>

          {children}
          </Suspense>
          <Analytics />
          <Toaster />
        </SessionProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
