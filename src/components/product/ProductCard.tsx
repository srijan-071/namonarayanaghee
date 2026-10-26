import Link from "next/link";
import Image from "next/image";
import { formatPrice, discountPercent } from "@/lib/utils";
import DiwaliDiya from "@/components/ui/DiwaliDiya";

interface ProductCardProps {
  slug: string;
  title: string;
  price: number;
  compareAtPrice: number | null;
  image: string;
  available: boolean;
}

export default function ProductCard({ slug, title, price, compareAtPrice, image, available }: ProductCardProps) {
  const discount = compareAtPrice ? discountPercent(price, compareAtPrice) : 0;

  return (
    <Link href={`/products/${slug}`} className="group flex flex-col h-full bg-white rounded-xl overflow-hidden transition-all duration-300 hover:shadow-lg border border-amber-200/60 hover:border-amber-400">
      <div className="relative aspect-square overflow-hidden bg-nn-cream">
        {image ? (
          <Image
            src={image}
            alt={title}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            sizes="(min-width: 1024px) 25vw, (min-width: 768px) 33vw, 50vw"
            quality={90}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-nn-bark/20">
            <svg className="w-12 h-12" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}><rect x="3" y="3" width="18" height="18" rx="2" /><circle cx="8.5" cy="8.5" r="1.5" /><path d="M21 15l-5-5L5 21" /></svg>
          </div>
        )}
        
        {/* Diwali Festive Discount Badge */}
        {discount > 0 ? (
          <span className="absolute top-2.5 left-2.5 bg-gradient-to-r from-[#8A1B14] to-[#630D12] text-amber-200 text-[10px] sm:text-[11px] font-black px-2 py-0.5 rounded shadow-sm border border-amber-400/40 flex items-center gap-1">
            <DiwaliDiya size={12} glow={false} />
            <span>{discount}% OFF</span>
          </span>
        ) : (
          <span className="absolute top-2.5 left-2.5 bg-[#8A1B14] text-amber-200 text-[10px] font-black px-2 py-0.5 rounded shadow-sm border border-amber-400/40 flex items-center gap-1">
            <DiwaliDiya size={12} glow={false} />
            <span>Diwali Special</span>
          </span>
        )}

        <span className="absolute bottom-2.5 right-2.5 bg-black/75 backdrop-blur-xs text-white text-[10px] font-bold px-2 py-0.5 rounded shadow-xs">
          Free Shipping
        </span>
      </div>

      <div className="p-4 flex flex-col flex-1 justify-between bg-white text-center">
        <div>
          <span className="text-[10px] text-[#8A1B14] font-extrabold uppercase tracking-widest block mb-1">
            शुभ दीपावली स्पेशल
          </span>
          <h3 className="font-serif font-bold text-base leading-snug text-nn-ink group-hover:text-[#8A1B14] transition-colors line-clamp-2 mb-2">
            {title}
          </h3>
        </div>
        
        <div className="flex flex-col items-center gap-1 mt-auto">
          <div className="flex items-center justify-center gap-2">
            <span className="font-bold text-[#8A1B14] text-lg font-sans">{formatPrice(price)}</span>
            {compareAtPrice && compareAtPrice > price && (
              <span className="text-sm font-medium text-nn-bark/60 line-through">{formatPrice(compareAtPrice)}</span>
            )}
          </div>
          <span className="text-[10px] text-amber-800 font-semibold flex items-center gap-1">
            <span>Free Cold-Pressed Oils Included</span>
          </span>
        </div>
      </div>
    </Link>
  );
}
