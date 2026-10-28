// Helper for Meta Pixel
const fbq = (...args: any[]) => {
  if (typeof window !== "undefined" && (window as any).fbq) {
    (window as any).fbq(...args);
  }
};

/**
 * Normalizes values to clean INR Rupee amounts.
 * Prices in our store are stored in paise (e.g. 59900 paise = ₹599.00).
 * If value >= 100, divide by 100 to get INR Rupee format expected by Meta.
 */
function toValidMetaAmount(raw: any): number | undefined {
  if (raw === undefined || raw === null) return undefined;
  const num = typeof raw === "number" ? raw : parseFloat(String(raw).replace(/[^0-9.-]+/g, ""));
  if (isNaN(num) || num <= 0) return undefined;
  const inRupees = num >= 100 ? num / 100 : num;
  return Number(inRupees.toFixed(2));
}

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
      let metaEvent = "CustomEvent";
      let metaParams: Record<string, any> = {};

      const cleanValue = toValidMetaAmount(eventParams?.value);

      switch (eventName) {
        case "page_view":
          metaEvent = "PageView";
          break;

        case "view_item":
          metaEvent = "ViewContent";
          metaParams = {
            content_type: "product",
            ...(eventParams?.items?.length && {
              content_ids: eventParams.items.map((i: any) => String(i.item_id || i.id)),
            }),
            ...(cleanValue !== undefined && {
              value: cleanValue,
              currency: "INR",
            }),
          };
          break;

        case "add_to_cart":
          metaEvent = "AddToCart";
          metaParams = {
            content_type: "product",
            ...(eventParams?.items?.length && {
              content_ids: eventParams.items.map((i: any) => String(i.item_id || i.id)),
            }),
            ...(cleanValue !== undefined && {
              value: cleanValue,
              currency: "INR",
            }),
          };
          break;

        case "remove_from_cart":
          metaEvent = "RemoveFromCart";
          if (cleanValue !== undefined) {
            metaParams.value = cleanValue;
            metaParams.currency = "INR";
          }
          break;

        case "begin_checkout":
          metaEvent = "InitiateCheckout";
          metaParams = {
            ...(cleanValue !== undefined && {
              value: cleanValue,
              currency: "INR",
            }),
            ...(eventParams?.items?.length && {
              content_ids: eventParams.items.map((i: any) => String(i.item_id || i.id)),
              num_items: eventParams.items.length,
            }),
          };
          break;

        case "add_shipping_info":
          metaEvent = "AddShippingInfo";
          if (cleanValue !== undefined) {
            metaParams.value = cleanValue;
            metaParams.currency = "INR";
          }
          break;

        case "add_payment_info":
          metaEvent = "AddPaymentInfo";
          metaParams = {
            ...(cleanValue !== undefined && {
              value: cleanValue,
              currency: "INR",
            }),
            ...(eventParams?.payment_type && {
              payment_type: String(eventParams.payment_type),
            }),
          };
          break;

        case "purchase":
          metaEvent = "Purchase";
          metaParams = {
            value: cleanValue ?? 0,
            currency: "INR",
            ...(eventParams?.transaction_id && {
              transaction_id: String(eventParams.transaction_id),
            }),
            ...(eventParams?.payment_type && {
              payment_type: String(eventParams.payment_type),
            }),
          };
          break;

        case "order_created":
          metaEvent = "OrderCreated";
          if (cleanValue !== undefined) {
            metaParams.value = cleanValue;
            metaParams.currency = "INR";
          }
          if (eventParams?.payment_type) {
            metaParams.payment_type = String(eventParams.payment_type);
          }
          break;

        case "sign_up":
          metaEvent = "CompleteRegistration";
          break;

        case "login":
          metaEvent = "Login";
          break;

        default:
          metaEvent = eventName;
          if (cleanValue !== undefined) {
            metaParams.value = cleanValue;
            metaParams.currency = "INR";
          }
          break;
      }

      if (metaEvent === "PageView") {
        fbq("track", "PageView");
      } else if (
        ["ViewContent", "AddToCart", "InitiateCheckout", "Purchase", "AddPaymentInfo", "CompleteRegistration"].includes(
          metaEvent
        )
      ) {
        fbq("track", metaEvent, metaParams);
      } else {
        fbq("trackCustom", metaEvent, metaParams);
      }
    } catch (e) {
      console.error("Analytics Error:", e);
    }
  }, 0);
};

