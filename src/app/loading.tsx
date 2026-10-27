import { Loader2 } from "lucide-react";

export default function Loading() {
  return (
    <div className="fixed inset-0 bg-white/80 backdrop-blur-sm z-50 flex flex-col items-center justify-center min-h-[50vh]">
      <Loader2 className="w-12 h-12 text-[#C38936] animate-spin mb-4" />
      <p className="text-[#5E0B10] font-serif text-lg animate-pulse">Loading Namo Narayana...</p>
    </div>
  );
}
