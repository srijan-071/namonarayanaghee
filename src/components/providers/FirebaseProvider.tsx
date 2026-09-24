"use client";

import { useEffect } from "react";
export function FirebaseProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    import("@/lib/firebase").then(({ initializeAnonymousAuth }) => {
      initializeAnonymousAuth().catch(console.error);
    });
  }, []);

  return <>{children}</>;
}
