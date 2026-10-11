import Link from "next/link";
import Image from "next/image";
import { formatPrice, discountPercent } from "@/lib/utils";

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
    <Link href={`/products/${slug}`} className="group flex flex-col h-full bg-white rounded-xl overflow-hidden transition-all duration-300 hover:shadow-md border border-nn-hairline">
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
        
        {discount > 0 && (
          <span className="absolute top-3 left-3 bg-nn-mustard text-white text-xs font-bold px-2 py-1 rounded shadow-sm">
            {discount}% OFF
          </span>
        )}
        

      </div>

      <div className="p-4 flex flex-col flex-1 justify-between bg-white text-center">
        <h3 className="font-serif font-bold text-base leading-snug text-nn-ink group-hover:text-nn-forest transition-colors line-clamp-2 mb-3">
          {title}
        </h3>
        
        <div className="flex flex-col items-center gap-2 mt-auto">
          <div className="flex items-center justify-center gap-2">
            <span className="font-bold text-nn-leaf text-lg">{formatPrice(price)}</span>
            {compareAtPrice && compareAtPrice > price && (
              <span className="text-sm font-medium text-nn-bark/60 line-through">{formatPrice(compareAtPrice)}</span>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
}
