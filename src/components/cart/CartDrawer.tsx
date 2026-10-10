"use client";

import { useState } from "react";
import { useCart, useCartDrawer, removeFromCart, updateQuantity, addToCart, applyCoupon, removeCoupon } from "@/lib/cart";
import { formatPrice } from "@/lib/utils";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { toast } from "sonner";
import { Loader2, ChevronLeft, ShoppingCart, Trash2, Ticket, TrendingUp, MessageCircle, Star } from "lucide-react";
import { trackEvent } from "@/lib/analytics";
import { RAW_PRODUCTS } from "@/lib/data-store";

export default function CartDrawer() {
  const cart = useCart();
  const { isOpen, close } = useCartDrawer();
  const router = useRouter();
  const [isNavigating, setIsNavigating] = useState(false);
  const [tempCoupon, setTempCoupon] = useState("");
  const [showBreakdown, setShowBreakdown] = useState(false);

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
    toast.success(`${p.title} added to cart`);
  };

  const crossSells = [
    { slug: "pure-a2-gir-cow-ghee-500-ml", badge: <><Star className="w-2.5 h-2.5 fill-current inline"/> 1st</> },
    { slug: "pure-desi-cow-ghee-1-litre", badge: <><Star className="w-2.5 h-2.5 fill-current inline"/> 2nd</> }
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
            <button onClick={close} className="p-1.5 -ml-1 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors">
              <ChevronLeft className="w-5 h-5" />
            </button>
            <h2 className="text-[#0B483B] font-bold text-[17px] font-serif absolute left-1/2 -translate-x-1/2">Your <span className="notranslate">Cart</span></h2>
            <div className="w-8"></div>
          </div>
          <div className="bg-[#0B483B] text-white text-center py-2.5 text-[12px] font-bold tracking-wide shadow-sm">
            <span className="notranslate">Free Shipping</span> - Pan India
          </div>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto pb-40 custom-scrollbar">
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
              <div className="p-4 space-y-6">
                
                {/* Cart Details */}
                <div>
                  <div className="flex justify-between items-center mb-4">
                    <div className="flex items-center gap-2 text-[#0B483B] font-bold font-serif text-[15px]">
                      <ShoppingCart className="w-[18px] h-[18px]" />
                      <span><span className="notranslate">Cart</span> details</span>
                    </div>
                    <span className="text-[13px] font-bold text-gray-800">Total items: {cart.items.length}</span>
                  </div>

                  <div className="space-y-4">
                    {cart.items.map(item => (
                      <div key={item.variantId} className="border border-gray-200 rounded-2xl p-3.5 flex gap-4 bg-white relative">
                        <div className="w-[84px] h-[84px] rounded-xl overflow-hidden bg-gray-50 border border-gray-100 shrink-0 relative">
                          {item.image ? (
                            <Image src={item.image} alt={item.title} fill className="object-cover" sizes="84px" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-gray-300">No Img</div>
                          )}
                        </div>
                        <div className="flex-1 flex flex-col">
                          <Link href={`/products/${item.slug}`} onClick={close} className="text-[13px] font-bold text-gray-900 leading-tight pr-6">
                            {item.title}
                          </Link>
                          {item.variantTitle && (
                            <div className="mt-1.5">
                              <span className="bg-[#EEF4F0] text-[#0B483B] text-[11px] font-bold px-2 py-0.5 rounded-md">
                                {item.variantTitle}
                              </span>
                            </div>
                          )}
                          <p className="text-[13px] font-bold text-gray-900 mt-2">{formatPrice(item.price)}</p>
                          
                          <div className="flex items-center justify-between mt-3">
                            <div className="flex items-center border border-gray-200 rounded-full h-[32px] bg-white overflow-hidden">
                              <button onClick={() => handleUpdate(item.variantId, item.quantity - 1)} className="w-[32px] h-full flex items-center justify-center text-green-700 text-lg hover:bg-green-50 transition-colors">−</button>
                              <span className="w-6 text-center text-[13px] font-bold text-gray-800">{item.quantity}</span>
                              <button onClick={() => handleUpdate(item.variantId, item.quantity + 1)} className="w-[32px] h-full flex items-center justify-center text-green-700 text-lg hover:bg-green-50 transition-colors">+</button>
                            </div>
                            
                            <button onClick={() => handleRemove(item.variantId)} className="text-gray-400 hover:text-red-500 p-2 transition-colors">
                              <Trash2 className="w-[18px] h-[18px]" />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Cross-Sells */}
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
                                <button onClick={() => handleAddCrossSell(cs.slug)} className="bg-[#215E4C] text-white text-[11px] font-bold px-4 py-1.5 rounded-full hover:bg-[#164235] transition-colors">
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
                <button onClick={close} className="border border-[#0B483B] text-[#0B483B] bg-white rounded-full px-5 py-2 text-[13px] font-bold flex items-center gap-1.5 hover:bg-gray-50 transition-colors w-fit">
                  Add more items <ChevronLeft className="w-[14px] h-[14px] rotate-180 stroke-[3]" />
                </button>

                {/* Coupon */}
                <div className="pt-2">
                  <div className="flex items-center gap-2 text-[#0B483B] font-bold text-[13px] mb-3">
                    <Ticket className="w-[18px] h-[18px] -rotate-45" /> Have a <span className="notranslate">coupon</span> code?
                  </div>
                  {cart.discountCode ? (
                    <div className="flex items-center justify-between bg-[#EEF4F0] border border-[#0B483B] text-[#0B483B] px-4 py-3 rounded-xl text-sm font-bold">
                      <span>{cart.discountCode} applied!</span>
                      <button onClick={() => removeCoupon()} className="text-xs hover:underline">Remove</button>
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
                        className="absolute right-1.5 top-1.5 bottom-1.5 bg-[#215E4C] text-white px-5 rounded-lg text-[13px] font-bold hover:bg-[#164235] transition-colors"
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
            <>
              {/* Unlock banner */}
              <div className="bg-[#FCF5E3] text-[#A66D25] text-center py-3 text-[13px] font-bold border-y border-[#F0E0B6]">
                Unlock your best offer at <span className="notranslate">checkout</span>!
              </div>

            </>
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
                   <button onClick={() => setShowBreakdown(false)} className="text-gray-400 hover:text-gray-600 p-1 rounded-md">
                     <ChevronLeft className="w-5 h-5 -rotate-90" />
                   </button>
                 </div>
                 <div className="space-y-2.5 mb-2">
                   <div className="flex justify-between text-[13px] text-gray-600">
                     <span><span className="notranslate">Order Total</span></span>
                     <span className="font-bold text-gray-900">{formatPrice(cart.subtotal)}</span>
                   </div>
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
                 </div>
                 
                 <button 
                  onClick={() => {
                    setIsNavigating(true);
                    router.push("/checkout");
                    setTimeout(() => {
                      close();
                      setIsNavigating(false);
                    }, 500);
                  }}
                  disabled={isNavigating}
                  className="bg-[#084131] text-white font-bold text-[15px] flex-1 h-[48px] rounded-full shadow-md hover:bg-[#062f23] transition disabled:opacity-70 flex items-center justify-center gap-2"
                 >
                   {isNavigating ? <Loader2 className="w-5 h-5 animate-spin" /> : null}
                   <span className="notranslate">Continue</span>
                 </button>
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
