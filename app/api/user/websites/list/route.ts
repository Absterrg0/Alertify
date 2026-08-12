import prisma from "@/db";
import { auth } from "@/lib/auth";
import { NextResponse } from "next/server";

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  try {
    const websites = await prisma.website.findMany({
      where: { userId: session.user.id },
      orderBy: [{ status: "asc" }, { createdAt: "desc" }],
    });

    return NextResponse.json({
      websites: websites.map((website) => ({
        ...website,
        verificationRecord: `droplert-verification=${website.verificationToken}`,
      })),
    });
  } catch (error) {
    console.error("Failed to list websites", error);
    return NextResponse.json({ message: "Unable to load websites" }, { status: 500 });
  }
}
