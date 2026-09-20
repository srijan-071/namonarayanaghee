import fs from "fs";
import path from "path";
import HeroCarousel from "./HeroCarousel";
import type { HeroMedia } from "./MediaRenderer";

export default function Hero() {
  let slides: HeroMedia[] = [];
  try {
    const filePath = path.join(process.cwd(), "reconstruction", "hero-media.json");
    const fileContents = fs.readFileSync(filePath, "utf8");
    slides = JSON.parse(fileContents);
  } catch (error) {
    console.error("Failed to load hero-media.json:", error);
  }

  return <HeroCarousel slides={slides} />;
}
