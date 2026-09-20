import Image from "next/image";
import { cn } from "@/lib/utils";

interface AtmosphereProps {
  image?: string;
  opacity?: number;
  tint?: "forest" | "cream" | "earth" | "none";
  position?: "center" | "top" | "bottom";
  blur?: boolean;
  gradient?: "bottom" | "top" | "radial" | "none";
  className?: string;
}

export function Atmosphere({
  image,
  opacity = 0.08,
  tint = "none",
  position = "center",
  blur = false,
  gradient = "none",
  className,
}: AtmosphereProps) {
  // Map tint to color layers
  const tintClass = {
    forest: "bg-nn-forest-deep mix-blend-multiply",
    cream: "bg-nn-cream mix-blend-screen",
    earth: "bg-nn-earth mix-blend-multiply",
    none: "",
  }[tint];

  // Gradient masks
  const gradientClass = {
    bottom: "bg-gradient-to-t from-nn-bg via-nn-bg/50 to-transparent",
    top: "bg-gradient-to-b from-nn-bg via-nn-bg/50 to-transparent",
    radial: "bg-[radial-gradient(circle_at_center,transparent_0%,var(--color-nn-bg)_100%)]",
    none: "",
  }[gradient];

  const posClass = {
    center: "object-center",
    top: "object-top",
    bottom: "object-bottom",
  }[position];

  return (
    <div className={cn("absolute inset-0 z-0 overflow-hidden pointer-events-none select-none", className)}>
      {image && (
        <Image
          src={image}
          alt=""
          fill
          className={cn("object-cover", posClass, blur && "blur-sm")}
          style={{ opacity }}
        />
      )}
      
      {tint !== "none" && <div className={cn("absolute inset-0 opacity-50", tintClass)} />}
      
      {gradient !== "none" && <div className={cn("absolute inset-0", gradientClass)} />}
    </div>
  );
}
