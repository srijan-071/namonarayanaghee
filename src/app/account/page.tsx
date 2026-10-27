"use client";

import { useEffect, useState } from "react";
// Firebase dynamically imported to prevent Cloudflare 1102 errors
import AuthUpgrade from "@/components/auth/AuthUpgrade";
import { getDynamicOrderStatus } from "@/lib/orderUtils";
import { downloadInvoice } from "@/lib/invoice";
import { Package, MapPin, CreditCard, LogOut, Loader2, ArrowRight, FileDown } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";
import { Skeleton } from "@/components/ui/Skeleton";
import { useRouter } from "next/navigation";
import { formatPrice } from "@/lib/utils";

export default function AccountPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [orders, setOrders] = useState<any[]>([]);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    let unsubscribe: () => void;

    const initAuth = async () => {
      const { auth, db } = await import("@/lib/firebase");
      const { onAuthStateChanged } = await import("firebase/auth");
      const { collection, query, where, getDocs } = await import("firebase/firestore/lite");

      unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
        if (!currentUser) {
        // If no user at all, wait or maybe redirect if strictly needed, 
        // but FirebaseProvider initializes anonymous auth on load.
        setLoading(false);
        return;
      }

      setUser(currentUser);

      // Fetch user's orders using client side to avoid Cloudflare Worker CPU limits
      try {
        const q = query(
          collection(db, "orders"),
          where("userId", "==", currentUser.uid)
        );
        const querySnapshot = await getDocs(q);
        const fetchedOrders: any[] = [];
        querySnapshot.forEach((doc) => {
          fetchedOrders.push({ id: doc.id, ...doc.data() });
        });
        
        // Sort in memory to avoid needing a Firestore composite index
        fetchedOrders.sort((a, b) => {
          const timeA = a.createdAt?.seconds || 0;
          const timeB = b.createdAt?.seconds || 0;
          return timeB - timeA;
        });
        
        setOrders(fetchedOrders);
      } catch (err) {
        console.error("Failed to fetch orders", err);
      } finally {
        setLoading(false);
      }
    });
  };

    initAuth();

    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, []);

  const handleSignOut = async () => {
    const { auth } = await import("@/lib/firebase");
    const { signOut } = await import("firebase/auth");
    await signOut(auth);
    toast.success("Signed out successfully");
    router.push("/");
  };

  return (
    <div className="bg-[#FAF8F5] min-h-screen pt-32 pb-24">
      <div className="nn-container max-w-5xl">
        {loading ? (
          <div className="space-y-8">
            <div className="flex justify-between items-end mb-10">
              <div>
                <Skeleton className="h-10 w-48 mb-2" />
                <Skeleton className="h-4 w-32" />
              </div>
            </div>
            <div className="grid lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 space-y-6">
                <Skeleton className="h-8 w-40 mb-6" />
                <Skeleton className="h-32 w-full rounded-2xl" />
                <Skeleton className="h-32 w-full rounded-2xl" />
              </div>
              <div className="space-y-6">
                <Skeleton className="h-8 w-32 mb-6" />
                <Skeleton className="h-24 w-full rounded-2xl" />
                <Skeleton className="h-24 w-full rounded-2xl" />
              </div>
            </div>
          </div>
        ) : (
          <>
        <div className="flex justify-between items-end mb-10">
          <div>
            <h1 className="text-4xl font-serif text-[#5E0B10] mb-2">My Account</h1>
            <p className="text-[#4A352F]">
              {user?.isAnonymous
                ? "Guest User"
                : `Welcome back, ${user?.email || "User"}`}
            </p>
          </div>
          {!user?.isAnonymous && (
            <button
              onClick={handleSignOut}
              className="flex items-center gap-2 text-[#4A352F] hover:text-[#C99A3D] transition-colors"
            >
              <LogOut className="w-4 h-4" />
              Sign Out
            </button>
          )}
        </div>

        <AuthUpgrade user={user} />

        <div className="grid lg:grid-cols-3 gap-8">

          {/* Main Orders Column */}
          <div className="lg:col-span-2 space-y-8">
            <h2 className="text-2xl font-serif text-[#5E0B10]">Order History</h2>

            {orders.length === 0 ? (
              <div className="bg-white border border-[#EAD7BC] rounded-2xl p-8 text-center shadow-sm">
                <Package className="w-12 h-12 text-[#C99A3D]/50 mx-auto mb-4" />
                <h3 className="text-lg font-bold text-[#2A1612] mb-2">No orders yet</h3>
                <p className="text-[#4A352F] mb-6">When you place an order, it will appear here.</p>
                <Link href="/collections/all-products" className="nn-btn nn-btn-primary py-2 px-6">
                  Start Shopping
                </Link>
              </div>
            ) : (
              <div className="space-y-6">
                {orders.map((order) => {
                  const currentStatus = getDynamicOrderStatus(
                    order.createdAt,
                    order.status,
                    order.paymentStatus,
                    order.paymentMethod
                  );

                  return (
                    <div key={order.id} className="bg-white border border-[#EAD7BC] rounded-2xl overflow-hidden shadow-sm">
                      <div className="bg-[#FCFAF5] p-5 border-b border-[#EAD7BC] flex flex-wrap justify-between items-center gap-4">
                        <div>
                          <p className="text-sm text-[#4A352F] mb-1">Order #{order.orderId || order.id}</p>
                          <p className="text-xs text-[#7A4A3B]">
                            {order.createdAt?.seconds ? new Date(order.createdAt.seconds * 1000).toLocaleDateString() : "Recently"}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-bold text-[#2A1612]">{formatPrice(order.totalAmount)}</p>
                          <div className="inline-flex items-center px-2.5 py-1 mt-1 rounded-full text-xs font-semibold bg-[#C99A3D]/10 text-[#A87845]">
                            {currentStatus}
                          </div>
                        </div>
                      </div>

                      <div className="p-5">
                        <div className="space-y-4">
                          {order.items?.map((item: any, idx: number) => (
                            <div key={idx} className="flex gap-4 items-center">
                              <div className="w-16 h-16 bg-[#FDF6E8] rounded-lg overflow-hidden flex-shrink-0 relative">
                                {item.image ? (
                                  <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                                ) : (
                                  <Package className="w-6 h-6 text-[#7A4A3B] absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
                                )}
                              </div>
                              <div className="flex-1">
                                <div className="flex items-center gap-1.5 flex-wrap">
                                  {item.isGift && (
                                    <span className="bg-[#8A1B14] text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                                      FREE GIFT
                                    </span>
                                  )}
                                  <h4 className="font-bold text-[#2A1612] text-sm">{item.name}</h4>
                                </div>
                                <p className="text-[#7A4A3B] text-xs">Qty: {item.quantity}</p>
                              </div>
                              <div className="font-semibold text-sm text-[#4A352F]">
                                {item.isGift || item.price === 0 ? (
                                  <span className="text-[#D4A017] font-bold">FREE</span>
                                ) : (
                                  formatPrice(item.price * item.quantity)
                                )}
                              </div>
                            </div>
                          ))}
                        </div>

                        {/* Invoice Download */}
                        <div className="mt-4 pt-4 border-t border-[#EAD7BC] flex justify-end">
                          <button
                            onClick={() => {
                              downloadInvoice(order);
                              toast.success("Invoice opened! Use Print / Save as PDF.");
                            }}
                            className="flex items-center gap-2 text-sm font-semibold text-[#C99A3D] hover:text-[#8A1B14] transition-colors"
                          >
                            <FileDown className="w-4 h-4" />
                            Download Invoice
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <h2 className="text-2xl font-serif text-[#5E0B10]">Quick Links</h2>

            <Link href="/track-order" className="block bg-white border border-[#EAD7BC] rounded-2xl p-6 shadow-sm hover:border-[#C99A3D]/50 transition-colors group">
              <div className="flex items-center gap-4 mb-2">
                <div className="bg-[#FCFAF5] p-3 rounded-xl text-[#C99A3D]">
                  <Package className="w-5 h-5" />
                </div>
                <h3 className="font-bold text-[#2A1612] group-hover:text-[#C99A3D] transition-colors">Track an Order</h3>
              </div>
              <p className="text-sm text-[#4A352F] pl-16">Track orders using an Order ID and Email.</p>
            </Link>

            <Link href="/pages/contact" className="block bg-white border border-[#EAD7BC] rounded-2xl p-6 shadow-sm hover:border-[#C99A3D]/50 transition-colors group">
              <div className="flex items-center gap-4 mb-2">
                <div className="bg-[#FCFAF5] p-3 rounded-xl text-[#8A1B14]">
                  <MapPin className="w-5 h-5" />
                </div>
                <h3 className="font-bold text-[#2A1612] group-hover:text-[#8A1B14] transition-colors">Need Help?</h3>
              </div>
              <p className="text-sm text-[#4A352F] pl-16">Contact support regarding any issues.</p>
            </Link>

          </div>

        </div>
          </>
        )}
      </div>
    </div>
  );
}
