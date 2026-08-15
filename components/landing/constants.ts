export const LANDING_ORIGIN = "https://droplert.abstergo.fyi"

export const LANDING_MOTION =
  "transition-all duration-700 ease-[cubic-bezier(0.32,0.72,0,1)]"

export const LANDING_INTERACTIVE = [
  LANDING_MOTION,
  "active:scale-[0.98]",
  "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white",
].join(" ")

export const INSTALL_SNIPPET = `import { Droplert } from "droplert/react"
import "droplert/styles.css"

export default function AppLayout({ children }) {
  return (
    <>
      {children}
      <Droplert
        siteId="site_public_id"
        apiUrl="https://droplert.abstergo.fyi"
      />
    </>
  )
}`

export const FAQ_ITEMS = [
  {
    question: "Do visitors need a live connection?",
    answer:
      "No. The reader fetches a versioned HTTP feed on load and revalidates later.",
  },
  {
    question: "What goes in the browser?",
    answer:
      "A public site ID and the API origin. Owner secrets stay on the control plane.",
  },
  {
    question: "Can I target one path?",
    answer: "Yes. Match an exact route or a prefix on a verified site.",
  },
  {
    question: "What surfaces can I use?",
    answer:
      "Toast, inline alert, or dialog. Pick the lightest interruption that fits the moment.",
  },
  {
    question: "Does a published campaign survive a restart?",
    answer:
      "Yes. The feed serves the current revision until you archive it or the window ends.",
  },
  {
    question: "How do I start?",
    answer:
      "Create a workspace with Google or GitHub, add a verified site, then publish a campaign. No credit card.",
  },
  {
    question: "Can I cancel?",
    answer:
      "Yes. You can stop publishing and remove the reader from your app at any time.",
  },
  {
    question: "Is there a native SDK?",
    answer:
      "Yes. Install droplert/react, mount the reader, and point it at the public feed origin.",
  },
] as const

export const FAQ_GROUPS = [
  {
    label: "Delivery",
    items: [FAQ_ITEMS[0], FAQ_ITEMS[4]],
  },
  {
    label: "The reader",
    items: [FAQ_ITEMS[1], FAQ_ITEMS[7]],
  },
  {
    label: "Targeting",
    items: [FAQ_ITEMS[2], FAQ_ITEMS[3]],
  },
  {
    label: "Account",
    items: [FAQ_ITEMS[5], FAQ_ITEMS[6]],
  },
] as const

export const FAQ_JSON_LD = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: FAQ_ITEMS.map((item) => ({
    "@type": "Question",
    name: item.question,
    acceptedAnswer: {
      "@type": "Answer",
      text: item.answer,
    },
  })),
}

export const HARBOR_ORIGIN = "ledger.harbor.test"

export const HARBOR_ROUTES = [
  { path: "/marketing", note: "No record" },
  { path: "/billing", note: "No record" },
  { path: "/changelog", note: "Version 2.4 · Now to Fri · Toast", active: true },
  { path: "/docs/exports", note: "No record" },
] as const
