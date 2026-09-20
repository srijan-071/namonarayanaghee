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
    <div className="bg-[#FAF8F5] min-h-screen pt-32 pb-24">
      <div className="nn-container max-w-4xl">
        
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm text-[#5C6B65] mb-8 font-medium">
          <Link href="/" className="hover:text-[#235A49] transition-colors">Home</Link>
          <ChevronRight className="w-4 h-4 opacity-50" />
          <span className="text-[#1C2B26]">{title}</span>
        </nav>

        {/* Header */}
        <header className="mb-12 border-b border-[#E3DCCC] pb-8">
          <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl text-[#1C2B26] tracking-tight mb-4">
            {title}
          </h1>
          {lastUpdated && (
            <p className="text-[#5C6B65] text-sm tracking-wide uppercase">
              Last updated: {lastUpdated}
            </p>
          )}
        </header>

        {/* Content */}
        <div className="prose prose-lg prose-headings:font-serif prose-headings:font-semibold prose-headings:text-[#1C2B26] prose-p:text-[#5C6B65] prose-p:leading-relaxed prose-a:text-[#235A49] prose-a:font-semibold hover:prose-a:text-[#1C4A3B] max-w-none prose-li:text-[#5C6B65] prose-li:marker:text-[#C38936]">
          {children}
        </div>
        
      </div>
    </div>
  );
}
