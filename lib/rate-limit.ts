
import prisma from "@/db"


type PlanStatus = "FREE" | "PREMIUM" | "ENTERPRISE";

const DAILY_LIMIT={
    FREE:5,
    PREMIUM:5,
    ENTERPRISE:5
}


export async function CheckRateLimit(userId:string | undefined,plan:PlanStatus | undefined):Promise<boolean>{

    const today = new Date();
    today.setHours(0,0,0,0)
    if(!plan)
        return false

    const requestCount = await prisma.apiRequest.count({
        where:{
            userId,
            timestamp:{
                gte:today
            }
        }
    })
    return requestCount < DAILY_LIMIT[plan]

}


export async function logApiRequest(
    userId: string | undefined, 
    endpoint: string, 
    name: string,
    success: boolean
): Promise<boolean> {
    try {
        if (!userId) {
            return false;
        }
        
        const response = await prisma.apiRequest.create({
            data: {
                userId,
                success,
                endpoint,
                name
            }
        });

        console.log('API Request logged:', response);
        return true;
    } catch (e) {
        console.error('Error logging API request:', e);
        return false;
    }
}