"use server"

import { scrapClips } from "@/app/lib/scrap_clips";
import { NextResponse } from "next/server";

let status = "stopped";



export async function GET() {

    const response = NextResponse.json({
        status: status
    })

    return response
}

export async function POST(request: Request) {
    try {
        const body = await request.json();
        
        if (!body.key) {
            throw "no key"
        }
        
    } catch (error) {
        console.log(error)
    }
}

