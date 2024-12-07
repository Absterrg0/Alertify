import { auth } from "@/lib/auth";
import alertSchema from "@/types/AlertSchema";
import { NextRequest, NextResponse } from "next/server";




export async function POST(req:NextRequest){
    const session = await auth();
    if(!session?.user||!session.user?.id){
        return NextResponse.json({
            msg:"Unauthorized"
        },{
            status:403
        })
    }

    try{
        const body = await req.json();
        const parsedBody = alertSchema.parse(body)
        const {title,description,layoutId}=parsedBody;

        await prisma?.alerts.create({
            data:{
                title,
                description,
                layoutId,
                userId:session.user.id
            }
        })
        return NextResponse.json({
            msg:"Alert successfully created"
        },{
            status:201
        })
    }
    catch(e){
        console.error(e);
        return NextResponse.json({
            msg:"Error while adding alert"
        },{
            status:500
        })
    }
}