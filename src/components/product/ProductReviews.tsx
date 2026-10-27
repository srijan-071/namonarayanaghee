"use client";

import { useState } from "react";
import { Star, CheckCircle, ChevronLeft, ChevronRight } from "lucide-react";
import type { Review } from "@/lib/reviews-data";

export default function ProductReviews({ reviews, totalReviews, averageRating }: { reviews: Review[], totalReviews: number, averageRating: number }) {
  const [currentPage, setCurrentPage] = useState(1);
  const reviewsPerPage = 6;
  const totalPages = Math.ceil(reviews.length / reviewsPerPage);

  const startIndex = (currentPage - 1) * reviewsPerPage;
  const currentReviews = reviews.slice(startIndex, startIndex + reviewsPerPage);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    // Smooth scroll slightly up to the start of reviews if needed, but not full page load
    const element = document.getElementById("product-reviews-section");
    if (element) {
      const y = element.getBoundingClientRect().top + window.scrollY - 100;
      window.scrollTo({ top: y, behavior: 'smooth' });
    }
  };

  return (
    <div id="product-reviews-section" className="py-12 border-t border-[#EAD7BC] mt-12 scroll-mt-24">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-6">
        <div>
          <h2 className="font-serif text-3xl font-bold text-[#5E0B10] mb-2">Customer Reviews</h2>
          <div className="flex items-center gap-3">
            <div className="flex text-[#F5BD47]">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className={`w-6 h-6 ${i < Math.floor(averageRating) ? "fill-current" : i < averageRating ? "fill-current opacity-50" : "text-gray-300"}`} />
              ))}
            </div>
            <span className="text-[#5E0B10] font-bold text-lg">{averageRating.toFixed(1)} out of 5</span>
            <span className="text-[#7A4A3B]">Based on {totalReviews} reviews</span>
          </div>
        </div>
        
        <button className="bg-gradient-to-r from-[#8A1B14] to-[#5E0B10] text-white px-6 py-3 rounded-full font-bold hover:shadow-lg hover:shadow-[#8A1B14]/20 transition-all shadow-sm">
          Write a Review
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
        {currentReviews.map((review) => (
          <div key={review.id} className="bg-white p-6 rounded-2xl border border-[#EAD7BC]/60 shadow-sm hover:shadow-md transition-shadow flex flex-col h-full">
            <div className="flex justify-between items-start mb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-[#FDF6E8] text-[#8A1B14] font-bold border border-[#EAD7BC] flex items-center justify-center">
                  {review.initial}
                </div>
                <div>
                  <h4 className="font-bold text-[#5E0B10] flex items-center gap-1.5">
                    {review.author}
                    {review.verified && <CheckCircle className="w-4 h-4 text-[#D4A017]" />}
                  </h4>
                  <span className="text-xs text-[#7A4A3B]">
                    {new Date(review.date).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}
                  </span>
                </div>
              </div>
              <div className="flex text-[#F5BD47]">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className={`w-4 h-4 ${i < review.rating ? "fill-current" : "text-gray-300"}`} />
                ))}
              </div>
            </div>
            <p className="text-[#4A352F] leading-relaxed flex-1">
              {review.content}
            </p>
          </div>
        ))}
      </div>

      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-2">
          <button 
            onClick={() => handlePageChange(currentPage - 1)} 
            disabled={currentPage === 1}
            className="w-10 h-10 rounded-full border border-[#EAD7BC] flex items-center justify-center text-[#5E0B10] hover:bg-[#FCFAF5] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          
          <div className="flex items-center gap-1">
            {[...Array(totalPages)].map((_, i) => {
              const page = i + 1;
              return (
                <button
                  key={page}
                  onClick={() => handlePageChange(page)}
                  className={`w-10 h-10 rounded-full text-sm font-bold transition-colors ${
                    currentPage === page 
                      ? "bg-[#8A1B14] text-white" 
                      : "text-[#7A4A3B] hover:bg-[#FCFAF5]"
                  }`}
                >
                  {page}
                </button>
              );
            })}
          </div>

          <button 
            onClick={() => handlePageChange(currentPage + 1)} 
            disabled={currentPage === totalPages}
            className="w-10 h-10 rounded-full border border-[#EAD7BC] flex items-center justify-center text-[#5E0B10] hover:bg-[#FCFAF5] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      )}
    </div>
  );
}
