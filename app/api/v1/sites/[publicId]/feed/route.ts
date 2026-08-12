import prisma from "@/db";
import { normalizeOrigin } from "@/lib/campaigns/contracts";
import { buildFeed, feedEtag } from "@/lib/campaigns/feed";
import { NextRequest, NextResponse } from "next/server";

const CACHE_CONTROL = "public, max-age=0, s-maxage=60, stale-while-revalidate=30";

function corsHeaders(origin: string | null, allowedOrigin: string) {
  const headers = new Headers({
    "Cache-Control": CACHE_CONTROL,
    Vary: "Origin",
    "X-Content-Type-Options": "nosniff",
  });

  if (origin && safeOrigin(origin) === allowedOrigin) {
    headers.set("Access-Control-Allow-Origin", origin);
    headers.set("Access-Control-Allow-Methods", "GET, OPTIONS");
    headers.set("Access-Control-Allow-Headers", "If-None-Match, Content-Type");
    headers.set("Access-Control-Expose-Headers", "ETag");
  }

  return headers;
}

function safeOrigin(origin: string | null) {
  if (!origin) return null;
  try {
    return normalizeOrigin(origin);
  } catch {
    return null;
  }
}

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ publicId: string }> },
) {
  const { publicId } = await context.params;
  const now = new Date();
  const website = await prisma.website.findUnique({
    where: { publicId, status: "ACTIVE", isVerified: true },
    include: {
      campaignTargets: {
        where: {
          campaign: {
            status: "PUBLISHED",
            OR: [{ endsAt: null }, { endsAt: { gt: now } }],
          },
        },
        include: { campaign: { include: { revisions: true } } },
        orderBy: { campaign: { priority: "desc" } },
      },
    },
  });

  if (!website) {
    return NextResponse.json({ message: "Site feed not found" }, { status: 404 });
  }

  const origin = request.headers.get("origin");
  const allowedOrigin = normalizeOrigin(website.url);
  const headers = corsHeaders(origin, allowedOrigin);
  if (origin && safeOrigin(origin) !== allowedOrigin) {
    return NextResponse.json({ message: "Origin is not allowed" }, { status: 403, headers });
  }

  const etag = feedEtag(website.feedRevision);
  headers.set("ETag", etag);
  if (request.headers.get("if-none-match") === etag) {
    return new NextResponse(null, { status: 304, headers });
  }

  return NextResponse.json(buildFeed(website, now), { headers });
}

export async function OPTIONS(
  request: NextRequest,
  context: { params: Promise<{ publicId: string }> },
) {
  const { publicId } = await context.params;
  const website = await prisma.website.findUnique({ where: { publicId } });
  if (!website) return new NextResponse(null, { status: 404 });

  const origin = request.headers.get("origin");
  const allowedOrigin = normalizeOrigin(website.url);
  if (!origin || safeOrigin(origin) !== allowedOrigin) {
    return new NextResponse(null, { status: 403 });
  }

  return new NextResponse(null, { status: 204, headers: corsHeaders(origin, allowedOrigin) });
}
