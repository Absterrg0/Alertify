import { auth } from "@/lib/auth";
import { NextRequest, NextResponse } from "next/server";
import prisma from "@/db";
import userSchema from "@/types/UserUpdate";
import { ZodError } from "zod";

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
        await prisma.user.update({
            where:{
                id:session.user.id
            },
            data:{
                email,
                name
            }
        })
        return NextResponse.json({ message: "Profile updated" });
    }
    catch(e){
        if (e instanceof ZodError) {
            return NextResponse.json({ message: "Enter a valid name and email" }, { status: 400 });
        }
        console.error("Failed to update user details", e);
        return NextResponse.json({
            message:"Error while updating user details"
        },{
            status:500
        })
    }

}
