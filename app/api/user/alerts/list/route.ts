import prisma from "@/db";
import { auth } from "@/lib/auth";
import type { NotificationAppearance } from "@/lib/campaigns/contracts";
import { NextResponse } from "next/server";

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  try {
    const [campaigns, legacyAlerts] = await Promise.all([
      prisma.campaign.findMany({
        where: { userId: session.user.id },
        orderBy: { createdAt: "desc" },
        take: 30,
        include: { revisions: { orderBy: { revision: "desc" }, take: 1 } },
      }),
      prisma.alert.findMany({
        where: { userId: session.user.id },
        orderBy: { createdAt: "desc" },
        take: 20,
      }),
    ]);

    const durable = campaigns.flatMap((campaign) => {
      const revision = campaign.revisions[0];
      if (!revision) return [];
      const appearance = revision.appearance as NotificationAppearance;
      return [{
        id: campaign.id,
        title: revision.title,
        description: revision.description,
        type: revision.type,
        backgroundColor: appearance.backgroundColor,
        textColor: appearance.textColor,
        borderColor: appearance.borderColor,
        imageUrl: appearance.imageUrl ?? undefined,
        createdAt: campaign.createdAt,
        status: campaign.status,
      }];
    });

    return NextResponse.json({ response: [...durable, ...legacyAlerts].toSorted((left, right) => right.createdAt.getTime() - left.createdAt.getTime()).slice(0, 30) });
  } catch (error) {
    console.error("Failed to list campaign history", error);
    return NextResponse.json({ message: "Unable to list campaign history" }, { status: 500 });
  }
}
