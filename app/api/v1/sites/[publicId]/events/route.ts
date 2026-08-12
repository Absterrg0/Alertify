import prisma from "@/db";
import { deliveryEventBatchSchema, normalizeOrigin } from "@/lib/campaigns/contracts";
import { consumeEventLimit } from "@/lib/event-rate-limit";
import { NextRequest, NextResponse } from "next/server";
import { ZodError } from "zod";

function eventCors(origin: string) {
  return {
    "Access-Control-Allow-Origin": origin,
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
    Vary: "Origin",
  };
}

function isAllowedOrigin(origin: string | null, websiteUrl: string) {
  if (!origin) return false;
  try {
    return normalizeOrigin(origin) === normalizeOrigin(websiteUrl);
  } catch {
    return false;
  }
}

async function readLimitedBody(request: NextRequest, maximumBytes: number) {
  if (!request.body) return "";
  const reader = request.body.getReader();
  const decoder = new TextDecoder();
  let size = 0;
  let body = "";
  while (true) {
    const { done, value } = await reader.read();
    if (done) return body + decoder.decode();
    size += value.byteLength;
    if (size > maximumBytes) {
      await reader.cancel();
      throw new PayloadTooLargeError();
    }
    body += decoder.decode(value, { stream: true });
  }
}

class PayloadTooLargeError extends Error {}

export async function POST(
  request: NextRequest,
  context: { params: Promise<{ publicId: string }> },
) {
  const { publicId } = await context.params;
  const website = await prisma.website.findUnique({ where: { publicId } });
  if (!website || website.status !== "ACTIVE" || !website.isVerified) {
    return NextResponse.json({ message: "Site not found" }, { status: 404 });
  }

  const origin = request.headers.get("origin");
  if (!origin || !isAllowedOrigin(origin, website.url)) {
    return NextResponse.json({ message: "Origin is not allowed" }, { status: 403 });
  }

  try {
    const body = await readLimitedBody(request, 4_096);
    const input = deliveryEventBatchSchema.parse(JSON.parse(body));
    if (!consumeEventLimit(`${website.id}:all`, input.events.length, 2_000)) {
      return NextResponse.json({ message: "Too many events" }, { status: 429 });
    }

    const campaignIds = [...new Set(input.events.map((event) => event.campaignId))];
    const targets = await prisma.campaignTarget.findMany({
      where: { websiteId: website.id, campaignId: { in: campaignIds } },
      include: { campaign: { select: { userId: true, status: true, currentRevision: true } } },
    });
    const targetByCampaign = new Map(targets.map((target) => [target.campaignId, target]));

    if (input.events.some((event) => {
      const target = targetByCampaign.get(event.campaignId);
      return !target || target.campaign.status !== "PUBLISHED" || target.campaign.currentRevision !== event.campaignRevision;
    })) {
      return NextResponse.json({ message: "Campaign not found" }, { status: 404 });
    }

    await prisma.deliveryEvent.createMany({
      data: input.events.map((event) => {
        const target = targetByCampaign.get(event.campaignId)!;
        return {
        websiteId: website.id,
        campaignId: event.campaignId,
        userId: target.campaign.userId,
        campaignRevision: event.campaignRevision,
        type: event.type,
        visitorId: event.visitorId,
        path: event.path,
      };
      }),
    });

    return new NextResponse(null, {
      status: 204,
      headers: eventCors(origin),
    });
  } catch (error) {
    if (error instanceof PayloadTooLargeError) {
      return NextResponse.json({ message: "Event payload is too large" }, { status: 413 });
    }
    if (error instanceof ZodError || error instanceof SyntaxError) {
      return NextResponse.json({ message: "Invalid event" }, { status: 400 });
    }
    console.error("Failed to ingest delivery event", error);
    return NextResponse.json({ message: "Unable to record event" }, { status: 500 });
  }
}

export async function OPTIONS(
  request: NextRequest,
  context: { params: Promise<{ publicId: string }> },
) {
  const { publicId } = await context.params;
  const website = await prisma.website.findUnique({ where: { publicId } });
  const origin = request.headers.get("origin");
  if (!website || !origin || !isAllowedOrigin(origin, website.url)) {
    return new NextResponse(null, { status: 403 });
  }
  return new NextResponse(null, { status: 204, headers: eventCors(origin) });
}
