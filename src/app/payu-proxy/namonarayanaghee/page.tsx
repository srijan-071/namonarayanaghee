"use client";

import { useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';

function LegacyProxyForwarder() {
  const searchParams = useSearchParams();

  useEffect(() => {
    const params = new URLSearchParams(searchParams.toString());
    window.location.href = `/pay-proxy?${params.toString()}`;
  }, [searchParams]);

  return (
    <div className="fixed inset-0 z-[99999] flex flex-col items-center justify-center bg-[#FCFAF5] text-[#5E0B10]">
      <div className="w-10 h-10 border-4 border-[#EAD7BC] border-t-[#8A1B14] rounded-full animate-spin mb-4" />
      <p className="text-sm font-medium">Connecting to secure gateway...</p>
    </div>
  );
}

export default function NamoNarayanaLegacyProxyPage() {
  return (
    <Suspense fallback={
      <div className="fixed inset-0 z-[99999] flex items-center justify-center bg-[#FCFAF5] text-[#7A4A3B]">
        Loading secure checkout...
      </div>
    }>
      <LegacyProxyForwarder />
    </Suspense>
  );
}
