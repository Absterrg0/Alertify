
import prisma from "@/db"
import { NextResponse } from "next/server";


type PlanStatus = "FREE" | "PREMIUM" | "ENTERPRISE";

const DAILY_LIMIT={
    FREE:2,
    PREMIUM:10,
    ENTERPRISE:1000
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



export async function logApiRequest(userId:string | undefined,endpoint:string,success:boolean){

    if(!userId){
        return
    }
    await prisma.apiRequest.create({
        data:{
            userId,
            success,
            endpoint
        }
    })

}