import { auth } from "@/lib/auth";
import { NextRequest, NextResponse } from "next/server";
import prisma from "@/db";
import userSchema from "@/types/UserUpdate";
import crypto, { randomBytes } from 'crypto'

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
        const apiKey = randomBytes(32).toString('hex');
        const response = await prisma.user.update({
            where:{
                id:session.user.id
            },
            data:{
                email,
                name,
                apiKey
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