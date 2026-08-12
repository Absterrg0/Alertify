import { describe, expect, it } from "vitest";

import { campaignPublishSchema, normalizeOrigin } from "./contracts";

describe("campaign contracts", () => {
  it("normalizes a website origin", () => {
    expect(normalizeOrigin("https://Example.com:443/")).toBe(
      "https://example.com",
    );
  });

  it("rejects paths when registering an origin", () => {
    expect(() => normalizeOrigin("https://example.com/dashboard?ref=1")).toThrow(/origin/i);
  });

  it("accepts a complete durable campaign and supplies safe delivery defaults", () => {
    const campaign = campaignPublishSchema.parse({
      title: "Scheduled maintenance",
      description: "The dashboard will be unavailable for ten minutes.",
      type: "TOAST",
      preset: "AURORA",
      websiteIds: ["site-db-id"],
    });

    expect(campaign.animation).toBe("SPRING");
    expect(campaign.position).toBe("TOP_CENTER");
    expect(campaign.durationMs).toBe(10_000);
    expect(campaign.appearance.backgroundColor).toBe("#0f172a");
  });
});
