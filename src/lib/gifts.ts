import { CartItem } from "./types";

export interface FreeGift {
  id: string;
  name: string;
  variant: string;
  size: string;
  image: string;
  quantity: number;
  price: number;
  isGift: true;
}

/**
 * Returns the list of free gift oils based on ghee items present in the cart.
 * Rules:
 * - 1 Litre Ghee -> 1x Mustard Oil 250ml
 * - 2.5 Litre Ghee -> 1x Groundnut Oil 250ml + 1x Yellow Mustard Oil 250ml + 1x Mustard Oil 250ml
 * - 5 Litre Ghee -> 1x Coconut Oil 250ml + 1x Groundnut Oil 250ml + 1x Mustard Oil 500ml
 */
export function getFreeGiftsForCart(items: CartItem[]): FreeGift[] {
  let qty1L = 0;
  let qty2_5L = 0;
  let qty5L = 0;

  for (const item of items) {
    const title = (item.title || "").toLowerCase();
    const slug = (item.slug || "").toLowerCase();
    const variant = (item.variantTitle || "").toLowerCase();

    // 2.5 Litre check (must be checked before 5-litre because "2-5-litre" contains "5-litre")
    if (slug.includes("2-5-litre") || slug.includes("2.5") || variant.includes("2.5") || title.includes("2.5")) {
      qty2_5L += item.quantity;
    }
    // 5 Litre check
    else if ((slug.includes("5-litre") || variant.includes("5 litre") || title.includes("5 litre")) && !slug.includes("2-5") && !title.includes("2.5") && !variant.includes("2.5")) {
      qty5L += item.quantity;
    }
    // 1 Litre check
    else if (slug.includes("1-litre") || variant.includes("1 litre") || (title.includes("1 litre") && !title.includes("2.5"))) {
      qty1L += item.quantity;
    }
  }

  const gifts: FreeGift[] = [];

  // Gifts for 1 Litre Ghee: Mustard Oil 250ml
  if (qty1L > 0) {
    gifts.push({
      id: "gift-mustard-250",
      name: "Mustard Oil – 250 ml (Free Gift)",
      variant: "250ml",
      size: "250ml",
      image: "/assets/mustard-oil-250ml.webp",
      quantity: qty1L,
      price: 0,
      isGift: true,
    });
  }

  // Gifts for 2.5 Litre Ghee: Groundnut 250ml + Yellow Mustard 250ml + Mustard 250ml
  if (qty2_5L > 0) {
    gifts.push({
      id: "gift-groundnut-250",
      name: "Groundnut Oil – 250 ml (Free Gift)",
      variant: "250ml",
      size: "250ml",
      image: "/assets/groundnut-oil-250ml.webp",
      quantity: qty2_5L,
      price: 0,
      isGift: true,
    });
    gifts.push({
      id: "gift-yellow-mustard-250",
      name: "Yellow Mustard Oil – 250 ml (Free Gift)",
      variant: "250ml",
      size: "250ml",
      image: "/assets/yellow-mustard-oil-250ml.webp",
      quantity: qty2_5L,
      price: 0,
      isGift: true,
    });
    gifts.push({
      id: "gift-mustard-250-bundle",
      name: "Mustard Oil – 250 ml (Free Gift)",
      variant: "250ml",
      size: "250ml",
      image: "/assets/mustard-oil-250ml.webp",
      quantity: qty2_5L,
      price: 0,
      isGift: true,
    });
  }

  // Gifts for 5 Litre Ghee: Coconut 250ml + Groundnut 250ml + Mustard 500ml
  if (qty5L > 0) {
    gifts.push({
      id: "gift-coconut-250",
      name: "Coconut Oil – 250 ml (Free Gift)",
      variant: "250ml",
      size: "250ml",
      image: "/assets/coconut-oil-250ml.webp",
      quantity: qty5L,
      price: 0,
      isGift: true,
    });
    gifts.push({
      id: "gift-groundnut-250-5l",
      name: "Groundnut Oil – 250 ml (Free Gift)",
      variant: "250ml",
      size: "250ml",
      image: "/assets/groundnut-oil-250ml.webp",
      quantity: qty5L,
      price: 0,
      isGift: true,
    });
    gifts.push({
      id: "gift-mustard-500",
      name: "Mustard Oil – 500 ml (Free Gift)",
      variant: "500ml",
      size: "500ml",
      image: "/assets/mustard-oil-500ml.webp",
      quantity: qty5L,
      price: 0,
      isGift: true,
    });
  }

  return gifts;
}

/**
 * Checks if the cart contains 500ml ghee and no 1L/2.5L/5L ghee
 */
export function has500mlGheeUpsell(items: CartItem[]): boolean {
  const has500ml = items.some(
    (item) =>
      item.slug.includes("500-ml") ||
      (item.variantTitle || "").toLowerCase().includes("500 ml") ||
      (item.title || "").toLowerCase().includes("500 ml")
  );
  const hasLargerGhee = items.some(
    (item) =>
      item.slug.includes("1-litre") ||
      item.slug.includes("2-5-litre") ||
      item.slug.includes("5-litre") ||
      (item.variantTitle || "").toLowerCase().includes("1 litre") ||
      (item.variantTitle || "").toLowerCase().includes("2.5") ||
      (item.variantTitle || "").toLowerCase().includes("5 litre")
  );
  return has500ml && !hasLargerGhee;
}
