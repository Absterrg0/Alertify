import type { Metadata } from "next"

import { LegalShell } from "@/components/landing/LegalShell"

export const metadata: Metadata = {
  title: "Privacy",
  description: "How Droplert handles workspace accounts, campaign copy, and delivery events.",
}

export default function PrivacyPage() {
  return (
    <LegalShell title="Privacy">
      <p>
        Droplert is operated by Abstergo. This page describes what the product stores today. It is
        not a substitute for counsel.
      </p>
      <p>
        When you create a workspace with Google or GitHub, we store the account name, email, and
        provider identity needed to keep you signed in.
      </p>
      <p>
        Campaign copy, verified site origins, public site IDs, and aggregate delivery events are
        stored for your workspace so you can publish, inspect, and archive records.
      </p>
      <p>
        The browser reader only needs a public site ID and the API origin. Owner secrets stay on
        the control plane and are not shipped to visitors.
      </p>
      <p>
        You can stop publishing and remove the reader from your app at any time. To ask for account
        deletion, contact the operator through the workspace account you used to sign in.
      </p>
    </LegalShell>
  )
}
