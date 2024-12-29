"use server"

import cron from "node-cron";
import { scrapClips } from "@/app/lib/scrap_clips";

let status = "stopped";

// cron.schedule("0 */3 * * *", async () => {
//     console.log("Tâche planifiée : Scraping démarré");
//     try {
//       await scrapClips();
//     } catch (error) {
//       console.error("Erreur lors du scraping :", error);
//     }
//   });


cron.schedule("*/5 * * * *", async () => {
    console.log("Tâche planifiée : Scraping démarré");
    try {
        status = "running";
        await scrapClips();
        console.log("Tâche terminée avec succès.");
    } catch (error) {
        console.error("Erreur lors du scraping :", error);
    }
    status = "stopped";
});


export async function GET() {
    return {
        status: 200,
        body: {
            message: "cron-job",
            status: status,
        },
    };
}
