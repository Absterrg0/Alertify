import { NextRequest, NextResponse } from "next/server";
import { CheckRateLimit, logApiRequest } from "@/lib/rate-limit";
import { auth } from "@/lib/auth";
import axios from "axios";
import { Website } from "@/components/Dashboard";

enum AlertType {
    ALERT = "ALERT",
    ALERT_DIALOG = "ALERT_DIALOG",
    TOAST = "TOAST",
}

enum StyleType {
    NATIVE = "NATIVE",
    GRADIENT = "GRADIENT",
    LOGO = "LOGO",
}

interface Payload {
    title: string;
    description: string;
    selectedType: AlertType;
    style: StyleType;
    backgroundColor: string;
    textColor: string;
    borderColor: string;
    imageUrl: string;
}

interface InputProps {
    payload: Payload;
    websites: Website[];
}

interface NotificationResult {
    website: string;
    status: 'success' | 'failed' | 'error';
    message: string;
    error?: Error;
}

export async function POST(req: NextRequest) {
    try {
        // 1. Authentication
        const session = await auth();
        if (!session?.user?.id) {
            return NextResponse.json(
                { msg: "Unauthorized" },
                { status: 403 }
            );
        }

        // 2. Get user data
        const user = await prisma?.user.findUnique({
            where: { id: session.user.id },
            include: { websites: true }
        });

        if (!user) {
            return NextResponse.json(
                { msg: "User not found" },
                { status: 404 }
            );
        }

        // 3. Rate limiting
        const rateLimit = await CheckRateLimit(user.id, user.plan);
        if (!rateLimit) {
            return NextResponse.json(
                { msg: "Rate limit exceeded, please try again tomorrow" },
                { status: 429 }
            );
        }

        // 4. Parse request body
        const body: InputProps = await req.json();
        const { payload, websites } = body;
        console.log(payload)
        
        // 5. Create alert record
        const alert = await prisma?.alert.create({
            data: {
                title: payload.title,
                description: payload.description,
                type: payload.selectedType,
                style:payload.style,
                userId:session.user.id,
                backgroundColor: payload.backgroundColor,
                textColor: payload.textColor,
                borderColor: payload.borderColor,
              },
        });

        if(websites.length===0){
            return NextResponse.json({
                msg:"Select at least 1 website"
            },{
                status:400
            })
        }
        // 6. Process notifications
        const results: NotificationResult[] = [];
        
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
                        timeout: 5000,
                    }
                );

                const success = response.status === 200;
                await logApiRequest(user.id, website.url, true);

                results.push({
                    website: website.name,
                    status: success ? 'success' : 'failed',
                    message: success ? "Notification sent successfully" : "Failed to send notification"
                });
            } catch (error) {
                console.error(error)
                await logApiRequest(user.id, website.url, false);
                
                results.push({
                    website: website.name,
                    status: 'error',
                    message: 'Failed to send notification',
                });
            }
        }

        // 7. Return response
        return NextResponse.json({
            msg: "Notification process completed",
            results,
            alertId: alert?.id,
            status: 200
        });

    } catch (error) {
        console.error(error)
        return NextResponse.json(
            {
                msg: "Error while processing notifications",
                error: error instanceof Error ? error.message : "Unknown error"
            },
            { status: 500 }
        );
    }
}