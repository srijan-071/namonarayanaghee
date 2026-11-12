"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  ShieldCheck,
  CheckCircle2,
  Sparkles,
  Truck,
  Heart,
  HelpCircle,
  ChevronDown,
  ChevronUp,
  Check,
  Package,
  Layers,
  Flame,
  ArrowRight,
  TrendingUp,
  ShoppingCart,
  Zap,
  Tag,
  Clock,
  Info
} from "lucide-react";
import { toast } from "sonner";
import { addToCart, useCartDrawer } from "@/lib/cart";
import { formatPrice } from "@/lib/utils";

interface PackItem {
  id: number;
  variantId: number;
  slug: string;
  title: string;
  size: string;
  price: number; // in paise
  compareAtPrice: number; // in paise
  effectiveRatePerLitre: string;
  badge: string;
  badgeColor: string;
  image: string;
  bestFor: string;
  dailyCost: string;
  savings: string;
  packaging: string;
  isPopular?: boolean;
}

const PACK_CATALOG: PackItem[] = [
  {
    id: 9545153446055,
    variantId: 55812012572839,
    slug: "pure-desi-cow-ghee-500-ml",
    title: "Pure A2 Gir Cow Ghee 500 ml",
    size: "500 ml",
    price: 79900,
    compareAtPrice: 199900,
    effectiveRatePerLitre: "₹1,598 / Litre",
    badge: "🌱 STARTER / TRIAL",
    badgeColor: "bg-[#1E3A24]",
    image: "/assets/product_6_jpg_669162f4-5007-41a6-85ac-bbc8b7cdf942.webp",
    bestFor: "Trial buyers, singles, travel, and sacred daily pooja rituals",
    dailyCost: "~₹36 / day",
    savings: "60% OFF",
    packaging: "Food-grade glass jar",
  },
  {
    id: 9545153446056,
    variantId: 55812012572840,
    slug: "pure-desi-cow-ghee-1-litre",
    title: "Pure A2 Gir Cow Ghee 1 Litre",
    size: "1 Litre",
    price: 129900,
    compareAtPrice: 329900,
    effectiveRatePerLitre: "₹1,299 / Litre",
    badge: "👑 #1 BESTSELLER • MOST LOVED",
    badgeColor: "bg-[#C38936]",
    image: "/assets/product_6_jpg_669162f4-5007-41a6-85ac-bbc8b7cdf942.webp",
    bestFor: "Nuclear families (2–3 people), daily roti brushing, and dal tadka",
    dailyCost: "~₹43 / day",
    savings: "60% OFF",
    packaging: "Food-grade glass jar",
    isPopular: true,
  },
  {
    id: 9545146237096,
    variantId: 55811997728936,
    slug: "pure-desi-cow-ghee-2-5-litre",
    title: "Pure A2 Gir Cow Ghee 2.5 Litre",
    size: "2.5 Litre",
    price: 269900,
    compareAtPrice: 749900,
    effectiveRatePerLitre: "₹1,079.60 / Litre",
    badge: "🔥 BEST VALUE FOR FAMILIES",
    badgeColor: "bg-[#1E3A24]",
    image: "/assets/product_6-2p5_jpg.webp",
    bestFor: "Families of 3–5 members; lowers cost to ₹1,079/L with higher savings",
    dailyCost: "~₹27 / day",
    savings: "64% OFF",
    packaging: "Heavy-duty food container",
  },
  {
    id: 9545149055144,
    variantId: 55812002971816,
    slug: "pure-desi-cow-ghee-5-litre",
    title: "Pure A2 Gir Cow Ghee 5 Litre",
    size: "5 Litre",
    price: 449900,
    compareAtPrice: 1449900,
    effectiveRatePerLitre: "₹899.80 / Litre",
    badge: "💰 BULK SAVINGS CONTAINER",
    badgeColor: "bg-emerald-800",
    image: "/assets/product_6-5L_jpg.webp",
    bestFor: "Joint households, festive sweet preparations, and Ayurvedic diets",
    dailyCost: "~₹30 / day",
    savings: "69% OFF",
    packaging: "Heavy-duty bulk food-grade container",
  },
];

