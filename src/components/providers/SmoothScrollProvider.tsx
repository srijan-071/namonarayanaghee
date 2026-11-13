"use client";

export function SmoothScrollProvider({ children }: { children: React.ReactNode }) {
  // Let native browser scrolling handle inertia and gesture navigation cleanly
  return <>{children}</>;
}
