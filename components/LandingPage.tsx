'use client'
import { useRouter } from "next/navigation"
import { useEffect } from "react";




export default function LandingPage(){
    const router = useRouter();
    useEffect(()=>{
        router.push('/getstarted')
    })
    return <div>
        
    </div>
}