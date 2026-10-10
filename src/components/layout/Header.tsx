"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useCartDrawer, useCart } from "@/lib/cart";
import { cn } from "@/lib/utils";
import { Search, User, ShoppingBag, Gift } from "lucide-react";

import Image from "next/image";

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
    { href: "/collections/all-products", label: <span className="notranslate">Shop All</span> },
    { href: "/collections/ghee", label: "A2 Ghee" },
    { href: "/collections/oils", label: "Oils" },
    { href: "/collections/honey", label: "Honey" },
    { href: "/pages/about-us", label: "Our Story" },
    { href: "/blog", label: "Blog" },
    { href: "/pages/contact", label: "Contact" },
  ];

  return (
    <>
      {/* Announcement bar */}
      <div className="bg-nn-forest-deep text-white text-xs py-2 px-4 font-medium tracking-wide">
        <div className="nn-container flex items-center justify-center md:justify-between">
          <div className="hidden md:flex items-center gap-2">
            <svg className="w-4 h-4 text-[#F39C12]" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-1-13h2v6h-2zm0 8h2v2h-2z"/></svg>
            <span>FREE SHIPPING PAN INDIA | TRUSTED BY 10 LAKH+ CUSTOMERS</span>
          </div>
          <div 
            className="flex flex-col md:hidden text-center justify-center w-full gap-1 cursor-pointer" 
            onClick={() => window.dispatchEvent(new CustomEvent('open-promo-popup'))}
          >
            <span>FREE SHIPPING PAN INDIA</span>
            <span className="text-yellow-300 font-bold flex items-center justify-center gap-1">
              <Gift className="w-4 h-4" /> Click here to get 10% discount coupon code
            </span>
          </div>
          <div 
            className="hidden md:flex items-center gap-2 text-yellow-300 font-bold cursor-pointer hover:text-yellow-100 transition"
            onClick={() => window.dispatchEvent(new CustomEvent('open-promo-popup'))}
          >
            <Gift className="w-4 h-4" />
            <span>Click here to get 10% discount coupon code</span>
          </div>
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
          <button className="md:hidden p-2 -ml-2 text-nn-forest-deep" onClick={() => setMobileOpen(true)} aria-label="Open menu">
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
            </svg>
          </button>

          {/* Logo */}
          <Link href="/" className="flex flex-col items-center shrink-0">
            <Image src="/assets/logo.png" alt="Namo Narayana Logo" width={100} height={100} className="w-20 h-20 md:w-24 md:h-24 object-contain drop-shadow-md" />
          </Link>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-6 lg:gap-8 xl:mr-12">
            {navLinks.map((link) => (
              <Link 
                key={link.href} 
                href={link.href} 
                className="text-sm font-semibold tracking-wide text-[#364935] hover:text-[#B58231] transition-colors py-2"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Right section: Search / Account / Cart */}
          <div className="flex items-center gap-2 lg:gap-4">
            <div className="hidden lg:flex relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-4 w-4 text-[#8C988B]" strokeWidth={2} />
              </div>
              <input
                type="text"
                className="block w-full pl-10 pr-3 py-2 bg-[#E9E5D9] border border-transparent rounded-full text-sm placeholder-[#8C988B] focus:outline-none focus:ring-1 focus:ring-[#8C988B] text-[#364935] w-[180px] xl:w-[240px]"
                placeholder="Search products..."
              />
            </div>
            
            <Link href="/account" className="p-2 text-[#364935] hover:text-[#B58231] transition-colors hidden sm:block" aria-label="Account">
              <User strokeWidth={1.5} size={22} />
            </Link>
            <button onClick={open} className="relative p-2 text-[#364935] hover:text-[#B58231] transition-colors group flex items-center" aria-label="Open cart">
              <ShoppingBag strokeWidth={1.5} size={22} />
              {cart.totalItems > 0 && (
                <span className="absolute top-1 right-0 bg-[#B58231] text-white text-[10px] font-bold rounded-full w-4 h-4 flex items-center justify-center transform translate-x-1/4 -translate-y-1/4">
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
          <div className="fixed inset-0 bg-[#364935]/60 backdrop-blur-sm z-40 transition-opacity" onClick={() => setMobileOpen(false)} />
          <nav className="fixed top-0 left-0 z-50 w-4/5 max-w-sm h-full bg-[#F7F4EB] shadow-2xl flex flex-col transform transition-transform">
            <div className="flex items-center justify-between p-6 border-b border-[#E9E5D9]">
              <span className="font-serif text-2xl font-bold text-[#364935]">Menu</span>
              <button onClick={() => setMobileOpen(false)} aria-label="Close menu" className="p-2 text-gray-500 hover:text-[#364935] transition-colors">
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
                    className="block px-4 py-3 text-lg font-serif text-[#364935] hover:bg-[#E9E5D9] rounded-xl transition-colors"
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
