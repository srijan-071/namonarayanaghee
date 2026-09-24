import { logEvent } from "firebase/analytics";
import { analytics } from "./firebase";

// Helper for Meta Pixel
const fbq = (...args: any[]) => {
  if (typeof window !== "undefined" && (window as any).fbq) {
    (window as any).fbq(...args);
  }
};

export const trackEvent = (eventName: string, eventParams?: any) => {
  try {
    // 1. Firebase Analytics
    if (analytics) {
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
      case "begin_checkout":
        metaEvent = "InitiateCheckout";
        metaParams = {
          value: eventParams?.value,
          currency: eventParams?.currency || 'INR',
        };
        break;
      case "purchase":
        metaEvent = "Purchase";
        metaParams = {
          value: eventParams?.value,
          currency: eventParams?.currency || 'INR',
        };
        break;
      default:
        metaEvent = eventName; // Custom event
    }

    if (metaEvent === "PageView") {
      fbq("track", "PageView");
    } else if (["ViewContent", "AddToCart", "InitiateCheckout", "Purchase"].includes(metaEvent)) {
      fbq("track", metaEvent, metaParams);
    } else {
      fbq("trackCustom", metaEvent, metaParams);
    }
    
  } catch (e) {
    console.error("Analytics Error:", e);
  }
};
