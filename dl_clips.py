import subprocess
import re

import sys

# Vérifie si un argument est passé
first_arg = None
if len(sys.argv) > 1:
    first_arg = sys.argv[1]
    print(f"Premier argument : {first_arg}")
else:
    print("Aucun argument n'a été passé.")


# Paramètres du clip Twitch
CLIP_ID =  first_arg # Remplace avec l'ID du clip
SAVE_PATH = "./clips"  # Chemin où sauvegarder le fichier téléchargé

# Construire l'URL du clip à partir de l'ID
clip_url = f"https://clips.twitch.tv/{CLIP_ID}"

# Nettoyer le titre pour nommer correctement le fichier
clip_title = re.sub(r'\W+', '_', CLIP_ID)

# Fonction pour télécharger un clip avec yt-dlp
def download_clip_with_ytdlp(url, save_path):
    print(f"Téléchargement du clip depuis : {url}")
    try:
        # Commande yt-dlp pour télécharger le clip
        subprocess.run([
            "yt-dlp", 
            "-o", f"{save_path}/{clip_title}.mp4",  # Nom du fichier de sortie
            url
        ], check=True)
        print(f"Clip téléchargé avec succès : {save_path}/{clip_title}.mp4")
        return True
    except subprocess.CalledProcessError as e:
        print(f"Erreur lors du téléchargement : {e}")

# Exécution principale
if __name__ == "__main__":
    download_clip_with_ytdlp(clip_url, SAVE_PATH)
