"use client";

import { useState, useEffect } from "react";
import { useCart, useCartDrawer, removeFromCart, updateQuantity, addToCart, applyCoupon, removeCoupon } from "@/lib/cart";
import { formatPrice } from "@/lib/utils";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { toast } from "sonner";
import { Loader2, ChevronLeft, ShoppingCart, Trash2, Ticket, TrendingUp, Star, Gift, Sparkles, ArrowRight } from "lucide-react";
import { trackEvent } from "@/lib/analytics";
import { RAW_PRODUCTS } from "@/lib/data-store";
import { getFreeGiftsForCart, has500mlGheeUpsell } from "@/lib/gifts";
import DiwaliDiya from "@/components/ui/DiwaliDiya";

export default function CartDrawer() {
  const cart = useCart();
  const { isOpen, close } = useCartDrawer();
  const router = useRouter();
  const [isNavigating, setIsNavigating] = useState(false);
  const [tempCoupon, setTempCoupon] = useState("");
  const [showBreakdown, setShowBreakdown] = useState(false);

  // Proactively prefetch /checkout so clicking Continue transitions in 0ms
  useEffect(() => {
    if (isOpen) {
      router.prefetch("/checkout");
    }
  }, [isOpen, router]);

  // Compute free gifts based on cart contents
  const freeGifts = getFreeGiftsForCart(cart.items);
  const totalFreeGiftsCount = freeGifts.reduce((s, g) => s + g.quantity, 0);
  const totalGheeItemsCount = cart.items.reduce((s, i) => s + i.quantity, 0);
  const totalCombinedCount = totalGheeItemsCount + totalFreeGiftsCount;
  const show500mlUpsell = has500mlGheeUpsell(cart.items);

  const handleRemove = (variantId: number) => {
    const item = cart.items.find((i) => i.variantId === variantId);
    if (item) {
      trackEvent("remove_from_cart", {
        currency: "INR",
        value: item.price * item.quantity,
        items: [{
          item_id: item.productId,
          item_name: item.title,
          quantity: item.quantity,
          price: item.price
        }]
      });
    }
    removeFromCart(variantId);
    toast.success("Item removed from cart");
  };

  const handleUpdate = (variantId: number, newQty: number) => {
    if (newQty < 1) return;
    updateQuantity(variantId, newQty);
  };

  const handleAddCrossSell = (slug: string) => {
    const p = RAW_PRODUCTS[slug];
    if (!p) return;
    const v = p.variants[0];
    addToCart({
      productId: p.id,
      variantId: v.id,
      slug: p.handle,
      title: p.title,
      variantTitle: v.title,
      price: v.price,
      image: p.images[0] ?? ""
    }, 1);

    if (slug === "pure-desi-cow-ghee-1-litre") {
      toast.success("🎉 Added 1L Ghee! Free Mustard Oil (250ml) added!");
    } else {
      toast.success(`${p.title} added to cart`);
    }
  };

  const handleUpgradeTo1L = () => {
    const item500ml = cart.items.find(
      (i) => i.slug.includes("500-ml") || (i.variantTitle || "").includes("500 ml")
    );
    if (item500ml) {
      removeFromCart(item500ml.variantId);
    }
    const p1L = RAW_PRODUCTS["pure-desi-cow-ghee-1-litre"];
    if (p1L) {
      const v1L = p1L.variants[0];
      addToCart({
        productId: p1L.id,
        variantId: v1L.id,
        slug: p1L.handle,
        title: p1L.title,
        variantTitle: v1L.title,
        price: v1L.price,
        image: p1L.images[0] ?? "/assets/mustard-oil-250ml.webp"
      }, 1);
      toast.success("🎉 Upgraded to 1 Litre Ghee! Free Mustard Oil (250ml) added!");
    }
  };

  const crossSells = [
    { slug: "pure-desi-cow-ghee-500-ml", badge: <><Star className="w-2.5 h-2.5 fill-current inline"/> Trial Pack</> },
    { slug: "pure-desi-cow-ghee-1-litre", badge: <><Star className="w-2.5 h-2.5 fill-current inline"/> Most Popular</> }
  ].filter(cs => !cart.items.some(i => i.slug === cs.slug));

  return (
    <>
      <div 
        className={`fixed inset-0 z-[100] bg-black/40 transition-opacity duration-300 ${isOpen ? "opacity-100" : "opacity-0 pointer-events-none"}`} 
        onClick={close} 
      />
      
      <aside className={`fixed top-0 right-0 z-[101] h-full w-full sm:w-[420px] bg-[#F7F8FA] flex flex-col transition-transform duration-300 shadow-2xl ${isOpen ? "translate-x-0" : "translate-x-full"}`}>
        
        {/* Header */}
        <div className="bg-white shrink-0">
          <div className="flex items-center justify-between p-4 relative border-b border-gray-100">
            <button onClick={close} className="p-1.5 -ml-1 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors cursor-pointer" aria-label="Close cart drawer">
              <ChevronLeft className="w-5 h-5" />
            </button>
            <h2 className="text-[#0B483B] font-bold text-[17px] font-serif absolute left-1/2 -translate-x-1/2">Your <span className="notranslate">Cart</span></h2>
            <div className="w-8"></div>
          </div>
          <div className="bg-gradient-to-r from-[#5E0B10] via-[#85181A] to-[#5E0B10] text-amber-200 text-center py-2.5 px-3 text-[12px] font-bold tracking-wide shadow-sm flex items-center justify-center gap-2 border-b border-amber-400/30">
            <DiwaliDiya size={16} glow={false} />
            <span>शुभ दीपावली: Free Shipping + Free Festive Gifts!</span>
          </div>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto pb-44 custom-scrollbar">
          {cart.items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full gap-4 text-center p-8">
              <ShoppingCart className="w-16 h-16 text-gray-300" />
              <h3 className="font-serif text-lg font-bold text-gray-900">Your <span className="notranslate">cart</span> is empty</h3>
              <p className="text-gray-500 text-sm">Pure, farm-fresh essentials are waiting for you.</p>
              <Link href="/collections/all-products" onClick={close} className="bg-[#0B483B] text-white font-bold px-6 py-3 rounded-xl mt-4 hover:bg-[#073329] transition">
                Continue Shopping
              </Link>
            </div>
          ) : (
            <div className="flex flex-col bg-white">
              <div className="p-4 space-y-5">
                
                {/* 500ml Upsell Notice to Upgrade to 1L and get Free Mustard Oil */}
                {show500mlUpsell && (
                  <div className="bg-gradient-to-r from-amber-50 via-yellow-50 to-amber-100 border-2 border-dashed border-amber-400 rounded-2xl p-3.5 flex items-center justify-between gap-3 shadow-xs animate-in fade-in slide-in-from-top-1">
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div className="w-9 h-9 rounded-full bg-amber-500/20 text-amber-700 flex items-center justify-center shrink-0">
                        <Gift className="w-5 h-5 text-amber-700" />
                      </div>
                      <div>
                        <p className="text-[13px] font-bold text-amber-950 leading-tight">
                          Upgrade to 1 Litre Ghee!
                        </p>
                        <p className="text-[11px] text-amber-900 font-medium mt-0.5">
                          Get <span className="font-bold underline text-amber-950">FREE Mustard Oil (250 ml)</span> with 1L pack!
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={handleUpgradeTo1L}
                      className="bg-[#0B483B] hover:bg-[#073329] text-white text-[11px] font-bold px-3 py-2 rounded-xl shrink-0 transition shadow-sm flex items-center gap-1 cursor-pointer"
                    >
                      <span>Upgrade</span>
                      <ArrowRight className="w-3 h-3" />
                    </button>
                  </div>
                )}

                {/* Cart Details Header */}
                <div>
                  <div className="flex justify-between items-center mb-4">
                    <div className="flex items-center gap-2 text-[#0B483B] font-bold font-serif text-[15px]">
                      <ShoppingCart className="w-[18px] h-[18px]" />
                      <span><span className="notranslate">Cart</span> details</span>
                    </div>
                    <span className="text-[13px] font-bold text-gray-800">
                      Total items: {totalCombinedCount}
                      {totalFreeGiftsCount > 0 && (
                        <> • Free gifts: {totalFreeGiftsCount}</>
                      )}
                    </span>
                  </div>

                  {/* Main Ghee Products */}
                  <div className="space-y-3.5">
                    {cart.items.map(item => (
                      <div key={item.variantId} className="border border-gray-200 rounded-2xl p-3.5 flex gap-4 bg-white relative">
                        <div className="w-[84px] h-[84px] rounded-xl overflow-hidden bg-gray-50 border border-gray-100 shrink-0 relative">
                          {item.image ? (
                            <Image src={item.image} alt={item.title} fill className="object-cover" sizes="84px" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-gray-300">No Img</div>
                          )}
                        </div>
                        <div className="flex-1 flex flex-col justify-between">
                          <div>
                            <Link href={`/products/${item.slug}`} onClick={close} className="text-[13px] font-bold text-gray-900 leading-tight pr-6 line-clamp-2">
                              {item.title}
                            </Link>
                            {item.variantTitle && (
                              <div className="mt-1.5">
                                <span className="bg-[#EEF4F0] text-[#0B483B] text-[11px] font-bold px-2 py-0.5 rounded-md">
                                  {item.variantTitle}
                                </span>
                              </div>
                            )}
                            <p className="text-[13px] font-bold text-gray-900 mt-1.5">{formatPrice(item.price)}</p>
                          </div>
                          
                          <div className="flex items-center justify-between mt-2.5">
                            <div className="flex items-center border border-gray-200 rounded-full h-[32px] bg-white overflow-hidden">
                              <button onClick={() => handleUpdate(item.variantId, item.quantity - 1)} className="w-[32px] h-full flex items-center justify-center text-green-700 text-lg hover:bg-green-50 transition-colors cursor-pointer">−</button>
                              <span className="w-6 text-center text-[13px] font-bold text-gray-800">{item.quantity}</span>
                              <button onClick={() => handleUpdate(item.variantId, item.quantity + 1)} className="w-[32px] h-full flex items-center justify-center text-green-700 text-lg hover:bg-green-50 transition-colors cursor-pointer">+</button>
                            </div>
                            
                            <button onClick={() => handleRemove(item.variantId)} className="text-gray-400 hover:text-red-500 p-2 transition-colors cursor-pointer" aria-label="Remove item">
                              <Trash2 className="w-[18px] h-[18px]" />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}

                    {/* Free Gifts Cards Matching User Screenshots Exactly */}
                    {freeGifts.map((gift, idx) => (
                      <div 
                        key={`${gift.id}-${idx}`} 
                        className="border-2 border-[#1E40AF] rounded-2xl p-3.5 flex gap-4 bg-white relative shadow-xs animate-in fade-in duration-300"
                      >
                        <div className="w-[84px] h-[84px] rounded-xl overflow-hidden bg-[#FAF9F5] border border-gray-100 shrink-0 relative flex items-center justify-center">
                          <Image 
                            src={gift.image} 
                            alt={gift.name} 
                            fill 
                            className="object-contain p-1" 
                            sizes="84px" 
                          />
                        </div>
                        <div className="flex-1 flex flex-col justify-center">
                          <h4 className="text-[14px] font-bold text-gray-900 leading-tight">
                            {gift.name}
                          </h4>
                          
                          <div className="flex items-center gap-1.5 mt-1.5 flex-wrap">
                            <span className="bg-[#0B3B82] text-white text-[11px] font-bold px-2.5 py-0.5 rounded-full inline-flex items-center">
                              Free gift • {gift.size} × {gift.quantity}
                            </span>
                            <span className="bg-[#EBF3FB] text-[#1E3A8A] text-[11px] font-bold px-2 py-0.5 rounded-md">
                              {gift.variant}
                            </span>
                          </div>

                          <div className="flex items-center gap-2 mt-2">
                            <span className="text-[13px] font-extrabold text-gray-900">FREE</span>
                            <span className="text-[12px] font-semibold text-[#086642]">You saved Rs. 0.00</span>
                          </div>

                          <p className="text-[11px] font-semibold text-[#1F6E43] mt-1">
                            Added with your ghee offer
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Highly Selling Products Cross-Sells */}
                {crossSells.length > 0 && (
                  <div>
                    <div className="flex items-center gap-1.5 mb-3 text-[#0B483B] font-bold font-serif text-[15px]">
                      Highly Selling Products <TrendingUp className="w-[14px] h-[14px] text-red-500" />
                    </div>
                    <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide -mx-4 px-4">
                      {crossSells.map((cs) => {
                        const p = RAW_PRODUCTS[cs.slug];
                        if (!p) return null;
                        const variant = p.variants[0];
                        const img = p.images[0];
                        return (
                          <div key={cs.slug} className="border border-gray-200 rounded-2xl p-2.5 bg-white w-[260px] flex gap-3 relative shrink-0">
                            <div className="absolute top-0 left-0 bg-[#0B483B] text-white text-[10px] font-bold px-1.5 py-0.5 rounded-br-lg rounded-tl-xl z-10 flex items-center gap-0.5 shadow-sm">
                              {cs.badge}
                            </div>
                            <div className="w-[72px] h-[72px] rounded-lg overflow-hidden relative shrink-0 bg-gray-50 border border-gray-100">
                              {img && <Image src={img} alt={p.title} fill className="object-cover" sizes="72px" />}
                            </div>
                            <div className="flex-1 flex flex-col justify-center">
                              <p className="text-[12px] font-bold text-gray-900 leading-snug line-clamp-2">{p.title}</p>
                              <div className="flex items-center justify-between mt-2">
                                <p className="text-[12px] font-bold text-gray-900">{formatPrice(variant.price)}</p>
                                <button onClick={() => handleAddCrossSell(cs.slug)} className="bg-[#215E4C] text-white text-[11px] font-bold px-4 py-1.5 rounded-full hover:bg-[#164235] transition-colors cursor-pointer">
                                  Add
                                </button>
                              </div>
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  </div>
                )}

                {/* Add more items */}
                <button onClick={close} className="border border-[#0B483B] text-[#0B483B] bg-white rounded-full px-5 py-2 text-[13px] font-bold flex items-center gap-1.5 hover:bg-gray-50 transition-colors w-fit cursor-pointer">
                  Add more items <ChevronLeft className="w-[14px] h-[14px] rotate-180 stroke-[3]" />
                </button>

                {/* Coupon */}
                <div className="pt-1">
                  <div className="flex items-center gap-2 text-[#0B483B] font-bold text-[13px] mb-3">
                    <Ticket className="w-[18px] h-[18px] -rotate-45" /> Have a <span className="notranslate">coupon</span> code?
                  </div>
                  {/* 1-Click Diwali Offer Coupon */}
                  {!cart.discountCode && (
                    <div className="bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-300 rounded-xl p-3 flex items-center justify-between mb-3 shadow-xs">
                      <div className="flex items-center gap-2 min-w-0">
                        <DiwaliDiya size={20} glow={false} />
                        <div>
                          <p className="text-[12px] font-black text-[#8A1B14] leading-tight">
                            DIWALI SPECIAL (10% OFF)
                          </p>
                          <p className="text-[11px] text-stone-600 font-medium">
                            Apply code <span className="font-bold text-amber-900">DIWALI</span> for festive savings
                          </p>
                        </div>
                      </div>
                      <button
                        onClick={() => {
                          if (applyCoupon("DIWALI")) {
                            toast.success("🎉 Shubh Deepavali! 10% Festive Discount Applied!");
                          }
                        }}
                        className="bg-[#8A1B14] hover:bg-[#68140E] text-white text-[11px] font-bold px-3 py-1.5 rounded-lg shadow-sm transition active:scale-95 cursor-pointer shrink-0"
                      >
                        Apply
                      </button>
                    </div>
                  )}

                  {cart.discountCode ? (
                    <div className="flex items-center justify-between bg-[#EEF4F0] border border-[#0B483B] text-[#0B483B] px-4 py-3 rounded-xl text-sm font-bold">
                      <span>{cart.discountCode} applied!</span>
                      <button onClick={() => removeCoupon()} className="text-xs hover:underline cursor-pointer">Remove</button>
                    </div>
                  ) : (
                    <div className="flex gap-2 relative">
                      <input
                        type="text"
                        placeholder="Enter coupon code"
                        value={tempCoupon}
                        onChange={(e) => setTempCoupon(e.target.value.toUpperCase())}
                        className="w-full border-2 border-dashed border-gray-300 rounded-xl pl-4 pr-[88px] py-3 text-[13px] focus:outline-none focus:border-[#0B483B] bg-white uppercase font-bold placeholder:font-normal placeholder:normal-case notranslate"
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' && tempCoupon) {
                            if (!applyCoupon(tempCoupon)) {
                              toast.error("This code isn't valid for the items in your cart.");
                            } else {
                              toast.success("Coupon applied!");
                            }
                          }
                        }}
                      />
                      <button 
                        onClick={() => {
                          if (tempCoupon) {
                            if (!applyCoupon(tempCoupon)) {
                              toast.error("This code isn't valid for the items in your cart.");
                            } else {
                              toast.success("Coupon applied!");
                            }
                          }
                        }}
                        className="absolute right-1.5 top-1.5 bottom-1.5 bg-[#215E4C] text-white px-5 rounded-lg text-[13px] font-bold hover:bg-[#164235] transition-colors cursor-pointer"
                      >
                        Apply
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {cart.items.length > 0 && (
            <div className="bg-[#FCF5E3] text-[#A66D25] text-center py-3 text-[13px] font-bold border-y border-[#F0E0B6]">
              Unlock your best offer at <span className="notranslate">checkout</span>!
            </div>
          )}
        </div>

        {/* Sticky Footer */}
        {cart.items.length > 0 && (
          <div className="absolute bottom-0 left-0 w-full bg-[#F7F8FA] border-t border-gray-200 z-[102] rounded-t-xl shadow-[0_-4px_15px_-3px_rgba(0,0,0,0.05)] transition-all duration-300">
             {/* Expandable Price Breakdown */}
             {showBreakdown && (
               <div className="px-4 pt-4 pb-2 bg-white border-b border-gray-100 rounded-t-xl animate-in slide-in-from-bottom-2">
                 <div className="flex justify-between items-center mb-3">
                   <h3 className="font-bold font-serif text-[15px] text-gray-900"><span className="notranslate">Price Summary</span></h3>
                   <button onClick={() => setShowBreakdown(false)} className="text-gray-400 hover:text-gray-600 p-1 rounded-md cursor-pointer">
                     <ChevronLeft className="w-5 h-5 -rotate-90" />
                   </button>
                 </div>
                 <div className="space-y-2.5 mb-2">
                   <div className="flex justify-between text-[13px] text-gray-600">
                     <span><span className="notranslate">Order Total</span></span>
                     <span className="font-bold text-gray-900">{formatPrice(cart.subtotal)}</span>
                   </div>
                   {totalFreeGiftsCount > 0 && (
                     <div className="flex justify-between text-[13px] text-gray-600">
                       <span className="flex items-center gap-1 text-[#1E40AF] font-medium">
                         <Gift className="w-3.5 h-3.5" /> Free Gifts ({totalFreeGiftsCount})
                       </span>
                       <span className="font-bold text-[#25D366]">FREE</span>
                     </div>
                   )}
                   <div className="flex justify-between text-[13px] text-gray-600">
                     <span>Items <span className="notranslate">Discount</span></span>
                     <span className="font-bold text-gray-900">{cart.discountAmount ? `- ${formatPrice(cart.discountAmount)}` : "Rs. 0.00"}</span>
                   </div>
                   <div className="flex justify-between text-[13px] text-gray-600">
                     <span><span className="notranslate">Shipping</span></span>
                     <span className="font-bold text-[#25D366]">FREE</span>
                   </div>
                   <div className="flex justify-between text-[14px] font-bold text-gray-900 pt-2 pb-1 border-t border-dashed border-gray-200 mt-2">
                     <span><span className="notranslate">To Pay</span></span>
                     <span>{formatPrice(cart.total ?? cart.subtotal)}</span>
                   </div>
                 </div>
               </div>
             )}

             <div className="p-4 flex flex-col gap-3">
               <div className="flex items-center justify-between gap-4">
                 <div className="flex flex-col shrink-0">
                   <div className="flex items-center gap-1 cursor-pointer" onClick={() => setShowBreakdown(!showBreakdown)}>
                     <span className="text-[17px] font-extrabold text-gray-900">{formatPrice(cart.total ?? cart.subtotal)}</span>
                     <ChevronLeft className={`w-4 h-4 text-gray-700 stroke-[3] transition-transform ${showBreakdown ? '-rotate-90' : 'rotate-90'}`} />
                   </div>
                   {totalFreeGiftsCount > 0 && (
                     <span className="text-[11px] font-semibold text-[#1E40AF]">
                       Includes {totalFreeGiftsCount} Free Gift{totalFreeGiftsCount > 1 ? "s" : ""}
                     </span>
                   )}
                 </div>
                 
                 <Link
                   href="/checkout"
                   prefetch={true}
                   onClick={() => close()}
                   className="bg-[#084131] text-white font-bold text-[15px] flex-1 h-[48px] rounded-full shadow-md hover:bg-[#062f23] transition flex items-center justify-center gap-2 cursor-pointer"
                 >
                   <span className="notranslate">Continue</span>
                 </Link>
               </div>
               
               <div className="flex items-center justify-center gap-1.5 text-[11px] font-bold text-gray-500 pt-1">
                 Secure Payments: 
                 <div className="flex gap-1 items-center ml-1">
                   <span className="bg-white border border-gray-200 text-gray-400 font-extrabold px-1.5 py-0.5 rounded text-[8px] tracking-wider">UPI</span>
                   <span className="bg-white border border-gray-200 text-blue-800 font-extrabold px-1.5 py-0.5 rounded text-[8px] tracking-wider italic">VISA</span>
                   <span className="bg-white border border-gray-200 text-orange-500 font-extrabold px-1.5 py-0.5 rounded text-[8px] tracking-wider">MC</span>
                 </div>
               </div>
             </div>
          </div>
        )}
      </aside>
    </>
  );
}
