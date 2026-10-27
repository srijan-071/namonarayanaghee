'use client';

import { useEffect, useState } from 'react';
import { X, ExternalLink } from 'lucide-react';

export default function InAppBrowserWarning() {
  const [isInAppBrowser, setIsInAppBrowser] = useState(false);

  useEffect(() => {
    // Detect Instagram or Facebook in-app browser
    const userAgent = navigator.userAgent || navigator.vendor;
    const isInstagram = userAgent.includes('Instagram');
    const isFacebook = userAgent.includes('FBAN') || userAgent.includes('FBAV');
    
    if (isInstagram || isFacebook) {
      setIsInAppBrowser(true);
      
      // Auto-redirect for Android users to force Chrome
      if (userAgent.includes('Android')) {
        const url = window.location.href.replace(/^https?:\/\//, '');
        window.location.href = `intent://${url}#Intent;scheme=https;package=com.android.chrome;end;`;
      }
    }
  }, []);

  if (!isInAppBrowser) return null;

  return (
    <div className="fixed inset-0 z-[99999] bg-gradient-to-b from-[#5E0B10] to-[#2D0609] text-white p-8 flex flex-col items-center justify-center text-center animate-in fade-in">
      <ExternalLink className="w-16 h-16 text-[#F5BD47] mb-6" />
      <h2 className="text-2xl font-bold font-serif mb-4">Please Open in Browser</h2>
      <p className="text-white/80 text-lg mb-8 leading-relaxed max-w-sm">
        To complete your purchase securely and without errors, please click the <strong className="text-white">3 dots (•••)</strong> at the top right corner and select <strong className="text-[#F5BD47]">&quot;Open in Chrome&quot;</strong> or <strong className="text-[#F5BD47]">&quot;Open in System Browser&quot;</strong>.
      </p>
      
      <div className="bg-white/10 rounded-xl p-4 border border-white/20">
        <p className="text-sm font-bold uppercase tracking-widest text-[#F5BD47] mb-2">Step-by-step</p>
        <ol className="text-left text-sm text-white/90 space-y-2">
          <li>1. Look at the top right of this screen.</li>
          <li>2. Tap the three dots icon.</li>
          <li>3. Select &quot;Open in Chrome&quot; or &quot;Open in Safari&quot;.</li>
        </ol>
      </div>
    </div>
  );
}
