import { CampaignComposer } from "@/components/campaigns/CampaignComposer";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function AlertCampaignPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/getstarted");
  return <CampaignComposer type="ALERT" />;
}
