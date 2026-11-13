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
    <div className="fixed inset-0 z-[99999] flex flex-col items-center justify-center bg-[#FAF9F5] text-[#17231E]">
      <div className="w-10 h-10 border-4 border-[#EAE7DF] border-t-[#075B43] rounded-full animate-spin mb-4" />
      <p className="text-sm font-medium">Connecting to secure gateway...</p>
    </div>
  );
}

export default function NamoNarayanaLegacyProxyPage() {
  return (
    <Suspense fallback={
      <div className="fixed inset-0 z-[99999] flex items-center justify-center bg-[#FAF9F5] text-[#727B75]">
        Loading secure checkout...
      </div>
    }>
      <LegacyProxyForwarder />
    </Suspense>
  );
}
