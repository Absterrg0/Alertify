import { auth } from "@/lib/auth";
import { NextRequest, NextResponse } from "next/server";
import websiteSchema from "@/types/WebsiteSchema";
import prisma from "@/db";


export async function POST(req:NextRequest){

    const session = await auth();
    if(!session?.user||!session.user.id){
        return NextResponse.json({
            msg:"Unauthorized"
        },{
            status:403
        })
    }

    try{
        const body = await req.json();
        const parsedBody = websiteSchema.parse(body)
        const {name,URL}=parsedBody;
        const checkExistingUrl= await prisma.website.findFirst({
            where:{
                URL
            }
        })
        if(checkExistingUrl){
            return NextResponse.json({
                msg:"Website with this URL already exists"
            })
        }
        //CHECK IF THE USER WHO IS ADDING THE WEBSITE IS THE OWNER OF THE WEBSITE OR NOT
        const checkValidity=2;

        const response = await prisma.website.create({
            data:{
                name,
                URL,
                userId:session.user.id,
            }
        })

        return NextResponse.json({
            msg:"Website added successfully"
        },{
            status:201
        })

    }
    catch(e){
        console.error(e);
        return NextResponse.json({
            msg:"Error while adding website"
        },{
            status:500
        })
    }
}



