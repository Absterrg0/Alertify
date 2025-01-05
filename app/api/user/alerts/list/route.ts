import { auth } from "@/lib/auth";
import { NextResponse } from "next/server";
import prisma from "@/db";

export async function GET() {
  const session = await auth();
  if (!session?.user || !session.user.id) {
    return NextResponse.json(
      {
        msg: "Unauthorized",
      },
      {
        status: 403,
      }
    );
  }

  try {
    // Fetch alerts and order them by the 'createdAt' field in descending order
    const response = await prisma.alert.findMany({
      where: {
        userId: session.user.id,
      },
      orderBy: {
        createdAt: 'desc', // Assuming you have a 'createdAt' field in your alert model
      },
    });

    return NextResponse.json(
      {
        response,
      },
      {
        status: 200, // 200 status indicates success
      }
    );
  } catch (e) {
    console.error(e);
    return NextResponse.json(
      {
        msg: "Error occurred while listing the alerts",
      },
      {
        status: 500,
      }
    );
  }
}
