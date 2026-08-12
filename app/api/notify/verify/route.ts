import { resolveTxt } from "node:dns/promises";

import prisma from "@/db";
import { auth } from "@/lib/auth";
import { InvalidOriginError, normalizeOrigin } from "@/lib/campaigns/contracts";
import { NextRequest, NextResponse } from "next/server";

const DNS_TIMEOUT_MS = 5_000;

export async function POST(request: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = (await request.json()) as { id?: string; url?: string };
    const website = await prisma.website.findFirst({
      where: {
        userId: session.user.id,
        ...(body.id ? { id: body.id } : body.url ? { url: normalizeOrigin(body.url) } : { id: "" }),
      },
    });

    if (!website) {
      return NextResponse.json({ message: "Website not found" }, { status: 404 });
    }

    const hostname = new URL(website.url).hostname;
    const expected = `droplert-verification=${website.verificationToken}`;
    let verified = process.env.NODE_ENV !== "production" && hostname === "localhost";

    if (!verified) {
      const records = await Promise.race([
        resolveTxt(hostname),
        new Promise<never>((_, reject) =>
          setTimeout(() => reject(new Error("DNS verification timed out")), DNS_TIMEOUT_MS),
        ),
      ]);
      verified = records.some((record) => record.join("") === expected);
    }

    if (!verified) {
      return NextResponse.json(
        {
          message: "Verification record was not found",
          hostname,
          recordType: "TXT",
          recordValue: expected,
        },
        { status: 422 },
      );
    }

    const updated = await prisma.website.update({
      where: { id: website.id },
      data: { isVerified: true, status: "ACTIVE", verifiedAt: new Date() },
    });

    return NextResponse.json({ message: "Website verified", website: updated });
  } catch (error) {
    if (error instanceof InvalidOriginError || error instanceof SyntaxError) {
      return NextResponse.json({ message: "Enter a valid HTTPS website origin" }, { status: 400 });
    }
    const message = error instanceof Error ? error.message : "Verification failed";
    if (
      typeof error === "object" && error !== null && "code" in error &&
      ["ENODATA", "ENOTFOUND", "ESERVFAIL", "ETIMEOUT"].includes(
        String((error as { code?: string }).code),
      )
    ) {
      return NextResponse.json(
        { message: "DNS record is not visible yet. DNS changes can take time to propagate." },
        { status: 422 },
      );
    }
    console.error("Website verification failed", message);
    return NextResponse.json({ message: "Unable to verify website" }, { status: 500 });
  }
}
