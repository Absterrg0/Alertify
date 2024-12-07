import { auth } from "@/lib/auth";
import { NextRequest, NextResponse } from "next/server";
import prisma from "@/db";




export async function GET(req:NextRequest){
    const session = await auth();
    if(session?.user||!session?.user?.id){
        return NextResponse.json({
            msg:"Unauthorized"
        },{
            status:403
        })
    }
    try{

        const response = await prisma?.website.findMany({
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
            msg:"Error while fetching the websites"
        },{
            status:500
        })
    }
}