import { Sparkles, Droplets, Leaf, ShieldCheck, Truck, Clock } from "lucide-react";

const reasons = [
  { icon: Droplets, title: "A2 Gir Cow", desc: "Pure A2 Milk" },
  { icon: Clock, title: "Bilona Churned", desc: "Vedic Process" },
  { icon: Leaf, title: "100% Natural", desc: "No Preservatives" },
  { icon: ShieldCheck, title: "Lab Tested", desc: "Certified Purity" },
  { icon: Truck, title: "COD Available", desc: "Across India" },
  { icon: Sparkles, title: "Premium Quality", desc: "Farm to Fork" },
];

export default function WhyChooseUs() {
  return (
    <section className="py-12 bg-white border-t border-nn-hairline">
      <div className="nn-container">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6 md:gap-8">
          {reasons.map((r, i) => {
            const Icon = r.icon;
            return (
              <div key={i} className="flex flex-col items-center text-center">
                <div className="w-12 h-12 rounded-full bg-nn-cream flex items-center justify-center text-nn-forest mb-3">
                  <Icon strokeWidth={1.5} size={24} />
                </div>
                <h4 className="font-sans font-bold text-sm text-nn-ink">{r.title}</h4>
                <p className="font-sans text-xs text-nn-bark/70 mt-1">{r.desc}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
