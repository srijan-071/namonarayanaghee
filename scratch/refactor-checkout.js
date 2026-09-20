const fs = require('fs');
const path = './src/app/checkout/page.tsx';
let code = fs.readFileSync(path, 'utf8');

// 1. Imports
code = code.replace(
  'import { Info, CheckCircle2, ShieldCheck, Truck, Loader2, CreditCard, Banknote, Tag, Percent } from "lucide-react";',
  'import { Info, CheckCircle2, ShieldCheck, Truck, Loader2, CreditCard, Banknote, Tag, Percent, Key, MapPin } from "lucide-react";'
);

// 2. Types and Steps
code = code.replace(
  'type Step = "info" | "shipping" | "billing" | "payment" | "review";',
  'type Step = "info" | "shipping" | "payment" | "review";'
);
code = code.replace(
  /const steps: \{ key: Step; label: string \}\[\] = \[\s+\{ key: "info", label: "Information" \},\s+\{ key: "shipping", label: "Shipping" \},\s+\{ key: "billing", label: "Billing" \},\s+\{ key: "payment", label: "Payment" \},\s+\{ key: "review", label: "Review" \},\s+\];/,
  `const steps: { key: Step; label: string }[] = [
    { key: "info", label: "Information" },
    { key: "shipping", label: "Shipping" },
    { key: "payment", label: "Payment" },
    { key: "review", label: "Review" },
  ];`
);

// 3. States and Transition function
code = code.replace(
  'const [isSubmitting, setIsSubmitting] = useState(false);',
  `const [isSubmitting, setIsSubmitting] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);

  const handleNextStep = (nextStep: Step) => {
    setIsTransitioning(true);
    setTimeout(() => {
      setStep(nextStep);
      setIsTransitioning(false);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }, 400);
  };`
);

// 4. Fetch pincode effect
code = code.replace(
  /const \[paymentMethod, setPaymentMethod\] = useState\("cod"\);/,
  `const [paymentMethod, setPaymentMethod] = useState("cod");
  const [isFetchingPincode, setIsFetchingPincode] = useState(false);

  const handlePincodeChange = async (val: string, target: 'shipping' | 'billing') => {
    if (target === 'shipping') {
      setShipping({ ...shipping, pincode: val });
    } else {
      setBilling({ ...billing, pincode: val });
    }

    if (val.length === 6) {
      setIsFetchingPincode(true);
      try {
        const res = await fetch(\`https://api.postalpincode.in/pincode/\${val}\`);
        const data = await res.json();
        if (data && data[0] && data[0].Status === 'Success') {
          const postOffice = data[0].PostOffice[0];
          if (target === 'shipping') {
            setShipping(prev => ({ ...prev, city: postOffice.District, state: postOffice.State }));
          } else {
            setBilling(prev => ({ ...prev, city: postOffice.District, state: postOffice.State }));
          }
        }
      } catch (e) {
        console.error("Failed to fetch pincode", e);
      }
      setIsFetchingPincode(false);
    }
  };`
);

// 5. Update Info -> Shipping button
code = code.replace(
  '<button onClick={() => setStep("shipping")}',
  '<button onClick={() => handleNextStep("shipping")}'
);
code = code.replace(
  'Continue to Shipping\n                    </button>',
  `{isTransitioning ? <Loader2 className="w-5 h-5 animate-spin mx-auto" /> : "Continue to Shipping"}
                    </button>`
);

