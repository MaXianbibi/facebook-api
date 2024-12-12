import { NextResponse } from 'next/server';
import { PostPhotoWithMessageFB } from '@/app/lib/lib_fb'

export async function GET() {

    const response = NextResponse.json({
        message: 'Nothing to get here'
    })

    return response
}


export async function POST(request: Request) {
    try {
        const body =  await request.json();

        if (!body.photo_url || !body.message) {
            return NextResponse.json(
                {
                    message: 'Les paramètres photo_url et message sont obligatoires',
                },
                { status: 400 } // Retourne un statut 400 en cas d'erreur
            );
        }
        await PostPhotoWithMessageFB(body.photo_url ,body.message);
        return NextResponse.json({
            message: 'POST EN COURS SUR LA PAGE FB'
        });
    } catch (error) {
        console.error('Erreur lors du traitement de la requête POST :', error);

        return NextResponse.json(
            {
                message: 'Erreur lors du traitement de la requête',
                error: (error as Error).message,
            },
            { status: 400 } // Retourne un statut 400 en cas d'erreur
        );
    }
}
