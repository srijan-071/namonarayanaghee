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
    <div id="product-reviews-section" className="py-12 border-t border-[#E9E5D9] mt-12 scroll-mt-24">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-6">
        <div>
          <h2 className="font-serif text-3xl font-bold text-[#1E3A24] mb-2">Customer Reviews</h2>
          <div className="flex items-center gap-3">
            <div className="flex text-[#F5B301]">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className={`w-6 h-6 ${i < Math.floor(averageRating) ? "fill-current" : i < averageRating ? "fill-current opacity-50" : "text-gray-300"}`} />
              ))}
            </div>
            <span className="text-[#1E3A24] font-bold text-lg">{averageRating.toFixed(1)} out of 5</span>
            <span className="text-[#576B55]">Based on {totalReviews} reviews</span>
          </div>
        </div>
        
        <button className="bg-[#1E3A24] text-white px-6 py-3 rounded-full font-bold hover:bg-[#152919] transition-colors shadow-sm">
          Write a Review
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
        {currentReviews.map((review) => (
          <div key={review.id} className="bg-white p-6 rounded-2xl border border-[#E9DFD1] shadow-sm hover:shadow-md transition-shadow flex flex-col h-full">
            <div className="flex justify-between items-start mb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-[#E9E5D9] text-[#1E3A24] font-bold flex items-center justify-center">
                  {review.initial}
                </div>
                <div>
                  <h4 className="font-bold text-[#1E3A24] flex items-center gap-1.5">
                    {review.author}
                    {review.verified && <CheckCircle className="w-4 h-4 text-green-600" />}
                  </h4>
                  <span className="text-xs text-[#576B55]">
                    {new Date(review.date).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}
                  </span>
                </div>
              </div>
              <div className="flex text-[#F5B301]">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className={`w-4 h-4 ${i < review.rating ? "fill-current" : "text-gray-300"}`} />
                ))}
              </div>
            </div>
            <p className="text-[#364935] leading-relaxed flex-1">
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
            className="w-10 h-10 rounded-full border border-[#D5D8D0] flex items-center justify-center text-[#1E3A24] hover:bg-[#FAF9F5] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
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
                      ? "bg-[#1E3A24] text-white" 
                      : "text-[#576B55] hover:bg-[#FAF9F5]"
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
            className="w-10 h-10 rounded-full border border-[#D5D8D0] flex items-center justify-center text-[#1E3A24] hover:bg-[#FAF9F5] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      )}
    </div>
  );
}
