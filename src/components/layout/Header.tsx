"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { useCartDrawer, useCart } from "@/lib/cart";
import { cn } from "@/lib/utils";
import { Search, User, ShoppingBag, Menu, X, Sparkles, Copy, Check } from "lucide-react";
import { toast } from "sonner";

export default function Header() {
  const router = useRouter();
  const pathname = usePathname();
  const { open } = useCartDrawer();
  const cart = useCart();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [copied, setCopied] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const handleCopyCode = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (typeof navigator !== "undefined" && navigator.clipboard) {
      navigator.clipboard.writeText("NAMO10");
      setCopied(true);
      toast.success("Coupon NAMO10 copied! 10% discount applied at checkout.");
      setTimeout(() => setCopied(false), 2500);
    }
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/collections/ghee?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchOpen(false);
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
    { href: "/collections/ghee", label: "Shop" },
    { href: "/pages/about-us", label: "Our Story" },
    { href: "/a2-ghee-guide", label: "Bilona Method" },
    { href: "/pages/certifications", label: "Quality & Testing" },
    { href: "/pages/namo-narayana-ghee-price-buying-guide", label: "Price Guide" },
    { href: "/pages/contact", label: "Contact" },
  ];

  return (
    <>
      {/* ─── Compact Single-Offer Announcement Bar (COD & Prepaid) ─── */}
      <div className="bg-[#4E1013] text-[#F8F5EE] text-xs h-9 px-3 sm:px-4 font-medium tracking-wide border-b border-[#68191D]/40 relative z-40 flex items-center justify-center select-none">
        <div className="flex items-center justify-center gap-2 text-center text-[11px] sm:text-xs truncate">
          <span className="font-semibold text-amber-200">
            🚚 Pan-India COD Available
          </span>
          <span className="text-[#EAE3D7]/40 hidden sm:inline">•</span>
          <span className="font-semibold text-[#EAE3D7] hidden sm:inline">
            Free Express Delivery Across India
          </span>
          <span className="text-[#EAE3D7]/40 hidden sm:inline">|</span>
          <span className="hidden sm:inline text-amber-200">
            Flat 10% OFF with code
          </span>
          <button
            type="button"
            onClick={handleCopyCode}
            className="inline-flex items-center gap-1 font-mono font-bold bg-[#F8F5EE] text-[#4E1013] px-2 py-0.5 rounded text-[10px] sm:text-[11px] hover:bg-white active:scale-95 transition-all cursor-pointer shadow-2xs"
            title="Click to copy coupon code"
          >
            <span>NAMO10</span>
            {copied ? (
              <span className="text-[10px] text-emerald-800 font-sans font-bold">✓</span>
            ) : (
              <span className="text-[9px] text-[#4E1013]/70 font-sans uppercase">Copy</span>
            )}
          </button>
        </div>
      </div>

      {/* ─── Main Header ─── */}
      <header
        className={cn(
          "sticky top-0 z-40 w-full transition-all duration-300 border-b border-[#EAE3D7]",
          scrolled ? "bg-[#F8F5EE]/95 backdrop-blur-md shadow-xs py-2" : "bg-[#F8F5EE] py-2.5 sm:py-3.5"
        )}
      >
        <div className="nn-container flex items-center justify-between">
          
          {/* Mobile: Left Hamburger */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setMobileOpen(true)}
              className="p-2 -ml-2 text-[#4E1013] hover:text-[#68191D] transition-colors cursor-pointer"
              aria-label="Open menu"
            >
              <Menu className="w-6 h-6" strokeWidth={1.75} />
            </button>
          </div>

          {/* Desktop Left / Mobile Centre: Logo */}
          <Link
            href="/"
            className="flex items-center gap-2.5 shrink-0 group focus:outline-none"
          >
            <div className="relative w-12 h-12 sm:w-14 sm:h-14">
              <Image
                src="/assets/logo.png"
                alt="Namo Narayana"
                fill
                className="object-contain drop-shadow-sm group-hover:scale-105 transition-transform"
                priority
              />
            </div>
            <div className="hidden sm:flex flex-col">
              <span className="font-serif font-bold text-base sm:text-lg text-[#4E1013] leading-tight tracking-tight">
                Namo Narayana
              </span>
              <span className="text-[10px] font-semibold text-[#78634B] uppercase tracking-widest">
                Pure A2 Gir Cow Ghee
              </span>
            </div>
          </Link>

          {/* Desktop Centre: Navigation Links */}
          <nav className="hidden md:flex items-center gap-6 lg:gap-8">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    "text-xs sm:text-sm tracking-wide font-medium transition-colors py-1 relative",
                    isActive
                      ? "text-[#68191D] font-bold"
                      : "text-[#29251F] hover:text-[#68191D]"
                  )}
                >
                  {link.label}
                  {isActive && (
                    <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#68191D] rounded-full" />
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Right Section: Search / Account / Cart */}
          <div className="flex items-center gap-2 sm:gap-3">
            
            {/* Desktop Search */}
            <div className="hidden lg:block relative">
              <form onSubmit={handleSearchSubmit} className="relative">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search ghee, packs..."
                  className="pl-8 pr-3 py-1.5 bg-white border border-[#EAE3D7] rounded-full text-xs text-[#29251F] placeholder-[#78634B]/60 focus:outline-none focus:border-[#68191D] w-[160px] xl:w-[200px] transition-all"
                />
                <Search className="w-3.5 h-3.5 text-[#78634B] absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              </form>
            </div>

            {/* Mobile Search Toggle */}
            <button
              onClick={() => setSearchOpen(!searchOpen)}
              className="lg:hidden p-2 text-[#29251F] hover:text-[#68191D] transition-colors"
              aria-label="Search"
            >
              <Search className="w-5 h-5" strokeWidth={1.75} />
            </button>

            {/* Account */}
            <Link
              href="/account"
              className="p-2 text-[#29251F] hover:text-[#68191D] transition-colors hidden sm:block"
              aria-label="Account"
            >
              <User className="w-5 h-5" strokeWidth={1.75} />
            </Link>

            {/* Cart Button */}
            <button
              onClick={open}
              onMouseEnter={() => router.prefetch("/checkout")}
              className="relative p-2 text-[#29251F] hover:text-[#68191D] transition-colors flex items-center cursor-pointer"
              aria-label="Open cart"
            >
              <ShoppingBag className="w-5 h-5" strokeWidth={1.75} />
              {cart.totalItems > 0 && (
                <span className="absolute top-1 right-0 bg-[#68191D] text-white text-[10px] font-bold rounded-full w-4 h-4 flex items-center justify-center transform translate-x-1/4 -translate-y-1/4 shadow-xs">
                  {cart.totalItems}
                </span>
              )}
            </button>

          </div>

        </div>

        {/* Mobile Search Input Drawer (Dropdown) */}
        {searchOpen && (
          <div className="lg:hidden px-4 pt-2 pb-3 border-t border-[#EAE3D7] bg-[#F8F5EE]">
            <form onSubmit={handleSearchSubmit} className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search products, sizes..."
                autoFocus
                className="w-full pl-9 pr-3 py-2 bg-white border border-[#EAE3D7] rounded-xl text-xs text-[#29251F] placeholder-[#78634B]/60 focus:outline-none focus:border-[#68191D]"
              />
              <Search className="w-4 h-4 text-[#78634B] absolute left-3 top-1/2 -translate-y-1/2" />
            </form>
          </div>
        )}
      </header>

      {/* ─── Mobile Navigation Drawer ─── */}
      {mobileOpen && (
        <>
          <div
            className="fixed inset-0 bg-[#29251F]/60 backdrop-blur-xs z-50 transition-opacity"
            onClick={() => setMobileOpen(false)}
          />
          <nav className="fixed top-0 left-0 z-50 w-4/5 max-w-sm h-full bg-[#F8F5EE] shadow-2xl flex flex-col justify-between transform transition-transform">
            <div>
              {/* Drawer Header */}
              <div className="flex items-center justify-between p-5 border-b border-[#EAE3D7]">
                <div className="flex items-center gap-2">
                  <div className="relative w-9 h-9">
                    <Image src="/assets/logo.png" alt="Namo Narayana" fill className="object-contain" />
                  </div>
                  <span className="font-serif font-bold text-lg text-[#4E1013]">
                    Namo Narayana
                  </span>
                </div>
                <button
                  onClick={() => setMobileOpen(false)}
                  aria-label="Close menu"
                  className="p-1.5 text-[#78634B] hover:text-[#4E1013] transition-colors rounded-lg"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Drawer Links */}
              <ul className="flex flex-col py-4 px-3 gap-1">
                {navLinks.map((link) => {
                  const isActive = pathname === link.href;
                  return (
                    <li key={link.href}>
                      <Link
                        href={link.href}
                        onClick={() => setMobileOpen(false)}
                        className={cn(
                          "block px-4 py-3 rounded-xl text-sm font-medium transition-colors",
                          isActive
                            ? "bg-[#68191D] text-white font-bold"
                            : "text-[#29251F] hover:bg-[#EAE3D7]/60"
                        )}
                      >
                        {link.label}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>

            {/* Drawer Footer Info */}
            <div className="p-5 border-t border-[#EAE3D7] bg-white/60 text-xs text-[#78634B] space-y-1.5">
              <p className="font-semibold text-[#4E1013]">Official Namo Narayana Store</p>
              <p>FSSAI Lic. No. 20824005000185</p>
              <p>100% Secure Prepaid Orders Pan-India</p>
            </div>
          </nav>
        </>
      )}
    </>
  );
}
