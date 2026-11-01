"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCartDrawer, useCart } from "@/lib/cart";
import { cn } from "@/lib/utils";
import { Search, User, ShoppingBag, Gift } from "lucide-react";

import Image from "next/image";
import { Sparkles } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export default function Header() {
  const router = useRouter();
  const pathname = usePathname();
  const { open } = useCartDrawer();
  const cart = useCart();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [announcementCopied, setAnnouncementCopied] = useState(false);

  const handleCopyAnnouncementCoupon = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (typeof navigator !== "undefined" && navigator.clipboard) {
      navigator.clipboard.writeText("NAMO10");
      setAnnouncementCopied(true);
      toast.success("Coupon code NAMO10 copied! Apply at checkout for 10% off.");
      setTimeout(() => setAnnouncementCopied(false), 2500);
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  if (pathname?.startsWith("/checkout")) {
    return null;
  }

  const navLinks = [
    { 
      href: "/collections/all-products", 
      label: (
        <span className="flex items-center gap-1.5 text-[#8A1B14] font-extrabold px-2.5 py-1 bg-amber-100/90 border border-amber-400/50 rounded-full shadow-xs hover:bg-amber-200 transition">
          <Sparkles className="w-3.5 h-3.5 text-amber-600" />
          <span>Bestsellers</span>
          <span className="bg-[#8A1B14] text-white text-[9px] font-bold px-1.5 py-0.2 rounded-full uppercase ml-0.5">Pure A2</span>
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
      {/* Compact Single-Line Announcement Bar (Section 4, Section A) */}
      <div className="bg-[#4E1013] text-[#FAF8F2] text-xs h-9 px-3 sm:px-4 font-medium tracking-wide border-b border-[#701619]/40 relative z-40 flex items-center justify-center select-none">
        <div className="flex items-center justify-center gap-1.5 sm:gap-2 text-center text-[12px] sm:text-[13px] truncate">
          <span>10% OFF with</span>
          <button
            type="button"
            onClick={handleCopyAnnouncementCoupon}
            className="inline-flex items-center gap-1 font-mono font-bold bg-[#FAF8F2] text-[#4E1013] px-2 py-0.5 rounded text-[11px] hover:bg-white active:scale-95 transition-all cursor-pointer shadow-2xs"
            title="Click to copy coupon code"
          >
            <span>NAMO10</span>
            {announcementCopied ? (
              <span className="text-[10px] text-emerald-700 font-sans font-bold">✓ Copied</span>
            ) : (
              <span className="text-[9px] text-[#701619]/70 font-sans uppercase">Copy</span>
            )}
          </button>
          <span className="text-[#FAF8F2]/60">·</span>
          <span>Free Delivery Pan-India</span>
        </div>
      </div>

      {/* Main header */}
      <header
        className={cn(
          "sticky top-0 z-40 w-full transition-all duration-300",
          scrolled ? "bg-[#F7F4EB] shadow-xs py-2" : "bg-[#F7F4EB] py-2.5 sm:py-3"
        )}
      >
        <div className="nn-container flex items-center justify-between">
          {/* Mobile menu button */}
          <button className="md:hidden p-2 -ml-2 text-[#5E0B10]" onClick={() => setMobileOpen(true)} aria-label="Open menu">
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
            </svg>
          </button>

          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 shrink-0 group">
            <Image src="/assets/logo.png" alt="Namo Narayana Logo" width={100} height={100} className="w-14 h-14 md:w-16 md:h-16 object-contain drop-shadow-md transition-transform group-hover:scale-105" />
            <div className="hidden sm:flex flex-col">
              <span className="font-serif font-bold text-sm md:text-base text-[#5E0B10] leading-tight flex items-center gap-1.5">
                <span>Namo Narayana</span>
              </span>
              <span className="text-[10px] md:text-[11px] font-bold text-[#8A1B14] tracking-widest uppercase flex items-center gap-1">
                <span>Vedic Bilona Ghee</span>
                <span className="text-amber-500">•</span>
                <span className="text-[#C38936]">100% Pure A2</span>
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
            <button 
              onClick={open} 
              onMouseEnter={() => router.prefetch("/checkout")}
              className="relative p-2 text-[#2A1612] hover:text-[#8A1B14] transition-colors group flex items-center" 
              aria-label="Open cart"
            >
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
