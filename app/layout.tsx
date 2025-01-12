import type { Metadata } from "next";
import localFont from "next/font/local";
import { Poppins } from "next/font/google";
import "./globals.css";
import { SessionProvider } from "next-auth/react";
import { Toaster } from "@/components/ui/toaster";
import Head from "next/head";
import { Analytics } from "@vercel/analytics/react"
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
  title: "Droplert",
  description: "Free real-time website notifications to notify users effortlessly",
  openGraph: {
    title: "Droplert",
    description: "Free real-time website notifications to notify users effortlessly",
    url: "https://droplert.abstergo.dev",  // Replace with your actual domain
    siteName: "Droplert",
    images: [
      {
        url: "/DarkLogo.png",  // Replace with your image URL
        width: 1200,
        height: 630,
        alt: "Your App Name",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Droplert",
    description: "Free real-time website notifications to notify users effortlessly",
    images: ["/DarkLogo.png"],  // Replace with your image URL
    site: "@Absterrg0", // Replace with your actual Twitter handle
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <Head>
        <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <meta name="theme-color" content="#ffffff" />
      </Head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${poppins.variable} antialiased`}
      >
        <SessionProvider>
          {children}
          <Analytics></Analytics>
          <Toaster />
        </SessionProvider>
      </body>
    </html>
  );
}
