"use client";

import React, { useEffect, useRef, useState, useCallback } from "react";
import { Sparkles, Flame } from "lucide-react";

interface SparkleParticle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  alpha: number;
  decay: number;
  color: string;
  rotation: number;
  vRot: number;
  isStar?: boolean;
}

interface FloatingEmber {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  alpha: number;
  maxAlpha: number;
  color: string;
  oscillationSpeed: number;
  oscillationDistance: number;
  angle: number;
}

const GOLD_PALETTE = [
  "#FFD700", // Gold
  "#FFA500", // Amber
  "#FF8C00", // Dark Orange
  "#F5BD47", // Vedic Gold
  "#FFE57F", // Light Gold
  "#FF6F00", // Saffron Flame
  "#FFF9C4", // Cream Glow
  "#FFFFFF", // Pure White Core
];

export default function DiwaliEffects() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isEnabled, setIsEnabled] = useState(true);
  const [isClient, setIsClient] = useState(false);
  const [leftDiyaActive, setLeftDiyaActive] = useState(false);
  const [rightDiyaActive, setRightDiyaActive] = useState(false);

  const particlesRef = useRef<SparkleParticle[]>([]);
  const embersRef = useRef<FloatingEmber[]>([]);
  const lastMousePos = useRef<{ x: number; y: number } | null>(null);
  const animationFrameId = useRef<number | null>(null);

  // Check prefers-reduced-motion
  useEffect(() => {
    setIsClient(true);
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (mediaQuery.matches) {
      setIsEnabled(false);
    }
    const saved = localStorage.getItem("nn_diwali_effects");
    if (saved !== null) {
      setIsEnabled(saved === "true");
    }
  }, []);

  const toggleEffects = () => {
    setIsEnabled((prev) => {
      const next = !prev;
      localStorage.setItem("nn_diwali_effects", String(next));
      return next;
    });
  };

  // Spawn firework burst at coordinates
  const triggerFireworkBurst = useCallback((cx: number, cy: number, count = 35) => {
    if (!isEnabled) return;
    for (let i = 0; i < count; i++) {
      const angle = (Math.PI * 2 * i) / count + (Math.random() - 0.5) * 0.5;
      const speed = Math.random() * 5 + 2.5;
      const color = GOLD_PALETTE[Math.floor(Math.random() * GOLD_PALETTE.length)];
      particlesRef.current.push({
        x: cx,
        y: cy,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed - 1.5,
        size: Math.random() * 3.5 + 1.5,
        alpha: 1,
        decay: Math.random() * 0.02 + 0.015,
        color,
        rotation: Math.random() * Math.PI,
        vRot: (Math.random() - 0.5) * 0.2,
        isStar: Math.random() > 0.4,
      });
    }
  }, [isEnabled]);

  // Main Canvas Animation Engine
  useEffect(() => {
    if (!isEnabled || !isClient) return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener("resize", handleResize, { passive: true });

    // Initialize floating background embers
    const emberCount = window.innerWidth < 768 ? 20 : 45;
    embersRef.current = Array.from({ length: emberCount }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      vx: (Math.random() - 0.5) * 0.4,
      vy: -(Math.random() * 0.8 + 0.3),
      size: Math.random() * 2.5 + 1,
      alpha: Math.random() * 0.6 + 0.2,
      maxAlpha: Math.random() * 0.5 + 0.3,
      color: GOLD_PALETTE[Math.floor(Math.random() * GOLD_PALETTE.length)],
      oscillationSpeed: Math.random() * 0.02 + 0.01,
      oscillationDistance: Math.random() * 20 + 10,
      angle: Math.random() * Math.PI * 2,
    }));

    // Mouse Move Sparkler Trail
    const handlePointerMove = (e: MouseEvent | TouchEvent) => {
      const clientX = "touches" in e ? e.touches[0].clientX : e.clientX;
      const clientY = "touches" in e ? e.touches[0].clientY : e.clientY;

      if (lastMousePos.current) {
        const dx = clientX - lastMousePos.current.x;
        const dy = clientY - lastMousePos.current.y;
        const dist = Math.hypot(dx, dy);

        // Spawn sparkler embers on movement
        const spawnCount = Math.min(6, Math.floor(dist / 8) + 1);
        for (let i = 0; i < spawnCount; i++) {
          const color = GOLD_PALETTE[Math.floor(Math.random() * GOLD_PALETTE.length)];
          const spreadAngle = Math.random() * Math.PI * 2;
          const spreadSpeed = Math.random() * 2.5 + 0.5;

          particlesRef.current.push({
            x: clientX + (Math.random() - 0.5) * 6,
            y: clientY + (Math.random() - 0.5) * 6,
            vx: (dx * 0.15) + Math.cos(spreadAngle) * spreadSpeed,
            vy: (dy * 0.15) + Math.sin(spreadAngle) * spreadSpeed - 0.8,
            size: Math.random() * 2.8 + 1.2,
            alpha: 1,
            decay: Math.random() * 0.035 + 0.02,
            color,
            rotation: Math.random() * Math.PI,
            vRot: (Math.random() - 0.5) * 0.3,
            isStar: Math.random() > 0.5,
          });
        }
      }
      lastMousePos.current = { x: clientX, y: clientY };
    };

    // Click Fireworks Burst
    const handlePointerDown = (e: MouseEvent) => {
      // Don't burst on interactive form inputs or buttons to avoid visual obstruction
      const target = e.target as HTMLElement;
      if (target && (target.tagName === "INPUT" || target.tagName === "BUTTON" || target.tagName === "SELECT" || target.tagName === "TEXTAREA")) {
        return;
      }
      triggerFireworkBurst(e.clientX, e.clientY, 28);
    };

    window.addEventListener("mousemove", handlePointerMove, { passive: true });
    window.addEventListener("touchmove", handlePointerMove, { passive: true });
    window.addEventListener("mousedown", handlePointerDown, { passive: true });

    // Periodic ambient Diwali micro-firework bursts in the background (every 7s)
    const fireworkTimer = setInterval(() => {
      if (document.hidden) return;
      const rx = Math.random() * width * 0.8 + width * 0.1;
      const ry = Math.random() * (height * 0.45) + height * 0.05;
      triggerFireworkBurst(rx, ry, window.innerWidth < 768 ? 18 : 28);
    }, 6500);

    // Animation Loop
    let running = true;
    const render = () => {
      if (!running) return;
      ctx.clearRect(0, 0, width, height);

      // 1. Draw and update ambient floating embers
      const embers = embersRef.current;
      for (let i = 0; i < embers.length; i++) {
        const emb = embers[i];
        emb.angle += emb.oscillationSpeed;
        emb.x += emb.vx + Math.sin(emb.angle) * 0.3;
        emb.y += emb.vy;

        // Wrap around viewport
        if (emb.y < -10) {
          emb.y = height + 10;
          emb.x = Math.random() * width;
        }
        if (emb.x < -10) emb.x = width + 10;
        if (emb.x > width + 10) emb.x = -10;

        ctx.save();
        ctx.beginPath();
        ctx.arc(emb.x, emb.y, emb.size, 0, Math.PI * 2);
        ctx.fillStyle = emb.color;
        ctx.globalAlpha = Math.sin(emb.angle) * 0.3 + 0.4;
        ctx.shadowBlur = 8;
        ctx.shadowColor = emb.color;
        ctx.fill();
        ctx.restore();
      }

      // 2. Draw and update sparkler particles
      const particles = particlesRef.current;
      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.x += p.vx;
        p.y += p.vy;
        p.vy += 0.12; // Gravity
        p.vx *= 0.96; // Air drag
        p.rotation += p.vRot;
        p.alpha -= p.decay;

        if (p.alpha <= 0) {
          particles.splice(i, 1);
          continue;
        }

        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rotation);
        ctx.globalAlpha = Math.max(0, p.alpha);
        ctx.fillStyle = p.color;
        ctx.shadowBlur = 10;
        ctx.shadowColor = p.color;

        if (p.isStar) {
          // 4-point sparkle star
          const s = p.size * 1.5;
          ctx.beginPath();
          ctx.moveTo(0, -s);
          ctx.quadraticCurveTo(0, 0, s, 0);
          ctx.quadraticCurveTo(0, 0, 0, s);
          ctx.quadraticCurveTo(0, 0, -s, 0);
          ctx.quadraticCurveTo(0, 0, 0, -s);
          ctx.fill();
        } else {
          // Glowing round ember
          ctx.beginPath();
          ctx.arc(0, 0, p.size, 0, Math.PI * 2);
          ctx.fill();
        }

        ctx.restore();
      }

      animationFrameId.current = requestAnimationFrame(render);
    };

    render();

    return () => {
      running = false;
      if (animationFrameId.current) cancelAnimationFrame(animationFrameId.current);
      clearInterval(fireworkTimer);
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("mousemove", handlePointerMove);
      window.removeEventListener("touchmove", handlePointerMove);
      window.removeEventListener("mousedown", handlePointerDown);
    };
  }, [isEnabled, isClient, triggerFireworkBurst]);

  if (!isClient) return null;

  return (
    <>
      {/* ─── 1. Fullscreen Sparkler & Firework Canvas (Pass-through clicks) ─── */}
      {isEnabled && (
        <canvas
          ref={canvasRef}
          className="fixed inset-0 pointer-events-none z-[8888] w-full h-full"
          aria-hidden="true"
        />
      )}

      {/* ─── 2. Top Corner Hanging Diwali Kandils (Festive Lanterns) ─── */}
      {isEnabled && (
        <div className="fixed top-0 inset-x-0 pointer-events-none z-[45] flex justify-between px-3 sm:px-8 select-none overflow-hidden h-40">
          {/* Left Hanging Kandil */}
          <div className="relative animate-kandil-sway-left origin-top transform-gpu">
            {/* Thread */}
            <div className="w-[1.5px] h-12 sm:h-16 bg-gradient-to-b from-amber-400 via-amber-600 to-amber-700 mx-auto shadow-xs" />
            {/* Lantern Core */}
            <div className="relative w-11 h-14 sm:w-14 sm:h-18">
              {/* Outer Golden Glow */}
              <div className="absolute inset-0 bg-amber-400/30 rounded-full blur-md animate-pulse" />
              {/* SVG Kandil */}
              <svg viewBox="0 0 100 120" className="w-full h-full drop-shadow-[0_4px_12px_rgba(245,189,71,0.6)]">
                {/* Diamond Body */}
                <polygon points="50,10 90,50 50,90 10,50" fill="url(#kandilGradLeft)" stroke="#F5BD47" strokeWidth="2.5" />
                {/* Inner Glow Center */}
                <circle cx="50" cy="50" r="16" fill="#FFF3B0" opacity="0.9" />
                <circle cx="50" cy="50" r="8" fill="#FFFFFF" />
                {/* Hanging Ribbons / Tassels */}
                <line x1="30" y1="90" x2="25" y2="120" stroke="#E67E22" strokeWidth="2" strokeDasharray="2,2" />
                <line x1="42" y1="90" x2="40" y2="125" stroke="#F5BD47" strokeWidth="2.5" />
                <line x1="50" y1="90" x2="50" y2="130" stroke="#FFF3B0" strokeWidth="3" />
                <line x1="58" y1="90" x2="60" y2="125" stroke="#F5BD47" strokeWidth="2.5" />
                <line x1="70" y1="90" x2="75" y2="120" stroke="#E67E22" strokeWidth="2" strokeDasharray="2,2" />
                <defs>
                  <linearGradient id="kandilGradLeft" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#8A1B14" />
                    <stop offset="50%" stopColor="#C48B28" />
                    <stop offset="100%" stopColor="#5E0B10" />
                  </linearGradient>
                </defs>
              </svg>
            </div>
          </div>

          {/* Right Hanging Kandil */}
          <div className="relative animate-kandil-sway-right origin-top transform-gpu">
            {/* Thread */}
            <div className="w-[1.5px] h-10 sm:h-14 bg-gradient-to-b from-amber-400 via-amber-600 to-amber-700 mx-auto shadow-xs" />
            {/* Lantern Core */}
            <div className="relative w-11 h-14 sm:w-14 sm:h-18">
              <div className="absolute inset-0 bg-amber-400/30 rounded-full blur-md animate-pulse" />
              <svg viewBox="0 0 100 120" className="w-full h-full drop-shadow-[0_4px_12px_rgba(245,189,71,0.6)]">
                <polygon points="50,10 90,50 50,90 10,50" fill="url(#kandilGradRight)" stroke="#F5BD47" strokeWidth="2.5" />
                <circle cx="50" cy="50" r="16" fill="#FFF3B0" opacity="0.9" />
                <circle cx="50" cy="50" r="8" fill="#FFFFFF" />
                <line x1="30" y1="90" x2="25" y2="120" stroke="#E67E22" strokeWidth="2" strokeDasharray="2,2" />
                <line x1="42" y1="90" x2="40" y2="125" stroke="#F5BD47" strokeWidth="2.5" />
                <line x1="50" y1="90" x2="50" y2="130" stroke="#FFF3B0" strokeWidth="3" />
                <line x1="58" y1="90" x2="60" y2="125" stroke="#F5BD47" strokeWidth="2.5" />
                <line x1="70" y1="90" x2="75" y2="120" stroke="#E67E22" strokeWidth="2" strokeDasharray="2,2" />
                <defs>
                  <linearGradient id="kandilGradRight" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#C48B28" />
                    <stop offset="50%" stopColor="#8A1B14" />
                    <stop offset="100%" stopColor="#D4A017" />
                  </linearGradient>
                </defs>
              </svg>
            </div>
          </div>
        </div>
      )}

      {/* ─── 3. Left Bottom Glowing Traditional Earthen Diya (Interactive) ─── */}
      {isEnabled && (
        <div
          onClick={(e) => {
            const rect = e.currentTarget.getBoundingClientRect();
            triggerFireworkBurst(rect.left + rect.width / 2, rect.top + 10, 40);
            setLeftDiyaActive(true);
            setTimeout(() => setLeftDiyaActive(false), 800);
          }}
          className="fixed bottom-6 left-6 z-40 cursor-pointer select-none group transition-transform hover:scale-115 active:scale-95"
          title="Click to light sacred Diwali sparks! 🪔"
          aria-label="Interactive Diwali Diya"
        >
          {/* Ambient Diya Halo */}
          <div className="absolute -inset-4 bg-gradient-to-t from-amber-500/20 via-yellow-400/30 to-transparent rounded-full blur-xl pointer-events-none group-hover:via-yellow-400/50 transition-all duration-300" />

          <div className="relative w-14 h-14 flex flex-col items-center justify-end">
            {/* Dancing Flame */}
            <div className={`relative mb-[-4px] z-10 transition-transform ${leftDiyaActive ? "scale-130" : "scale-100"}`}>
              {/* Outer Glow */}
              <div className="w-4 h-6 bg-amber-400/70 rounded-full blur-xs animate-flame mx-auto" />
              {/* Inner Flame Core */}
              <div className="absolute top-1 left-1/2 -translate-x-1/2 w-2.5 h-4.5 bg-gradient-to-t from-[#FF6F00] via-[#FFB703] to-[#FFFFFF] rounded-full animate-flame" />
              {/* Heat Spark Sparkle */}
              <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 bg-white rounded-full blur-[0.5px] animate-ping" />
            </div>

            {/* Terracotta Clay Diya Pot */}
            <svg viewBox="0 0 100 45" className="w-14 h-8 drop-shadow-[0_4px_8px_rgba(94,11,16,0.4)]">
              {/* Clay Bowl */}
              <path
                d="M 5 15 Q 50 45 95 15 Q 70 8 50 14 Q 30 8 5 15 Z"
                fill="url(#clayDiyaGradLeft)"
                stroke="#D4A017"
                strokeWidth="2"
              />
              {/* Lip / Golden Filigree Trim */}
              <ellipse cx="50" cy="14" rx="42" ry="5" fill="#8A1B14" stroke="#F5BD47" strokeWidth="1.5" />
              {/* Vedic Ghee Pool */}
              <ellipse cx="50" cy="14" rx="30" ry="3.5" fill="#FFB703" opacity="0.9" />
              <defs>
                <linearGradient id="clayDiyaGradLeft" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#C45A28" />
                  <stop offset="50%" stopColor="#8A1B14" />
                  <stop offset="100%" stopColor="#5E0B10" />
                </linearGradient>
              </defs>
            </svg>

            {/* Sparkle Tag */}
            <span className="absolute -top-6 left-1/2 -translate-x-1/2 bg-[#5E0B10]/90 text-[#F5BD47] text-[9px] font-bold px-1.5 py-0.5 rounded-full border border-[#D4A017]/60 whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none shadow-md">
              Tap for Sparks ✨
            </span>
          </div>
        </div>
      )}

      {/* ─── 4. Discreet Festive Control Pill (Bottom Left Next to Diya) ─── */}
      <div className="fixed bottom-2 left-6 z-40 select-none">
        <button
          type="button"
          onClick={toggleEffects}
          className="flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-bold text-[#8A1B14] bg-[#FFFDF7]/90 hover:bg-[#FFFDF7] border border-[#EAD7BC] shadow-xs backdrop-blur-xs transition hover:scale-105"
          title={isEnabled ? "Disable Diwali visual animations" : "Enable Diwali visual animations"}
        >
          <Sparkles className={`w-3 h-3 ${isEnabled ? "text-amber-500 fill-amber-500 animate-spin" : "text-stone-400"}`} />
          <span className="text-[9px] tracking-tight">{isEnabled ? "Diwali Glow" : "Diwali Off"}</span>
        </button>
      </div>
    </>
  );
}
