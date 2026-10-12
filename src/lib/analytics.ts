// Helper for Meta Pixel
const fbq = (...args: any[]) => {
  if (typeof window !== "undefined" && (window as any).fbq) {
    (window as any).fbq(...args);
  }
};

export const trackEvent = (eventName: string, eventParams?: any) => {
  // Run asynchronously so we don't block and can dynamic import
  setTimeout(async () => {
    try {
      // 1. Firebase Analytics
      const { analytics } = await import("./firebase");
      if (analytics) {
        const { logEvent } = await import("firebase/analytics");
        logEvent(analytics, eventName, eventParams);
      }

    // 2. Meta Pixel
    // Map Firebase event names to standard Meta Pixel events where applicable
    let metaEvent = "CustomEvent";
    let metaParams = eventParams || {};

    switch (eventName) {
      case "page_view":
        metaEvent = "PageView";
        break;
      case "view_item":
        metaEvent = "ViewContent";
        metaParams = {
          content_ids: eventParams?.items?.map((i: any) => i.item_id),
          content_type: 'product',
          value: eventParams?.value,
          currency: eventParams?.currency || 'INR',
        };
        break;
      case "add_to_cart":
        metaEvent = "AddToCart";
        metaParams = {
          content_ids: eventParams?.items?.map((i: any) => i.item_id),
          content_type: 'product',
          value: eventParams?.value,
          currency: eventParams?.currency || 'INR',
        };
        break;
      case "remove_from_cart":
        metaEvent = "RemoveFromCart";
        break;
      case "begin_checkout":
        metaEvent = "InitiateCheckout";
        metaParams = {
          value: eventParams?.value,
          currency: eventParams?.currency || 'INR',
        };
        break;
      case "add_shipping_info":
        metaEvent = "AddShippingInfo";
        break;
      case "add_payment_info":
        metaEvent = "AddPaymentInfo";
        metaParams = {
          payment_type: eventParams?.payment_type,
          value: eventParams?.value,
          currency: eventParams?.currency || 'INR',
        };
        break;
      case "purchase":
        metaEvent = "Purchase";
        metaParams = {
          value: eventParams?.value,
          currency: eventParams?.currency || 'INR',
          transaction_id: eventParams?.transaction_id,
          payment_type: eventParams?.payment_type || "prepaid",
        };
        break;
      case "order_created":
        metaEvent = "OrderCreated"; // Pending order placed, before payment redirect
        metaParams = {
          value: eventParams?.value,
          currency: eventParams?.currency || 'INR',
          payment_type: eventParams?.payment_type,
        };
        break;
      case "sign_up":
        metaEvent = "CompleteRegistration";
        break;
      case "login":
        metaEvent = "Login"; // Will map to custom if not standard
        break;
      default:
        metaEvent = eventName; // Custom event
    }

    if (metaEvent === "PageView") {
      fbq("track", "PageView");
    } else if (["ViewContent", "AddToCart", "InitiateCheckout", "Purchase", "AddPaymentInfo", "CompleteRegistration"].includes(metaEvent)) {
      fbq("track", metaEvent, metaParams);
    } else {
      fbq("trackCustom", metaEvent, metaParams);
    }
    
  } catch (e) {
    console.error("Analytics Error:", e);
  }
  }, 0);
};
