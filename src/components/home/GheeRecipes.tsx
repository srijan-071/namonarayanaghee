"use client";

import Link from "next/link";
import Image from "next/image";
import { Utensils, Flame, Sparkles } from "lucide-react";

export default function GheeRecipes() {
  const recipes = [
    {
      title: "Golden Dal Tadka & Khichdi",
      category: "Daily Cooking",
      desc: "Heat 1 tbsp Namo Narayana Bilona Ghee with cumin seeds, hing (asafoetida), and garlic. Pour sizzling tadka over yellow dal or comforting khichdi for rich aroma.",
      image: "/assets/product_4_jpg_7ae1f462-43e7-4a48-b169-2f632af1e706.webp",
      time: "5 mins",
    },
    {
      title: "Flaky Rotis & Stuffed Parathas",
      category: "Indian Breads",
      desc: "Brush warm phulkas or crispy aloo parathas with melted danedar ghee. The high smoke point (250°C) prevents burning while imparting a melt-in-the-mouth texture.",
      image: "/assets/product_5_jpg_b47e45c2-a1e1-4cd5-9de3-5f4f689abfd9.webp",
      time: "10 mins",
    },
    {
      title: "Ayurvedic Warm Milk & Halwa",
      category: "Traditional Nourishment",
      desc: "Whisk a teaspoon of pure A2 ghee into warm saffron turmeric milk before bed, or roast sooji/atta slowly for festive halwa with natural nutty sweetness.",
      image: "/assets/product_2_jpg_955716ab-fc20-478e-b3b3-485f4ad8ffcd.webp",
      time: "15 mins",
    },
  ];

  return (
    <section className="py-16 md:py-24 bg-[#F8F5EE] border-b border-[#EAE3D7]">
      <div className="nn-container">
        
        <div className="text-center max-w-3xl mx-auto mb-14">
          <span className="text-xs font-bold uppercase tracking-widest text-[#68191D] block mb-2">
            Culinary Heritage
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl text-[#4E1013] font-bold mb-4">
            Pure Ghee in Every Day Indian Cooking
          </h2>
          <p className="text-sm sm:text-base text-[#29251F] leading-relaxed">
            With a smoke point exceeding 250°C and a rich danedar crumb, Namo Narayana A2 Ghee elevates traditional dishes with unmatched aroma and wholesome flavor.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto mb-10">
          {recipes.map((item, i) => (
            <div
              key={i}
              className="bg-white rounded-2xl overflow-hidden border border-[#EAE3D7] shadow-2xs flex flex-col group hover:shadow-md transition-shadow"
            >
              <div className="relative aspect-[16/10] overflow-hidden bg-stone-100">
                <Image
                  src={item.image}
                  alt={item.title}
                  fill
                  sizes="(min-width: 768px) 33vw, 90vw"
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <span className="absolute top-3 left-3 bg-[#68191D] text-white text-[10px] font-bold px-2 py-0.5 rounded shadow">
                  {item.category}
                </span>
                <span className="absolute bottom-3 right-3 bg-black/70 backdrop-blur-xs text-white text-[10px] font-medium px-2 py-0.5 rounded">
                  {item.time}
                </span>
              </div>

              <div className="p-5 flex flex-col flex-1 justify-between">
                <div>
                  <h3 className="font-serif font-bold text-base text-[#4E1013] mb-2 group-hover:text-[#68191D] transition-colors">
                    {item.title}
                  </h3>
                  <p className="text-xs text-[#29251F] leading-relaxed mb-4">
                    {item.desc}
                  </p>
                </div>

                <Link
                  href="/#bestsellers"
                  className="text-xs font-semibold text-[#68191D] hover:text-[#68191D] inline-flex items-center gap-1"
                >
                  <span>Order Ghee for this recipe →</span>
                </Link>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}

