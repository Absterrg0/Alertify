import { auth } from "@/lib/auth";
import { NextResponse } from "next/server";
import prisma from "@/db";



export async function GET(){
    const session = await auth();
    if(!session?.user||!session.user.id){
        return NextResponse.json({
            msg:"Unauthorized"
        },{
            status:403
        })
    }

    try{
        const response = await prisma.alert.findMany({
            where:{
                userId:session.user.id
            }
        })

        return NextResponse.json({
            response
        },{
            status:201
        })

    }
    catch(e){
        console.error(e);
        return NextResponse.json({
            msg:"Error occurred while listing the alerts"
        },{
            status:500
        })
    }
}