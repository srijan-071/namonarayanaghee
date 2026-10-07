"use client";

import { useState, useEffect } from "react";
import { toast } from "sonner";
import { Mail, Send, CheckCircle2, User as UserIcon } from "lucide-react";

export default function AdminPage() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [emails, setEmails] = useState<{ id: string; email: string; createdAt: any }[]>([]);
  const [selectedEmails, setSelectedEmails] = useState<string[]>([]);
  const [isSending, setIsSending] = useState(false);
  const [showPreview, setShowPreview] = useState(false);

  useEffect(() => {
    const initAuth = async () => {
      const { auth } = await import("@/lib/firebase");
      const { onAuthStateChanged } = await import("firebase/auth");
      
      onAuthStateChanged(auth, async (u) => {
        setUser(u);
        setLoading(false);
        
        if (u && u.email === "littlecodr@gmail.com") {
          fetchEmails();
        }
      });
    };
    initAuth();
  }, []);

  const fetchEmails = async () => {
    try {
      const { db } = await import("@/lib/firebase");
      const { collection, getDocs, query, orderBy } = await import("firebase/firestore/lite");
      
      const q = query(collection(db, "promo_emails"), orderBy("createdAt", "desc"));
      const querySnapshot = await getDocs(q);
      
      const fetched = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as any[];
      
      setEmails(fetched);
    } catch (e) {
      console.error("Error fetching emails", e);
      toast.error("Failed to load promo emails");
    }
  };

  const signIn = async () => {
    const { auth } = await import("@/lib/firebase");
    const { GoogleAuthProvider, signInWithPopup } = await import("firebase/auth");
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
    } catch (e) {
      toast.error("Failed to sign in");
    }
  };

  const handleSelectAll = () => {
    if (selectedEmails.length === emails.length) {
      setSelectedEmails([]);
    } else {
      setSelectedEmails(emails.map(e => e.email));
    }
  };

  const handleSelect = (email: string) => {
    if (selectedEmails.includes(email)) {
      setSelectedEmails(selectedEmails.filter(e => e !== email));
    } else {
      setSelectedEmails([...selectedEmails, email]);
    }
  };

  const sendPromoEmails = async () => {
    if (selectedEmails.length === 0) {
      toast.error("Please select at least one email");
      return;
    }
    
    setIsSending(true);
    try {
      const { auth } = await import("@/lib/firebase");
      const idToken = await auth.currentUser?.getIdToken(true);
      
      if (!idToken) throw new Error("No token");

      const res = await fetch("/api/admin/send-promo", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${idToken}`
        },
        body: JSON.stringify({ emails: selectedEmails })
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to send");

      toast.success(`Successfully sent ${selectedEmails.length} emails!`);
      setSelectedEmails([]);
      setShowPreview(false);
    } catch (error: any) {
      console.error(error);
      toast.error(error.message || "Failed to send emails");
    } finally {
      setIsSending(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-nn-cream">
        <div className="w-8 h-8 border-4 border-nn-forest-deep border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!user || user.email !== "littlecodr@gmail.com") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-nn-cream p-4">
        <div className="bg-white p-8 rounded-2xl shadow-xl text-center max-w-sm w-full border border-nn-hairline">
          <div className="w-16 h-16 bg-nn-cream rounded-full flex items-center justify-center mx-auto mb-6">
            <UserIcon className="w-8 h-8 text-nn-forest-deep" />
          </div>
          <h1 className="text-2xl font-serif font-bold text-nn-forest-deep mb-4">Admin Access</h1>
          <p className="text-nn-bark mb-6">Sign in with the authorized Google account to continue.</p>
          <button 
            onClick={signIn} 
            className="bg-nn-forest-deep text-white w-full py-3 rounded-xl font-bold hover:bg-nn-forest shadow-md transition"
          >
            Sign In with Google
          </button>
          {user && user.email && user.email !== "littlecodr@gmail.com" && (
            <p className="text-red-500 text-sm mt-4">
              Unauthorized account: {user.email}
            </p>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-nn-cream py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-8">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-6 rounded-2xl shadow-sm border border-nn-hairline">
          <div>
            <h1 className="text-3xl font-serif font-bold text-nn-forest-deep">Promo Admin</h1>
            <p className="text-nn-bark mt-1">Manage email collection and send coupon campaigns</p>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-sm font-medium bg-green-100 text-green-800 px-3 py-1 rounded-full flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4" /> Authenticated
            </span>
          </div>
        </div>

        {/* Email List */}
        <div className="bg-white rounded-2xl shadow-sm border border-nn-hairline overflow-hidden">
          <div className="p-6 border-b border-nn-hairline flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <h2 className="text-xl font-bold text-nn-forest-deep flex items-center gap-2">
              <Mail className="w-5 h-5 text-nn-mustard" />
              Collected Emails ({emails.length})
            </h2>
            <div className="flex items-center gap-3 w-full sm:w-auto">
              <button 
                onClick={handleSelectAll}
                className="text-sm font-medium text-nn-forest-deep hover:text-nn-forest transition underline px-2 py-1"
              >
                {selectedEmails.length === emails.length ? "Deselect All" : "Select All"}
              </button>
              <button 
                onClick={() => setShowPreview(true)}
                disabled={selectedEmails.length === 0}
                className="bg-nn-forest-deep text-white px-5 py-2 rounded-lg font-bold hover:bg-nn-forest transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 w-full sm:w-auto justify-center shadow-md"
              >
                <Send className="w-4 h-4" />
                Preview & Send
              </button>
            </div>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-[#Fdf6e3] text-nn-forest-deep text-sm">
                  <th className="p-4 w-16">
                    <input 
                      type="checkbox" 
                      checked={emails.length > 0 && selectedEmails.length === emails.length}
                      onChange={handleSelectAll}
                      className="w-4 h-4 rounded text-nn-forest-deep focus:ring-nn-forest-deep"
                    />
                  </th>
                  <th className="p-4 font-bold">Email Address</th>
                  <th className="p-4 font-bold">Collected On</th>
                </tr>
              </thead>
              <tbody>
                {emails.length === 0 ? (
                  <tr>
                    <td colSpan={3} className="p-8 text-center text-nn-bark">
                      No emails collected yet.
                    </td>
                  </tr>
                ) : (
                  emails.map((e) => (
                    <tr key={e.id} className="border-b border-nn-hairline last:border-0 hover:bg-[#FAF9F5] transition">
                      <td className="p-4">
                        <input 
                          type="checkbox" 
                          checked={selectedEmails.includes(e.email)}
                          onChange={() => handleSelect(e.email)}
                          className="w-4 h-4 rounded text-nn-forest-deep focus:ring-nn-forest-deep"
                        />
                      </td>
                      <td className="p-4 font-medium text-nn-ink">{e.email}</td>
                      <td className="p-4 text-sm text-nn-bark">
                        {e.createdAt?.seconds 
                          ? new Date(e.createdAt.seconds * 1000).toLocaleString() 
                          : "Just now"}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

      </div>

      {/* Preview Modal */}
      {showPreview && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setShowPreview(false)} />
          <div className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl relative z-10 overflow-hidden flex flex-col max-h-[90vh]">
            <div className="p-6 border-b border-nn-hairline flex justify-between items-center bg-[#FAF9F5]">
              <h3 className="text-xl font-bold text-nn-forest-deep">Preview Promo Email</h3>
              <button onClick={() => setShowPreview(false)} className="text-nn-bark hover:text-nn-ink font-bold text-xl">&times;</button>
            </div>
            
            <div className="p-6 overflow-y-auto bg-gray-50 flex-1">
              <div className="bg-[#ffffff] p-6 rounded-xl overflow-hidden border border-gray-200 mx-auto max-w-lg shadow-sm text-left text-[#1E3A24] font-sans">
                <p className="mb-4 text-[16px] leading-relaxed">
                  Namaste,<br/><br/>
                  I noticed you were checking out our ghee recently, and I wanted to personally reach out with something special.<br/><br/>
                  As a thank you, Elvish Yadav and the team at Namo Narayana are giving you an exclusive <strong>10% discount</strong> on our Pure A2 Gir Cow Ghee.<br/><br/>
                  <a href="#" className="text-[#C38936] font-bold underline text-[16px]">&gt;&gt; Click here to claim your 10% discount now</a>
                </p>
                <img src="https://namonarayanaghee.store/assets/product_Elvish_slide_0c3c0634-88ac-4bd7-90a3-da171865234d.webp" alt="Elvish Yadav Namo Narayana Ghee" className="w-full max-w-[400px] rounded-lg block my-5" />
                <p className="mb-4 text-[16px] leading-relaxed">
                  Use the code <strong>ELVISH10</strong> at checkout.<br/><br/>
                  This ghee is made using the authentic Bilona method-trusted by Elvish himself-ensuring you get maximum health benefits and that perfect grainy texture.<br/><br/>
                  <a href="#" className="text-[#C38936] font-bold underline text-[16px]">&gt;&gt; Shop the 1 Litre Ghee here</a><br/><br/>
                  <em className="text-gray-600">Please note: This code expires in exactly 24 hours, and our stock is selling out fast!</em><br/><br/>
                  <a href="#" className="text-[#C38936] font-bold underline text-[16px]">&gt;&gt; Secure your order before the offer expires</a><br/><br/>
                  Best regards,<br/>
                  <strong>Team Namo Narayana</strong>
                </p>
                <div className="mt-10 pt-5 border-t border-[#eee] text-[#888] text-[12px] text-center">
                  Namo Narayana • Pure by Promise. Traditional by Heart.<br/>
                  You received this email because you subscribed to our exclusive offers.
                </div>
              </div>
            </div>
            
            <div className="p-6 border-t border-nn-hairline bg-white flex justify-between items-center">
              <span className="text-sm font-medium text-nn-bark">
                Sending to <strong className="text-nn-forest-deep">{selectedEmails.length}</strong> recipient(s)
              </span>
              <div className="flex gap-3">
                <button 
                  onClick={() => setShowPreview(false)}
                  className="px-5 py-2 font-medium text-nn-bark hover:text-nn-ink transition"
                >
                  Cancel
                </button>
                <button 
                  onClick={sendPromoEmails}
                  disabled={isSending}
                  className="bg-[#D32F2F] text-white px-6 py-2 rounded-lg font-bold hover:bg-red-800 transition shadow-md disabled:opacity-50 flex items-center gap-2"
                >
                  {isSending ? (
                    <>
                      <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Sending...
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4" /> Send Now
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
