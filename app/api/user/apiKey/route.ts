import { auth } from "@/lib/auth";
import { NextRequest, NextResponse } from "next/server";
import prisma from "@/db";



export async function GET(){
    const session = await auth();
    if(!session||!session.user){
        return NextResponse.json({
            msg:"Unauthorized"
        },{
            status:403
        })
    }

    try{
        const response = await prisma?.user.findUnique({
            where:{
                id:session.user.id
            },select:{
                apiKey:true,
                droplertId:true
            }
        })
        return NextResponse.json(response,{
            status:200
        })

    }catch(e){
        console.error(e);
        return NextResponse.json({
            msg:"Error while fetching apiKey"
        },{
            status:500
        })
    }
}



export async function PUT(req:NextRequest){
    const session = await auth();
    if(!session||!session.user){
        return NextResponse.json({
            msg:"Unauthorized"
        },{
            status:403
        })
    }

    try{   
        const body = await req.json();
        const {apiKey}=body;

        await prisma.user.update({
            where:{
                id:session.user.id
            },data:{
                apiKey
            }
        })
        return NextResponse.json({
            msg:"Successfully updated the api key"
        })
    }
    catch(e){
        console.error(e);
        return NextResponse.json({
            msg:"Error while updating the api key"
        },{
            status:500
        })
    }
}