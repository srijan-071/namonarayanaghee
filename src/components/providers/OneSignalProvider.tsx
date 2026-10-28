"use client";

import { useEffect } from "react";
import Script from "next/script";

declare global {
  interface Window {
    OneSignalDeferred?: any[];
    OneSignal?: any;
  }
}

const ONESIGNAL_APP_ID = process.env.NEXT_PUBLIC_ONESIGNAL_APP_ID || "c467b8e5-6a21-4134-b8f6-9da89a7a9e06";
const ONESIGNAL_SAFARI_WEB_ID = process.env.NEXT_PUBLIC_ONESIGNAL_SAFARI_WEB_ID || "web.onesignal.auto.41b6a3ea-cfe2-480b-805a-97ab17a018f3";

export default function OneSignalProvider() {
  useEffect(() => {
    // Setup OneSignal deferred queue
    window.OneSignalDeferred = window.OneSignalDeferred || [];
    window.OneSignalDeferred.push(async function (OneSignal: any) {
      try {
        await OneSignal.init({
          appId: ONESIGNAL_APP_ID,
          safari_web_id: ONESIGNAL_SAFARI_WEB_ID,
          notifyButton: {
            enable: true,
            position: "bottom-left",
            theme: "default",
            size: "medium",
            showCredit: false,
          },
          allowLocalhostAsSecureOrigin: true,
        });

        // Trigger standard OneSignal slidedown prompt after slight delay if not already subscribed
        const optedIn = OneSignal.User?.PushSubscription?.optedIn;
        if (!optedIn) {
          setTimeout(async () => {
            try {
              if (OneSignal.Slidedown?.promptPush) {
                await OneSignal.Slidedown.promptPush();
              } else if (OneSignal.Notifications?.requestPermission) {
                await OneSignal.Notifications.requestPermission();
              }
            } catch (promptErr) {
              console.log("OneSignal standard prompt notice:", promptErr);
            }
          }, 2000);
        }

        // Listen for subscription changes to trigger welcome notification
        OneSignal.User?.PushSubscription?.addEventListener("change", async (event: any) => {
          if (event.current && event.current.optedIn) {
            const subId = event.current.id;
            const onesignalId = OneSignal.User?.onesignalId;

            // Trigger welcome push notification via backend API
            try {
              await fetch("/api/onesignal/welcome", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ subscriptionId: subId, onesignalId }),
              });
            } catch (err) {
              console.error("Failed to send welcome push:", err);
            }
          }
        });
      } catch (e) {
        console.error("OneSignal init error:", e);
      }
    });
  }, []);

  return (
    <Script
      src="https://cdn.onesignal.com/sdks/web/v16/OneSignalSDK.page.js"
      strategy="afterInteractive"
    />
  );
}
