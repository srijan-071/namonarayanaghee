"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { siteConfig } from "@/lib/config";
import { Heart, Leaf, Sparkles, Mail } from "lucide-react";

import Image from "next/image";

export default function Footer() {
  const pathname = usePathname();

  if (pathname?.startsWith("/checkout")) {
    return null;
  }
  return (
    <footer className="bg-[#2D0609] text-white mt-auto relative overflow-hidden">
      
      {/* Royal Vedic Purity Trust Banner */}
      <div className="bg-gradient-to-r from-[#5E0B10] via-[#85181A] to-[#5E0B10] border-b border-amber-400/40 py-4 text-center text-amber-100 relative z-20 shadow-lg">
        <div className="nn-container flex flex-col sm:flex-row items-center justify-center gap-2.5">
          <Sparkles className="w-5 h-5 text-amber-300" />
          <span className="font-serif text-base sm:text-lg font-bold text-amber-300">
            100% Pure Vedic A2 Gir Cow Ghee • Handcrafted Using Traditional Wooden Bilona Method • Delivered Fresh Across India
          </span>
          <Sparkles className="w-5 h-5 text-amber-300" />
        </div>
      </div>

      {/* Background Image with Tint */}
      <div className="absolute inset-0 z-0">
        <Image src="/assets/footer-bg.jpg" alt="Footer Background" fill className="object-cover object-center" />
        <div className="absolute inset-0 bg-black/80" />
      </div>

      {/* Decorative Cursive Text on the right */}
      <div className="absolute right-[-2%] md:right-12 top-24 opacity-20 pointer-events-none transform rotate-[-15deg] hidden md:block z-10">
        <span className="font-serif italic text-6xl lg:text-7xl leading-tight text-amber-200 drop-shadow-lg [text-shadow:_0_4px_12px_rgb(0_0_0_/_80%)]">
          Rooted <br/> in Bharat <br/> For Generations
        </span>
      </div>

      <div className="nn-container py-16 md:py-24 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-12 lg:gap-8">
          
          {/* Brand Info (Spans 4 cols) */}
          <div className="lg:col-span-4 lg:pr-12 flex flex-col gap-6">
            <div>
              <Image src="/assets/logo.png" alt="Namo Narayana Logo" width={160} height={160} className="w-32 h-32 md:w-40 md:h-40 object-contain drop-shadow-[0_4px_8px_rgba(0,0,0,0.5)] mb-2" />
            </div>
            
            <p className="text-sm text-amber-100/90 leading-relaxed font-medium drop-shadow-md [text-shadow:_0_1px_2px_rgb(0_0_0_/_80%)]">
              Rooted in pure tradition. We bring you naturally crafted A2 Gir Cow Ghee and wholesome Indian foods for a healthier, happier tomorrow.
            </p>

            <div className="text-xs text-amber-200/80 space-y-1 bg-black/40 p-3.5 rounded-xl border border-amber-500/20 backdrop-blur-xs">
              <p><strong className="text-amber-300">Legal Entity:</strong> Namo Narayana</p>
              <p><strong className="text-amber-300">FSSAI Lic. No:</strong> 20824005000185</p>
              <p><strong className="text-amber-300">Official Domain:</strong> https://www.namonarayanaghee.store/</p>
              <p><strong className="text-amber-300">Customer Support:</strong> support@namonarayanaghee.store</p>
            </div>
            
            {/* Social Icons */}
            <div className="flex gap-4 mt-2">
              <a href="https://www.youtube.com/@NamoNarayanaOfficial" target="_blank" rel="noopener noreferrer" aria-label="YouTube" className="w-10 h-10 rounded-full border border-amber-300/30 flex items-center justify-center hover:bg-amber-400 hover:text-[#2D0609] transition-colors">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.5 12 3.5 12 3.5s-7.505 0-9.377.55a3.015 3.015 0 0 0-2.122 2.136C0 8.07 0 12 0 12s0 3.93.501 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.55 9.377.55 9.377.55s7.505 0 9.377-.55a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>
              </a>
              <a href="https://www.facebook.com/profile.php?id=61591398574964" target="_blank" rel="noopener noreferrer" aria-label="Facebook" className="w-10 h-10 rounded-full border border-amber-300/30 flex items-center justify-center hover:bg-amber-400 hover:text-[#2D0609] transition-colors">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.469h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.469h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
              </a>
              <a href="https://www.instagram.com/namonarayanaofficial" target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="w-10 h-10 rounded-full border border-amber-300/30 flex items-center justify-center hover:bg-amber-400 hover:text-[#2D0609] transition-colors">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/></svg>
              </a>
              <a href="mailto:support@namonarayanaghee.store" aria-label="Email Support" title="Email Support (support@namonarayanaghee.store)" className="w-10 h-10 rounded-full border border-amber-300/30 flex items-center justify-center hover:bg-amber-400 hover:text-[#2D0609] transition-colors">
                <Mail className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Shop */}
          <div className="lg:col-span-2">
            <h4 className="font-bold text-sm tracking-widest mb-6 text-amber-400 uppercase drop-shadow-[0_1px_1px_rgba(0,0,0,0.8)]">Shop</h4>
            <ul className="space-y-4 text-sm text-white/90 font-medium drop-shadow-md [text-shadow:_0_1px_2px_rgb(0_0_0_/_80%)]">
              <li><Link href="/collections/all-products" className="text-amber-300 font-bold hover:text-white hover:underline underline-offset-4 transition-all flex items-center gap-1.5"><Sparkles className="w-3.5 h-3.5" /> Best Sellers</Link></li>
              <li><Link href="/collections/ghee" className="hover:text-amber-200 hover:underline underline-offset-4 transition-all">A2 Gir Cow Ghee</Link></li>
              <li><Link href="/products/pure-desi-cow-ghee-1-litre" className="hover:text-amber-200 hover:underline underline-offset-4 transition-all">1 Litre Ghee</Link></li>
              <li><Link href="/products/pure-desi-cow-ghee-2-5-litre" className="hover:text-amber-200 hover:underline underline-offset-4 transition-all">2.5 Litre Ghee</Link></li>
              <li><Link href="/products/pure-desi-cow-ghee-5-litre" className="hover:text-amber-200 hover:underline underline-offset-4 transition-all">5 Litre Family Pack</Link></li>
              <li><Link href="/collections/all-products" className="hover:text-amber-200 hover:underline underline-offset-4 transition-all">All Products</Link></li>
            </ul>
          </div>

          {/* Company */}
          <div className="lg:col-span-2">
            <h4 className="font-bold text-sm tracking-widest mb-6 text-amber-400 uppercase drop-shadow-[0_1px_1px_rgba(0,0,0,0.8)]">Company</h4>
            <ul className="space-y-4 text-sm text-white/90 font-medium drop-shadow-md [text-shadow:_0_1px_2px_rgb(0_0_0_/_80%)]">
              <li><Link href="/pages/about-us" className="hover:text-amber-200 hover:underline underline-offset-4 transition-all">About Us</Link></li>
              <li><Link href="/pages/namo-narayana-ghee-price-buying-guide" className="hover:text-amber-200 hover:underline underline-offset-4 transition-all">Price Guide</Link></li>
              <li><Link href="/elvish-yadav-ghee" className="hover:text-amber-200 hover:underline underline-offset-4 transition-all">Elvish Yadav Ghee</Link></li>
              <li><Link href="/a2-ghee-guide" className="hover:text-amber-200 hover:underline underline-offset-4 transition-all">A2 Ghee Guide</Link></li>
              <li><Link href="/pages/certifications" className="hover:text-amber-200 hover:underline underline-offset-4 transition-all">Certifications</Link></li>
              <li><Link href="/pages/contact" className="hover:text-amber-200 hover:underline underline-offset-4 transition-all">Contact Us</Link></li>
            </ul>
          </div>

          {/* Support */}
          <div className="lg:col-span-2">
            <h4 className="font-bold text-sm tracking-widest mb-6 text-amber-400 uppercase drop-shadow-[0_1px_1px_rgba(0,0,0,0.8)]">Support</h4>
            <ul className="space-y-4 text-sm text-white/90 font-medium drop-shadow-md [text-shadow:_0_1px_2px_rgb(0_0_0_/_80%)]">
              <li><Link href="/policies/shipping-policy" className="hover:text-amber-200 hover:underline underline-offset-4 transition-all">Shipping Policy</Link></li>
              <li><Link href="/policies/refund-policy" className="hover:text-amber-200 hover:underline underline-offset-4 transition-all">Refund Policy</Link></li>
              <li><Link href="/policies/privacy-policy" className="hover:text-amber-200 hover:underline underline-offset-4 transition-all">Privacy Policy</Link></li>
              <li><Link href="/policies/terms-of-service" className="hover:text-amber-200 hover:underline underline-offset-4 transition-all">Terms of Service</Link></li>
              <li><Link href="/pages/contact" className="hover:text-amber-200 hover:underline underline-offset-4 transition-all">Customer Care</Link></li>
            </ul>
          </div>

        </div>
      </div>

      <div className="border-t border-amber-500/20 bg-[#1A0305]">
        <div className="nn-container py-6 flex flex-col lg:flex-row items-center justify-between gap-6 text-xs text-amber-200/70 font-light">
          <p>&copy; {new Date().getFullYear()} Namo Narayana. All rights reserved.</p>
          
          <div className="flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>Pure Vedic Purity &bull; Handcrafted with <Heart className="w-3 h-3 inline text-red-500 fill-red-500 mx-0.5" /> in Bharat</span>
          </div>

          <div className="flex flex-wrap gap-4 md:gap-6">
            <Link href="/policies/privacy-policy" className="hover:text-white transition-colors">Privacy Policy</Link>
            <span className="hidden lg:block text-white/20">|</span>
            <Link href="/policies/terms-of-service" className="hover:text-white transition-colors">Terms of Service</Link>
            <span className="hidden lg:block text-white/20">|</span>
            <Link href="/sitemap.xml" className="hover:text-white transition-colors">Sitemap</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
