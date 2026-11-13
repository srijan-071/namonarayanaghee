"use client";

import { useState, useRef, useCallback } from "react";

interface TiltState {
  rotateX: number;
  rotateY: number;
  scale: number;
  glareX: number;
  glareY: number;
  glareOpacity: number;
}

export function use3DTilt(maxTilt = 10, scale = 1.02) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [tilt, setTilt] = useState<TiltState>({
    rotateX: 0,
    rotateY: 0,
    scale: 1,
    glareX: 50,
    glareY: 50,
    glareOpacity: 0,
  });

  const onMouseMove = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (!cardRef.current) return;
      const rect = cardRef.current.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      const centerX = rect.width / 2;
      const centerY = rect.height / 2;

      const normX = (x - centerX) / centerX;
      const normY = (y - centerY) / centerY;

      const rotX = -normY * maxTilt;
      const rotY = normX * maxTilt;

      const glareX = (x / rect.width) * 100;
      const glareY = (y / rect.height) * 100;

      setTilt({
        rotateX: rotX,
        rotateY: rotY,
        scale,
        glareX,
        glareY,
        glareOpacity: 0.25,
      });
    },
    [maxTilt, scale]
  );

  const onMouseLeave = useCallback(() => {
    setTilt({
      rotateX: 0,
      rotateY: 0,
      scale: 1,
      glareX: 50,
      glareY: 50,
      glareOpacity: 0,
    });
  }, []);

  const cardStyle: React.CSSProperties = {
    transform: `perspective(1000px) rotateX(${tilt.rotateX.toFixed(2)}deg) rotateY(${tilt.rotateY.toFixed(2)}deg) scale3d(${tilt.scale}, ${tilt.scale}, 1)`,
    transition: tilt.scale === 1 ? "transform 0.5s cubic-bezier(0.25, 1, 0.5, 1)" : "none",
    willChange: "transform",
  };

  const glareStyle: React.CSSProperties = {
    position: "absolute",
    inset: 0,
    pointerEvents: "none",
    background: `radial-gradient(circle at ${tilt.glareX}% ${tilt.glareY}%, rgba(52, 211, 153, ${tilt.glareOpacity}), transparent 60%)`,
    transition: "opacity 0.3s ease",
    borderRadius: "inherit",
    zIndex: 10,
  };

  return {
    cardRef,
    cardStyle,
    glareStyle,
    onMouseMove,
    onMouseLeave,
  };
}

