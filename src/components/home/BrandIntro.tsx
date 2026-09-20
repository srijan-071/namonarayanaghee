import { Atmosphere } from "@/components/ui/Atmosphere";

export default function BrandIntro() {
  return (
    <section className="relative overflow-hidden bg-nn-cream py-24 md:py-32 lg:py-40">
      <Atmosphere tint="earth" opacity={0.03} />
      
      <div className="nn-container relative z-10 max-w-4xl text-center">
        <span className="nn-eyebrow block mb-6 md:mb-8 text-nn-gold">A Heritage of Purity</span>
        
        <h2 className="font-serif text-3xl md:text-5xl lg:text-6xl text-nn-forest-deep leading-[1.15] tracking-tight mb-8 md:mb-10">
          Rooted in ancient Ayurveda, crafted for the modern soul.
        </h2>
        
        <p className="font-sans text-lg md:text-xl text-nn-bark leading-relaxed max-w-2xl mx-auto font-light">
          We believe true wellness begins with reverence for nature. Our A2 Gir Cow Ghee is meticulously handcrafted using the traditional Vedic Bilona method-churning curds, not cream-to preserve the vital energy and golden richness that has nourished generations.
        </p>
        
        <div className="mt-12 flex justify-center">
          <svg className="w-12 h-12 text-nn-gold/40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v18m-9-9h18" />
            <circle cx="12" cy="12" r="8" strokeDasharray="2 4" />
          </svg>
        </div>
      </div>
    </section>
  );
}
