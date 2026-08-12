-- CreateEnum
CREATE TYPE "CampaignStatus" AS ENUM ('DRAFT', 'PUBLISHED', 'ARCHIVED');
CREATE TYPE "NotificationPreset" AS ENUM ('MINIMAL', 'GLASS', 'AURORA', 'EDITORIAL', 'NEON');
CREATE TYPE "NotificationAnimation" AS ENUM ('FADE', 'SLIDE', 'POP', 'SPRING', 'FLIP');
CREATE TYPE "NotificationPosition" AS ENUM ('TOP_CENTER', 'TOP_RIGHT', 'BOTTOM_RIGHT', 'BOTTOM_CENTER');
CREATE TYPE "DeliveryEventType" AS ENUM ('IMPRESSION', 'CLICK', 'DISMISS');

-- Expand Website into a durable public feed identity.
ALTER TABLE "Website"
ADD COLUMN "publicId" TEXT,
ADD COLUMN "verificationToken" TEXT,
ADD COLUMN "verifiedAt" TIMESTAMP(3),
ADD COLUMN "feedRevision" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

UPDATE "Website"
SET "publicId" = 'site_' || md5(random()::text || clock_timestamp()::text || "id"),
    "verificationToken" = md5(random()::text || clock_timestamp()::text || "url");

ALTER TABLE "Website"
ALTER COLUMN "publicId" SET NOT NULL,
ALTER COLUMN "verificationToken" SET NOT NULL;

CREATE UNIQUE INDEX "Website_publicId_key" ON "Website"("publicId");

-- Durable campaign source of truth.
CREATE TABLE "Campaign" (
  "id" TEXT NOT NULL,
  "userId" TEXT NOT NULL,
  "status" "CampaignStatus" NOT NULL DEFAULT 'DRAFT',
  "currentRevision" INTEGER NOT NULL DEFAULT 1,
  "startsAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "endsAt" TIMESTAMP(3),
  "priority" INTEGER NOT NULL DEFAULT 100,
  "publishedAt" TIMESTAMP(3),
  "archivedAt" TIMESTAMP(3),
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "Campaign_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "CampaignRevision" (
  "id" TEXT NOT NULL,
  "campaignId" TEXT NOT NULL,
  "revision" INTEGER NOT NULL,
  "type" "AlertType" NOT NULL,
  "preset" "NotificationPreset" NOT NULL DEFAULT 'GLASS',
  "animation" "NotificationAnimation" NOT NULL DEFAULT 'SPRING',
  "position" "NotificationPosition" NOT NULL DEFAULT 'TOP_CENTER',
  "title" TEXT NOT NULL,
  "description" TEXT NOT NULL,
  "appearance" JSONB NOT NULL,
  "routeRules" TEXT[],
  "dismissible" BOOLEAN NOT NULL DEFAULT true,
  "durationMs" INTEGER NOT NULL DEFAULT 10000,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "CampaignRevision_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "CampaignTarget" (
  "id" TEXT NOT NULL,
  "campaignId" TEXT NOT NULL,
  "websiteId" TEXT NOT NULL,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "CampaignTarget_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "DeliveryEvent" (
  "id" TEXT NOT NULL,
  "websiteId" TEXT NOT NULL,
  "campaignId" TEXT NOT NULL,
  "userId" TEXT NOT NULL,
  "type" "DeliveryEventType" NOT NULL,
  "campaignRevision" INTEGER NOT NULL,
  "visitorId" TEXT,
  "path" TEXT,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "DeliveryEvent_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "Campaign_userId_status_createdAt_idx" ON "Campaign"("userId", "status", "createdAt");
CREATE INDEX "Campaign_status_startsAt_endsAt_idx" ON "Campaign"("status", "startsAt", "endsAt");
CREATE UNIQUE INDEX "CampaignRevision_campaignId_revision_key" ON "CampaignRevision"("campaignId", "revision");
CREATE INDEX "CampaignRevision_campaignId_revision_idx" ON "CampaignRevision"("campaignId", "revision");
CREATE UNIQUE INDEX "CampaignTarget_campaignId_websiteId_key" ON "CampaignTarget"("campaignId", "websiteId");
CREATE INDEX "CampaignTarget_websiteId_createdAt_idx" ON "CampaignTarget"("websiteId", "createdAt");
CREATE INDEX "DeliveryEvent_websiteId_createdAt_idx" ON "DeliveryEvent"("websiteId", "createdAt");
CREATE INDEX "DeliveryEvent_campaignId_type_createdAt_idx" ON "DeliveryEvent"("campaignId", "type", "createdAt");

ALTER TABLE "Campaign" ADD CONSTRAINT "Campaign_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "CampaignRevision" ADD CONSTRAINT "CampaignRevision_campaignId_fkey" FOREIGN KEY ("campaignId") REFERENCES "Campaign"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "CampaignTarget" ADD CONSTRAINT "CampaignTarget_campaignId_fkey" FOREIGN KEY ("campaignId") REFERENCES "Campaign"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "CampaignTarget" ADD CONSTRAINT "CampaignTarget_websiteId_fkey" FOREIGN KEY ("websiteId") REFERENCES "Website"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "DeliveryEvent" ADD CONSTRAINT "DeliveryEvent_websiteId_fkey" FOREIGN KEY ("websiteId") REFERENCES "Website"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "DeliveryEvent" ADD CONSTRAINT "DeliveryEvent_campaignId_fkey" FOREIGN KEY ("campaignId") REFERENCES "Campaign"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "DeliveryEvent" ADD CONSTRAINT "DeliveryEvent_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- Existing website ownership should also cascade cleanly.
ALTER TABLE "Website" DROP CONSTRAINT IF EXISTS "Website_userId_fkey";
ALTER TABLE "Website" ADD CONSTRAINT "Website_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
