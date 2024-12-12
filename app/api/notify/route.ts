import { NextRequest, NextResponse } from "next/server";
import { CheckRateLimit, logApiRequest } from "@/lib/rate-limit";
import { auth } from "@/lib/auth";
import axios from "axios";

interface Payload {
    title: string;
    description: string;
    type: string;
    style: string;
    backgroundColor: string;
    textColor: string;
    borderColor: string;
    imageUrl: string;
}

interface Website {
    name: string;
    url: string;
}

interface InputProps {
    payload: Payload;
    websites: Website[];
}

export async function POST(req: NextRequest) {
    const session = await auth();
    if (!session || !session.user) {
        return NextResponse.json(
            {
                msg: "Unauthorized",
            },
            {
                status: 403,
            }
        );
    }

    try {
        const user = await prisma?.user.findUnique({
            where: {
                id: session.user.id,
            },
            include: {
                registeredWebsites: true,
            },
        });

        if (!user) {
            return NextResponse.json(
                {
                    msg: "User not found",
                },
                {
                    status: 404,
                }
            );
        }

        const body: InputProps = await req.json();
        const { payload, websites } = body;

        // Check rate limit for the user
        const rateLimit = await CheckRateLimit(user.id,user.plan);
        if (!rateLimit) {
            await logApiRequest(user.id, `RateLimitExceeded`, false);
            return NextResponse.json(
                {
                    msg: "Rate limit exceeded, please try again tomorrow",
                },
                {
                    status: 429,
                }
            );
        }

        // Process each website individually
        const results = [];
        for (const website of websites) {
            try {
                const response = await axios.post(
                    `${website.url}/api/droplert/notify`,
                    payload,
                    {
                        headers: {
                            Authorization: `Bearer ${user.apiKey}`,
                            "Content-Type": "application/json",
                        },
                    }
                );

                if (response.status === 200) {
                    results.push({
                        website: website.name,
                        status: "success",
                        message: "Notification sent successfully",
                    });
                    await logApiRequest(user.id, `${website.url}/api/droplert/notify`, true);
                } else {
                    results.push({
                        website: website.name,
                        status: "failed",
                        message: "Failed to send notification",
                    });
                    await logApiRequest(user.id, `${website.url}/api/droplert/notify`, false);
                }
            } catch (error) {
                results.push({
                    website: website.name,
                    status: "error",
                    message: error || "Unknown error occurred",
                });
                await logApiRequest(user.id, `${website.url}/api/droplert/notify`, false);
            }
        }

        return NextResponse.json({
            msg: "Notification process completed",
            results,
        });
    } catch (e) {
        console.error(e);
        return NextResponse.json(
            {
                msg: "Error while processing notifications",
                error: e instanceof Error ? e.message : "Unknown error",
            },
            {
                status: 500,
            }
        );
    }
}
