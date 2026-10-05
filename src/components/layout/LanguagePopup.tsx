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
          className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-[#364935]/60 backdrop-blur-sm"
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 20 }}
            className="bg-[#F7F4EB] rounded-2xl shadow-2xl overflow-hidden max-w-md w-full border border-[#E9E5D9]"
          >
            <div className="p-8 text-center">
              <h2 className="text-3xl font-serif text-[#364935] mb-2 font-bold">Welcome!</h2>
              <p className="text-[#364935]/80 mb-8 font-medium">Please select your preferred language</p>
              
              <div className="grid grid-cols-2 gap-4">
                <button
                  onClick={() => handleLanguageSelect('en')}
                  className="flex flex-col items-center justify-center p-6 border-2 border-[#E9E5D9] bg-white rounded-xl hover:border-[#B58231] hover:bg-[#E9E5D9]/50 transition-all group"
                >
                  <span className="text-4xl mb-3 group-hover:scale-110 transition-transform">🇬🇧</span>
                  <span className="font-semibold text-[#364935] text-lg">English</span>
                </button>
                
                <button
                  onClick={() => handleLanguageSelect('hi')}
                  className="flex flex-col items-center justify-center p-6 border-2 border-[#E9E5D9] bg-white rounded-xl hover:border-[#B58231] hover:bg-[#E9E5D9]/50 transition-all group"
                >
                  <span className="text-4xl mb-3 group-hover:scale-110 transition-transform">🇮🇳</span>
                  <span className="font-semibold text-[#364935] text-lg">हिंदी</span>
                  <span className="text-sm text-[#364935]/60 mt-1">Hindi</span>
                </button>
              </div>
            </div>
            <div className="bg-[#E9E5D9]/50 p-4 text-center">
              <p className="text-xs text-[#364935]/70">You can always change this later from your browser settings.</p>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
