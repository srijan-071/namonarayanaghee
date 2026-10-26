"use client";

import React, { useState, useEffect } from "react";
import DiwaliDiya from "./DiwaliDiya";
import { Sparkles, X } from "lucide-react";

export default function DiwaliAmbience() {
  const [visible, setVisible] = useState(true);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted || !visible) return null;

  return (
    <>
      {/* Subtle Floating Corner Diya Badges */}
      <div 
        className="fixed bottom-4 left-4 z-40 hidden sm:flex items-center gap-2 bg-[#5E0B10]/90 backdrop-blur-md border border-amber-400/60 text-amber-200 px-3.5 py-2 rounded-full shadow-2xl transition-all duration-300 hover:scale-105"
        role="complementary"
        aria-label="Diwali Festive Celebration"
      >
        <DiwaliDiya size={20} glow={true} />
        <div className="flex flex-col text-left">
          <span className="text-[11px] font-black text-amber-300 leading-tight">शुभ दीपावली महोत्सव</span>
          <span className="text-[10px] text-amber-100 font-semibold leading-tight">Code: DIWALI (10% OFF)</span>
        </div>
        <button
          onClick={() => setVisible(false)}
          className="ml-1 p-0.5 text-amber-300/70 hover:text-white transition cursor-pointer"
          aria-label="Dismiss festive badge"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>
    </>
  );
}
