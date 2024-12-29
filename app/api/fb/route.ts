import { NextResponse } from 'next/server';
import { PostPhotoWithMessageFB, PostVideo } from '@/app/lib/lib_fb'

export async function GET() {

    const response = NextResponse.json({
        message: 'Nothing to get here'
    })

    return response
}


export async function POST(request: Request) {
    try {
        const body = await request.json();

        // Vérifier que les paramètres nécessaires sont présents
        if ((!body.photo_url && !body.video_url) || !body.message) {
            return NextResponse.json(
                {
                    message: 'Les paramètres photo_url ou video_url et message sont obligatoires',
                },
                { status: 400 } // Retourne un statut 400 en cas d'erreur
            );
        }

        // Publier une photo ou une vidéo selon les paramètres fournis
        if (body.photo_url) {
            await PostPhotoWithMessageFB(body.photo_url, body.message);
            return NextResponse.json({
                message: 'Publication d\'une photo en cours sur la page Facebook',
            });
        } else if (body.video_url) {
            await PostVideo(body.video_url, body.message);
            return NextResponse.json({
                message: 'Publication d\'une vidéo en cours sur la page Facebook',
            });
        }

        // Si ni photo ni vidéo n'est fournie (cas improbable ici)
        return NextResponse.json(
            {
                message: 'Aucun contenu valide à publier',
            },
            { status: 400 }
        );
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

