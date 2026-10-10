'use client';

import { useEffect } from 'react';
import Script from 'next/script';

export default function GoogleTranslate() {
  useEffect(() => {
    // Force Hindi translation for all users automatically
    document.cookie = `googtrans=/en/hi; path=/; domain=${window.location.hostname}`;
    document.cookie = `googtrans=/en/hi; path=/;`;

    // We define the callback function globally so Google Translate script can call it
    (window as any).googleTranslateElementInit = () => {
      new (window as any).google.translate.TranslateElement(
        {
          pageLanguage: 'en',
          includedLanguages: 'hi',
          autoDisplay: false,
        },
        'google_translate_element'
      );
    };

    // Patch DOM methods to prevent React from crashing when Google Translate wraps text nodes in <font> tags
    if (typeof Node === 'function' && Node.prototype) {
      const originalRemoveChild = Node.prototype.removeChild;
      Node.prototype.removeChild = function <T extends Node>(child: T): T {
        if (child.parentNode !== this) {
          if (console) {
            console.warn('Prevented React crash from Google Translate DOM manipulation', child, this);
          }
          return child;
        }
        return originalRemoveChild.apply(this, arguments as any) as T;
      };

      const originalInsertBefore = Node.prototype.insertBefore;
      Node.prototype.insertBefore = function <T extends Node>(newNode: T, referenceNode: Node | null): T {
        if (referenceNode && referenceNode.parentNode !== this) {
          if (console) {
            console.warn('Prevented React crash from Google Translate DOM manipulation', referenceNode, this);
          }
          return newNode;
        }
        return originalInsertBefore.apply(this, arguments as any) as T;
      };
    }
  }, []);

  return (
    <>
      <div id="google_translate_element" style={{ display: 'none' }}></div>
      <Script
        src="//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit"
        strategy="afterInteractive"
      />
    </>
  );
}
