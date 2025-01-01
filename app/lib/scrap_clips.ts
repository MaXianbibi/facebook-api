"use server"

import puppeteer, { Browser, Page, ElementHandle } from 'puppeteer';

import fs from 'fs';

import { spawn } from 'child_process';
import path from 'path';
import { PostVideo } from './lib_fb';

const clipDescriptions: string[] = [
  "An epic moment of pure skill and precision!",
  "You won't believe what happens in this clip!",
  "A hilarious fail that will make your day.",
  "Unstoppable gameplay showcasing insane talent.",
  "When strategy meets perfect execution – must watch!",
  "A clutch moment that had everyone on the edge of their seat.",
  "This clip is a rollercoaster of emotions!",
  "A perfectly timed reaction that will make you laugh out loud.",
  "The ultimate showcase of teamwork and coordination.",
  "One of the funniest in-game interactions ever caught on stream.",
  "An unbelievable comeback you have to see to believe.",
  "This moment proves why they're a top player in the game.",
  "An intense battle with an epic finish!",
  "A creative play that left the opponents speechless.",
  "The chat went wild for this jaw-dropping moment.",
  "Proof that sometimes luck is all you need.",
  "An iconic clip showcasing pure entertainment.",
  "An unexpected twist that no one saw coming.",
  "A wholesome moment that will warm your heart.",
  "This highlight is Twitch gold – you can't miss it!"
];


// URL de la page à scraper

let browser: Browser | null = null;
let page: Page | null = null;

async function init_scrapping() {
  browser = await puppeteer.launch({
      headless: true,
      args: [
        "--no-sandbox",
        "--disable-setuid-sandbox",
        "--disable-dev-shm-usage",
      ]
    });

  if (!browser) {
      console.log("Échec du lancement du navigateur");
      throw new Error("Échec du lancement du navigateur");
  }

  page = await browser.newPage();
  await page.setExtraHTTPHeaders({ "Accept-Language": "en-US,en;q=0.9" });
  await page.setViewport({ width: 1080, height: 1024 });

  await page.setUserAgent(
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
    );
}

async function get_id_clips(clips: ElementHandle<Element>[], index: number = 0) {
    if (!page) {
        throw new Error("Page non initialisée");
    }

    return await page.evaluate(
        (el) => el.querySelector('.clip-tp')?.getAttribute('data-litebox') || null,
        clips[index] // Accéder au 5ᵉ élément
      );
}

export async function scrapClips() : Promise<string | void> {
    try {
        await init_scrapping();

        if (!page || !browser) {
            throw new Error("Navigateur ou page non initialisé");
        }
        await page.goto("https://twitchtracker.com/clips", { waitUntil: "networkidle0" });
        const clips = await page.$$('.clip-entity');

        if (!clips) {
            throw new Error("Élément '.clip-entity' non trouvé");
        }

        
        let index = 0; 
        let clip : string | null = null;
        while (true) {
            clip = await get_id_clips(clips, index)
            if (!clip) {
                throw new Error("ID du clip non trouvé");
            }

            clip = clip.split('=').at(-1) ?? null;

            if (!clip) {
                throw new Error("Clip manquant");
            }

            if (await saveIds([clip])) {
                break ;
            }
            index++;
        }

        if (!clip) {
            throw new Error("ID du clip non trouvé");
        }

        await dl_clip(clip);
        const clipsDir = path.join(process.cwd(), 'clips');

        let i = 0;
        let files : string[] = [];
        while (i < 10) {
            try {
                if (!fs.existsSync(clipsDir)) {
                    await new Promise((resolve) => setTimeout(resolve, 5000));
                    continue;
                  }

                files = fs.readdirSync(clipsDir);
                if (files.length > 0) {
                    break ;
                }
                
                await new Promise((resolve) => setTimeout(resolve, 5000));
                i++;
            } catch (error) {
              console.error(error);
            }
        }
        
        const description = clipDescriptions[Math.floor(Math.random() * clipDescriptions.length)] + "\n What y'all think about this ? 🤔 \n.\n.\n.\n.\n.\n.\n.\n.\n.\n.\n.\n";
        const tags = "#Twitch, #TwitchClips, #Gaming, #LiveStreaming, #Streamer, #GamingHighlights, #EpicMoments, #FunnyMoments, #GamePlay, #BestPlays, #ProGamer, #ClutchMoments, #Esports, #Fails, #StreamerLife, #Gamers, #TwitchFails, #TwitchMoments, #TwitchCommunity, #TwitchHighlights";

        await PostVideo(`${clipsDir}/${files[0]}`, description + tags);
        browser.close();
        fs.unlink(`${clipsDir}/${files[0]}`, (err) => {
            if (err) {
                console.error('Erreur lors de la suppression du fichier :', err);
                return;
            }
            console.log('Fichier supprimé avec succès.');
        });

        return clip;
    }
    catch (error) {
        console.error('Erreur lors de l\'initialisation du scraping :', error);
        return;
    }
}

async function saveIds(ids: string[]) {
    const filePath = 'ids.json';
  
    try {
      // Lire les IDs existants
      let existingIds = [];
      try {
        const data = await fs.promises.readFile(filePath, 'utf-8');
        existingIds = JSON.parse(data);
      } catch (error) {
        console.error('Fichier non trouvé, création d\'un nouveau.', error);
      }
  
      // Identifier les IDs déjà présents
      const duplicateIds = ids.filter((id) => existingIds.includes(id));
      if (duplicateIds.length > 0) {
        console.log('Certains IDs sont déjà présents:', duplicateIds);
        return false; // Retourne false si au moins un ID est déjà présent
      }
  
      // Ajouter les nouveaux IDs et sauvegarder
      const uniqueIds = Array.from(new Set([...existingIds, ...ids]));
      fs.writeFile(filePath, JSON.stringify(uniqueIds, null, 2), (err) => {
        if (err) throw err;
        console.log('Les nouveaux IDs ont été sauvegardés.');
      });
  
      console.log('Les nouveaux IDs ont été sauvegardés.');
      return true; // Retourne true si les IDs ont été ajoutés
    } catch (error) {
      console.error('Erreur lors de la sauvegarde des IDs :', error);
      return false; // Retourne false en cas d’erreur
    }
  }

async function dl_clip(clips_name : string) {
    const script = spawn('python3', ['./dl_clips.py', clips_name]); // Spécifiez 'python3' ou 'python' selon votre configuration

    script.on('close', (code) => {
        if (code === 0) {
          console.log('Script Python exécuté avec succès.');
        } else {
          console.error(`Script Python terminé avec le code : ${code}`);
        }
      });
}