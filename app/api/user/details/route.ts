import { auth } from "@/lib/auth";
import { NextRequest, NextResponse } from "next/server";
import prisma from "@/db";
import userSchema from "@/types/UserUpdate";


export async function PUT(req:NextRequest){
    const session = await auth();
    if(!session?.user){
        return NextResponse.json({
            msg:"Unauthorized"
        },{
            status:403
        })
    }


    try{
        const body = await req.json();
        const parsedBody = userSchema.parse(body)
        const {email,name} = parsedBody;

        const response = await prisma.user.update({
            where:{
                id:session.user.id
            },
            data:{
                email,
                name
            }
        })
    }
    catch(e){
        console.log(e);
        return NextResponse.json({
            msg:"Error while updating user details"
        },{
            status:500
        })
    }

}