"use client"
import { scrapClips } from "@/app/lib/scrap_clips";

async function handleClick() {
  try {
    await scrapClips();
  } catch (error) {
    console.error('Erreur lors de l\'initialisation du scraping :', error);
  }
}

export default function Home() {
  return (
    <>
      <button onClick={handleClick}>
        Click on me !
      </button>
    </>
  );
}
