import type { Metadata } from "next"

import { LegalShell } from "@/components/landing/LegalShell"

export const metadata: Metadata = {
  title: "Terms",
  description: "Terms for using Droplert to publish announcements on verified sites.",
}

export default function TermsPage() {
  return (
    <LegalShell title="Terms">
      <p>
        Droplert lets you create a workspace, verify a site origin, and publish a scheduled
        announcement that a public reader can fetch from a versioned HTTP feed.
      </p>
      <p>
        You are responsible for the campaign copy you publish and for confirming that you control
        each origin you verify. Do not use the product to deliver unlawful, deceptive, or harmful
        messages.
      </p>
      <p>
        The service is provided as available. Feed delivery depends on your reader install, your
        origin, and the public internet. We do not promise a specific uptime number.
      </p>
      <p>
        You can cancel by stopping campaigns and removing the reader from your app. Continuing to
        use the product after we update this page means you accept the current terms.
      </p>
    </LegalShell>
  )
}
