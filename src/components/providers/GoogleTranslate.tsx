'use client';

import { useEffect } from 'react';
import Script from 'next/script';

export default function GoogleTranslate() {
  useEffect(() => {
    // We define the callback function globally so Google Translate script can call it
    (window as any).googleTranslateElementInit = () => {
      new (window as any).google.translate.TranslateElement(
        {
          pageLanguage: 'en',
          includedLanguages: 'hi,en',
          autoDisplay: false,
        },
        'google_translate_element'
      );
    };

    // Patch DOM methods to prevent React from crashing when Google Translate wraps text nodes in <font> tags
    if (typeof Node === 'function' && Node.prototype) {
      const originalRemoveChild = Node.prototype.removeChild;
      Node.prototype.removeChild = function (child) {
        if (child.parentNode !== this) {
          if (console) {
            console.warn('Prevented React crash from Google Translate DOM manipulation', child, this);
          }
          return child;
        }
        return originalRemoveChild.apply(this, arguments as any);
      };

      const originalInsertBefore = Node.prototype.insertBefore;
      Node.prototype.insertBefore = function (newNode, referenceNode) {
        if (referenceNode && referenceNode.parentNode !== this) {
          if (console) {
            console.warn('Prevented React crash from Google Translate DOM manipulation', referenceNode, this);
          }
          return newNode;
        }
        return originalInsertBefore.apply(this, arguments as any);
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
