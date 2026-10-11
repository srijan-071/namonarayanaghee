"use client";

import { useEffect, useRef, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';

function ProxyForm() {
  const searchParams = useSearchParams();
  const [payuParams, setPayuParams] = useState<Record<string, string> | null>(null);
  const [error, setError] = useState<string | null>(null);
  const formRef = useRef<HTMLFormElement>(null);

  const txnid = searchParams.get('txnid');
  const amount = searchParams.get('amount');
  const productinfo = searchParams.get('productinfo');
  const firstname = searchParams.get('firstname');
  const email = searchParams.get('email');
  const phone = searchParams.get('phone');
  const udf1 = searchParams.get('udf1');

  useEffect(() => {
    if (!txnid || !amount || !productinfo || !firstname || !email) {
      setError("Missing required payment parameters");
      return;
    }

    const getHash = async () => {
      try {
        const response = await fetch('/api/payu/hash', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            txnid,
            amount,
            productinfo,
            firstname,
            email,
            phone: phone || '',
            udf1: udf1 || 'namonarayanaghee'
          })
        });

        const data = await response.json();
        
        if (data.hash && data.key) {
          setPayuParams(data);
        } else {
          setError(data.error || "Failed to generate hash");
        }
      } catch (err: any) {
        setError(err.message || "Error communicating with server");
      }
    };

    getHash();
  }, [txnid, amount, productinfo, firstname, email, phone, udf1]);

  useEffect(() => {
    if (payuParams) {
      const timer = setTimeout(() => {
        if (formRef.current) {
          formRef.current.submit();
        }
      }, 50);

      return () => clearTimeout(timer);
    }
  }, [payuParams]);

  if (error) {
    return (
      <div className="fixed inset-0 z-[99999] flex items-center justify-center bg-[#FAF9F5] p-4 font-sans text-[#1E3A24]">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 text-center border border-[#E9E5D9] flex flex-col items-center">
          <div className="w-16 h-16 bg-red-50 text-red-600 rounded-full flex items-center justify-center mb-6">
            <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <h1 className="text-xl font-serif font-bold text-[#1E3A24] mb-2">Payment Initialisation Error</h1>
          <p className="text-[#576B55] mb-6 text-sm">{error}</p>
          <button onClick={() => window.location.href = '/cart'} className="w-full py-3 px-4 bg-[#1E3A24] text-white rounded-xl font-bold shadow-lg hover:bg-[#152919] transition">
            Return to Cart
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-[99999] flex flex-col items-center justify-center bg-[#FAF9F5] p-4 font-sans text-[#1E3A24]">
      <div className="max-w-md w-full bg-white rounded-3xl shadow-xl p-8 text-center border border-[#E9E5D9] flex flex-col items-center relative overflow-hidden">
        
        {/* Top gold accent line */}
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-[#C38936]"></div>

        {/* Namo Narayana Brand Emblem */}
        <div className="mb-8 flex items-center justify-center space-x-2">
          <div className="w-12 h-12 bg-[#1E3A24] rounded-full flex items-center justify-center shadow-lg shadow-[#1E3A24]/20 border-2 border-[#C38936]">
            <span className="text-[#C38936] font-serif font-bold text-2xl" style={{marginTop: '-2px'}}>ॐ</span>
          </div>
          <span className="text-3xl font-serif font-bold text-[#1E3A24]">
            Namo <span className="text-[#C38936]">Narayana</span>
          </span>
        </div>

        {/* Animated Loader */}
        <div className="relative w-16 h-16 mb-6">
          <div className="absolute inset-0 border-4 border-[#E9E5D9] rounded-full"></div>
          <div className="absolute inset-0 border-4 border-[#1E3A24] rounded-full border-t-transparent animate-spin"></div>
        </div>

        <h1 className="text-xl font-serif font-bold text-[#1E3A24] mb-3">
          Connecting to Secure Gateway
        </h1>
        
        <div className="bg-[#FAF9F5] border border-[#E9E5D9] rounded-xl p-4 mb-6 text-left">
          <p className="text-[#364935] text-xs leading-relaxed text-center">
            You are being securely directed to the official <strong>PayU payment portal</strong> to complete your order.
          </p>
        </div>
        
        <div className="w-full bg-[#1E3A24]/5 border border-[#1E3A24]/20 text-[#1E3A24] text-xs py-2 px-3 rounded-lg font-medium">
          Please do not refresh or close this window
        </div>

        {/* Footer security mark */}
        <div className="mt-8 pt-6 border-t border-[#E9E5D9] w-full">
          <p className="text-[11px] text-[#576B55] font-medium flex justify-center items-center gap-1.5">
            <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm3.88-11.71L10 14.17l-1.88-1.88a.996.996 0 10-1.41 1.41l2.59 2.59c.39.39 1.02.39 1.41 0L17.3 9.7a.996.996 0 10-1.42-1.41z"/>
            </svg>
            256-bit Bank Grade Encrypted Gateway
          </p>
        </div>

        {payuParams && (
          <form ref={formRef} action={payuParams.action || "https://secure.payu.in/_payment"} method="POST" className="hidden">
            {Object.entries(payuParams).map(([name, val]) => (
              name !== "action" && <input key={name} type="hidden" name={name} value={String(val ?? '')} />
            ))}
          </form>
        )}
      </div>
    </div>
  );
}

export default function NamoNarayanaProxyPage() {
  return (
    <Suspense fallback={
      <div className="fixed inset-0 z-[99999] flex items-center justify-center bg-[#FAF9F5] text-[#576B55]">
        Loading secure checkout...
      </div>
    }>
      <ProxyForm />
    </Suspense>
  );
}
