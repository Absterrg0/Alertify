import { auth } from "@/lib/auth";
import websiteSchema from "@/types/WebsiteSchema";
import { NextRequest, NextResponse } from "next/server";
import prisma from "@/db";
export async function PUT(req: NextRequest) {
    const session = await auth();
    if (!session?.user || !session.user.id) {
        return NextResponse.json(
            { msg: "Unauthorized" },
            { status: 403 }
        );
    }

    // Extracting ID from URL parameters
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id'); // Assuming ID is passed as a query parameter

    if (!id) {
        return NextResponse.json(
            { msg: "ID is required" },
            { status: 400 }
        );
    }

    try {
        const body = await req.json();
        const parsedBody = websiteSchema.parse(body);
        const { name } = parsedBody;

        const response = await prisma.website.update({
            where: {
                id,
                userId: session.user.id,
            },
            data: {
                name,
            },
        });

        return NextResponse.json(
            {
                msg: "Name of the website successfully updated",
                response,
            },
            { status: 200 }
        );
    } catch (e) {
        console.error('Error while updating website:', e);
        return NextResponse.json(
            { msg: "Error while updating website" },
            { status: 500 }
        );
    }
}

export async function POST(req: NextRequest) {
    const session = await auth();
    if (!session?.user || !session.user.id) {
        return NextResponse.json(
            { msg: "Unauthorized" },
            { status: 403 }
        );
    }

    // Extracting ID from URL parameters
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id'); // Assuming ID is passed as a query parameter

    if (!id) {
        return NextResponse.json(
            { msg: "ID is required" },
            { status: 400 }
        );
    }

    try {
        console.log(`Deactivating website with ID: ${id}`);

        // Update the website status
        const updatedWebsite = await prisma.website.update({
            where: {
                id,
                userId: session.user.id,
            },
            data: {
                status: "DEACTIVATED",
            },
        });

        return NextResponse.json(
            { msg: "Website successfully deactivated", website: updatedWebsite },
            { status: 200 }
        );
    } catch (e) {
        console.error('Error while deactivating website:', e);
        return NextResponse.json(
            { msg: "Error while deactivating website" },
            { status: 500 }
        );
    }
}