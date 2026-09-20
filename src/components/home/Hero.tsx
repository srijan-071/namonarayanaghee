import HeroCarousel from "./HeroCarousel";
import type { HeroMedia } from "./MediaRenderer";
import slidesData from "../../../reconstruction/hero-media.json";

export default function Hero() {
  const slides: HeroMedia[] = slidesData as HeroMedia[];
  return <HeroCarousel slides={slides} />;
}
