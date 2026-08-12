import { auth } from "@/lib/auth";
import {
  campaignPublishSchema,
  type CampaignPublishInput,
} from "@/lib/campaigns/contracts";
import { CampaignError, publishCampaign } from "@/lib/campaigns/service";
import { checkCampaignLimit } from "@/lib/rate-limit";
import prisma from "@/db";
import { NextRequest, NextResponse } from "next/server";
import { ZodError } from "zod";

type LegacyPayload = {
  payload: {
    title: string;
    description: string;
    selectedType: CampaignPublishInput["type"];
    style?: "NATIVE" | "GRADIENT" | "LOGO";
    preset?: CampaignPublishInput["preset"];
    animation?: CampaignPublishInput["animation"];
    position?: CampaignPublishInput["position"];
    backgroundColor?: string;
    textColor?: string;
    borderColor?: string;
    accentColor?: string;
    uploadedFileUrl?: string;
    routes?: string[];
    borderRadius?: number;
    durationMs?: number;
    dismissible?: boolean;
    startsAt?: string;
    endsAt?: string | null;
  };
  websites: Array<{ id: string }>;
};

function fromLegacyBody(body: LegacyPayload) {
  const payload = body.payload;
  const preset =
    payload.preset ??
    (payload.style === "GRADIENT"
      ? "AURORA"
      : payload.style === "LOGO"
        ? "EDITORIAL"
        : "GLASS");

  return {
    title: payload.title,
    description: payload.description,
    type: payload.selectedType,
    preset,
    animation: payload.animation,
    position: payload.position,
    websiteIds: body.websites.map((website) => website.id),
    routes: payload.routes,
    startsAt: payload.startsAt,
    endsAt: payload.endsAt,
    dismissible: payload.dismissible,
    durationMs: payload.durationMs,
    appearance: {
      backgroundColor: payload.backgroundColor,
      textColor: payload.textColor,
      accentColor: payload.accentColor,
      borderColor: payload.borderColor,
      borderRadius: payload.borderRadius,
      imageUrl: payload.uploadedFileUrl || null,
    },
  };
}

function isLegacyPayload(body: unknown): body is LegacyPayload {
  if (!body || typeof body !== "object") return false;
  const candidate = body as Partial<LegacyPayload>;
  return Boolean(
    candidate.payload &&
    typeof candidate.payload === "object" &&
    Array.isArray(candidate.websites),
  );
}

export async function POST(request: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  try {
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { plan: true },
    });
    if (!user || !(await checkCampaignLimit(session.user.id, user.plan))) {
      return NextResponse.json(
        { message: "Daily campaign limit reached for this plan" },
        { status: 429 },
      );
    }

    const body = await request.json();
    const input = campaignPublishSchema.parse(
      isLegacyPayload(body) ? fromLegacyBody(body) : body,
    );
    const campaign = await publishCampaign(prisma, session.user.id, input);

    return NextResponse.json(
      {
        message: "Campaign published",
        campaignId: campaign.id,
        revision: campaign.currentRevision,
      },
      { status: 201 },
    );
  } catch (error) {
    if (error instanceof ZodError || error instanceof SyntaxError) {
      return NextResponse.json(
        {
          message: "Invalid campaign",
          issues: error instanceof ZodError ? error.issues : undefined,
        },
        { status: 400 },
      );
    }
    if (error instanceof CampaignError) {
      return NextResponse.json({ message: error.message }, { status: error.status });
    }

    console.error("Failed to publish campaign", error);
    return NextResponse.json(
      { message: "Unable to publish campaign" },
      { status: 500 },
    );
  }
}
