import { auth } from "@/lib/auth";
import { NextRequest, NextResponse } from "next/server";
import prisma from "@/db";
import alertSchema from "@/types/AlertSchema";

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
        const alertId=params.id;
        const body = await req.json();
        const parsedBody =  alertSchema.parse(body)
        const {title,description,layoutId}=parsedBody;
        const checkAlert= await prisma.alerts.findFirst({
            where:{
                id:alertId,
                userId:session.user.id
            }
        })

        if(!checkAlert){
            return NextResponse.json({
                msg:"No alert found "
            })
        }

        const response = await prisma.alerts.update({
            where:{
                id:alertId,
                userId:session.user.id
            },
            data:{
                title,
                description,
                layoutId
            }
        })
        return NextResponse.json({
            msg:"Alert successfully updated"
        })

    }
    catch(e){
        return NextResponse.json({
            msg:"Error updating alert"
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
        const alertId=params.id

        const checkExistingAlert = await prisma.alerts.findFirst({
            where:{
                id:alertId,
                userId:session.user.id
            }
        })

        if(!checkExistingAlert){
            return NextResponse.json({
                msg:"No alert exists"
            })
        }

        await prisma.alerts.delete({
            where:{
                id:alertId,
                userId:session.user.id
            }
        })


        return NextResponse.json({
            msg:"Alert successfully deleted"
        },{
            status:200
        })

    }
    catch(e){
        console.error(e);
        return NextResponse.json({
            msg:"Error deleting alert"
        },{
            status:500
        })
    }
}