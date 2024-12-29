import axios from 'axios';
import FormData from 'form-data';
import fs from 'fs';


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


export async function PostVideo(filePath: string, message: string) {
    try {
        // Récupérer le token Facebook depuis les variables d'environnement
        const fb_token = process.env.FB_TOKEN;
        if (!fb_token) throw new Error('FB_TOKEN est manquant dans les variables d\'environnement.');
    

        // ID de la page Facebook
        const pageId = process.env.FB_APP_ID // Remplacez par votre Page ID
        
        if (!pageId) throw new Error('FB_APP_ID est manquant dans les variables d\'environnement.');

        // URL de l'API Graph pour publier une vidéo
        const url = `https://graph.facebook.com/v21.0/${pageId}/videos`;

        // Préparer les données pour l'envoi de fichier
        const formData = new FormData();
        formData.append('description', message); // Ajout du message
        formData.append('access_token', fb_token); // Ajout du token d'accès
        formData.append('file', fs.createReadStream(filePath)); // Charger le fichier vidéo local

        // Envoyer la requête POST
        const response = await axios.post(url, formData, {
            headers: {
                ...formData.getHeaders(), // Inclure les en-têtes nécessaires pour le multipart/form-data
            },
        });

        // Vérification de la réponse
        console.log('Vidéo publiée avec succès :', response.data);
        return true;
    } catch (error) {
        // Gestion des erreurs
        if (axios.isAxiosError(error)) {
            console.error('Erreur Axios:', error.response?.data || error.message);
        } else {
            console.error('Erreur inattendue:', error);
        }
        return false;
    }
}
