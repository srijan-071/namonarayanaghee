// Site configuration - single source of truth
export const siteConfig = {
  name: "Namo Narayana Ghee by Elvish Yadav",
  tagline: "Pure A2 Gir Cow Ghee & Traditional Indian Foods",
  description: "Namo Narayana Ghee, proudly launched by Elvish Yadav. We focus on traditional food products, including A2 Gir Cow Ghee prepared using the traditional Bilona process. Pure, authentic, and delivered to your doorstep.",
  url: "https://namonarayanaghee.store",
  locale: "en_IN",
  currency: "INR",
  currencySymbol: "₹",
  phone: "+91 99999 99999",
  email: "namonarayana.contact@gmail.com",
  social: {
    instagram: "https://instagram.com/namonarayanaghee",
    facebook: "https://facebook.com/namonarayanaghee",
  },
  announcement: "Free Shipping Pan India | Trusted by 10 Lakh+ Customers",
} as const;

export type SiteConfig = typeof siteConfig;
