import { auth } from "@/lib/auth";
import websiteSchema from "@/types/WebsiteSchema"
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

    const requestUrl = new URL(req.url);
    // Extracting ID from URL path
    const { pathname } = requestUrl;
    const id = pathname.split('/').pop(); // Get the last segment of the path

    if (!id) {
        return NextResponse.json(
            { msg: "ID is required" },
            { status: 400 }
        );
    }

    try {
        let action = requestUrl.searchParams.get("action") === "reactivate" ? "reactivate" : "deactivate";
        try {
            const body = (await req.json()) as { action?: string };
            if (body.action) action = body.action;
        } catch {
            // Existing deactivation calls send no body; keep that request shape supported.
        }

        if (action !== "deactivate" && action !== "reactivate") {
            return NextResponse.json({ msg: "Unsupported website action" }, { status: 400 });
        }

        // Read through the authenticated owner before changing lifecycle state.
        const website = await prisma.website.findFirst({
            where: {
                id,
                userId: session.user.id,
            },
        });

        if (!website) {
            return NextResponse.json({ msg: "Website not found" }, { status: 404 });
        }

        if (action === "reactivate") {
            if (website.status !== "DEACTIVATED") {
                return NextResponse.json({ msg: "Only deactivated websites can be reactivated", website }, { status: 409 });
            }

            // Keep the stored DNS result authoritative. A verified site returns ACTIVE;
            // an unverified record returns to the pending flow instead of being promoted.
            const updatedWebsite = await prisma.website.update({
                where: { id: website.id },
                data: { status: website.isVerified ? "ACTIVE" : "PENDING" },
            });

            return NextResponse.json(
                {
                    msg: updatedWebsite.isVerified ? "Website successfully reactivated" : "Website reactivated; verification is required",
                    website: updatedWebsite,
                },
                { status: 200 },
            );
        }

        // Preserve the old empty-body POST deactivation call for backwards compatibility.
        const updatedWebsite = await prisma.website.update({
            where: { id: website.id },
            data: { status: "DEACTIVATED" },
        });

        return NextResponse.json(
            { msg: "Website successfully deactivated", website: updatedWebsite },
            { status: 200 },
        );
    } catch (e) {
        console.error('Error while deactivating website:', e);
        return NextResponse.json(
            { msg: "Error while deactivating website" },
            { status: 500 }
        );
    }
}
