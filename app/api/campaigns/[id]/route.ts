import prisma from "@/db";
import { auth } from "@/lib/auth";
import { archiveCampaign, CampaignError } from "@/lib/campaigns/service";
import { NextResponse } from "next/server";

export async function DELETE(
  _request: Request,
  context: { params: Promise<{ id: string }> },
) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  try {
    const { id } = await context.params;
    await archiveCampaign(prisma, session.user.id, id);
    return NextResponse.json({ message: "Campaign archived" });
  } catch (error) {
    if (error instanceof CampaignError) {
      return NextResponse.json({ message: error.message }, { status: error.status });
    }
    console.error("Failed to archive campaign", error);
    return NextResponse.json({ message: "Unable to archive campaign" }, { status: 500 });
  }
}
