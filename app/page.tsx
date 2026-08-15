import type { Metadata } from "next"

import LandingPage from "@/components/LandingPage"

export const metadata: Metadata = {
  title: {
    absolute: "Droplert | Announcements on the route that needs them",
  },
  description:
    "Publish scheduled product announcements inside verified sites. A versioned HTTP feed, no live socket, no secret in the client.",
  alternates: {
    canonical: "https://droplert.abstergo.fyi",
  },
  openGraph: {
    title: "Droplert | Announcements on the route that needs them",
    description:
      "Publish scheduled product announcements inside verified sites. A versioned HTTP feed, no live socket, no secret in the client.",
    url: "https://droplert.abstergo.fyi",
    images: [
      {
        url: "/og.png",
        width: 1536,
        height: 1024,
        alt: "Droplert. Announcements on the route that needs them.",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Droplert | Announcements on the route that needs them",
    description:
      "Publish scheduled product announcements inside verified sites. A versioned HTTP feed, no live socket, no secret in the client.",
    images: ["/og.png"],
  },
}

export default function Home() {
  return <LandingPage />
}
