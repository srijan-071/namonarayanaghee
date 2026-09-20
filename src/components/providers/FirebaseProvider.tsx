"use client";

import { useEffect } from "react";
import { initializeAnonymousAuth } from "@/lib/firebase";

export function FirebaseProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    // Initialize anonymous authentication on app load
    initializeAnonymousAuth().catch(console.error);
  }, []);

  return <>{children}</>;
}
