import { z } from "zod";

const hexColor = z.string().regex(/^#[\da-f]{6}$/i, "Use a six-digit hex color");

export const appearanceSchema = z.object({
  backgroundColor: hexColor.default("#0f172a"),
  textColor: hexColor.default("#f8fafc"),
  accentColor: hexColor.default("#2dd4bf"),
  borderColor: hexColor.default("#334155"),
  borderRadius: z.number().int().min(0).max(32).default(16),
  shadow: z.enum(["NONE", "SOFT", "ELEVATED", "GLOW"]).default("ELEVATED"),
  imageUrl: z.url().max(2_048).startsWith("https://").nullable().default(null),
  icon: z.enum(["BELL", "SPARKLES", "CHECK", "WARNING", "INFO"]).default("BELL"),
  cta: z
    .object({
      label: z.string().trim().min(1).max(40),
      url: z.url().max(2_048).startsWith("https://"),
    })
    .nullable()
    .default(null),
});

export const campaignPublishSchema = z
  .object({
    title: z.string().trim().min(2).max(80),
    description: z.string().trim().min(2).max(320),
    type: z.enum(["ALERT", "ALERT_DIALOG", "TOAST"]),
    preset: z.enum(["MINIMAL", "GLASS", "AURORA", "EDITORIAL", "NEON"]).default("GLASS"),
    animation: z.enum(["FADE", "SLIDE", "POP", "SPRING", "FLIP"]).default("SPRING"),
    position: z
      .enum(["TOP_CENTER", "TOP_RIGHT", "BOTTOM_RIGHT", "BOTTOM_CENTER"])
      .default("TOP_CENTER"),
    appearance: appearanceSchema.prefault({}),
    routes: z
      .array(
        z
          .string()
          .trim()
          .min(1)
          .max(160)
          .refine((route) => route.startsWith("/"), "Routes must start with /")
          .refine(
            (route) => !route.includes("*") || route.endsWith("/*"),
            "Wildcards are only supported as a trailing /*",
          ),
      )
      .max(30)
      .default([]),
    websiteIds: z.array(z.string().min(1)).min(1).max(20),
    startsAt: z.coerce.date().default(() => new Date()),
    endsAt: z.coerce.date().nullable().default(null),
    priority: z.number().int().min(0).max(1000).default(100),
    dismissible: z.boolean().default(true),
    durationMs: z.number().int().min(3_000).max(60_000).default(10_000),
  })
  .superRefine((value, context) => {
    if (value.endsAt && value.endsAt <= value.startsAt) {
      context.addIssue({
        code: "custom",
        path: ["endsAt"],
        message: "End time must be after the start time",
      });
    }
  });

export const deliveryEventSchema = z.object({
  campaignId: z.string().min(1),
  campaignRevision: z.number().int().positive(),
  type: z.enum(["IMPRESSION", "CLICK", "DISMISS"]),
  visitorId: z.string().max(80).nullable().default(null),
  path: z.string().max(512).nullable().default(null),
});

export const deliveryEventBatchSchema = z.object({
  events: z.array(deliveryEventSchema).min(1).max(5),
});

export type CampaignPublishInput = z.infer<typeof campaignPublishSchema>;
export type NotificationAppearance = z.infer<typeof appearanceSchema>;

export class InvalidOriginError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "InvalidOriginError";
  }
}

export function normalizeOrigin(input: string): string {
  let url: URL;
  try {
    url = new URL(input);
  } catch {
    throw new InvalidOriginError("Enter a valid website origin");
  }

  if (url.protocol !== "https:" && url.hostname !== "localhost") {
    throw new InvalidOriginError("Production websites must use HTTPS");
  }

  if (url.username || url.password) {
    throw new InvalidOriginError("Website URLs cannot contain credentials");
  }

  if (url.pathname !== "/" || url.search || url.hash) {
    throw new InvalidOriginError("Website URLs must be origins without a path, query, or fragment");
  }

  return url.origin.toLowerCase();
}
