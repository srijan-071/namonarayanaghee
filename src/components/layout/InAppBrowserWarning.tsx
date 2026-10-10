'use client';

import { useEffect, useState } from 'react';
import { X, ExternalLink } from 'lucide-react';

export default function InAppBrowserWarning() {
  const [isInAppBrowser, setIsInAppBrowser] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    // Detect Instagram or Facebook in-app browser
    const userAgent = navigator.userAgent || navigator.vendor;
    const isInstagram = userAgent.includes('Instagram');
    const isFacebook = userAgent.includes('FBAN') || userAgent.includes('FBAV');
    
    if (isInstagram || isFacebook) {
      setIsInAppBrowser(true);
    }
  }, []);

  if (!isInAppBrowser || dismissed) return null;

  return (
    <div className="fixed top-0 left-0 right-0 z-[9999] bg-[#1E3A24] text-white p-4 shadow-md flex items-center justify-between gap-4 animate-in slide-in-from-top">
      <div className="flex flex-col gap-1 flex-1">
        <p className="text-sm font-bold flex items-center gap-2">
          <ExternalLink className="w-4 h-4 text-[#F5B301]" />
          Open in System Browser
        </p>
        <p className="text-xs text-white/80 leading-snug">
          For a smooth and secure checkout experience, please click the 3 dots (•••) at the top right and select &quot;Open in Chrome&quot; or &quot;Open in System Browser&quot;.
        </p>
      </div>
      <button 
        onClick={() => setDismissed(true)}
        className="p-2 bg-white/10 rounded-full hover:bg-white/20 transition shrink-0"
        aria-label="Dismiss warning"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
}
