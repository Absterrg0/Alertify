import { NextRequest, NextResponse } from "next/server";
import { logApiRequest } from "@/lib/rate-limit";
import { auth } from "@/lib/auth";
import axios from "axios";
import { Website } from "@/components/Dashboard";
import prisma from "@/db";

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
    fileName?: string;
    uploadedFileUrl?:string;
    routes:string[];
    borderRadius:number;
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

const WS_SERVER_URL = process.env.NEXT_PUBLIC_WEBSOCKET_SERVER_URL;

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

        // 3. Parse request body
        const body: InputProps = await req.json();
        const { payload, websites } = body;

        if (websites.length === 0) {
            return NextResponse.json({
                msg: "Select at least 1 website"
            }, {
                status: 400
            });
        }

        // 4. Create alert record
        const alert = await prisma?.alert.create({
            data: {
                title: payload.title,
                description: payload.description,
                type: payload.selectedType,
                style: payload.style,
                userId: session.user.id,
                backgroundColor: payload.backgroundColor,
                textColor: payload.textColor,
                borderColor: payload.borderColor,
                imageUrl:payload.uploadedFileUrl
                
            },
        });

        // 5. Send notification to WebSocket server
        const results: NotificationResult[] = [];
        
        try {
            // Format payload for WebSocket server
            const wsPayload = {
                droplertId: user.droplertId,
                websites: websites.map(w => w.url),
                routes:payload.routes,
                notification: {
                    type: payload.selectedType.toLowerCase(),
                    title: payload.title,
                    message: payload.description,
                    style: payload.style,
                    backgroundColor: payload.backgroundColor,
                    textColor: payload.textColor,
                    borderColor: payload.borderColor,
                    fileName:payload.fileName,
                    routes:payload.routes,
                    borderRadius:payload.borderRadius
                }
            };

            // Send to WebSocket server
            await axios.post(
                `${WS_SERVER_URL}/notify`,
                wsPayload,
                {
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${user.apiKey}`
                    },
                    timeout: 5000
                }
            );

            // Log successful delivery
            for (const website of websites) {
                await logApiRequest(user.id, website.url, website.name,true);
                results.push({
                    website: website.name,
                    status: 'success',
                    message: "Notification sent successfully"
                });
            }
        } catch (error) {
            console.error('WebSocket server error:', error);
            
            // Log failed delivery
            for (const website of websites) {
                await logApiRequest(user.id, website.url, website.name,false);
                results.push({
                    website: website.name,
                    status: 'error',
                    message: 'Failed to send notification',
                    error: error instanceof Error ? error : new Error('Unknown error')
                });
            }
        }

        // 6. Return response
        return NextResponse.json({
            msg: "Notification process completed",
            results,
            alertId: alert?.id,
            status: 200
        });

    } catch (error) {
        console.error(error);
        return NextResponse.json(
            {
                msg: "Error while processing notifications",
                error: error instanceof Error ? error.message : "Unknown error"
            },
            { status: 500 }
        );
    }
}