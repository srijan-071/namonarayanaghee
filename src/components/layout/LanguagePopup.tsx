'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function LanguagePopup() {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    // Check if the user has already selected a language
    const hasSelectedLanguage = localStorage.getItem('language_selected');
    if (!hasSelectedLanguage) {
      // Small delay to let the page load first
      const timer = setTimeout(() => {
        setIsOpen(true);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleLanguageSelect = (lang: 'en' | 'hi') => {
    localStorage.setItem('language_selected', lang);
    
    if (lang === 'hi') {
      // Set Google Translate cookie for Hindi
      document.cookie = `googtrans=/en/hi; path=/; domain=${window.location.hostname}`;
      // Some browsers also look at this cookie without domain
      document.cookie = `googtrans=/en/hi; path=/;`;
    } else {
      // Set for English or clear
      document.cookie = `googtrans=/en/en; path=/; domain=${window.location.hostname}`;
      document.cookie = `googtrans=/en/en; path=/;`;
    }
    
    setIsOpen(false);
    
    // Reload to apply translation
    window.location.reload();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-[#2D0609]/60 backdrop-blur-sm"
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 20 }}
            className="bg-[#FCFAF5] rounded-2xl shadow-2xl overflow-hidden max-w-md w-full border border-[#EAD7BC]"
          >
            <div className="p-8 text-center">
              <h2 className="text-3xl font-serif text-[#5E0B10] mb-2 font-bold">Welcome!</h2>
              <p className="text-[#4A352F] mb-8 font-medium">Please select your preferred language</p>
              
              <div className="grid grid-cols-2 gap-4">
                <button
                  onClick={() => handleLanguageSelect('en')}
                  className="flex flex-col items-center justify-center p-6 border-2 border-[#EAD7BC] bg-white rounded-xl hover:border-[#D4A017] hover:bg-[#FDF6E8] transition-all group"
                >
                  <span className="text-4xl mb-3 group-hover:scale-110 transition-transform">��</span>
                  <span className="font-semibold text-[#5E0B10] text-lg">English</span>
                </button>
                
                <button
                  onClick={() => handleLanguageSelect('hi')}
                  className="flex flex-col items-center justify-center p-6 border-2 border-[#EAD7BC] bg-white rounded-xl hover:border-[#D4A017] hover:bg-[#FDF6E8] transition-all group"
                >
                  <span className="text-4xl mb-3 group-hover:scale-110 transition-transform">��</span>
                  <span className="font-semibold text-[#5E0B10] text-lg">हिंदी</span>
                  <span className="text-sm text-[#7A4A3B] mt-1">Hindi</span>
                </button>
              </div>
            </div>
            <div className="bg-[#FDF6E8] p-4 text-center border-t border-[#EAD7BC]/60">
              <p className="text-xs text-[#7A4A3B]">You can always change this later from your browser settings.</p>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
