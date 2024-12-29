"use server"

import { scrapClips } from "@/app/lib/scrap_clips";
import { NextResponse } from "next/server";

let status = "stopped";


export async function GET(request: Request): Promise<Response> {
    // Récupération des paramètres de requête
    const { searchParams } = new URL(request.url);
    const key = searchParams.get("key");

    // Vérification de la clé API
    if (key !== process.env.API_KEY) {
        return NextResponse.json({ message: "Invalid key" }, { status: 401 });
    }

    // Réponse avec le statut
    return NextResponse.json({ status: "OK" });
}

export async function POST(request: Request): Promise<Response> {
    try {
        const body = await request.json();

        // Validation de la clé transmise
        if (!body.key) {
            return NextResponse.json({ message: "Key is required" }, { status: 400 });
        }

        // Vérification de la clé API dans les variables d'environnement
        const api_key: string | undefined = process.env.API_KEY;
        if (!api_key) {
            console.error("Server misconfiguration: API_KEY is missing");
            return NextResponse.json({ message: "Server misconfiguration: API_KEY is missing" }, { status: 500 });
        }

        if (body.key !== api_key) {
            return NextResponse.json({ message: "Invalid key" }, { status: 401 });
        }

        // Réponse réussie
        return NextResponse.json({ message: "Cron job started" }, { status: 200 });

    } catch (error) {
        console.error("Error in API endpoint:", error);
        return NextResponse.json(
            { message: "Internal server error", error: error instanceof Error ? error.message : String(error) },
            { status: 500 }
        );
    }
}

