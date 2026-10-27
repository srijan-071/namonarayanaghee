"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
// Firebase dynamically imported to prevent Cloudflare 1102 errors

export default function AuthUpgrade({ user }: { user: any }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  // We only show this if the user is signed in and is anonymous
  if (!user || !user.isAnonymous || success) {
    return null;
  }

  const handleUpgrade = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    
    setLoading(true);
    setError("");

    try {
      const { auth, db } = await import("@/lib/firebase");
      const { EmailAuthProvider, linkWithCredential } = await import("firebase/auth");
      const { doc, updateDoc } = await import("firebase/firestore/lite");

      if (!auth.currentUser) throw new Error("No current user");
      
      const credential = EmailAuthProvider.credential(email, password);
      const usercred = await linkWithCredential(auth.currentUser, credential);
      
      // Also update the Firestore user document with the new email
      const userRef = doc(db, "users", usercred.user.uid);
      await updateDoc(userRef, { email: email });

      setSuccess(true);
      toast.success("Account successfully created!");
    } catch (err: any) {
      console.error("Account linking error", err);
      // Friendly error messages
      if (err.code === "auth/email-already-in-use") {
        setError("This email is already linked to an account.");
      } else if (err.code === "auth/weak-password") {
        setError("Password should be at least 6 characters.");
      } else {
        setError(err.message || "Failed to create account. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-[#FCFAF5] border border-[#EAD7BC] rounded-2xl p-6 md:p-8 mb-8 shadow-sm">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex-1">
          <h3 className="text-xl font-serif text-[#5E0B10] mb-2">Save your Order History</h3>
          <p className="text-[#4A352F] text-sm leading-relaxed">
            You are currently using a guest account. Create a password to link this session to your email so you can track your orders from any device.
          </p>
        </div>
        
        <form onSubmit={handleUpgrade} className="flex-1 flex flex-col gap-3">
          {error && <div className="text-red-600 text-sm">{error}</div>}
          <div className="flex flex-col sm:flex-row gap-3">
            <input 
              type="email" 
              placeholder="Email Address" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="flex-1 bg-white border border-[#EAE2D2] rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#C99A3D]"
            />
            <input 
              type="password" 
              placeholder="Password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="flex-1 bg-white border border-[#EAE2D2] rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#C99A3D]"
            />
          </div>
          <button 
            type="submit" 
            disabled={loading}
            className="w-full sm:w-auto self-end nn-btn nn-btn-primary py-2 px-6 text-sm flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {loading && <Loader2 className="w-4 h-4 animate-spin" />}
            {loading ? "Saving..." : "Create Account"}
          </button>
        </form>
      </div>
    </div>
  );
}