// 6. Update Shipping step form & move billing here
const shippingAndBillingRegex = /\{\/\* 2\. SHIPPING STEP \*\/\}(.|\n)*?\{\/\* 4\. PAYMENT STEP \*\/\}/g;
code = code.replace(shippingAndBillingRegex, `
              {/* 2. SHIPPING STEP */}
              {step === "shipping" && (
                <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                  <h2 className="font-serif text-xl font-bold text-[#1E3A24]">Shipping & Billing Address</h2>
                  <div className="space-y-4">
                    <input type="text" placeholder="Full Name *" value={shipping.name} onChange={(e) => setShipping({...shipping, name: e.target.value})} className="w-full border border-[#D5D8D0] rounded-xl px-4 py-3 focus:outline-none focus:border-[#1E3A24]" />
                    <input type="text" placeholder="Street Address / Apartment / Suite *" value={shipping.address} onChange={(e) => setShipping({...shipping, address: e.target.value})} className="w-full border border-[#D5D8D0] rounded-xl px-4 py-3 focus:outline-none focus:border-[#1E3A24]" />
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="relative">
                        <input type="text" maxLength={6} placeholder="PIN Code / Zip Code *" value={shipping.pincode} onChange={(e) => handlePincodeChange(e.target.value, 'shipping')} className="w-full border border-[#D5D8D0] rounded-xl px-4 py-3 focus:outline-none focus:border-[#1E3A24]" />
                        {isFetchingPincode && <Loader2 className="w-4 h-4 animate-spin absolute right-4 top-4 text-[#576B55]" />}
                      </div>
                      <input type="text" placeholder="City *" value={shipping.city} onChange={(e) => setShipping({...shipping, city: e.target.value})} className="w-full border border-[#D5D8D0] rounded-xl px-4 py-3 focus:outline-none focus:border-[#1E3A24]" />
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <input type="text" placeholder="State / Province *" value={shipping.state} onChange={(e) => setShipping({...shipping, state: e.target.value})} className="w-full border border-[#D5D8D0] rounded-xl px-4 py-3 focus:outline-none focus:border-[#1E3A24]" />
                      <input type="text" value={shipping.country} readOnly className="w-full border border-[#D5D8D0] rounded-xl px-4 py-3 bg-[#FAF9F5] text-[#576B55] outline-none" />
                    </div>
                  </div>

                  <div className="pt-6 border-t border-[#E9E5D9]">
                    <h3 className="font-serif text-lg font-bold text-[#1E3A24] mb-4">Billing Address</h3>
                    <div className="space-y-3">
                      <label className={\`flex items-center gap-3 p-4 border rounded-xl cursor-pointer transition \${billingSameAsShipping ? "border-[#1E3A24] bg-[#F4F6F0]" : "border-[#E9E5D9] hover:border-[#D5D8D0]"}\`}>
                        <input type="radio" name="billingAddress" checked={billingSameAsShipping} onChange={() => setBillingSameAsShipping(true)} className="w-5 h-5 accent-[#1E3A24]" />
                        <span className="font-medium text-[#1E3A24]">Same as shipping address</span>
                      </label>

                      <label className={\`flex items-center gap-3 p-4 border rounded-xl cursor-pointer transition \${!billingSameAsShipping ? "border-[#1E3A24] bg-[#F4F6F0]" : "border-[#E9E5D9] hover:border-[#D5D8D0]"}\`}>
                        <input type="radio" name="billingAddress" checked={!billingSameAsShipping} onChange={() => setBillingSameAsShipping(false)} className="w-5 h-5 accent-[#1E3A24]" />
                        <span className="font-medium text-[#1E3A24]">Use a different billing address</span>
                      </label>
                    </div>

                    {!billingSameAsShipping && (
                      <div className="space-y-4 pt-4 animate-in fade-in slide-in-from-top-2">
                        <input type="text" placeholder="Full Name *" value={billing.name} onChange={(e) => setBilling({...billing, name: e.target.value})} className="w-full border border-[#D5D8D0] rounded-xl px-4 py-3 focus:outline-none focus:border-[#1E3A24]" />
                        <input type="text" placeholder="Street Address / Apartment / Suite *" value={billing.address} onChange={(e) => setBilling({...billing, address: e.target.value})} className="w-full border border-[#D5D8D0] rounded-xl px-4 py-3 focus:outline-none focus:border-[#1E3A24]" />
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="relative">
                            <input type="text" maxLength={6} placeholder="PIN Code / Zip Code *" value={billing.pincode} onChange={(e) => handlePincodeChange(e.target.value, 'billing')} className="w-full border border-[#D5D8D0] rounded-xl px-4 py-3 focus:outline-none focus:border-[#1E3A24]" />
                            {isFetchingPincode && <Loader2 className="w-4 h-4 animate-spin absolute right-4 top-4 text-[#576B55]" />}
                          </div>
                          <input type="text" placeholder="City *" value={billing.city} onChange={(e) => setBilling({...billing, city: e.target.value})} className="w-full border border-[#D5D8D0] rounded-xl px-4 py-3 focus:outline-none focus:border-[#1E3A24]" />
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <input type="text" placeholder="State / Province *" value={billing.state} onChange={(e) => setBilling({...billing, state: e.target.value})} className="w-full border border-[#D5D8D0] rounded-xl px-4 py-3 focus:outline-none focus:border-[#1E3A24]" />
                          <input type="text" value={billing.country} readOnly className="w-full border border-[#D5D8D0] rounded-xl px-4 py-3 bg-[#FAF9F5] text-[#576B55] outline-none" />
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="pt-6 flex items-center justify-between border-t border-[#E9E5D9] mt-6">
                    <button onClick={() => handleNextStep("info")} className="text-[#364935] font-medium hover:text-[#1E3A24] px-4 py-2">Back to Info</button>
                    <button onClick={() => handleNextStep("payment")} disabled={isTransitioning || !shipping.name || !shipping.address || !shipping.city || !shipping.state || !shipping.pincode || (!billingSameAsShipping && (!billing.name || !billing.address || !billing.city || !billing.state || !billing.pincode))} className="bg-[#1E3A24] text-white px-8 py-4 rounded-xl font-semibold hover:bg-[#152919] transition-all disabled:opacity-50 disabled:cursor-not-allowed">
                      {isTransitioning ? <Loader2 className="w-5 h-5 animate-spin mx-auto" /> : "Continue to Payment"}
                    </button>
                  </div>
                </div>
              )}

              {/* 4. PAYMENT STEP */}
`);

