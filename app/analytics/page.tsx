import { redirect } from "next/navigation";

import AnalyticsPage from "@/components/AnalyticsPage";
import { auth } from "@/lib/auth";

export default async function AnalyticsRoute() {
  const session = await auth();
  if (!session?.user?.id) redirect("/getstarted");
  return <AnalyticsPage />;
}
