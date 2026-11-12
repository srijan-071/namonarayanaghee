"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";

interface FAQItem {
  q: string;
  a: string;
}

const FAQS: FAQItem[] = [
  {
    q: "How do I know this is the authentic official website for Namo Narayana?",
    a: "The only legitimate official website for Namo Narayana Ghee is https://www.namonarayanaghee.store/. Every authentic shipment features statutory FSSAI License No. 20824005000185, tamper-evident security seals, and direct batch tracing. Beware of unauthorized imitators or third-party clones.",
  },
  {
    q: "What makes Bilona ghee different from regular cream-based commercial ghee?",
    a: "Commercial ghee is produced rapidly by separating raw cream directly from milk using high-speed industrial centrifuges. Authentic Bilona ghee follows the ancient Ayurvedic 5-step process: fresh milk is boiled, cultured overnight into curd, and hand-churned bi-directionally in a wooden bilona to separate cultured makkhan (butter), which is then gently clarified over a low flame. This preserves the natural danedar texture and distinct nutty aroma.",
  },
  {
    q: "How does Cash on Delivery (COD) work on this store?",
    a: "To protect our gaushala dispatch operations from fraudulent unverified orders and high courier return-to-origin (RTO) costs, Cash on Delivery requires a standard ₹250 online advance booking deposit. The remaining balance is collected conveniently via Cash or UPI at your doorstep when the delivery arrives.",
  },
  {
    q: "What are the verified laboratory test results for this ghee?",
    a: "Our ghee is tested by NABL-accredited FARE Labs (Report TC550326100005189F for representative batch NMO-260722-A01). Testing verified 99.88% pure milk fat (FSSAI statutory minimum: 99.5%), <0.5% moisture, zero added sugar, zero synthetic preservatives, and zero palm oil adulteration.",
  },
  {
    q: "How should I store Namo Narayana Ghee, and what is its shelf life?",
    a: "Keep the jar in a cool, dry place away from direct sunlight. Traditional Bilona ghee does not require refrigeration. Ensure you always use a clean, dry spoon to prevent moisture contamination. The sealed shelf life is 12 months from the packaging date.",
  },
  {
    q: "Which pack size is best suited for my household?",
    a: "The 500 ml jar (₹799) is ideal as a starter trial pack. The 1 Litre jar (₹1,299) is our flagship best-seller for small families of 2-3 members. For regular cooking households (3-5 members), the 2.5 Litre pack (₹2,699, ₹1,079/L) provides optimum value. The 5 Litre bulk container (₹4,499, ₹899/L) offers maximum family savings.",
  },
  {
    q: "What is your shipping and return policy if a jar arrives damaged?",
    a: "We offer Free Express Shipping across India. All glass jars and food-grade containers are encased in multi-layer protective transit packaging. In the rare event of transit damage, simply email support@namonarayanaghee.store within 48 hours of delivery with unboxing photos, and we will issue an immediate free replacement.",
  },
];

export default function HomeFAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleFAQ = (idx: number) => {
    setOpenIndex(openIndex === idx ? null : idx);
  };

  return (
    <section className="py-16 md:py-24 bg-white border-b border-[#E5DEC9]">
      <div className="nn-container max-w-4xl mx-auto">
        
        <div className="text-center mb-12">
          <span className="text-xs font-bold uppercase tracking-widest text-[#2D5A37] block mb-2">
            Clear Answers
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl text-[#142918] font-bold mb-3">
            Frequently Asked Questions
          </h2>
          <p className="text-sm sm:text-base text-[#3D4A41]">
            Everything you need to know about our sourcing, bilona method, lab reports, and delivery.
          </p>
        </div>

        <div className="divide-y divide-[#E5DEC9] border-y border-[#E5DEC9]">
          {FAQS.map((faq, i) => {
            const isOpen = openIndex === i;
            return (
              <div key={i} className="py-5">
                <button
                  type="button"
                  onClick={() => toggleFAQ(i)}
                  className="w-full flex items-center justify-between text-left font-serif font-bold text-base sm:text-lg text-[#142918] hover:text-[#2D5A37] transition-colors gap-4 cursor-pointer"
                  aria-expanded={isOpen}
                >
                  <span>{faq.q}</span>
                  <ChevronDown
                    className={`w-5 h-5 text-[#2D5A37] shrink-0 transition-transform duration-200 ${
                      isOpen ? "rotate-180" : ""
                    }`}
                  />
                </button>
                {isOpen && (
                  <p className="mt-3 text-xs sm:text-sm text-[#3D4A41] leading-relaxed">
                    {faq.a}
                  </p>
                )}
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
