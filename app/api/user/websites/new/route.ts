import { randomBytes } from "node:crypto";

import prisma from "@/db";
import { auth } from "@/lib/auth";
import { InvalidOriginError, normalizeOrigin } from "@/lib/campaigns/contracts";
import websiteSchema from "@/types/WebsiteSchema";
import { NextRequest, NextResponse } from "next/server";
import { ZodError } from "zod";

const WEBSITE_LIMIT = 6;

export async function POST(request: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  try {
    const parsed = websiteSchema.parse(await request.json());
    const url = normalizeOrigin(parsed.url);
    const [websiteCount, existing] = await Promise.all([
      prisma.website.count({ where: { userId: session.user.id } }),
      prisma.website.findUnique({ where: { url } }),
    ]);

    if (websiteCount >= WEBSITE_LIMIT) {
      return NextResponse.json({ message: "Website limit reached" }, { status: 409 });
    }
    if (existing) {
      return NextResponse.json(
        { message: "This origin is already registered" },
        { status: 409 },
      );
    }

    const website = await prisma.website.create({
      data: {
        name: parsed.name,
        url,
        userId: session.user.id,
        publicId: `site_${randomBytes(18).toString("base64url")}`,
        verificationToken: `dl_verify_${randomBytes(20).toString("base64url")}`,
      },
    });

    return NextResponse.json(
      {
        message: "Website added",
        website,
        verificationRecord: `droplert-verification=${website.verificationToken}`,
      },
      { status: 201 },
    );
  } catch (error) {
    if (error instanceof ZodError || error instanceof InvalidOriginError || error instanceof SyntaxError) {
      return NextResponse.json({ message: "Enter a valid HTTPS website origin" }, { status: 400 });
    }
    console.error("Failed to add website", error);
    return NextResponse.json({ message: "Unable to add website" }, { status: 500 });
  }
}
