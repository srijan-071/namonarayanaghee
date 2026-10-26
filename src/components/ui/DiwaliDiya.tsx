import React from "react";

interface DiwaliDiyaProps {
  className?: string;
  size?: number;
  glow?: boolean;
}

export default function DiwaliDiya({ className = "", size = 32, glow = true }: DiwaliDiyaProps) {
  return (
    <div 
      className={`relative inline-flex items-center justify-center shrink-0 ${className}`} 
      style={{ width: size, height: size * 0.85 }}
      aria-hidden="true"
    >
      {/* Radiant ambient glow (ultra-lightweight radial gradient, no expensive blur filter) */}
      {glow && (
        <div 
          className="absolute -top-1 left-1/2 -translate-x-1/2 w-4/5 h-4/5 rounded-full bg-amber-400/25 pointer-events-none" 
        />
      )}

      <svg 
        viewBox="0 0 48 40" 
        fill="none" 
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full transform-gpu"
      >
        {/* Diya Base / Clay / Brass Body */}
        <defs>
          <linearGradient id="brassBase" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#F9D423" />
            <stop offset="40%" stopColor="#E65C00" />
            <stop offset="100%" stopColor="#8A1B14" />
          </linearGradient>
          
          <linearGradient id="oilPool" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#FFD200" />
            <stop offset="100%" stopColor="#F7971E" />
          </linearGradient>

          <linearGradient id="flameInner" x1="50%" y1="0%" x2="50%" y2="100%">
            <stop offset="0%" stopColor="#FFFFFF" />
            <stop offset="30%" stopColor="#FFF275" />
            <stop offset="70%" stopColor="#FF8F00" />
            <stop offset="100%" stopColor="#E65100" />
          </linearGradient>
          
          <radialGradient id="flameAura" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#FFC107" stopOpacity="0.7" />
            <stop offset="60%" stopColor="#FF6F00" stopOpacity="0.3" />
            <stop offset="100%" stopColor="#FF6F00" stopOpacity="0" />
          </radialGradient>
        </defs>

        {/* Diya Pedestal & Bowl */}
        <ellipse cx="24" cy="36" rx="8" ry="2.5" fill="#5E0B10" opacity="0.6" />
        <path
          d="M6 25 C6 35 14 37 24 37 C34 37 42 35 42 25 C42 25 36 30 24 30 C12 30 6 25 6 25 Z"
          fill="url(#brassBase)"
          stroke="#FFD700"
          strokeWidth="0.8"
        />
        <ellipse cx="24" cy="25" rx="18" ry="4.5" fill="url(#brassBase)" stroke="#FFE082" strokeWidth="0.6" />
        
        {/* Pure Ghee Oil Pool */}
        <ellipse cx="24" cy="25" rx="14" ry="3" fill="url(#oilPool)" />
        
        {/* Cotton Wick / Batti */}
        <path d="M23 25 C23.5 22 24.5 20 24 17" stroke="#3E2723" strokeWidth="1.2" strokeLinecap="round" />

        {/* Single GPU-Composited Flame Group (0 layout repaints, smooth 60fps) */}
        <g className="animate-flame origin-bottom">
          {/* Flame Aura */}
          <ellipse cx="24" cy="13" rx="7" ry="11" fill="url(#flameAura)" opacity="0.75" />

          {/* Animated Sacred Flame */}
          <path
            d="M24 3 C27 8 28.5 13 27 16 C25.5 19 22.5 19 21 16 C19.5 13 21 8 24 3 Z"
            fill="url(#flameInner)"
          />
          
          {/* Pure White Core Flame */}
          <path
            d="M24 7 C25.5 10 26 13 25 15 C24.2 16.5 23.8 16.5 23 15 C22 13 22.5 10 24 7 Z"
            fill="#FFFFFF"
            opacity="0.9"
          />
        </g>
      </svg>
    </div>
  );
}
