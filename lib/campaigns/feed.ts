import type {
  Campaign,
  CampaignRevision,
  CampaignTarget,
  Website,
} from "@prisma/client";

export const FEED_SCHEMA_VERSION = 1;
export const DEFAULT_POLL_AFTER_SECONDS = 900;
export const MAX_FEED_BYTES = 64 * 1_024;
export const MAX_FEED_CAMPAIGNS = 20;

type FeedTarget = CampaignTarget & {
  campaign: Campaign & { revisions: CampaignRevision[] };
};

export function buildFeed(
  website: Website & { campaignTargets: FeedTarget[] },
  now = new Date(),
) {
  const campaigns = website.campaignTargets.flatMap(({ campaign }) => {
    const revision = campaign.revisions.find(
      (candidate) => candidate.revision === campaign.currentRevision,
    );

    if (!revision) return [];

    return [
      {
        id: campaign.id,
        revision: revision.revision,
        kind: revision.type.toLowerCase(),
        preset: revision.preset.toLowerCase(),
        animation: revision.animation.toLowerCase(),
        position: revision.position.toLowerCase(),
        title: revision.title,
        description: revision.description,
        startsAt: campaign.startsAt.toISOString(),
        endsAt: campaign.endsAt?.toISOString() ?? null,
        priority: campaign.priority,
        appearance: revision.appearance,
        routes: revision.routeRules,
        dismissible: revision.dismissible,
        durationMs: revision.durationMs,
      },
    ];
  });

  const feed = {
    schemaVersion: FEED_SCHEMA_VERSION,
    siteId: website.publicId,
    revision: String(website.feedRevision),
    serverTime: now.toISOString(),
    pollAfterSeconds: DEFAULT_POLL_AFTER_SECONDS,
    campaigns,
  };

  return feed;
}

export function feedByteLength(feed: ReturnType<typeof buildFeed>) {
  return new TextEncoder().encode(JSON.stringify(feed)).byteLength;
}

export function feedEtag(feedRevision: number) {
  return `"site-${feedRevision}"`;
}
