import { auth } from "@/lib/auth";
import { NextRequest, NextResponse } from "next/server";
import axios from "axios";




export async function POST(req:NextRequest){
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
        const {websiteURL} = body;

        const validWebsite = await prisma?.website.findFirst({
            where:{
                url:websiteURL,
                userId:session.user.id
            },
            include:{
                user:true
            }
        })

        if(!validWebsite){
            return NextResponse.json({
                msg:"Not a valid website for this user"
            })
        }

        const apiKey = validWebsite.user.apiKey;

        const response = await axios.post(`${websiteURL}/droplert/verify`,null,
            {headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${apiKey}`
            }
        })



        if(response.status === 200){
            return NextResponse.json({
                msg:"Api Key Validation successful"
            })
        }
        else{
            return NextResponse.json({
                msg:"Api key validation is not successful"
            })
        }




    }
    catch(e){
        console.error(e);
        return NextResponse.json({
            msg:"Error while sending test request"
        })
    }
}