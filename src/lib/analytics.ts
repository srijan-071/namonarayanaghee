// E-Commerce Conversion Analytics 
// This is a foundational architecture to track SEO conversion effectiveness.

export const trackEvent = (eventName: string, data: Record<string, any> = {}) => {
  // In a real implementation, this would push to dataLayer (GTM), GA4, or Meta Pixel.
  if (typeof window !== "undefined") {
    // console.log(\`[Analytics Event]: \$\{eventName\}\`, data);
    
    // Example GTM integration:
    // window.dataLayer = window.dataLayer || [];
    // window.dataLayer.push({ event: eventName, ...data });
  }
};

export const trackPageView = (url: string) => {
  trackEvent("page_view", { page_url: url });
};

export const trackProductView = (product: any) => {
  trackEvent("view_item", {
    currency: product.currency || "INR",
    value: (product.price / 100),
    items: [{
      item_id: product.sku,
      item_name: product.title,
      price: (product.price / 100),
      item_category: product.type
    }]
  });
};

export const trackAddToCart = (item: any) => {
  trackEvent("add_to_cart", {
    currency: "INR",
    value: (item.price / 100) * item.quantity,
    items: [{
      item_id: item.variantId || item.productId,
      item_name: item.title,
      price: (item.price / 100),
      quantity: item.quantity
    }]
  });
};

export const trackBeginCheckout = (cart: any) => {
  trackEvent("begin_checkout", {
    currency: "INR",
    value: cart.subtotal / 100,
    items: cart.items.map((item: any) => ({
      item_id: item.variantId,
      item_name: item.title,
      price: item.price / 100,
      quantity: item.quantity
    }))
  });
};

export const trackPurchase = (transactionId: string, cart: any) => {
  trackEvent("purchase", {
    transaction_id: transactionId,
    currency: "INR",
    value: cart.subtotal / 100,
    items: cart.items.map((item: any) => ({
      item_id: item.variantId,
      item_name: item.title,
      price: item.price / 100,
      quantity: item.quantity
    }))
  });
};
