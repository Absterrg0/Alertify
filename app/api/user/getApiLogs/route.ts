import prisma from "@/db";
import { auth } from "@/lib/auth";
import { NextResponse } from "next/server";

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  try {
    const events = await prisma.deliveryEvent.findMany({
      where: { userId: session.user.id },
      orderBy: { createdAt: "desc" },
      take: 50,
      select: { id: true, type: true, path: true, createdAt: true },
    });

    return NextResponse.json({
      logs: events.map((event) => ({
        id: event.id,
        endpoint: event.path || "site feed",
        name: event.type.toLowerCase(),
        timestamp: event.createdAt,
        success: true,
      })),
    });
  } catch (error) {
    console.error("Failed to load delivery events", error);
    return NextResponse.json({ message: "Unable to load delivery events" }, { status: 500 });
  }
}
