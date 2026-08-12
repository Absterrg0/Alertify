import { redirect } from "next/navigation";

import { CampaignRegistry, type CampaignRegistryRecord } from "@/components/campaigns/CampaignRegistry";
import { WorkspaceShell } from "@/components/workspace/WorkspaceShell";
import { auth } from "@/lib/auth";
import prisma from "@/db";

export default async function CampaignsPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/getstarted");

  const campaigns = await prisma.campaign.findMany({
    where: { userId: session.user.id },
    orderBy: { createdAt: "desc" },
    include: {
      revisions: { orderBy: { revision: "desc" }, take: 1 },
      targets: { include: { website: { select: { id: true, name: true, url: true } } } },
      _count: { select: { deliveryEvents: true } },
    },
  });

  const records: CampaignRegistryRecord[] = campaigns.map((campaign) => ({
    id: campaign.id,
    status: campaign.status,
    currentRevision: campaign.currentRevision,
    startsAt: campaign.startsAt.toISOString(),
    endsAt: campaign.endsAt?.toISOString() ?? null,
    createdAt: campaign.createdAt.toISOString(),
    revisions: campaign.revisions.map((revision) => ({
      revision: revision.revision,
      type: revision.type,
      preset: revision.preset,
      animation: revision.animation,
      position: revision.position,
      title: revision.title,
      description: revision.description,
      appearance: typeof revision.appearance === "object" && revision.appearance !== null ? revision.appearance as Record<string, unknown> : {},
      routeRules: revision.routeRules,
      dismissible: revision.dismissible,
      durationMs: revision.durationMs,
    })),
    targets: campaign.targets,
    deliveryEventCount: campaign._count.deliveryEvents,
  }));

  return <WorkspaceShell hideNewCampaign><CampaignRegistry campaigns={records} /></WorkspaceShell>;
}
