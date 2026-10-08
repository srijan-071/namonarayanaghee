// Site configuration - single source of truth
export const siteConfig = {
  name: "Official Namo Narayana Ghee | By Elvish Yadav",
  tagline: "The Only Official Namo Narayana Store",
  description: "Welcome to the OFFICIAL Namo Narayana Ghee store by Elvish Yadav. Don't be fooled by fake websites! Buy 100% pure A2 Gir Cow Bilona Ghee directly from the authentic source here.",
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
