import axios from 'axios';

export async function PostPhotoWithMessageFB(photoUrl: string, message: string): Promise<void> {
    try {
        // Récupérer le token Facebook depuis les variables d'environnement
        const fb_token = process.env.FB_TOKEN;
        if (!fb_token) {
            throw new Error('FB_TOKEN est manquant dans les variables d’environnement.');
        }

        // URL de l'API Graph pour publier une photo avec un message
        const url = `https://graph.facebook.com/v21.0/514277571765765/photos`;

        // Construire les données pour la requête
        const data = {
            url: photoUrl, // URL de la photo
            caption: message, // Texte qui accompagne la photo (message)
            access_token: fb_token, // Token d'accès à la page
        };

        // Envoyer la requête POST à l'API Graph
        const response = await axios.post(url, data);

        // Vérifier la réponse
        console.log('Post publié avec succès :', response.data);
    } catch (error) {
        // Gestion des erreurs
        if (axios.isAxiosError(error)) {
            console.error('Erreur Axios:', error.response?.data || error.message);
        } else {
            console.error('Erreur inattendue:', error);
        }
    }
}
