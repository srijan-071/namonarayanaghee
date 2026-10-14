import { NextResponse } from "next/server";
import { firestoreSetDoc } from "@/lib/firestore-rest";
import { RAW_PRODUCTS } from "@/lib/data-store";

// We copy the coupons here since it's an API route or we could import it if it's available server-side.
// We can just import it from lib/cart but since it has "use client", we shouldn't import cart.ts in an API route.
const VALID_COUPONS: Record<string, { type: 'percentage' | 'fixed'; value: number }> = {
  "ELVISH10": { type: 'percentage', value: 10 },
  "NAMO50": { type: 'fixed', value: 50 },
  "WELCOME": { type: 'percentage', value: 5 },
  "GHEE100": { type: 'fixed', value: 100 }
};

const PROXY_URL = "/pay-proxy";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { uid, cartItems, checkoutData } = body;

    if (!cartItems || !Array.isArray(cartItems) || cartItems.length === 0) {
      return NextResponse.json({ error: "Cart is empty" }, { status: 400 });
    }
    
    if (!checkoutData || !checkoutData.email || !checkoutData.phone) {
        return NextResponse.json({ error: "Missing checkout info" }, { status: 400 });
    }

    // Server-side subtotal calculation
    let serverSubtotal = 0;
    const validatedItems = [];

    for (const item of cartItems) {
      const product = Object.values(RAW_PRODUCTS).find(p => p.id === item.productId || p.handle === item.slug);
      if (!product) {
        return NextResponse.json({ error: `Product not found: ${item.title}` }, { status: 400 });
      }

      // Check variant price
      let variantPrice = product.price; // default to main price
      if (product.variants && product.variants.length > 0) {
        const variant = product.variants.find((v: any) => v.id === item.variantId);
        if (variant && typeof variant.price === "number") {
          variantPrice = variant.price;
        }
      }

      const qty = Number(item.quantity);
      if (!Number.isInteger(qty) || qty <= 0) {
        return NextResponse.json({ error: `Invalid quantity for product: ${item.title}` }, { status: 400 });
      }

      serverSubtotal += variantPrice * qty;
      
      validatedItems.push({
        productId: item.productId,
        variantId: item.variantId,
        slug: item.slug,
        name: item.title,
        title: item.title,
        variantTitle: item.variantTitle,
        price: variantPrice,
        image: item.image,
        quantity: qty,
      });
    }

    // Coupon logic
    let discount = 0;
    let discountPercent = 0;
    const couponCode = checkoutData.couponCode?.toUpperCase().trim();

    if (couponCode && VALID_COUPONS[couponCode]) {
      const coupon = VALID_COUPONS[couponCode];
      if (coupon.type === 'percentage') {
        discount = Math.round(serverSubtotal * (coupon.value / 100));
        discountPercent = coupon.value;
      } else if (coupon.type === 'fixed') {
        discount = coupon.value;
      }
    }

    if (discount > serverSubtotal) {
      discount = serverSubtotal;
    }

    const amountAfterDiscount = serverSubtotal - discount;
    const amountToPay = amountAfterDiscount;

    const orderId = crypto.randomUUID().replace(/-/g, "").slice(0, 20);

    await firestoreSetDoc("orders", orderId, {
      orderId,
      userId: uid || `guest_${Date.now()}`,
      items: validatedItems,
      subtotal: serverSubtotal,
      shippingCost: 0,
      tax: 0,
      totalAmount: amountAfterDiscount,
      discount,
      discountPercent,
      couponCode: couponCode || null,
      amountToPay,
      amountRemaining: 0,
      shippingAddress: checkoutData.shippingAddress || null,
      billingAddress: checkoutData.billingAddress || null,
      gstDetails: checkoutData.gstDetails || null,
      contactInfo: {
        email: checkoutData.email,
        phone: checkoutData.phone
      },
      paymentMethod: "prepaid",
      paymentStatus: "pending",
      paymentSessionId: null,
      status: "pending",
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    // Save profile details
    if (uid && !uid.startsWith("guest_")) {
       await firestoreSetDoc("users", uid, {
           uid,
           email: checkoutData.email,
           phone: checkoutData.phone,
           defaultShippingAddress: checkoutData.shippingAddress || null,
           defaultBillingAddress: checkoutData.billingAddress || null,
           gstDetails: checkoutData.gstDetails || null,
           updatedAt: new Date()
       }, true);
    }

    // Construct proxy checkout url
    const amountInINR = amountToPay / 100;
    const proxyParams = new URLSearchParams();
    proxyParams.set("txnid", orderId);
    proxyParams.set("amount", amountInINR.toString());
    proxyParams.set("productinfo", `Order ${orderId}`);
    proxyParams.set("firstname", checkoutData.shippingAddress?.name || "Customer");
    proxyParams.set("email", checkoutData.email || "");
    proxyParams.set("phone", checkoutData.phone || "");
    proxyParams.set("udf1", "namonarayanaghee");

    const checkoutUrl = `${PROXY_URL}?${proxyParams.toString()}`;

    return NextResponse.json({
      success: true,
      orderId,
      checkoutUrl
    });

  } catch (error: any) {
    console.error("Create order error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
