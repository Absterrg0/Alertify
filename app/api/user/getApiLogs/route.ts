import { auth } from "@/lib/auth";
import { NextResponse } from "next/server";
import prisma from "@/db";

export async function GET() {
    const session = await auth();
    if (!session || !session.user) {
        return NextResponse.json({
            msg: "Unauthorized"
        }, {
            status: 403
        });
    }

    try {
        const logs = await prisma?.apiRequest.findMany({
            where: {
                userId: session.user.id
            },
            orderBy: {
                timestamp: 'desc'  // Use timestamp to order the requests in descending order
            },
            take: 9 // Limit the results to the latest 6 entries
        });

        return NextResponse.json({
            logs
        }, {
            status: 200
        });
    } catch (e) {
        console.error(e);
        return NextResponse.json({
            msg: "Error while fetching the API requests"
        }, {
            status: 500
        });
    }
}
