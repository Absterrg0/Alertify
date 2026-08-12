import { Prisma, type PrismaClient } from "@prisma/client";

import type { CampaignPublishInput } from "./contracts";
import {
  buildFeed,
  feedByteLength,
  MAX_FEED_BYTES,
  MAX_FEED_CAMPAIGNS,
} from "./feed";

type Database = PrismaClient | Prisma.TransactionClient;

export async function publishCampaign(
  prisma: PrismaClient,
  userId: string,
  input: CampaignPublishInput,
) {
  return prisma.$transaction(async (transaction) => {
    const websiteIds = [...new Set(input.websiteIds)].sort();
    await transaction.$queryRaw(
      Prisma.sql`SELECT "id" FROM "Website" WHERE "id" IN (${Prisma.join(websiteIds)}) ORDER BY "id" FOR UPDATE`,
    );
    const websites = await transaction.website.findMany({
      where: {
        id: { in: websiteIds },
        userId,
        status: "ACTIVE",
        isVerified: true,
      },
      select: { id: true, name: true, url: true },
    });

    if (websites.length !== websiteIds.length) {
      throw new CampaignError(
        "One or more selected websites are unavailable or do not belong to you",
        403,
      );
    }

    const campaign = await transaction.campaign.create({
      data: {
        userId,
        status: "PUBLISHED",
        currentRevision: 1,
        startsAt: input.startsAt,
        endsAt: input.endsAt,
        priority: input.priority,
        publishedAt: new Date(),
        revisions: {
          create: {
            revision: 1,
            type: input.type,
            preset: input.preset,
            animation: input.animation,
            position: input.position,
            title: input.title,
            description: input.description,
            appearance: input.appearance as Prisma.InputJsonValue,
            routeRules: input.routes,
            dismissible: input.dismissible,
            durationMs: input.durationMs,
          },
        },
        targets: {
          create: websites.map((website) => ({ websiteId: website.id })),
        },
      },
      include: { revisions: true, targets: true },
    });

    const now = new Date();
    for (const website of websites) {
      const projected = await transaction.website.findUniqueOrThrow({
        where: { id: website.id },
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

      if (projected.campaignTargets.length > MAX_FEED_CAMPAIGNS) {
        throw new CampaignError(
          `Publishing would exceed the ${MAX_FEED_CAMPAIGNS}-campaign limit for ${website.name}`,
          409,
        );
      }

      const projectedFeed = buildFeed(
        { ...projected, feedRevision: projected.feedRevision + 1 },
        now,
      );
      if (feedByteLength(projectedFeed) > MAX_FEED_BYTES) {
        throw new CampaignError(
          `Publishing would exceed the 64 KiB feed limit for ${website.name}`,
          409,
        );
      }
    }

    await incrementFeedRevisions(
      transaction,
      websites.map((website) => website.id),
    );

    return campaign;
  });
}

export async function archiveCampaign(
  prisma: PrismaClient,
  userId: string,
  campaignId: string,
) {
  return prisma.$transaction(async (transaction) => {
    const campaign = await transaction.campaign.findFirst({
      where: { id: campaignId, userId },
      include: { targets: { select: { websiteId: true } } },
    });

    if (!campaign) throw new CampaignError("Campaign not found", 404);

    const archived = await transaction.campaign.update({
      where: { id: campaign.id },
      data: { status: "ARCHIVED", archivedAt: new Date() },
    });

    await incrementFeedRevisions(
      transaction,
      campaign.targets.map((target) => target.websiteId),
    );

    return archived;
  });
}

async function incrementFeedRevisions(database: Database, websiteIds: string[]) {
  await database.website.updateMany({
    where: { id: { in: websiteIds } },
    data: { feedRevision: { increment: 1 } },
  });
}

export class CampaignError extends Error {
  constructor(
    message: string,
    public readonly status: number,
  ) {
    super(message);
    this.name = "CampaignError";
  }
}
