"use client";

import { Suspense, useEffect } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { trackEvent } from "@/lib/analytics";
import { recordAndGetVisit } from "@/lib/visitor";
import Script from "next/script";

function AnalyticsTracker() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    if (pathname) {
      const searchStr = searchParams?.toString() || "";
      // 1. UTM Parameters
      const source = searchParams?.get("utm_source") || searchParams?.get("source");
      const medium = searchParams?.get("utm_medium") || searchParams?.get("medium");
      const campaign = searchParams?.get("utm_campaign") || searchParams?.get("campaign");
      const content = searchParams?.get("utm_content");
      
      // 2. Referrer Tracking
      let referrer = "";
      if (typeof document !== "undefined") {
        referrer = document.referrer;
      }

      trackEvent("page_view", {
        page_path: pathname,
        page_search: searchStr,
        page_referrer: referrer,
        ...(source && { source }),
        ...(medium && { medium }),
        ...(campaign && { campaign }),
        ...(content && { content }),
      });

      // Special product view tracking for 1 Litre
      if (pathname.includes("pure-desi-cow-ghee-1-litre")) {
        trackEvent("view_item", {
          content_type: "product",
          content_ids: ["9545146237096"],
          content_name: "Pure A2 Gir Cow Ghee 1 Litre",
          currency: "INR",
          value: 949,
        });
      }

      // 3. Tracked Link & Meta Ad Visit Notification to Telegram Bot
      try {
        const { attribution, shouldNotify } = recordAndGetVisit(pathname, searchStr);

        if (shouldNotify) {
          fetch("/api/track-visit", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(attribution),
          }).catch((err) => {
            console.error("Visit notification dispatch error:", err);
          });
        }
      } catch (err) {
        console.error("Visit tracking evaluation error:", err);
      }
    }
  }, [pathname, searchParams]);

  return null;
}

export function AnalyticsProvider({ children }: { children: React.ReactNode }) {
  const pixelId = process.env.NEXT_PUBLIC_META_PIXEL_ID || '1146624257694761';

  return (
    <>
      <Suspense fallback={null}>
        <AnalyticsTracker />
      </Suspense>
      {pixelId && (
        <>
          <Script
            id="meta-pixel"
            strategy="afterInteractive"
            dangerouslySetInnerHTML={{
              __html: `
                !function(f,b,e,v,n,t,s)
                {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
                n.callMethod.apply(n,arguments):n.queue.push(arguments)};
                if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
                n.queue=[];t=b.createElement(e);t.async=!0;
                t.src=v;s=b.getElementsByTagName(e)[0];
                s.parentNode.insertBefore(t,s)}(window, document,'script',
                'https://connect.facebook.net/en_US/fbevents.js');
                fbq('init', '${pixelId}');
              `,
            }}
          />
          <noscript>
            <img 
              height="1" 
              width="1" 
              style={{ display: "none" }}
              src={`https://www.facebook.com/tr?id=${pixelId}&ev=PageView&noscript=1`}
              alt=""
            />
          </noscript>
        </>
      )}
      {children}
    </>
  );
}
