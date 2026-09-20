"use client";
import { toast } from "sonner";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Info, CheckCircle2, ShieldCheck, Truck, Loader2 } from "lucide-react";
import { useCart, clearCart } from "@/lib/cart";
import { formatPrice } from "@/lib/utils";
import { useAuth } from "@/hooks/useAuth";
import { saveUserCheckoutProfile, createOrder, CheckoutData, Address, GstDetails } from "@/lib/orders";

type Step = "info" | "shipping" | "billing" | "payment" | "review";

export default function CheckoutPage() {
  const router = useRouter();
  const cart = useCart();
  const { user } = useAuth();
  
  const [step, setStep] = useState<Step>("info");
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Form states
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [hasGst, setHasGst] = useState(false);
  const [gstDetails, setGstDetails] = useState<GstDetails>({ companyName: "", gstin: "" });
  
  const [shipping, setShipping] = useState<Address>({ name: "", address: "", city: "", state: "", pincode: "", country: "India" });
  const [billingSameAsShipping, setBillingSameAsShipping] = useState(true);
  const [billing, setBilling] = useState<Address>({ name: "", address: "", city: "", state: "", pincode: "", country: "India" });
  
  const [paymentMethod, setPaymentMethod] = useState("cod");

  if (cart.items.length === 0 && !isSubmitting) {
    return (
      <section className="nn-section bg-white min-h-[60vh]">
        <div className="nn-container max-w-lg mx-auto text-center py-16 space-y-4">
          <h1 className="nn-title">Checkout</h1>
          <p className="nn-sub">Your cart is empty. Add items before checking out.</p>
          <Link href="/collections/all-products" className="nn-btn nn-btn-primary mt-4">Shop Now</Link>
        </div>
      </section>
    );
  }

  const steps: { key: Step; label: string }[] = [
    { key: "info", label: "Information" },
    { key: "shipping", label: "Shipping" },
    { key: "billing", label: "Billing" },
    { key: "payment", label: "Payment" },
    { key: "review", label: "Review" },
  ];

  const currentIdx = steps.findIndex((s) => s.key === step);

  const handlePlaceOrder = async () => {
    if (!user) {
      toast.error("Authenticating... Please try again in a moment.");
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      const finalBilling = billingSameAsShipping ? shipping : billing;
      
      const checkoutData: CheckoutData = {
        email,
        phone,
        shippingAddress: shipping,
        billingAddress: finalBilling,
        gstDetails: hasGst ? gstDetails : undefined,
        paymentMethod
      };

      // 1. Save profile to Firestore
      await saveUserCheckoutProfile(user.uid, checkoutData);
      
      // 2. Create the order
      const orderId = await createOrder(user.uid, cart.items, cart.subtotal, checkoutData);
      
      // 3. Clear Cart
      clearCart();
      
      toast.success("Order placed successfully!");
      // 4. Redirect
      router.push(`/checkout/success?orderId=${orderId}`);
      
    } catch (error) {
      console.error("Order creation failed:", error);
      alert("There was an issue placing your order. Please try again.");
      setIsSubmitting(false);
    }
  };

  return (
    <section className="nn-section bg-[#FAF9F5] min-h-[80vh]">
      <div className="nn-container max-w-6xl mx-auto py-8">
        <h1 className="font-serif text-3xl md:text-4xl font-bold text-[#1E3A24] text-center mb-8">Secure Checkout</h1>

        {/* Step indicator */}
        <div className="flex items-center justify-center gap-2 mb-10 overflow-x-auto pb-4">
          {steps.map((s, i) => (
            <div key={s.key} className="flex items-center gap-2 shrink-0">
              <button
                onClick={() => i <= currentIdx && setStep(s.key)}
                className={`w-8 h-8 rounded-full text-sm font-bold flex items-center justify-center transition ${i <= currentIdx ? "bg-[#1E3A24] text-white" : "bg-[#E9E5D9] text-[#576B55]"}`}
              >
                {i + 1}
              </button>
              <span className={`text-sm font-medium hidden sm:inline ${i <= currentIdx ? "text-[#1E3A24]" : "text-[#576B55]"}`}>{s.label}</span>
              {i < steps.length - 1 && <div className="w-8 h-px bg-[#D5D8D0] mx-1" />}
            </div>
          ))}
        </div>

        <div className="flex flex-col-reverse lg:flex-row gap-10 items-start">
          
          {/* Main Form Area */}
          <div className="w-full lg:w-[60%] space-y-6">
            <div className="bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-[#E9E5D9]">
              
              {/* 1. INFO STEP */}
              {step === "info" && (
                <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                  <h2 className="font-serif text-xl font-bold text-[#1E3A24]">Contact Information</h2>
                  <div className="space-y-4">
                    <input type="email" placeholder="Email Address *" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full border border-[#D5D8D0] rounded-xl px-4 py-3 focus:outline-none focus:border-[#1E3A24] focus:ring-1 focus:ring-[#1E3A24] transition bg-white" />
                    <input type="tel" placeholder="Phone Number *" value={phone} onChange={(e) => setPhone(e.target.value)} className="w-full border border-[#D5D8D0] rounded-xl px-4 py-3 focus:outline-none focus:border-[#1E3A24] focus:ring-1 focus:ring-[#1E3A24] transition bg-white" />
                  </div>

                  <div className="pt-4 border-t border-[#E9E5D9]">
                    <label className="flex items-center gap-3 cursor-pointer select-none">
                      <input type="checkbox" checked={hasGst} onChange={(e) => setHasGst(e.target.checked)} className="w-5 h-5 rounded border-[#D5D8D0] text-[#1E3A24] focus:ring-[#1E3A24] accent-[#1E3A24]" />
                      <span className="font-medium text-[#364935]">I need a GST Invoice for my company</span>
                    </label>
                  </div>

                  {hasGst && (
                    <div className="space-y-4 p-5 bg-[#F7F4EB] rounded-xl border border-[#E9DFD1] mt-4 animate-in fade-in slide-in-from-top-2">
                      <input type="text" placeholder="Company Name *" value={gstDetails.companyName} onChange={(e) => setGstDetails({...gstDetails, companyName: e.target.value})} className="w-full border border-[#D5D8D0] rounded-xl px-4 py-3 focus:outline-none focus:border-[#1E3A24] bg-white" />
                      <input type="text" placeholder="GSTIN *" value={gstDetails.gstin} onChange={(e) => setGstDetails({...gstDetails, gstin: e.target.value})} className="w-full border border-[#D5D8D0] rounded-xl px-4 py-3 focus:outline-none focus:border-[#1E3A24] bg-white uppercase" />
                    </div>
                  )}

                  <div className="pt-4 flex justify-end">
                    <button onClick={() => setStep("shipping")} disabled={!email || !phone || (hasGst && (!gstDetails.companyName || !gstDetails.gstin))} className="bg-[#1E3A24] text-white px-8 py-4 rounded-xl font-semibold hover:bg-[#152919] transition-all disabled:opacity-50 disabled:cursor-not-allowed">
                      Continue to Shipping
                    </button>
                  </div>
                </div>
              )}

              {/* 2. SHIPPING STEP */}
              {step === "shipping" && (
                <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                  <h2 className="font-serif text-xl font-bold text-[#1E3A24]">Shipping Address</h2>
                  <div className="space-y-4">
                    <input type="text" placeholder="Full Name *" value={shipping.name} onChange={(e) => setShipping({...shipping, name: e.target.value})} className="w-full border border-[#D5D8D0] rounded-xl px-4 py-3 focus:outline-none focus:border-[#1E3A24]" />
                    <input type="text" placeholder="Street Address / Apartment / Suite *" value={shipping.address} onChange={(e) => setShipping({...shipping, address: e.target.value})} className="w-full border border-[#D5D8D0] rounded-xl px-4 py-3 focus:outline-none focus:border-[#1E3A24]" />
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <input type="text" placeholder="City *" value={shipping.city} onChange={(e) => setShipping({...shipping, city: e.target.value})} className="w-full border border-[#D5D8D0] rounded-xl px-4 py-3 focus:outline-none focus:border-[#1E3A24]" />
                      <input type="text" placeholder="State / Province *" value={shipping.state} onChange={(e) => setShipping({...shipping, state: e.target.value})} className="w-full border border-[#D5D8D0] rounded-xl px-4 py-3 focus:outline-none focus:border-[#1E3A24]" />
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <input type="text" placeholder="PIN Code / Zip Code *" value={shipping.pincode} onChange={(e) => setShipping({...shipping, pincode: e.target.value})} className="w-full border border-[#D5D8D0] rounded-xl px-4 py-3 focus:outline-none focus:border-[#1E3A24]" />
                      <input type="text" value={shipping.country} readOnly className="w-full border border-[#D5D8D0] rounded-xl px-4 py-3 bg-[#FAF9F5] text-[#576B55] outline-none" />
                    </div>
                  </div>

                  <div className="pt-6 flex items-center justify-between">
                    <button onClick={() => setStep("info")} className="text-[#364935] font-medium hover:text-[#1E3A24] px-4 py-2">Back to Info</button>
                    <button onClick={() => setStep("billing")} disabled={!shipping.name || !shipping.address || !shipping.city || !shipping.state || !shipping.pincode} className="bg-[#1E3A24] text-white px-8 py-4 rounded-xl font-semibold hover:bg-[#152919] transition-all disabled:opacity-50 disabled:cursor-not-allowed">
                      Continue to Billing
                    </button>
                  </div>
                </div>
              )}

              {/* 3. BILLING STEP */}
              {step === "billing" && (
                <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                  <h2 className="font-serif text-xl font-bold text-[#1E3A24]">Billing Address</h2>
                  
                  <div className="space-y-3">
                    <label className={`flex items-center gap-3 p-4 border rounded-xl cursor-pointer transition ${billingSameAsShipping ? "border-[#1E3A24] bg-[#F4F6F0]" : "border-[#E9E5D9] hover:border-[#D5D8D0]"}`}>
                      <input type="radio" name="billingAddress" checked={billingSameAsShipping} onChange={() => setBillingSameAsShipping(true)} className="w-5 h-5 accent-[#1E3A24]" />
                      <span className="font-medium text-[#1E3A24]">Same as shipping address</span>
                    </label>

                    <label className={`flex items-center gap-3 p-4 border rounded-xl cursor-pointer transition ${!billingSameAsShipping ? "border-[#1E3A24] bg-[#F4F6F0]" : "border-[#E9E5D9] hover:border-[#D5D8D0]"}`}>
                      <input type="radio" name="billingAddress" checked={!billingSameAsShipping} onChange={() => setBillingSameAsShipping(false)} className="w-5 h-5 accent-[#1E3A24]" />
                      <span className="font-medium text-[#1E3A24]">Use a different billing address</span>
                    </label>
                  </div>

                  {!billingSameAsShipping && (
                    <div className="space-y-4 pt-4 animate-in fade-in slide-in-from-top-2">
                      <input type="text" placeholder="Full Name *" value={billing.name} onChange={(e) => setBilling({...billing, name: e.target.value})} className="w-full border border-[#D5D8D0] rounded-xl px-4 py-3 focus:outline-none focus:border-[#1E3A24]" />
                      <input type="text" placeholder="Street Address / Apartment / Suite *" value={billing.address} onChange={(e) => setBilling({...billing, address: e.target.value})} className="w-full border border-[#D5D8D0] rounded-xl px-4 py-3 focus:outline-none focus:border-[#1E3A24]" />
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <input type="text" placeholder="City *" value={billing.city} onChange={(e) => setBilling({...billing, city: e.target.value})} className="w-full border border-[#D5D8D0] rounded-xl px-4 py-3 focus:outline-none focus:border-[#1E3A24]" />
                        <input type="text" placeholder="State / Province *" value={billing.state} onChange={(e) => setBilling({...billing, state: e.target.value})} className="w-full border border-[#D5D8D0] rounded-xl px-4 py-3 focus:outline-none focus:border-[#1E3A24]" />
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <input type="text" placeholder="PIN Code / Zip Code *" value={billing.pincode} onChange={(e) => setBilling({...billing, pincode: e.target.value})} className="w-full border border-[#D5D8D0] rounded-xl px-4 py-3 focus:outline-none focus:border-[#1E3A24]" />
                        <input type="text" value={billing.country} readOnly className="w-full border border-[#D5D8D0] rounded-xl px-4 py-3 bg-[#FAF9F5] text-[#576B55] outline-none" />
                      </div>
                    </div>
                  )}

                  <div className="pt-6 flex items-center justify-between">
                    <button onClick={() => setStep("shipping")} className="text-[#364935] font-medium hover:text-[#1E3A24] px-4 py-2">Back to Shipping</button>
                    <button onClick={() => setStep("payment")} disabled={!billingSameAsShipping && (!billing.name || !billing.address || !billing.city || !billing.state || !billing.pincode)} className="bg-[#1E3A24] text-white px-8 py-4 rounded-xl font-semibold hover:bg-[#152919] transition-all disabled:opacity-50 disabled:cursor-not-allowed">
                      Continue to Payment
                    </button>
                  </div>
                </div>
              )}

              {/* 4. PAYMENT STEP */}
              {step === "payment" && (
                <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                  <h2 className="font-serif text-xl font-bold text-[#1E3A24]">Payment Method</h2>
                  
                  <div className="space-y-3">
                    <label className={`flex items-start gap-4 p-5 border-2 rounded-xl cursor-pointer transition ${paymentMethod === "cod" ? "border-[#C38936] bg-[#FDFBF7]" : "border-[#E9E5D9] hover:border-[#C38936]/50"}`}>
                      <input type="radio" name="payment" value="cod" checked={paymentMethod === "cod"} onChange={(e) => setPaymentMethod(e.target.value)} className="mt-1 w-5 h-5 accent-[#C38936]" />
                      <div>
                        <span className="font-bold text-[#1E3A24] block text-base mb-1">Cash on Delivery (COD)</span>
                        <p className="text-sm text-[#576B55]">Pay with cash or UPI when your order is delivered.</p>
                      </div>
                    </label>

                    <label className={`flex items-start gap-4 p-5 border-2 rounded-xl transition opacity-60 cursor-not-allowed ${paymentMethod === "online" ? "border-[#C38936] bg-[#FDFBF7]" : "border-[#E9E5D9]"}`}>
                      <input type="radio" name="payment" value="online" disabled className="mt-1 w-5 h-5 accent-[#C38936]" />
                      <div>
                        <span className="font-bold text-[#1E3A24] block text-base mb-1">Pay Online <span className="ml-2 text-[10px] bg-[#E9E5D9] px-2 py-0.5 rounded text-[#576B55] uppercase tracking-wider">Coming Soon</span></span>
                        <p className="text-sm text-[#576B55]">Credit Card, UPI, NetBanking integrations will be available soon.</p>
                      </div>
                    </label>
                  </div>

                  <div className="pt-6 flex items-center justify-between">
                    <button onClick={() => setStep("billing")} className="text-[#364935] font-medium hover:text-[#1E3A24] px-4 py-2">Back to Billing</button>
                    <button onClick={() => setStep("review")} className="bg-[#1E3A24] text-white px-8 py-4 rounded-xl font-semibold hover:bg-[#152919] transition-all">
                      Review Order
                    </button>
                  </div>
                </div>
              )}

              {/* 5. REVIEW STEP */}
              {step === "review" && (
                <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                  <h2 className="font-serif text-xl font-bold text-[#1E3A24]">Review Your Order</h2>
                  
                  <div className="space-y-4">
                    <div className="p-5 bg-[#FAF9F5] rounded-xl border border-[#E9E5D9]">
                      <div className="flex justify-between items-center mb-3">
                        <h3 className="font-bold text-[#1E3A24]">Contact Info</h3>
                        <button onClick={() => setStep("info")} className="text-xs text-[#C38936] font-bold hover:underline">EDIT</button>
                      </div>
                      <p className="text-sm text-[#364935]">{email} • {phone}</p>
                      {hasGst && <p className="text-sm text-[#364935] mt-1"><strong>GSTIN:</strong> {gstDetails.gstin} ({gstDetails.companyName})</p>}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="p-5 bg-[#FAF9F5] rounded-xl border border-[#E9E5D9]">
                        <div className="flex justify-between items-center mb-3">
                          <h3 className="font-bold text-[#1E3A24]">Shipping</h3>
                          <button onClick={() => setStep("shipping")} className="text-xs text-[#C38936] font-bold hover:underline">EDIT</button>
                        </div>
                        <p className="text-sm text-[#364935] leading-relaxed">
                          {shipping.name}<br/>
                          {shipping.address}<br/>
                          {shipping.city}, {shipping.state} {shipping.pincode}<br/>
                          {shipping.country}
                        </p>
                      </div>

                      <div className="p-5 bg-[#FAF9F5] rounded-xl border border-[#E9E5D9]">
                        <div className="flex justify-between items-center mb-3">
                          <h3 className="font-bold text-[#1E3A24]">Billing</h3>
                          <button onClick={() => setStep("billing")} className="text-xs text-[#C38936] font-bold hover:underline">EDIT</button>
                        </div>
                        <p className="text-sm text-[#364935] leading-relaxed">
                          {billingSameAsShipping ? "Same as shipping address" : (
                            <>
                              {billing.name}<br/>
                              {billing.address}<br/>
                              {billing.city}, {billing.state} {billing.pincode}<br/>
                              {billing.country}
                            </>
                          )}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-[#E9E5D9]">
                    <button onClick={() => setStep("payment")} disabled={isSubmitting} className="text-[#364935] font-medium hover:text-[#1E3A24] px-4 py-2 order-2 sm:order-1 w-full sm:w-auto text-center">Back to Payment</button>
                    <button onClick={handlePlaceOrder} disabled={isSubmitting} className="bg-[#C38936] text-white px-8 py-4 rounded-xl font-bold text-lg hover:bg-[#b0782b] shadow-lg hover:shadow-xl transition-all order-1 sm:order-2 w-full sm:w-auto flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed">
  {isSubmitting && <Loader2 className="w-5 h-5 animate-spin" />}
                      {isSubmitting ? (
                        <>
                          <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                          Processing...
                        </>
                      ) : (
                        `Place Order - ${formatPrice(cart.subtotal)}`
                      )}
                    </button>
                  </div>
                </div>
              )}
            </div>
            
            {/* Trust Badges */}
            <div className="flex items-center justify-center gap-8 py-6 text-[#576B55]">
              <div className="flex flex-col items-center text-center gap-2">
                <ShieldCheck className="w-6 h-6 text-[#1E3A24]" />
                <span className="text-[10px] font-bold uppercase tracking-wider">Secure<br/>Checkout</span>
              </div>
              <div className="flex flex-col items-center text-center gap-2">
                <Truck className="w-6 h-6 text-[#1E3A24]" />
                <span className="text-[10px] font-bold uppercase tracking-wider">Fast & Reliable<br/>Shipping</span>
              </div>
              <div className="flex flex-col items-center text-center gap-2">
                <CheckCircle2 className="w-6 h-6 text-[#1E3A24]" />
                <span className="text-[10px] font-bold uppercase tracking-wider">100% Quality<br/>Guarantee</span>
              </div>
            </div>
          </div>

          {/* Order Summary Sidebar */}
          <div className="w-full lg:w-[40%] sticky top-24">
            <div className="bg-white p-6 md:p-8 rounded-2xl shadow-lg border border-[#E9E5D9]">
              <h3 className="font-serif text-2xl font-bold text-[#1E3A24] mb-6">Order Summary</h3>
              
              <ul className="divide-y divide-[#E9E5D9] mb-6 max-h-[40vh] overflow-y-auto pr-2 custom-scrollbar">
                {cart.items.map((item) => (
                  <li key={item.variantId} className="flex gap-4 py-4 first:pt-0">
                    <div className="relative w-20 h-20 rounded-xl overflow-hidden border border-[#E9DFD1] shrink-0 bg-[#F7F4EB]">
                      {item.image && <Image src={item.image} alt={item.title} fill className="object-cover" sizes="80px" />}
                    </div>
                    <div className="flex-1 flex flex-col justify-center min-w-0">
                      <p className="font-bold text-[#1E3A24] leading-tight mb-1">{item.title}</p>
                      <p className="text-xs text-[#576B55] mb-2">{item.variantTitle}</p>
                      <div className="flex justify-between items-end">
                        <span className="text-xs font-semibold bg-[#E9E5D9] px-2 py-1 rounded text-[#364935]">Qty: {item.quantity}</span>
                        <span className="font-bold text-[#1E3A24]">{formatPrice(item.price * item.quantity)}</span>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
              
              <div className="space-y-4 text-base border-t-2 border-dashed border-[#E9E5D9] pt-6 bg-[#FAF9F5] -mx-6 md:-mx-8 px-6 md:px-8 pb-2">
                <div className="flex justify-between items-center text-[#576B55]">
                  <span>Subtotal</span>
                  <span className="font-semibold text-[#1E3A24]">{formatPrice(cart.subtotal)}</span>
                </div>
                <div className="flex justify-between items-center text-[#576B55]">
                  <span>Shipping</span>
                  <span className="font-bold text-[#C38936]">FREE</span>
                </div>
                <div className="flex justify-between items-center text-[#576B55]">
                  <span>Tax (Included)</span>
                  <span className="font-semibold text-[#1E3A24]">₹0.00</span>
                </div>
              </div>
              
              <div className="flex justify-between items-end border-t border-[#D5D8D0] mt-4 pt-6 bg-[#FAF9F5] -mx-6 md:-mx-8 px-6 md:px-8 pb-6 md:pb-8 -mb-6 md:-mb-8 rounded-b-2xl">
                <div>
                  <span className="block text-sm text-[#576B55] mb-1">Total to Pay</span>
                  <span className="text-xs text-[#576B55]">Inclusive of all taxes</span>
                </div>
                <span className="text-3xl font-bold text-[#1E3A24]">{formatPrice(cart.subtotal)}</span>
              </div>
            </div>
          </div>
          
        </div>
      </div>
    </section>
  );
}
