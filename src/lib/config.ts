// Site configuration - single source of truth
export const siteConfig = {
  name: "Namo Narayana Ghee",
  tagline: "Pure, Authentic & Traditional",
  description: "Premium A2 Gir Cow Ghee, Wood Pressed Oils, Raw Forest Honey and more - made the traditional way, delivered to your doorstep.",
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
  announcement: "Free COD - Cash On Delivery Pan India | Trusted by 10 Lakh+ Customers",
} as const;

export type SiteConfig = typeof siteConfig;