// 8. Fix payment back button (was back to billing, now back to shipping)
code = code.replace(
  '<button onClick={() => setStep("billing")} className="text-[#364935] font-medium hover:text-[#1E3A24] px-4 py-2">Back to Billing</button>',
  '<button onClick={() => handleNextStep("shipping")} className="text-[#364935] font-medium hover:text-[#1E3A24] px-4 py-2">Back to Shipping</button>'
);

// 9. Fix payment continue button
code = code.replace(
  '<button onClick={() => setStep("review")} className="bg-[#1E3A24] text-white px-8 py-4 rounded-xl font-semibold hover:bg-[#152919] transition-all">',
  '<button onClick={() => handleNextStep("review")} className="bg-[#1E3A24] text-white px-8 py-4 rounded-xl font-semibold hover:bg-[#152919] transition-all disabled:opacity-50 disabled:cursor-not-allowed">'
);
code = code.replace(
  'Review Order\n                    </button>',
  `{isTransitioning ? <Loader2 className="w-5 h-5 animate-spin mx-auto" /> : "Review Order"}
                    </button>`
);

// 10. Update Review step back buttons
code = code.replace(
  'onClick={() => setStep("info")}',
  'onClick={() => handleNextStep("info")}'
);
code = code.replace(
  'onClick={() => setStep("shipping")}',
  'onClick={() => handleNextStep("shipping")}'
);
code = code.replace(
  'onClick={() => setStep("billing")}',
  'onClick={() => handleNextStep("shipping")}' // goes to shipping now
);
code = code.replace(
  'onClick={() => setStep("payment")} disabled={isSubmitting}',
  'onClick={() => handleNextStep("payment")} disabled={isSubmitting}'
);

// 11. Emojis removal (Payment breakdown and Review summary)
code = code.replace('🔑 Admin Test Mode', '<Key className="w-4 h-4 inline mr-1" /> Admin Test Mode');
code = code.replace('🔑 Admin Test Mode — Checkout for ₹1', '<Key className="w-4 h-4 inline mr-1" /> Admin Test Mode — Checkout for ₹1');
code = code.replace('💳 Pay Now Online', '<CreditCard className="w-4 h-4 inline mr-1" /> Pay Now Online');
code = code.replace('🚚 Pay on Delivery', '<Truck className="w-4 h-4 inline mr-1" /> Pay on Delivery');
code = code.replace('💳 Prepaid (10% Discount)', '<CreditCard className="w-4 h-4 inline mr-1" /> Prepaid (10% Discount)');
code = code.replace('🚚 Cash on Delivery', '<Banknote className="w-4 h-4 inline mr-1" /> Cash on Delivery');

// 12. Fix mobile sticky issue
code = code.replace(
  '<div className="w-full lg:w-[40%] sticky top-24">',
  '<div className="w-full lg:w-[40%] lg:sticky lg:top-24 h-fit">'
);

fs.writeFileSync(path, code);
console.log("Replaced successfully.");
