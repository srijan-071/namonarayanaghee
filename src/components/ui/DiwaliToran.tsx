import React from "react";

export default function DiwaliToran({ className = "" }: { className?: string }) {
  return (
    <div className={`w-full overflow-hidden pointer-events-none select-none relative z-20 ${className}`} aria-hidden="true">
      <svg 
        viewBox="0 0 1200 42" 
        fill="none" 
        xmlns="http://www.w3.org/2000/svg"
        preserveAspectRatio="none"
        className="w-full h-8 sm:h-10 md:h-12 transform-gpu"
      >
        <defs>
          {/* Marigold Orange & Gold Gradients */}
          <radialGradient id="marigoldOrange" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#FFF176" />
            <stop offset="40%" stopColor="#FF9800" />
            <stop offset="100%" stopColor="#E65100" />
          </radialGradient>
          
          <radialGradient id="marigoldYellow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#FFFFFF" />
            <stop offset="35%" stopColor="#FFEB3B" />
            <stop offset="100%" stopColor="#F57F17" />
          </radialGradient>

          <linearGradient id="mangoLeaf" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#43A047" />
            <stop offset="100%" stopColor="#1B5E20" />
          </linearGradient>

          <linearGradient id="toranGoldThread" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#FFD54F" />
            <stop offset="50%" stopColor="#FFF9C4" />
            <stop offset="100%" stopColor="#FFD54F" />
          </linearGradient>
        </defs>

        {/* Main Golden Rope Garland Scallops */}
        <path
          d="M0 4 Q 100 24, 200 4 Q 300 24, 400 4 Q 500 24, 600 4 Q 700 24, 800 4 Q 900 24, 1000 4 Q 1100 24, 1200 4"
          stroke="url(#toranGoldThread)"
          strokeWidth="2.5"
          fill="none"
        />

        {/* Repeats across 6 scallops (0 to 1200) */}
        {[100, 300, 500, 700, 900, 1100].map((cx, idx) => (
          <g key={cx}>
            {/* Hanging Mango Leaves */}
            <path
              d={`M${cx - 15} 12 C${cx - 18} 25 ${cx - 5} 32 ${cx - 12} 38 C${cx - 5} 32 ${cx - 2} 24 ${cx - 10} 12`}
              fill="url(#mangoLeaf)"
            />
            <path
              d={`M${cx + 15} 12 C${cx + 18} 25 ${cx + 5} 32 ${cx + 12} 38 C${cx + 5} 32 ${cx + 2} 24 ${cx + 10} 12`}
              fill="url(#mangoLeaf)"
            />

            {/* Central Hanging Golden Bell / Tassel */}
            <line x1={cx} y1="18" x2={cx} y2="28" stroke="#FFD54F" strokeWidth="1.5" />
            <circle cx={cx} cy="30" r="3.5" fill="#FFC107" stroke="#FFF" strokeWidth="0.8" />
            
            {/* Marigold Flower Center */}
            <circle cx={cx} cy="18" r="8" fill="url(#marigoldOrange)" />
            <circle cx={cx} cy="18" r="4.5" fill="url(#marigoldYellow)" />
            
            {/* Small Side Fluffs */}
            <circle cx={cx - 12} cy="14" r="5" fill="url(#marigoldYellow)" />
            <circle cx={cx + 12} cy="14" r="5" fill="url(#marigoldYellow)" />
          </g>
        ))}

        {/* Anchors at each crest */}
        {[0, 200, 400, 600, 800, 1000, 1200].map((ax) => (
          <g key={ax}>
            <circle cx={ax} cy="4" r="6" fill="url(#marigoldYellow)" />
            <circle cx={ax} cy="4" r="3" fill="url(#marigoldOrange)" />
          </g>
        ))}
      </svg>
    </div>
  );
}