const FAQS = [
  {
    q: "What is the official price of Namo Narayana Ghee 1 Litre?",
    a: "The verified price for the 1 Litre flagship glass jar of Namo Narayana Pure A2 Gir Cow Bilona Ghee is ₹1,299.00 on the official store (namonarayanaghee.store). This includes free courier delivery across India.",
  },
  {
    q: "Why does authentic Bilona Ghee cost more than supermarket ghee?",
    a: "Commercial ghee is made by skimming raw cream using motorized factory centrifuges from mixed cow and buffalo milk (requiring only 10–12 litres of milk). Namo Narayana uses the traditional Vedic Bilona method: fresh A2 milk is cultured into curd, churned with wooden bilonas to separate makkhan, and slow-simmered on low heat. This requires 25 to 30 litres of pure Gir cow milk per litre of ghee, establishing a true production cost baseline.",
  },
  {
    q: "Are shipping and courier delivery free on all orders?",
    a: "Yes. Namo Narayana provides 100% complimentary pan-India express courier shipping on all orders, from a single 500ml jar to multiple 5L bulk tins.",
  },
  {
    q: "Why does Namo Narayana operate exclusively on prepaid orders?",
    a: "To protect our glass jar packaging, guarantee temperature-controlled priority transit, and prevent courier transit rejections, all orders are 100% prepaid. This allows us to offer complimentary express shipping across India and an additional instant prepaid discount at checkout.",
  },
  {
    q: "What secure payment methods are accepted at checkout?",
    a: "We accept all major secure payment options: UPI (Google Pay, PhonePe, Paytm, BHIM), Credit Cards, Debit Cards, and Net Banking protected with 256-bit bank-grade SSL encryption.",
  },
  {
    q: "Where should I buy to avoid counterfeit or outdated pricing?",
    a: "Always purchase exclusively on https://www.namonarayanaghee.store/. Unauthorized third-party aggregators and unverified domains often list outdated prices (such as ₹1,249 or ₹2,350) or do not dispatch genuine FSSAI-sealed batches.",
  },
];

