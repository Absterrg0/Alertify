import { auth } from "@/lib/auth";
import websiteSchema from "@/types/WebsiteSchema";
import { NextRequest, NextResponse } from "next/server";
import prisma from "@/db";
export async function PUT(req:NextRequest,{params}:{params:{id:string}}){
    const session = await auth();
    if(!session?.user||!session.user.id){
        return NextResponse.json({
            msg:"Unauthorized"
        },{
            status:403
        })
    }

    try{
        const id = params.id;
        const body = await req.json();
        const parsedBody = websiteSchema.parse(body)
        const {name} = parsedBody;
        const response = await prisma.website.update({
            where:{
                id,
                userId:session.user.id
            },data:{
                name
            }
        })
        return NextResponse.json({
            msg:"Name of the website successfully updated"
        },{
            status:201
        })
    }
    catch(e){
        console.error(e);
        return NextResponse.json({
            msg:"Error while updating website"
        },{
            status:500
        })
    }
}




export async function DELETE(req:NextRequest,{params}:{params:{id:string}}){
    const session = await auth();
    if(!session?.user||!session.user.id){
        return NextResponse.json({
            msg:"Unauthorized"
        },{
            status:403
        })
    }

        try{
            const id = params.id;
            await prisma.website.update({
                where:{
                    id,
                    userId:session.user.id
                },
                data:{
                    status:"DEACTIVATED"
                }
            })
            return NextResponse.json({
                msg:"Website successfully deactivated"
            },{
                status:201
            })
        } 
        catch(e){
            console.error(e);
            return NextResponse.json({
                msg:"Error while deleting website"
            },{
                status:500
            })
        }
}