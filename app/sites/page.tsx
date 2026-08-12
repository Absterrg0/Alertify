import { redirect } from "next/navigation";

import SitesPage from "@/components/SitesPage";
import { auth } from "@/lib/auth";

export default async function SitesRoute() {
  const session = await auth();
  if (!session?.user?.id) redirect("/getstarted");
  return <SitesPage />;
}
