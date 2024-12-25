import { auth } from "@/lib/auth";
import { NextRequest, NextResponse } from "next/server";
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
        const {name,url}=body;
        const checkExistingUrl= await prisma.website.findUnique({
            where:{
                url
            }
        })

        const user = await prisma.user.findUnique({
            where:{
                id:session.user.id
            }
        })
        if(!user){
            return NextResponse.json({
                msg:"No user found"
            },{
                status:404
            })
        }



        // const websiteLimit = PLAN_LIMITS[user.plan]
        // if(user._count.registeredWebsites>=websiteLimit){
        //     return NextResponse.json({
        //         msg:`You have reached the maximum limits of ${websiteLimit} for your ${user.plan} plan `
        //     })
        // }

        if(checkExistingUrl){
            return NextResponse.json({
                msg:"Website with this URL already exists"
            })
        }

        const response = await prisma.website.create({
            data:{
                name,
                url,
                userId:session.user.id,
            }
        })


        return NextResponse.json({
            msg:"Website added successfully",
            response
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



