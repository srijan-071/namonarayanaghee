"use client";

export interface VisitorAttribution {
  visitorId: string;
  sessionId: string;
  lifetimeCartCount: number;
  sessionCartCount: number;
  isRepeat: boolean;
  utmSource?: string;
  utmMedium?: string;
  utmCampaign?: string;
  utmContent?: string;
  fbclid?: string;
  referrer?: string;
  landingPage?: string;
  currentPage?: string;
  screenResolution?: string;
}

export function getVisitorAttribution(): VisitorAttribution {
  if (typeof window === "undefined") {
    return {
      visitorId: "server",
      sessionId: "server",
      lifetimeCartCount: 0,
      sessionCartCount: 0,
      isRepeat: false,
    };
  }

  try {
    // 1. Persistent Visitor ID (stored across visits/days in localStorage)
    let vid = localStorage.getItem("nn_vid");
    if (!vid) {
      vid = `usr_${Math.random().toString(36).substring(2, 9)}_${Date.now().toString(36).slice(-4)}`;
      localStorage.setItem("nn_vid", vid);
    }

    // 2. Session ID (stored for the current browser session in sessionStorage)
    let sid = sessionStorage.getItem("nn_sid");
    if (!sid) {
      sid = `ses_${Math.random().toString(36).substring(2, 8)}`;
      sessionStorage.setItem("nn_sid", sid);
    }

    // 3. UTM & Ad Attribution tracking
    let attr: Record<string, string> = {};
    const storedAttr = sessionStorage.getItem("nn_attribution");
    if (storedAttr) {
      try {
        attr = JSON.parse(storedAttr);
      } catch {
        attr = {};
      }
    }

    // Parse URL params on landing
    const urlParams = new URLSearchParams(window.location.search);
    const utmSource = urlParams.get("utm_source") || urlParams.get("source") || attr.utmSource;
    const utmMedium = urlParams.get("utm_medium") || urlParams.get("medium") || attr.utmMedium;
    const utmCampaign = urlParams.get("utm_campaign") || urlParams.get("campaign") || attr.utmCampaign;
    const utmContent = urlParams.get("utm_content") || attr.utmContent;
    const fbclid = urlParams.get("fbclid") || attr.fbclid;
    const referrer = document.referrer || attr.referrer || "";
    const landingPage = attr.landingPage || (window.location.pathname + window.location.search);

    const currentAttr = {
      utmSource: utmSource || undefined,
      utmMedium: utmMedium || undefined,
      utmCampaign: utmCampaign || undefined,
      utmContent: utmContent || undefined,
      fbclid: fbclid || undefined,
      referrer: referrer || undefined,
      landingPage: landingPage || undefined,
    };

    sessionStorage.setItem("nn_attribution", JSON.stringify(currentAttr));

    const lifetimeCartCount = Number(localStorage.getItem("nn_cart_count") || "0");
    const sessionCartCount = Number(sessionStorage.getItem("nn_sess_cart_count") || "0");

    const screenResolution = `${window.screen?.width || window.innerWidth}x${window.screen?.height || window.innerHeight}`;

    return {
      visitorId: vid,
      sessionId: sid,
      lifetimeCartCount,
      sessionCartCount,
      isRepeat: sessionCartCount > 1,
      currentPage: window.location.pathname,
      screenResolution,
      ...currentAttr,
    };
  } catch {
    return {
      visitorId: "guest",
      sessionId: "guest",
      lifetimeCartCount: 0,
      sessionCartCount: 0,
      isRepeat: false,
    };
  }
}

/**
 * Increments and records a cart addition action.
 * Returns true if notification should be dispatched (throttled to avoid rapid double-clicks within 3s).
 */
export function recordAndGetCartAddition(): {
  attribution: VisitorAttribution;
  shouldNotify: boolean;
} {
  if (typeof window === "undefined") {
    return {
      attribution: getVisitorAttribution(),
      shouldNotify: true,
    };
  }

  try {
    const lifetime = Number(localStorage.getItem("nn_cart_count") || "0") + 1;
    localStorage.setItem("nn_cart_count", String(lifetime));

    const session = Number(sessionStorage.getItem("nn_sess_cart_count") || "0") + 1;
    sessionStorage.setItem("nn_sess_cart_count", String(session));

    // Throttling: avoid duplicate notification within 3 seconds
    const now = Date.now();
    const lastNotified = Number(sessionStorage.getItem("nn_last_cart_notified_at") || "0");
    const shouldNotify = now - lastNotified > 3000;

    if (shouldNotify) {
      sessionStorage.setItem("nn_last_cart_notified_at", String(now));
    }

    const base = getVisitorAttribution();
    const attribution: VisitorAttribution = {
      ...base,
      lifetimeCartCount: lifetime,
      sessionCartCount: session,
      isRepeat: session > 1,
    };

    return { attribution, shouldNotify };
  } catch {
    return {
      attribution: getVisitorAttribution(),
      shouldNotify: true,
    };
  }
}
