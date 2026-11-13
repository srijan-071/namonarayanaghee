"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { useCartDrawer, useCart } from "@/lib/cart";
import { cn } from "@/lib/utils";
import {
  Search,
  User,
  ShoppingBag,
  Menu,
  X,
  ChevronDown,
  Crown,
} from "lucide-react";
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
  const [shopDropdownOpen, setShopDropdownOpen] = useState(false);
  const dropdownTimeoutRef = useRef<NodeJS.Timeout | null>(null);

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

  const handleShopMouseEnter = () => {
    if (dropdownTimeoutRef.current) clearTimeout(dropdownTimeoutRef.current);
    setShopDropdownOpen(true);
  };

  const handleShopMouseLeave = () => {
    dropdownTimeoutRef.current = setTimeout(() => {
      setShopDropdownOpen(false);
    }, 150);
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
    { href: "/pages/about-us", label: "Our Story" },
    { href: "/a2-ghee-guide", label: "Bilona Method" },
    { href: "/pages/certifications", label: "Quality & Testing" },
    { href: "/pages/namo-narayana-ghee-price-buying-guide", label: "Price Guide" },
    { href: "/pages/contact", label: "Contact" },
  ];

  const shopPacks = [
    { href: "/products/pure-desi-cow-ghee-500-ml", title: "500 ml Jar", sub: "Starter Pack • ₹899 (₹799 with Gift Card)" },
    { href: "/products/pure-desi-cow-ghee-1-litre", title: "1 Litre Jar", sub: "Flagship Bestseller • ₹1,549 (₹1,299 with Gift Card)" },
    { href: "/products/pure-desi-cow-ghee-2-5-litre", title: "2.5 Litre Pack", sub: "Family Value (+3 Free Oils) • ₹3,199 (₹2,699 with Gift Card)" },
    { href: "/products/pure-desi-cow-ghee-5-litre", title: "5 Litre Tin", sub: "Bulk Heritage (+3 Free Oils) • ₹5,499 (₹4,499 with Gift Card)" },
    { href: "/collections/ghee", title: "View All Products →", sub: "Full Vedic Ghee Collection" },
  ];

  return (
    <>
      {/* ─── Compact Top Announcement Bar ─── */}
      <div className="bg-gradient-to-r from-[#0A1411] via-[#064E3B] to-[#032B1D] text-[#F8F5EE] text-xs h-8.5 px-3 sm:px-4 font-medium tracking-wide border-b border-emerald-900/40 relative z-30 flex items-center justify-center select-none shadow-xs">
        <div className="flex items-center justify-center gap-2 text-center text-[11px] sm:text-xs truncate">
          <span className="font-semibold text-emerald-300">
            🚚 Pan-India COD Available
          </span>
          <span className="text-emerald-200/40 hidden sm:inline">•</span>
          <span className="font-semibold text-emerald-50 hidden sm:inline">
            Free Express Delivery Across India
          </span>
          <span className="text-emerald-200/40 hidden sm:inline">|</span>
          <span className="hidden sm:inline text-amber-200">
            Flat 10% OFF with code
          </span>
          <button
            type="button"
            onClick={handleCopyCode}
            className="inline-flex items-center gap-1 font-mono font-bold bg-gradient-to-r from-[#F5E5B8] to-[#D4AF37] text-[#0A1411] px-2 py-0.5 rounded text-[10px] sm:text-[11px] hover:brightness-105 active:scale-95 transition-all cursor-pointer shadow-xs border border-amber-300/40"
            title="Click to copy coupon code"
          >
            <span>NAMO10</span>
            {copied ? (
              <span className="text-[10px] text-emerald-950 font-sans font-bold">✓</span>
            ) : (
              <span className="text-[9px] text-[#0A1411]/70 font-sans uppercase">Copy</span>
            )}
          </button>
        </div>
      </div>

      {/* ─── Floating Capsule Navbar ─── */}
      <header className="sticky top-2 sm:top-3 z-40 w-full px-3 sm:px-6 max-w-[1380px] mx-auto pointer-events-none">
        <nav
          className={cn(
            "pointer-events-auto w-full bg-white/95 backdrop-blur-md border border-[#E5E0D8]/90 rounded-full py-2 px-3 sm:px-5 flex items-center justify-between gap-2.5 sm:gap-4 transition-all duration-300",
            scrolled
              ? "shadow-[0_8px_30px_-6px_rgba(0,0,0,0.12),0_1px_3px_rgba(0,0,0,0.04)] bg-white/98 border-[#D8D2C6]"
              : "shadow-[0_4px_24px_-4px_rgba(0,0,0,0.06),0_1px_3px_rgba(0,0,0,0.02)]"
          )}
        >
          {/* Mobile: Left Hamburger */}
          <div className="lg:hidden flex items-center">
            <button
              onClick={() => setMobileOpen(true)}
              className="p-1.5 -ml-1 text-[#064E3B] hover:text-[#059669] transition-colors cursor-pointer rounded-full hover:bg-stone-100"
              aria-label="Open menu"
            >
              <Menu className="w-5 h-5" strokeWidth={1.75} />
            </button>
          </div>

          {/* Left: Brand Identity (Logo + Name + Vedic Tagline) */}
          <Link
            href="/"
            className="flex items-center gap-2 sm:gap-2.5 shrink-0 group focus:outline-none"
          >
            <div className="relative w-9 h-9 sm:w-11 sm:h-11 shrink-0">
              <Image
                src="/assets/logo.png"
                alt="Namo Narayana"
                fill
                className="object-contain drop-shadow-xs group-hover:scale-105 transition-transform"
                priority
              />
            </div>
            <div className="flex flex-col text-left">
              <span className="font-serif font-bold text-[15px] sm:text-[17px] leading-tight text-[#0D2B1D] tracking-tight">
                Namo Narayana
              </span>
              <span className="text-[8px] sm:text-[9.5px] font-bold tracking-wider uppercase leading-none mt-0.5">
                <span className="text-[#064E3B]">PURE A2 GIR COW GHEE</span>
                <span className="text-stone-300 mx-1">•</span>
                <span className="text-[#B85D19]">VEDIC BILONA</span>
              </span>
            </div>
          </Link>

          {/* Elvish Yadav Official Vedic Store Capsule Badge */}
          <Link
            href="/elvish-yadav-ghee"
            className="hidden xl:flex items-center gap-2 px-3 py-1 bg-[#FAF8F2] border border-[#E8DFD1] rounded-full hover:border-[#C5A16B] transition-all group shrink-0 shadow-2xs"
            title="Official Elvish Yadav Store"
          >
            <div className="w-5 h-5 rounded-full bg-amber-100/90 border border-amber-300/70 flex items-center justify-center shrink-0">
              <Crown className="w-3 h-3 text-[#B8860B]" />
            </div>
            <div className="flex items-center gap-2 text-left">
              <div className="flex flex-col leading-tight">
                <span className="text-[10px] font-bold text-[#064E3B]">Elvish</span>
                <span className="text-[10px] font-bold text-[#064E3B]">Yadav</span>
              </div>
              <span className="h-5 w-px bg-[#E2D8C7]" />
              <div className="flex flex-col leading-tight">
                <span className="text-[9px] font-medium text-[#78634B]">Official</span>
                <span className="text-[9px] font-medium text-[#78634B]">Vedic Store</span>
              </div>
            </div>
          </Link>

          {/* Center: Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-4 xl:gap-6 shrink-0">
            {/* Shop Dropdown */}
            <div
              className="relative"
              onMouseEnter={handleShopMouseEnter}
              onMouseLeave={handleShopMouseLeave}
            >
              <Link
                href="/collections/ghee"
                className={cn(
                  "inline-flex items-center gap-1 text-[13px] font-medium transition-colors py-1 hover:text-[#064E3B]",
                  pathname?.startsWith("/collections") || pathname?.startsWith("/products")
                    ? "text-[#064E3B] font-bold"
                    : "text-[#29251F]"
                )}
              >
                <span>Shop</span>
                <ChevronDown
                  className={cn(
                    "w-3.5 h-3.5 text-stone-500 transition-transform duration-200",
                    shopDropdownOpen && "rotate-180 text-[#064E3B]"
                  )}
                  strokeWidth={2}
                />
              </Link>

              {/* Shop Flyout Menu */}
              {shopDropdownOpen && (
                <div className="absolute top-full left-0 mt-2 w-64 bg-white/98 backdrop-blur-md border border-[#E5E0D8] rounded-2xl p-2 shadow-xl z-50 animate-in fade-in zoom-in-95 duration-150">
                  {shopPacks.map((pack) => (
                    <Link
                      key={pack.href}
                      href={pack.href}
                      onClick={() => setShopDropdownOpen(false)}
                      className="block px-3 py-2 rounded-xl text-left hover:bg-[#FAF8F2] transition-colors group"
                    >
                      <div className="text-xs font-semibold text-[#0D2B1D] group-hover:text-[#064E3B]">
                        {pack.title}
                      </div>
                      <div className="text-[10.5px] text-[#78634B]">
                        {pack.sub}
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </div>

            {/* Standard Links */}
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    "text-[13px] font-medium transition-colors py-1 relative hover:text-[#064E3B] whitespace-nowrap",
                    isActive
                      ? "text-[#064E3B] font-bold"
                      : "text-[#29251F]"
                  )}
                >
                  {link.label}
                  {isActive && (
                    <span className="absolute -bottom-1 left-0 right-0 h-0.5 bg-[#064E3B] rounded-full" />
                  )}
                </Link>
              );
            })}

            {/* Subtle Vertical Divider */}
            <span className="h-4 w-px bg-stone-300" />
          </nav>

          {/* Right Section: Search Pill, Account, Shopping Bag */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            {/* Desktop Search Input Field (Capsule Pill) */}
            <div className="hidden md:block relative">
              <form onSubmit={handleSearchSubmit} className="relative">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search ghee, packs..."
                  className="pl-8 pr-3 py-1.5 bg-white border border-[#E2DDD5] rounded-full text-xs text-[#111815] placeholder-stone-400 focus:outline-none focus:border-[#064E3B] focus:ring-1 focus:ring-[#064E3B]/20 w-[140px] xl:w-[175px] transition-all shadow-2xs"
                />
                <Search className="w-3.5 h-3.5 text-stone-400 absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none" strokeWidth={2} />
              </form>
            </div>

            {/* Mobile Search Toggle */}
            <button
              onClick={() => setSearchOpen(!searchOpen)}
              className="md:hidden p-1.5 text-[#29251F] hover:text-[#064E3B] transition-colors rounded-full hover:bg-stone-100"
              aria-label="Search"
            >
              <Search className="w-4 h-4" strokeWidth={1.85} />
            </button>

            {/* Account */}
            <Link
              href="/account"
              className="p-1.5 text-[#29251F] hover:text-[#064E3B] transition-colors hidden sm:block rounded-full hover:bg-stone-100"
              aria-label="Account"
              title="My Account"
            >
              <User className="w-4.5 h-4.5" strokeWidth={1.85} />
            </Link>

            {/* Shopping Bag Button with Badge */}
            <button
              onClick={open}
              onMouseEnter={() => router.prefetch("/checkout")}
              className="relative p-1.5 text-[#29251F] hover:text-[#064E3B] transition-colors flex items-center cursor-pointer rounded-full hover:bg-stone-100"
              aria-label="Open cart"
              title="Shopping Bag"
            >
              <ShoppingBag className="w-4.5 h-4.5" strokeWidth={1.85} />
              {cart.totalItems > 0 && (
                <span className="absolute -top-0.5 -right-0.5 bg-[#064E3B] text-white text-[9.5px] font-bold rounded-full w-4 h-4 flex items-center justify-center shadow-xs">
                  {cart.totalItems}
                </span>
              )}
            </button>
          </div>
        </nav>

        {/* Mobile Search Dropdown */}
        {searchOpen && (
          <div className="pointer-events-auto md:hidden mt-2 px-4 py-2.5 bg-white/98 backdrop-blur-md border border-[#E5E0D8] rounded-2xl shadow-lg">
            <form onSubmit={handleSearchSubmit} className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search ghee, packs..."
                autoFocus
                className="w-full pl-9 pr-3 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs text-[#111815] placeholder-stone-400 focus:outline-none focus:border-[#064E3B]"
              />
              <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" strokeWidth={2} />
            </form>
          </div>
        )}
      </header>

      {/* ─── Mobile Navigation Drawer ─── */}
      {mobileOpen && (
        <>
          <div
            className="fixed inset-0 bg-black/50 backdrop-blur-xs z-50 transition-opacity"
            onClick={() => setMobileOpen(false)}
          />
          <nav className="fixed top-0 left-0 z-50 w-4/5 max-w-sm h-full bg-[#FAF9F6] shadow-2xl flex flex-col justify-between transform transition-transform border-r border-[#E5E0D8]">
            <div>
              {/* Drawer Header */}
              <div className="flex items-center justify-between p-5 border-b border-[#EAE3D7] bg-white">
                <div className="flex items-center gap-2">
                  <div className="relative w-9 h-9">
                    <Image src="/assets/logo.png" alt="Namo Narayana" fill className="object-contain" />
                  </div>
                  <div className="flex flex-col text-left">
                    <span className="font-serif font-bold text-base text-[#0D2B1D]">
                      Namo Narayana
                    </span>
                    <span className="text-[9px] font-bold text-[#064E3B] uppercase tracking-wider">
                      Pure A2 Gir Cow Ghee
                    </span>
                  </div>
                </div>
                <button
                  onClick={() => setMobileOpen(false)}
                  aria-label="Close menu"
                  className="p-1.5 text-stone-500 hover:text-stone-900 transition-colors rounded-lg"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Elvish Yadav Mobile Badge */}
              <div className="p-3 border-b border-[#EAE3D7] bg-[#F7F4EB]">
                <Link
                  href="/elvish-yadav-ghee"
                  onClick={() => setMobileOpen(false)}
                  className="flex items-center gap-2 p-2 bg-white rounded-xl border border-amber-200/80 shadow-2xs"
                >
                  <Crown className="w-4 h-4 text-[#B8860B] shrink-0" />
                  <div className="flex items-center gap-2 text-left">
                    <span className="text-xs font-bold text-[#064E3B]">Elvish Yadav</span>
                    <span className="text-stone-300">•</span>
                    <span className="text-[11px] text-[#78634B] font-medium">Official Vedic Store</span>
                  </div>
                </Link>
              </div>

              {/* Drawer Links */}
              <ul className="flex flex-col py-4 px-3 gap-1">
                <li>
                  <Link
                    href="/collections/ghee"
                    onClick={() => setMobileOpen(false)}
                    className="block px-4 py-3 rounded-xl text-sm font-semibold text-[#064E3B] hover:bg-emerald-50/60"
                  >
                    Shop All Ghee
                  </Link>
                </li>
                {navLinks.map((link) => {
                  const isActive = pathname === link.href;
                  return (
                    <li key={link.href}>
                      <Link
                        href={link.href}
                        onClick={() => setMobileOpen(false)}
                        className={cn(
                          "block px-4 py-2.5 rounded-xl text-sm font-medium transition-colors",
                          isActive
                            ? "bg-[#064E3B] text-white font-bold"
                            : "text-[#29251F] hover:bg-stone-200/50"
                        )}
                      >
                        {link.label}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>

            {/* Drawer Footer */}
            <div className="p-4 border-t border-[#EAE3D7] bg-white">
              <Link
                href="/account"
                onClick={() => setMobileOpen(false)}
                className="flex items-center gap-2 px-3 py-2 text-xs font-semibold text-stone-700 hover:text-[#064E3B]"
              >
                <User className="w-4 h-4" />
                <span>My Account</span>
              </Link>
            </div>
          </nav>
        </>
      )}
    </>
  );
}
