"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useCartDrawer, useCart } from "@/lib/cart";
import { cn } from "@/lib/utils";
import { Search, User, ShoppingBag, Gift } from "lucide-react";

import Image from "next/image";
import DiwaliDiya from "@/components/ui/DiwaliDiya";
import DiwaliToran from "@/components/ui/DiwaliToran";
import { Sparkles } from "lucide-react";

export default function Header() {
  const { open } = useCartDrawer();
  const cart = useCart();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { 
      href: "/#diwali-specials", 
      label: (
        <span className="flex items-center gap-1.5 text-[#8A1B14] font-extrabold px-2.5 py-1 bg-amber-100/90 border border-amber-400/50 rounded-full shadow-xs hover:bg-amber-200 transition">
          <DiwaliDiya size={16} glow={false} />
          <span>Diwali Hampers</span>
          <span className="bg-[#8A1B14] text-white text-[9px] font-bold px-1.5 py-0.2 rounded-full uppercase ml-0.5">Special</span>
        </span>
      ) 
    },
    { href: "/collections/all-products", label: <span className="notranslate">Shop All</span> },
    { href: "/collections/ghee", label: "A2 Ghee" },
    { href: "/pages/about-us", label: "Our Story" },
    { href: "/blog", label: "Blog" },
    { href: "/pages/contact", label: "Contact" },
  ];

  return (
    <>
      {/* Decorative Hanging Toran Garland */}
      <DiwaliToran className="absolute top-0 inset-x-0 z-50 pointer-events-none opacity-90 hidden sm:block" />

      {/* Diwali Festive Announcement Bar */}
      <div className="bg-gradient-to-r from-[#5E0B10] via-[#85181A] to-[#5E0B10] text-amber-100 text-xs py-2 px-3 sm:px-4 font-medium tracking-wide border-b border-amber-400/30 shadow-md relative z-40">
        <div className="nn-container flex items-center justify-center md:justify-between">
          <div className="hidden md:flex items-center gap-2.5">
            <DiwaliDiya size={18} />
            <span className="font-bold text-amber-300 tracking-wider">शुभ दीपावली महोत्सव</span>
            <span className="text-white/60">|</span>
            <span className="text-white/95 text-[11px] font-semibold">100% Pure A2 Gir Cow Ghee for Akhand Diya &amp; Sweets</span>
          </div>
          <Link 
            href="/#diwali-specials"
            className="flex flex-col md:hidden text-center justify-center w-full gap-0.5 cursor-pointer hover:opacity-95 transition" 
          >
            <span className="text-[11px] font-bold text-amber-300 flex items-center justify-center gap-1.5">
              <DiwaliDiya size={16} /> 🪔 SHUBH DEEPAVALI SPECIAL 🪔
            </span>
            <span className="text-amber-100 font-extrabold text-[12px] flex items-center justify-center gap-1">
              Flat 10% OFF (Code: <span className="bg-amber-300 text-stone-900 px-1 rounded font-black">DIWALI</span>) + Free Gifts!
            </span>
          </Link>
          <Link 
            href="/#diwali-specials"
            className="hidden md:flex items-center gap-2 text-amber-200 font-bold cursor-pointer hover:text-white transition" 
          >
            <span className="bg-amber-400/20 text-amber-300 text-[10px] px-2 py-0.5 rounded-full border border-amber-400/40 uppercase tracking-widest font-extrabold">
              Diwali Offer
            </span>
            <span>Use Code: <strong className="text-amber-300 font-black underline">DIWALI</strong> for Extra 10% OFF + Free Gifts!</span>
            <Gift className="w-3.5 h-3.5 text-amber-300" />
          </Link>
        </div>
      </div>

      {/* Main header */}
      <header
        className={cn(
          "sticky top-0 z-40 w-full transition-all duration-300",
          scrolled 
            ? "bg-[#F7F4EB] shadow-sm py-2" 
            : "bg-[#F7F4EB] py-4"
        )}
      >
        <div className="nn-container flex items-center justify-between">
          {/* Mobile menu button */}
          <button className="md:hidden p-2 -ml-2 text-[#5E0B10]" onClick={() => setMobileOpen(true)} aria-label="Open menu">
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
            </svg>
          </button>

          {/* Logo with Diwali Festive Greeting Accent */}
          <Link href="/" className="flex items-center gap-2.5 shrink-0 group">
            <Image src="/assets/logo.png" alt="Namo Narayana Logo" width={100} height={100} className="w-16 h-16 md:w-20 md:h-20 object-contain drop-shadow-md transition-transform group-hover:scale-105" />
            <div className="hidden sm:flex flex-col">
              <span className="font-serif font-bold text-sm md:text-base text-[#5E0B10] leading-tight flex items-center gap-1.5">
                <span>Namo Narayana</span>
                <DiwaliDiya size={16} glow={true} />
              </span>
              <span className="text-[10px] md:text-[11px] font-bold text-[#8A1B14] tracking-widest uppercase flex items-center gap-1">
                <span>शुभ दीपावली</span>
                <span className="text-amber-500">•</span>
                <span className="text-[#C38936]">Festival of Lights</span>
              </span>
            </div>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-6 lg:gap-8 xl:mr-12">
            {navLinks.map((link) => (
              <Link 
                key={link.href} 
                href={link.href} 
                className="text-sm font-semibold tracking-wide text-[#2A1612] hover:text-[#8A1B14] transition-colors py-2"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Right section: Search / Account / Cart */}
          <div className="flex items-center gap-2 lg:gap-4">
            <div className="hidden lg:flex relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-4 w-4 text-[#A88878]" strokeWidth={2} />
              </div>
              <input
                type="text"
                className="block w-full pl-10 pr-3 py-2 bg-[#F3EADB] border border-[#E8DAC2] rounded-full text-sm placeholder-[#A88878] focus:outline-none focus:ring-1 focus:ring-amber-500 text-[#2A1612] w-[180px] xl:w-[240px]"
                placeholder="Search products..."
              />
            </div>
            
            <Link href="/account" className="p-2 text-[#2A1612] hover:text-[#8A1B14] transition-colors hidden sm:block" aria-label="Account">
              <User strokeWidth={1.5} size={22} />
            </Link>
            <button onClick={open} className="relative p-2 text-[#2A1612] hover:text-[#8A1B14] transition-colors group flex items-center" aria-label="Open cart">
              <ShoppingBag strokeWidth={1.5} size={22} />
              {cart.totalItems > 0 && (
                <span className="absolute top-1 right-0 bg-[#8A1B14] text-white text-[10px] font-bold rounded-full w-4 h-4 flex items-center justify-center transform translate-x-1/4 -translate-y-1/4 shadow-xs">
                  {cart.totalItems}
                </span>
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile nav overlay */}
      {mobileOpen && (
        <>
          <div className="fixed inset-0 bg-[#2D0609]/70 backdrop-blur-sm z-40 transition-opacity" onClick={() => setMobileOpen(false)} />
          <nav className="fixed top-0 left-0 z-50 w-4/5 max-w-sm h-full bg-[#FCFAF5] shadow-2xl flex flex-col transform transition-transform">
            <div className="flex items-center justify-between p-6 border-b border-[#EAD7BC]">
              <span className="font-serif text-2xl font-bold text-[#5E0B10]">Menu</span>
              <button onClick={() => setMobileOpen(false)} aria-label="Close menu" className="p-2 text-gray-500 hover:text-[#5E0B10] transition-colors">
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <ul className="flex flex-col py-6 px-4 gap-2 overflow-y-auto">
              {navLinks.map((link) => (
                <li key={link.href}>
                  <Link 
                    href={link.href} 
                    onClick={() => setMobileOpen(false)} 
                    className="block px-4 py-3 text-lg font-serif text-[#2A1612] hover:bg-[#F3EADB] hover:text-[#8A1B14] rounded-xl transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </>
      )}
    </>
  );
}
