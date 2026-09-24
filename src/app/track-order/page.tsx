"use client";

import { useState } from "react";
// Firebase dynamically imported to prevent Cloudflare 1102 errors
import { getDynamicOrderStatus } from "@/lib/orderUtils";
import { Search, Package, MapPin, AlertCircle, Loader2 } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";
import { Skeleton } from "@/components/ui/Skeleton";

export default function TrackOrderPage() {
  const [orderId, setOrderId] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [order, setOrder] = useState<any>(null);

  const handleTrack = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!orderId || !email) return;

    setLoading(true);
    setError("");
    setOrder(null);

    try {
      const { db } = await import("@/lib/firebase");
      const { doc, getDoc } = await import("firebase/firestore/lite");
      const orderRef = doc(db, "orders", orderId);
      const orderSnap = await getDoc(orderRef);

      if (orderSnap.exists()) {
        const data = orderSnap.data();
        // Verify email to protect privacy
        if (data.contactInfo?.email?.toLowerCase() === email.toLowerCase()) {
          setOrder({ id: orderSnap.id, ...data });
          toast.success("Order found!");
        } else {
          setError("We couldn't find an order matching that ID and Email combination."); toast.error("Order not found");
        }
      } else {
        setError("We couldn't find an order matching that ID and Email combination."); toast.error("Order not found");
      }
    } catch (err: any) {
      console.error("Tracking error:", err);
      setError("An error occurred while tracking your order. Please try again."); toast.error("Error tracking order");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-[#FAF8F5] min-h-screen pt-32 pb-24">
      <div className="nn-container max-w-3xl">
        
        <div className="text-center mb-12">
          <span className="nn-eyebrow mb-4 inline-block">Track Order</span>
          <h1 className="text-4xl md:text-5xl font-serif text-[#03483F] mb-4">
            Where is my Ghee?
          </h1>
          <p className="text-[#4A5450] text-lg">
            Enter your Order ID and Email address to track the real-time status of your package.
          </p>
        </div>

        {!order ? (
          <div className="bg-white rounded-2xl shadow-xl border border-[#EAE2D2] p-8 md:p-12">
            <form onSubmit={handleTrack} className="space-y-6">
              {error && (
                <div className="bg-red-50 text-red-700 p-4 rounded-xl flex gap-3 text-sm">
                  <AlertCircle className="w-5 h-5 flex-shrink-0" />
                  <p>{error}</p>
                </div>
              )}
              
              <div>
                <label htmlFor="orderId" className="block text-sm font-medium text-[#4A5450] mb-2">Order ID</label>
                <input 
                  type="text" 
                  id="orderId" 
                  value={orderId}
                  onChange={(e) => setOrderId(e.target.value)}
                  className="w-full bg-[#FCFAF5] border border-[#EAE2D2] rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#C99A3D] focus:border-transparent transition-all"
                  placeholder="e.g. 5xVp9q..."
                  required
                />
              </div>
              
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-[#4A5450] mb-2">Email Address</label>
                <input 
                  type="email" 
                  id="email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-[#FCFAF5] border border-[#EAE2D2] rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#C99A3D] focus:border-transparent transition-all"
                  placeholder="The email used during checkout"
                  required
                />
              </div>

              <button 
                type="submit" 
                disabled={loading}
                className="w-full nn-btn nn-btn-primary py-4 text-base shadow-lg flex justify-center items-center gap-2"
              >
                {loading ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <>
                    <Search className="w-5 h-5" />
                    Track Order
                  </>
                )}
              </button>
            </form>
          </div>
        ) : (
          <div className="space-y-8">
            <div className="flex justify-between items-center mb-4">
              <button 
                onClick={() => setOrder(null)} 
                className="text-[#C99A3D] font-semibold hover:text-[#A87845] text-sm"
              >
                &larr; Track another order
              </button>
            </div>
            
            <div className="bg-white border border-[#EAE2D2] rounded-2xl overflow-hidden shadow-xl">
              <div className="bg-[#03483F] p-8 text-white text-center">
                <p className="text-sm text-[#EAE2D2] mb-2 uppercase tracking-widest font-semibold">Current Status</p>
                <h2 className="text-2xl md:text-3xl font-serif text-[#F39C12]">
                  {getDynamicOrderStatus(order.createdAt, order.status, order.paymentStatus, order.paymentMethod)}
                </h2>
              </div>
              
              <div className="p-8">
                <div className="flex flex-col md:flex-row gap-8 justify-between border-b border-[#EAE2D2] pb-8 mb-8">
                  <div>
                    <p className="text-xs text-[#8C988B] uppercase tracking-wider mb-1">Order ID</p>
                    <p className="font-bold text-[#1C2B26]">{order.id}</p>
                  </div>
                  <div>
                    <p className="text-xs text-[#8C988B] uppercase tracking-wider mb-1">Order Date</p>
                    <p className="font-bold text-[#1C2B26]">
                      {order.createdAt?.seconds ? new Date(order.createdAt.seconds * 1000).toLocaleDateString() : "Unknown"}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-[#8C988B] uppercase tracking-wider mb-1">Total Paid</p>
                    <p className="font-bold text-[#1C2B26]">₹{order.amountToPay || order.totalAmount}</p>
                  </div>
                </div>

                <div className="space-y-6">
                  <h3 className="font-serif text-[#03483F] text-xl">Items Ordered</h3>
                  {order.items?.map((item: any, idx: number) => (
                    <div key={idx} className="flex gap-4 items-center">
                      <div className="w-20 h-20 bg-[#F7F4EB] rounded-lg overflow-hidden flex-shrink-0 relative border border-[#EAE2D2]">
                        {item.image ? (
                          <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                        ) : (
                          <Package className="w-6 h-6 text-[#8C988B] absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
                        )}
                      </div>
                      <div className="flex-1">
                        <h4 className="font-bold text-[#1C2B26]">{item.name}</h4>
                        <p className="text-[#8C988B] text-sm mt-1">Quantity: {item.quantity}</p>
                      </div>
                      <div className="font-bold text-[#4A5450]">
                        ₹{item.price * item.quantity}
                      </div>
                    </div>
                  ))}
                </div>

                <div className="pt-6 mt-4 border-t border-[#EAE2D2] space-y-3 text-[#4A5450]">
                  <div className="flex justify-between items-center text-sm">
                    <span className="font-semibold">Subtotal</span>
                    <span className="font-bold text-[#1C2B26]">₹{order.subtotal}</span>
                  </div>
                  {order.discount > 0 && (
                    <div className="flex justify-between items-center text-sm text-[#2E8B57]">
                      <span className="font-semibold">Discount ({order.discountPercent}%)</span>
                      <span className="font-bold">-₹{order.discount}</span>
                    </div>
                  )}
                  {order.amountRemaining > 0 && (
                    <div className="flex justify-between items-center text-sm text-[#C38936]">
                      <span className="font-semibold">Remaining Balance (COD)</span>
                      <span className="font-bold">₹{order.amountRemaining}</span>
                    </div>
                  )}
                  <div className="flex justify-between items-center text-lg mt-4 pt-4 border-t border-[#EAE2D2]">
                    <span className="font-bold text-[#1C2B26]">Total Paid</span>
                    <span className="font-bold text-[#C99A3D]">₹{order.amountToPay || order.totalAmount}</span>
                  </div>
                </div>
                
                <div className="mt-8 pt-8 border-t border-[#EAE2D2]">
                  <div className="flex items-start gap-4">
                    <div className="bg-[#FCFAF5] p-3 rounded-xl text-[#075B4F]">
                      <MapPin className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="font-bold text-[#1C2B26] mb-1">Shipping To</h4>
                      <p className="text-[#4A5450] text-sm leading-relaxed">
                        {order.shippingAddress?.name}<br/>
                        {order.shippingAddress?.address}<br/>
                        {order.shippingAddress?.city}, {order.shippingAddress?.state} {order.shippingAddress?.pincode}
                      </p>
                    </div>
                  </div>
                </div>

              </div>
            </div>
            
            <div className="text-center">
              <p className="text-sm text-[#8C988B]">
                Have a question about this order? <Link href="/pages/contact" className="text-[#C99A3D] hover:underline">Contact Support</Link>
              </p>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
