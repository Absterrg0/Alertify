import { describe, expect, it } from "vitest";

import { buildFeed, feedByteLength, feedEtag, MAX_FEED_BYTES } from "./feed";

describe("public campaign feed", () => {
  it("materializes the current immutable campaign revision", () => {
    const feed = buildFeed(
      {
        id: "site-db-id",
        publicId: "site_public",
        name: "Docs",
        url: "https://docs.example.com",
        isVerified: true,
        status: "ACTIVE",
        verificationToken: "token",
        verifiedAt: new Date(),
        feedRevision: 7,
        userId: "owner",
        createdAt: new Date(),
        updatedAt: new Date(),
        campaignTargets: [
          {
            id: "target",
            websiteId: "site-db-id",
            campaignId: "campaign",
            createdAt: new Date(),
            campaign: {
              id: "campaign",
              userId: "owner",
              status: "PUBLISHED",
              currentRevision: 2,
              startsAt: new Date("2026-08-12T00:00:00.000Z"),
              endsAt: null,
              priority: 200,
              publishedAt: new Date(),
              archivedAt: null,
              createdAt: new Date(),
              updatedAt: new Date(),
              revisions: [
                {
                  id: "old",
                  campaignId: "campaign",
                  revision: 1,
                  type: "TOAST",
                  preset: "MINIMAL",
                  animation: "FADE",
                  position: "TOP_CENTER",
                  title: "Old title",
                  description: "Old description",
                  appearance: {},
                  routeRules: [],
                  dismissible: true,
                  durationMs: 10_000,
                  createdAt: new Date(),
                },
                {
                  id: "current",
                  campaignId: "campaign",
                  revision: 2,
                  type: "TOAST",
                  preset: "AURORA",
                  animation: "SPRING",
                  position: "TOP_RIGHT",
                  title: "Current title",
                  description: "Current description",
                  appearance: { accentColor: "#70f0c0" },
                  routeRules: ["/docs/*"],
                  dismissible: true,
                  durationMs: 8_000,
                  createdAt: new Date(),
                },
              ],
            },
          },
        ],
      },
      new Date("2026-08-12T12:00:00.000Z"),
    );

    expect(feed.revision).toBe("7");
    expect(feed.campaigns).toHaveLength(1);
    expect(feed.campaigns[0]).toMatchObject({
      revision: 2,
      title: "Current title",
      preset: "aurora",
      routes: ["/docs/*"],
    });
    expect(feedEtag(7)).toBe('"site-7"');
    expect(feedByteLength(feed)).toBeLessThan(MAX_FEED_BYTES);
  });
});
