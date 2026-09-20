"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";

export type HeroMedia = 
  | { type: "image"; src: string; alt?: string; href?: string }
  | { type: "gif"; src: string; alt?: string; href?: string }
  | { type: "video"; src: string; poster?: string; href?: string; autoplay?: boolean; loop?: boolean; muted?: boolean };

interface Props {
  media: HeroMedia;
  isActive: boolean;
  priority?: boolean;
}

export default function MediaRenderer({ media, isActive, priority = false }: Props) {
  const videoRef = useRef<HTMLVideoElement>(null);

  // Handle play/pause when the slide becomes active/inactive
  useEffect(() => {
    if (media.type === "video" && videoRef.current) {
      if (isActive) {
        // Start playing when active
        const playPromise = videoRef.current.play();
        if (playPromise !== undefined) {
          playPromise.catch(() => {
            // Auto-play was prevented
          });
        }
      } else {
        // Pause when inactive to save resources
        videoRef.current.pause();
      }
    }
  }, [isActive, media.type]);

  const content = (
    <div className="relative w-full h-full">
      {media.type === "video" ? (
        <video
          ref={videoRef}
          src={media.src}
          poster={media.poster}
          playsInline
          muted={media.muted ?? true}
          loop={media.loop ?? true}
          preload={priority ? "auto" : "none"}
          className="w-full h-full object-cover object-center"
        />
      ) : (
        <Image
          src={media.src}
          alt={media.alt || "Hero banner"}
          fill
          priority={priority}
          sizes="100vw"
          className="object-cover object-center"
          unoptimized={media.type === "gif"} // Don't optimize animated GIFs
        />
      )}
    </div>
  );

  if (media.href) {
    return (
      <Link href={media.href} className="block w-full h-full" tabIndex={isActive ? 0 : -1}>
        {content}
      </Link>
    );
  }

  return content;
}
