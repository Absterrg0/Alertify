import type { UserPlan } from "@prisma/client";

import prisma from "@/db";

const DAILY_CAMPAIGN_LIMIT: Record<UserPlan, number> = {
  FREE: 5,
  PREMIUM: 50,
  ENTERPRISE: 500,
};

export async function checkCampaignLimit(userId: string, plan: UserPlan) {
  const startOfDay = new Date();
  startOfDay.setUTCHours(0, 0, 0, 0);
  const publishedToday = await prisma.campaign.count({
    where: { userId, publishedAt: { gte: startOfDay } },
  });
  return publishedToday < DAILY_CAMPAIGN_LIMIT[plan];
}
