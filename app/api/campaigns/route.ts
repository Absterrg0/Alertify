import prisma from "@/db";
import { auth } from "@/lib/auth";
import { NextResponse } from "next/server";

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const campaigns = await prisma.campaign.findMany({
    where: { userId: session.user.id },
    orderBy: { createdAt: "desc" },
    take: 50,
    include: {
      revisions: { orderBy: { revision: "desc" }, take: 1 },
      targets: { include: { website: { select: { id: true, name: true } } } },
      _count: { select: { deliveryEvents: true } },
    },
  });

  return NextResponse.json({ campaigns });
}
