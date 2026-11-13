import React from "react";
import { ChevronRight } from "lucide-react";
import Link from "next/link";

interface PolicyLayoutProps {
  title: string;
  lastUpdated?: string;
  children: React.ReactNode;
}

export default function PolicyLayout({ title, lastUpdated, children }: PolicyLayoutProps) {
  return (
    <div className="bg-[#FCFAF5] min-h-screen pt-32 pb-24">
      <div className="nn-container max-w-4xl">
        
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm text-[#727B75] mb-8 font-medium">
          <Link href="/" className="hover:text-[#075B43] transition-colors">Home</Link>
          <ChevronRight className="w-4 h-4 opacity-50" />
          <span className="text-[#17231E]">{title}</span>
        </nav>

        {/* Header */}
        <header className="mb-12 border-b border-[#EAE7DF] pb-8">
          <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl text-[#17231E] tracking-tight mb-4">
            {title}
          </h1>
          {lastUpdated && (
            <p className="text-[#727B75] text-sm tracking-wide uppercase">
              Last updated: {lastUpdated}
            </p>
          )}
        </header>

        {/* Content */}
        <div className="prose prose-lg prose-headings:font-serif prose-headings:font-semibold prose-headings:text-[#17231E] prose-p:text-[#727B75] prose-p:leading-relaxed prose-a:text-[#075B43] prose-a:font-semibold hover:prose-a:text-[#064635] max-w-none prose-li:text-[#727B75] prose-li:marker:text-[#075B43]">
          {children}
        </div>
        
      </div>
    </div>
  );
}