export default function PriceBuyingGuideContent() {
  const router = useRouter();
  const { open } = useCartDrawer();
  const [selectedPack, setSelectedPack] = useState<PackItem>(PACK_CATALOG[1]); // Default 1L
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const handleAddToCart = (pack: PackItem) => {
    addToCart({
      id: pack.id,
      productId: pack.id,
      variantId: pack.variantId,
      slug: pack.slug,
      title: pack.title,
      variantTitle: pack.size,
      price: pack.price,
      image: pack.image,
      quantity: 1,
      available: true,
    });
    toast.success(`Added ${pack.title} to cart`);
    open();
  };

  const handleInstantBuy = (pack: PackItem) => {
    addToCart({
      id: pack.id,
      productId: pack.id,
      variantId: pack.variantId,
      slug: pack.slug,
      title: pack.title,
      variantTitle: pack.size,
      price: pack.price,
      image: pack.image,
      quantity: 1,
      available: true,
    });
    router.push("/checkout");
  };

  return (
    <article className="bg-[#FAF8F5] text-[#24211E] py-12 md:py-20 font-sans">
      <div className="nn-container max-w-5xl mx-auto px-4 sm:px-6">

        {/* Breadcrumb Navigation */}
        <nav aria-label="Breadcrumb" className="text-xs text-stone-500 mb-6 flex items-center gap-2">
          <Link href="/" className="hover:text-[#8A1B14] transition-colors">Home</Link>
          <span>/</span>
          <Link href="/collections/ghee" className="hover:text-[#8A1B14] transition-colors">Ghee</Link>
          <span>/</span>
          <span className="text-[#8A1B14] font-medium">Price &amp; Buying Guide</span>
        </nav>

        {/* Hero Header */}
        <header className="mb-12 text-center max-w-3xl mx-auto">
          <span className="inline-flex items-center gap-2 bg-[#F3E8D8] text-[#8A1B14] text-xs uppercase tracking-widest font-bold px-3 py-1 rounded-full mb-4 border border-[#E4D1B8]">
            <Sparkles className="w-3.5 h-3.5 text-[#C99A3D]" />
            Official 2026 Price &amp; Pack Size Guide
          </span>
          <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold text-[#5E0B10] leading-tight mb-4">
            Namo Narayana Ghee Price: Pack Sizes, Current Rates &amp; Buying Guide
          </h1>
          <p className="text-stone-600 text-base sm:text-lg leading-relaxed">
            Verified official pricing, per-litre economics, pack recommendations, and step-by-step ordering instructions for authentic A2 Gir Cow Bilona Ghee.
          </p>
        </header>

        {/* AEO / Direct Answer Callout Box */}
        <section className="bg-white rounded-2xl p-6 sm:p-8 border-2 border-[#D4A017]/40 shadow-sm mb-12">
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-full bg-[#FCFAF5] border border-[#D4A017] flex items-center justify-center shrink-0 text-[#8A1B14] mt-1">
              <Info className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg sm:text-xl font-serif font-bold text-[#5E0B10] mb-2">
                Quick Summary: Current Official Rates (November 2026)
              </h2>
              <p className="text-sm sm:text-base text-stone-700 leading-relaxed mb-4">
                On the official store (<strong>namonarayanaghee.store</strong>), Namo Narayana Pure A2 Gir Cow Bilona Ghee is available in four verified pack sizes:
              </p>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
                {PACK_CATALOG.map((p) => (
                  <div key={p.size} className="bg-[#FCFAF5] p-3 rounded-xl border border-[#EAD7BC]">
                    <div className="text-xs font-bold text-stone-500 uppercase">{p.size}</div>
                    <div className="text-xl font-serif font-bold text-[#8A1B14]">{formatPrice(p.price)}</div>
                    <div className="text-[11px] text-stone-500 line-through">{formatPrice(p.compareAtPrice)}</div>
                    <div className="text-[11px] font-semibold text-emerald-700 mt-1">{p.effectiveRatePerLitre}</div>
                  </div>
                ))}
              </div>
              <p className="text-xs text-stone-500 mt-4">
                ✓ Free Pan-India Courier Delivery &bull; ✓ FSSAI Certified (Lic. No. 20824005000185) &bull; ✓ 100% Secure Prepaid Orders
              </p>
            </div>
          </div>
        </section>

        {/* Section 1: Detailed Price Comparison Table */}
        <section className="mb-16">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#5E0B10]">
                1. Official Price &amp; Specification Breakdown
              </h2>
              <p className="text-sm text-stone-600 mt-1">
                Transparent rates with zero hidden delivery charges or distributor markups.
              </p>
            </div>
          </div>

          <div className="overflow-x-auto bg-white rounded-2xl border border-[#EAD7BC] shadow-sm">
            <table className="w-full text-left border-collapse text-sm">
              <thead>
                <tr className="bg-[#F8F4EC] text-[#5E0B10] font-serif border-b border-[#EAD7BC]">
                  <th className="p-4 font-bold">Pack Size</th>
                  <th className="p-4 font-bold">Container</th>
                  <th className="p-4 font-bold">Official Price</th>
                  <th className="p-4 font-bold">MRP</th>
                  <th className="p-4 font-bold">Rate / Litre</th>
                  <th className="p-4 font-bold">Daily Cost</th>
                  <th className="p-4 font-bold text-center">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#F0E4D4]">
                {PACK_CATALOG.map((p) => (
                  <tr key={p.slug} className={`hover:bg-amber-50/50 transition-colors ${p.isPopular ? "bg-amber-50/30 font-medium" : ""}`}>
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-[#24211E]">{p.size}</span>
                        {p.isPopular && (
                          <span className="bg-[#C38936] text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                            Popular
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="p-4 text-stone-600">{p.packaging}</td>
                    <td className="p-4 font-bold text-[#8A1B14]">{formatPrice(p.price)}</td>
                    <td className="p-4 text-stone-400 line-through">{formatPrice(p.compareAtPrice)}</td>
                    <td className="p-4 font-semibold text-emerald-800">{p.effectiveRatePerLitre}</td>
                    <td className="p-4 text-stone-600">{p.dailyCost}</td>
                    <td className="p-4 text-center">
                      <button
                        onClick={() => handleInstantBuy(p)}
                        className="inline-flex items-center justify-center gap-1.5 bg-[#8A1B14] hover:bg-[#5E0B10] text-white text-xs font-bold px-3 py-2 rounded-lg shadow-sm transition-all"
                      >
                        <Zap className="w-3.5 h-3.5 fill-current" /> Buy Now
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* Section 2: Economics of Authentic Bilona Ghee */}
        <section className="mb-16 bg-white rounded-2xl p-6 sm:p-10 border border-[#EAD7BC] shadow-sm">
          <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#5E0B10] mb-4">
            2. The Economics of Bilona Ghee: Why Authentic Ghee Cannot Cost ₹300/kg
          </h2>
          <div className="prose prose-stone max-w-none text-stone-700 leading-relaxed space-y-4">
            <p>
              Shoppers often wonder why authentic A2 Gir Cow Bilona Ghee costs ₹1,299 per litre while industrial supermarket ghee is sold for ₹450 to ₹600 per litre. The answer lies in the fundamental difference between <strong>industrial cream-separation</strong> and the <strong>traditional Vedic Bilona curd-churning method</strong>.
            </p>

            <div className="grid md:grid-cols-2 gap-6 my-6 not-prose">
              <div className="bg-[#FFF8F7] p-5 rounded-xl border border-red-200">
                <span className="text-xs font-bold text-red-800 uppercase tracking-wider block mb-2">Commercial Industrial Ghee</span>
                <p className="text-xs text-stone-600 mb-3">
                  Industrial processors run raw milk through high-speed mechanical centrifuges, skimming fat directly as raw cream.
                </p>
                <ul className="text-xs space-y-2 text-stone-700">
                  <li>• Requires only 10 to 12 litres of mixed milk</li>
                  <li>• No fermentation or culturing to curd</li>
                  <li>• High-heat mechanical boiling destroys delicate enzymes</li>
                  <li>• Lower production cost, but lacks butyric acid &amp; probiotic synthesis</li>
                </ul>
              </div>

              <div className="bg-[#FAF9F5] p-5 rounded-xl border-2 border-[#D4A017]">
                <span className="text-xs font-bold text-[#8A1B14] uppercase tracking-wider block mb-2">Vedic Bilona Method (Namo Narayana)</span>
                <p className="text-xs text-stone-600 mb-3">
                  Whole A2 Gir cow milk is boiled, naturally cultured into curd, hand-churned with bi-directional wooden bilonas, and slow-simmered.
                </p>
                <ul className="text-xs space-y-2 text-stone-700">
                  <li>• <strong>Requires 25 to 30 litres of whole Gir cow milk per litre</strong></li>
                  <li>• Natural lactic culturing produces digestive butyrate</li>
                  <li>• Slow wood-fire simmering creates rich <em>danedar</em> golden grains</li>
                  <li>• Minimum milk procurement cost alone exceeds ₹1,100 per litre of ghee</li>
                </ul>
              </div>
            </div>

            <p>
              Because raw Gir cow milk costs approximately ₹45 to ₹65 per litre at the farm gate, producing one litre of curd-churned Bilona ghee carries an inescapable milk-cost baseline. Any product marketed as &ldquo;Gir Cow Bilona Ghee&rdquo; at ₹300–₹500 per litre is economically impossible without blending buffalo milk, palm oil derivatives, or commercial butter oil.
            </p>
          </div>
        </section>

        {/* Section 3: Interactive Pack Selector */}
        <section className="mb-16">
          <div className="text-center mb-8">
            <span className="text-xs font-bold text-[#8A1B14] tracking-widest uppercase block mb-1">Interactive Recommendation</span>
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#5E0B10]">
              3. Which Pack Size Best Fits Your Household?
            </h2>
            <p className="text-sm text-stone-600 max-w-xl mx-auto mt-2">
              Select your household type below to inspect savings, per-day cost, and recommended usage.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
            {PACK_CATALOG.map((pack) => {
              const isSelected = selectedPack.size === pack.size;
              return (
                <button
                  key={pack.size}
                  onClick={() => setSelectedPack(pack)}
                  className={`p-4 rounded-xl border-2 text-left transition-all ${
                    isSelected
                      ? "border-[#8A1B14] bg-white shadow-md ring-2 ring-[#8A1B14]/20"
                      : "border-[#EAD7BC] bg-[#FCFAF5] hover:bg-white text-stone-700"
                  }`}
                >
                  <div className="text-xs font-bold text-stone-500 uppercase">{pack.size}</div>
                  <div className="text-lg font-serif font-bold text-[#8A1B14] mt-1">{formatPrice(pack.price)}</div>
                  <div className="text-[11px] text-emerald-700 font-semibold">{pack.savings}</div>
                </button>
              );
            })}
          </div>

          {/* Selected Pack Spotlight Card */}
          <div className="bg-white rounded-2xl border border-[#EAD7BC] p-6 sm:p-8 shadow-sm">
            <div className="grid md:grid-cols-12 gap-8 items-center">
              <div className="md:col-span-4 relative aspect-square rounded-xl overflow-hidden bg-amber-50/50">
                <Image
                  src={selectedPack.image}
                  alt={selectedPack.title}
                  fill
                  className="object-contain p-4"
                  sizes="(max-width: 768px) 100vw, 300px"
                />
              </div>

              <div className="md:col-span-8">
                <div className="inline-block bg-[#8A1B14] text-white text-[10px] font-bold px-2.5 py-0.5 rounded-full mb-3">
                  {selectedPack.badge}
                </div>
                <h3 className="font-serif text-2xl sm:text-3xl font-bold text-[#5E0B10] mb-2">
                  {selectedPack.title}
                </h3>
                <div className="flex items-baseline gap-3 mb-4">
                  <span className="text-3xl font-serif font-bold text-[#8A1B14]">{formatPrice(selectedPack.price)}</span>
                  <span className="text-lg text-stone-400 line-through">{formatPrice(selectedPack.compareAtPrice)}</span>
                  <span className="text-sm font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-md border border-emerald-200">
                    Effective {selectedPack.effectiveRatePerLitre}
                  </span>
                </div>

                <p className="text-stone-700 text-sm leading-relaxed mb-6">
                  <strong>Recommended Use:</strong> {selectedPack.bestFor}. Daily estimated consumption cost: <strong>{selectedPack.dailyCost}</strong>. Packaged in a {selectedPack.packaging} to preserve natural aroma and granular crystals.
                </p>

                <div className="flex flex-wrap gap-3">
                  <button
                    onClick={() => handleInstantBuy(selectedPack)}
                    className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-2 bg-[#8A1B14] hover:bg-[#5E0B10] text-white font-bold px-6 py-3 rounded-xl shadow-md transition-all text-sm"
                  >
                    <Zap className="w-4 h-4 fill-current" /> Buy Now (Instant Checkout)
                  </button>
                  <button
                    onClick={() => handleAddToCart(selectedPack)}
                    className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-2 border-2 border-[#8A1B14] text-[#8A1B14] hover:bg-amber-50 font-bold px-6 py-3 rounded-xl transition-all text-sm"
                  >
                    <ShoppingCart className="w-4 h-4" /> Add to Cart
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Section 4: Ordering Guide & COD Policies */}
        <section className="mb-16 bg-white rounded-2xl p-6 sm:p-10 border border-[#EAD7BC] shadow-sm">
          <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#5E0B10] mb-4">
            4. Step-by-Step Guide: How to Order Authentic Ghee Online
          </h2>
          <div className="prose prose-stone max-w-none text-stone-700 leading-relaxed space-y-4">
            <p>
              Ordering directly from the authorized platform guarantees that your ghee is freshly clarified and shipped under tamper-proof packaging:
            </p>

            <ol className="list-decimal pl-5 space-y-3">
              <li>
                <strong>Verify the URL:</strong> Always make sure you are ordering on <code>https://www.namonarayanaghee.store/</code>.
              </li>
              <li>
                <strong>Select Pack Size:</strong> Choose between the 500ml trial, 1L bestseller, 2.5L family pack, or 5L bulk tin based on your monthly household usage.
              </li>
              <li>
                <strong>Provide Delivery Pincode:</strong> Enter your 6-digit postal code to calculate exact delivery transit times (Metro: 2–3 business days; Rest of India: 4–5 business days).
              </li>
              <li>
                <strong>Select Payment Method:</strong>
                <p className="text-stone-600 mt-1">
                  100% Secure Prepaid (UPI, Debit/Credit Card, Net Banking). Orders receive immediate priority batch allocation, complimentary transit insurance, and instant express dispatch.
                </p>
              </li>
              <li>
                <strong>Track in Real-Time:</strong> Receive automated WhatsApp and SMS updates with your live Delhivery Express tracking ID once your consignment is dispatched.
              </li>
            </ol>
          </div>
        </section>

        {/* Section 5: Frequently Asked Questions */}
        <section className="mb-16">
          <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#5E0B10] mb-6 text-center">
            5. Frequently Asked Questions
          </h2>
          <div className="space-y-4">
            {FAQS.map((faq, idx) => {
              const isOpen = openFaq === idx;
              return (
                <div key={idx} className="bg-white rounded-xl border border-[#EAD7BC] overflow-hidden shadow-xs">
                  <button
                    onClick={() => setOpenFaq(isOpen ? null : idx)}
                    className="w-full text-left p-5 flex items-center justify-between font-serif font-bold text-stone-800 hover:text-[#8A1B14] transition-colors"
                  >
                    <span>{faq.q}</span>
                    {isOpen ? <ChevronUp className="w-5 h-5 text-[#8A1B14] shrink-0" /> : <ChevronDown className="w-5 h-5 text-stone-400 shrink-0" />}
                  </button>
                  {isOpen && (
                    <div className="p-5 pt-0 text-sm text-stone-600 leading-relaxed border-t border-stone-100 bg-[#FCFAF5]/50">
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </section>

        {/* Bottom CTA Banner */}
        <section className="bg-gradient-to-r from-[#5E0B10] to-[#8A1B14] rounded-2xl p-8 sm:p-12 text-center text-white shadow-xl relative overflow-hidden">
          <div className="relative z-10 max-w-2xl mx-auto">
            <h2 className="font-serif text-3xl sm:text-4xl font-bold mb-3">
              Taste Authentic Vedic Bilona Ghee Today
            </h2>
            <p className="text-amber-100 text-sm sm:text-base mb-8">
              100% Pure A2 Gir Cow Ghee, hand-churned from cultured curd. Zero preservatives, zero additives, pan-India free delivery.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link
                href="/products/pure-desi-cow-ghee-1-litre"
                className="bg-[#D4A017] hover:bg-[#C99A3D] text-[#24211E] font-bold px-8 py-3.5 rounded-xl shadow-lg transition-all text-sm inline-flex items-center gap-2"
              >
                <Zap className="w-4 h-4 fill-current" /> Order 1 Litre Bestseller (₹1,299)
              </Link>
              <Link
                href="/collections/ghee"
                className="border-2 border-white/80 hover:bg-white/10 text-white font-bold px-8 py-3.5 rounded-xl transition-all text-sm inline-flex items-center gap-2"
              >
                View All Pack Sizes <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </section>

      </div>
    </article>
  );
}

