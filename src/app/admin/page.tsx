"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
import { toast } from "sonner";
import {
  Mail,
  Send,
  CheckCircle2,
  User as UserIcon,
  LogOut,
  TrendingUp,
  Package,
  IndianRupee,
  CreditCard,
  Truck,
  Clock,
  AlertCircle,
  Search,
  Filter,
  Download,
  Eye,
  X,
  Copy,
  ExternalLink,
  Phone,
  MapPin,
  Calendar,
  RefreshCw,
  Gift,
  ShoppingBag,
  Sparkles,
  Printer,
  ChevronRight,
  ShieldAlert,
  ShieldCheck,
  Check,
} from "lucide-react";

// Whitelisted Administrator Email
const ADMIN_EMAIL = "littlecodr@gmail.com";

// Helper: Extract valid JS Date from order
function getOrderDate(order: any): Date {
  if (order.createdAt) {
    if (typeof order.createdAt.toDate === "function") return order.createdAt.toDate();
    if (order.createdAt.seconds) return new Date(order.createdAt.seconds * 1000);
    if (typeof order.createdAt === "string") return new Date(order.createdAt);
  }
  if (order.paymentDetails?.paidAt) return new Date(order.paymentDetails.paidAt);
  return new Date(0);
}

// Helper: Format amount in Rupees
function getOrderAmounts(order: any) {
  const rawTotal = Number(order.totalAmount || order.amountToPay || 0);
  const rawSubtotal = Number(order.subtotal || rawTotal);
  const rawDiscount = Number(order.discount || 0);

  // Amounts >= 100 in our Firestore are in Paise (e.g. 94900 -> ₹949.00)
  const isPaise = rawTotal >= 100;
  const total = isPaise ? rawTotal / 100 : rawTotal;
  const subtotal = isPaise ? rawSubtotal / 100 : rawSubtotal;
  const discount = isPaise ? rawDiscount / 100 : rawDiscount;

  return { total, subtotal, discount, rawTotal };
}

// Helper: Check if order is an admin test order
function isTestOrder(order: any): boolean {
  const email = (order.contactInfo?.email || order.shippingAddress?.email || "").toLowerCase();
  const name = (order.shippingAddress?.name || "").toLowerCase();
  const amounts = getOrderAmounts(order);

  if (email === ADMIN_EMAIL.toLowerCase()) return true;
  if (order.paymentDetails?.is_admin_test === "true") return true;
  if (amounts.total <= 1 && (name.includes("mayank") || name.includes("bhuv") || email.includes("littlecodr"))) {
    return true;
  }
  return false;
}

export default function AdminPage() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"sales" | "promo">("sales");

  // Orders State
  const [orders, setOrders] = useState<any[]>([]);
  const [isLoadingOrders, setIsLoadingOrders] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  // Filters State
  const [timeFilter, setTimeFilter] = useState<"all" | "today" | "yesterday" | "27_28" | "7days" | "30days">("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [excludeAdminTests, setExcludeAdminTests] = useState(true);

  // Drawer / Details Modal State
  const [selectedOrder, setSelectedOrder] = useState<any | null>(null);
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);
  const [editStatus, setEditStatus] = useState("");
  const [editCourier, setEditCourier] = useState("");
  const [editTracking, setEditTracking] = useState("");
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  // Promo Mailer State (Retained from existing tool)
  const [emails, setEmails] = useState<{ id: string; email: string; createdAt: any }[]>([]);
  const [selectedEmails, setSelectedEmails] = useState<string[]>([]);
  const [isSending, setIsSending] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [subject, setSubject] = useState("A quick note from Namo Narayana");

  // Fetch all orders from Firestore
  const fetchOrders = useCallback(async () => {
    setIsLoadingOrders(true);
    try {
      const { db } = await import("@/lib/firebase");
      const { collection, getDocs } = await import("firebase/firestore/lite");

      const snap = await getDocs(collection(db, "orders"));
      const docs = snap.docs.map((d) => {
        const data = d.data();
        return {
          id: d.id,
          orderId: data.orderId || d.id,
          ...data,
        };
      });

      // Sort by creation date descending
      docs.sort((a, b) => {
        const dateA = getOrderDate(a).getTime();
        const dateB = getOrderDate(b).getTime();
        return dateB - dateA;
      });

      setOrders(docs);
      setLastUpdated(new Date());
    } catch (e: any) {
      console.error("Error fetching orders:", e);
      toast.error("Failed to load orders from Firestore");
    } finally {
      setIsLoadingOrders(false);
    }
  }, []);

  // Fetch collected promo emails
  const fetchEmails = useCallback(async () => {
    try {
      const { db } = await import("@/lib/firebase");
      const { collection, getDocs, query, orderBy } = await import("firebase/firestore/lite");

      const q = query(collection(db, "promo_emails"), orderBy("createdAt", "desc"));
      const querySnapshot = await getDocs(q);

      const fetched = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as any[];

      setEmails(fetched);
    } catch (e) {
      console.error("Error fetching emails", e);
    }
  }, []);

  // Sign In with Google
  const signIn = async () => {
    const { auth } = await import("@/lib/firebase");
    const { GoogleAuthProvider, signInWithPopup } = await import("firebase/auth");
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
      toast.success("Signed in successfully");
    } catch (e: any) {
      console.error(e);
      toast.error("Failed to sign in: " + (e?.message || "Check popup settings"));
    }
  };

  // Sign Out
  const signOut = async () => {
    const { auth } = await import("@/lib/firebase");
    const { signOut: fbSignOut } = await import("firebase/auth");
    await fbSignOut(auth);
    setUser(null);
    setSelectedOrder(null);
    toast.success("Signed out");
  };

  // Copy helper with visual confirmation
  const copyToClipboard = (text: string, key: string, label = "Copied to clipboard!") => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    toast.success(label);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  // Initialize Auth
  useEffect(() => {
    const initAuth = async () => {
      const { auth } = await import("@/lib/firebase");
      const { onAuthStateChanged } = await import("firebase/auth");

      onAuthStateChanged(auth, async (u) => {
        setUser(u);
        setLoading(false);

        if (u && u.email?.toLowerCase() === ADMIN_EMAIL.toLowerCase()) {
          fetchOrders();
          fetchEmails();
        }
      });
    };
    initAuth();
  }, [fetchOrders, fetchEmails]);

  // Filtered Orders Calculation
  const filteredOrders = useMemo(() => {
    const now = new Date();

    return orders.filter((order) => {
      // 1. Exclude test orders toggle
      if (excludeAdminTests && isTestOrder(order)) {
        return false;
      }

      const orderDate = getOrderDate(order);
      // Format in IST YYYY-MM-DD
      const istDateStr = orderDate.toLocaleDateString("en-CA", { timeZone: "Asia/Kolkata" });

      // 2. Time Filter
      if (timeFilter === "today") {
        const todayIst = now.toLocaleDateString("en-CA", { timeZone: "Asia/Kolkata" });
        if (istDateStr !== todayIst) return false;
      } else if (timeFilter === "yesterday") {
        const yesterday = new Date(now.getTime() - 86400 * 1000);
        const yestIst = yesterday.toLocaleDateString("en-CA", { timeZone: "Asia/Kolkata" });
        if (istDateStr !== yestIst) return false;
      } else if (timeFilter === "27_28") {
        if (istDateStr !== "2026-10-27" && istDateStr !== "2026-10-28") return false;
      } else if (timeFilter === "7days") {
        const diffDays = (now.getTime() - orderDate.getTime()) / (1000 * 3600 * 24);
        if (diffDays > 7) return false;
      } else if (timeFilter === "30days") {
        const diffDays = (now.getTime() - orderDate.getTime()) / (1000 * 3600 * 24);
        if (diffDays > 30) return false;
      }

      // 3. Status Filter
      const pStatus = (order.paymentStatus || "").toLowerCase();
      const sStatus = (order.status || "").toLowerCase();
      const pMethod = (order.paymentMethod || "").toLowerCase();

      if (statusFilter === "paid") {
        if (pStatus !== "paid" && sStatus !== "paid" && sStatus !== "processing") return false;
      } else if (statusFilter === "shipped") {
        if (sStatus !== "shipped" && order.shippingStatus !== "shipped") return false;
      } else if (statusFilter === "pending") {
        if (pStatus === "paid" || sStatus === "shipped" || sStatus === "paid") return false;
      } else if (statusFilter === "cod") {
        if (pMethod !== "cod") return false;
      }

      // 4. Search Query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const idMatch = (order.id || "").toLowerCase().includes(q) || (order.orderId || "").toLowerCase().includes(q);
        const nameMatch = (order.shippingAddress?.name || "").toLowerCase().includes(q);
        const emailMatch = (order.contactInfo?.email || "").toLowerCase().includes(q);
        const phoneMatch = (order.contactInfo?.phone || "").toLowerCase().includes(q);
        const cityMatch = (order.shippingAddress?.city || "").toLowerCase().includes(q);
        const stateMatch = (order.shippingAddress?.state || "").toLowerCase().includes(q);
        const paymentIdMatch = (
          order.paymentSessionId ||
          order.paymentDetails?.razorpay_payment_id ||
          ""
        ).toLowerCase().includes(q);
        const itemMatch = (order.items || []).some((i: any) => (i.name || i.title || "").toLowerCase().includes(q));

        if (!idMatch && !nameMatch && !emailMatch && !phoneMatch && !cityMatch && !stateMatch && !paymentIdMatch && !itemMatch) {
          return false;
        }
      }

      return true;
    });
  }, [orders, timeFilter, statusFilter, searchQuery, excludeAdminTests]);

  // Aggregate Sales KPIs
  const analytics = useMemo(() => {
    let totalRevenue = 0;
    let paidOrdersCount = 0;
    let shippedOrdersCount = 0;
    let pendingOrdersCount = 0;
    let prepaidCount = 0;
    let codCount = 0;
    let totalLitres = 0;
    let totalFreeGifts = 0;

    // Daily revenue distribution map
    const dailyMap: Record<string, { revenue: number; count: number; date: string }> = {};

    // Product breakdown map
    const productMap: Record<string, { units: number; revenue: number }> = {};

    // State breakdown map
    const stateMap: Record<string, number> = {};

    filteredOrders.forEach((order) => {
      const { total } = getOrderAmounts(order);
      const isPaid =
        order.paymentStatus === "paid" ||
        order.status === "paid" ||
        order.status === "processing" ||
        order.status === "shipped";

      if (isPaid) {
        totalRevenue += total;
        paidOrdersCount++;

        if (order.paymentMethod === "cod") {
          codCount++;
        } else {
          prepaidCount++;
        }

        // Daily grouping
        const dateObj = getOrderDate(order);
        const dayKey = dateObj.toLocaleDateString("en-IN", {
          day: "numeric",
          month: "short",
          timeZone: "Asia/Kolkata",
        });
        if (!dailyMap[dayKey]) {
          dailyMap[dayKey] = { revenue: 0, count: 0, date: dayKey };
        }
        dailyMap[dayKey].revenue += total;
        dailyMap[dayKey].count++;

        // Product volume & units
        (order.items || []).forEach((item: any) => {
          if (item.isGift) return;
          const title = item.name || item.title || "Ghee";
          const qty = Number(item.quantity || 1);
          const price = Number(item.price || 0) / 100;

          // Estimate volume
          const titleLower = (title + " " + (item.variantTitle || "")).toLowerCase();
          if (titleLower.includes("5 litre") || titleLower.includes("5l")) {
            totalLitres += 5 * qty;
          } else if (titleLower.includes("2.5 litre") || titleLower.includes("2.5l")) {
            totalLitres += 2.5 * qty;
          } else if (titleLower.includes("1 litre") || titleLower.includes("1l")) {
            totalLitres += 1 * qty;
          } else if (titleLower.includes("500 ml") || titleLower.includes("500ml")) {
            totalLitres += 0.5 * qty;
          }

          const key = item.variantTitle ? `${item.variantTitle}` : title;
          if (!productMap[key]) {
            productMap[key] = { units: 0, revenue: 0 };
          }
          productMap[key].units += qty;
          productMap[key].revenue += price * qty;
        });

        // Free Gifts tally
        const giftsCount = (order.freeGifts || []).reduce((acc: number, g: any) => acc + (Number(g.quantity) || 1), 0);
        totalFreeGifts += giftsCount;

        // State tally
        const state = order.shippingAddress?.state || "Other";
        stateMap[state] = (stateMap[state] || 0) + 1;
      } else {
        pendingOrdersCount++;
      }

      if (order.status === "shipped" || order.shippingStatus === "shipped") {
        shippedOrdersCount++;
      }
    });

    const aov = paidOrdersCount > 0 ? Math.round(totalRevenue / paidOrdersCount) : 0;
    const prepaidPercent = paidOrdersCount > 0 ? Math.round((prepaidCount / paidOrdersCount) * 100) : 100;

    // Daily sorted array
    const dailyChart = Object.values(dailyMap);

    // Top products sorted
    const topProducts = Object.entries(productMap)
      .map(([name, data]) => ({ name, ...data }))
      .sort((a, b) => b.units - a.units);

    // Top states sorted
    const topStates = Object.entries(stateMap)
      .map(([state, count]) => ({ state, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);

    return {
      totalRevenue,
      totalOrders: filteredOrders.length,
      paidOrdersCount,
      shippedOrdersCount,
      pendingOrdersCount,
      aov,
      totalLitres,
      totalFreeGifts,
      prepaidPercent,
      prepaidCount,
      codCount,
      dailyChart,
      topProducts,
      topStates,
    };
  }, [filteredOrders]);

  // Open Details Modal & populate edit inputs
  const openOrderDetails = (order: any) => {
    setSelectedOrder(order);
    setEditStatus(order.status || "processing");
    setEditCourier(order.courierPartner || "Delhivery Express");
    setEditTracking(order.trackingNumber || order.awbNumber || "");
  };

  // Update Order Status in Firestore
  const handleUpdateOrderStatus = async () => {
    if (!selectedOrder) return;
    setIsUpdatingStatus(true);
    try {
      const { db } = await import("@/lib/firebase");
      const { doc, updateDoc } = await import("firebase/firestore/lite");

      const updatePayload: Record<string, any> = {
        status: editStatus,
        shippingStatus: editStatus,
        updatedAt: new Date().toISOString(),
      };

      if (editTracking.trim()) {
        updatePayload.trackingNumber = editTracking.trim();
        updatePayload.awbNumber = editTracking.trim();
      }
      if (editCourier.trim()) {
        updatePayload.courierPartner = editCourier.trim();
      }

      await updateDoc(doc(db, "orders", selectedOrder.id), updatePayload);

      toast.success(`Order #${selectedOrder.id} status updated to ${editStatus}!`);

      // Update local state
      setOrders((prev) =>
        prev.map((o) => (o.id === selectedOrder.id ? { ...o, ...updatePayload } : o))
      );
      setSelectedOrder((prev: any) => ({ ...prev, ...updatePayload }));
    } catch (e: any) {
      console.error("Failed to update status:", e);
      toast.error("Failed to update Firestore: " + e.message);
    } finally {
      setIsUpdatingStatus(false);
    }
  };

  // Export Filtered Orders to CSV
  const exportToCSV = () => {
    if (filteredOrders.length === 0) {
      toast.error("No orders to export in current filter");
      return;
    }

    const headers = [
      "Order ID",
      "Order Status",
      "Payment Status",
      "Payment Method",
      "Customer Name",
      "Customer Email",
      "Customer Phone",
      "Address Line",
      "City",
      "State",
      "Pincode",
      "Country",
      "Purchased Items",
      "Free Gifts",
      "Total Amount (INR)",
      "Discount (INR)",
      "Payment ID",
      "Created At (IST)",
    ];

    const rows = filteredOrders.map((o) => {
      const amounts = getOrderAmounts(o);
      const itemsStr = (o.items || [])
        .map((it: any) => `${it.quantity}x ${it.name || it.title} (${it.variantTitle || ""})`)
        .join("; ");
      const giftsStr = (o.freeGifts || [])
        .map((g: any) => `${g.quantity}x ${g.name} (${g.size || g.variant || ""})`)
        .join("; ");
      const dateStr = getOrderDate(o).toLocaleString("en-IN", { timeZone: "Asia/Kolkata" });
      const payId = o.paymentSessionId || o.paymentDetails?.razorpay_payment_id || "N/A";

      return [
        `#${o.orderId || o.id}`,
        o.status || "processing",
        o.paymentStatus || "pending",
        o.paymentMethod || "prepaid",
        `"${(o.shippingAddress?.name || "").replace(/"/g, '""')}"`,
        `"${(o.contactInfo?.email || "").replace(/"/g, '""')}"`,
        `"${(o.contactInfo?.phone || "").replace(/"/g, '""')}"`,
        `"${(o.shippingAddress?.address || "").replace(/"/g, '""')}"`,
        `"${(o.shippingAddress?.city || "").replace(/"/g, '""')}"`,
        `"${(o.shippingAddress?.state || "").replace(/"/g, '""')}"`,
        `"${(o.shippingAddress?.pincode || "").replace(/"/g, '""')}"`,
        `"${(o.shippingAddress?.country || "India").replace(/"/g, '""')}"`,
        `"${itemsStr.replace(/"/g, '""')}"`,
        `"${(giftsStr || "None").replace(/"/g, '""')}"`,
        `₹${amounts.total.toFixed(2)}`,
        `₹${amounts.discount.toFixed(2)}`,
        `"${payId}"`,
        `"${dateStr}"`,
      ].join(",");
    });

    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    const filename = `namonarayana_orders_${timeFilter}_${new Date().toISOString().slice(0, 10)}.csv`;
    link.setAttribute("download", filename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    toast.success(`Exported ${filteredOrders.length} orders to ${filename}`);
  };

  // Promo Mailer Handlers
  const handleSelectAllEmails = () => {
    if (selectedEmails.length === emails.length) {
      setSelectedEmails([]);
    } else {
      setSelectedEmails(emails.map((e) => e.email));
    }
  };

  const handleSelectEmail = (email: string) => {
    if (selectedEmails.includes(email)) {
      setSelectedEmails(selectedEmails.filter((e) => e !== email));
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
          Authorization: `Bearer ${idToken}`,
        },
        body: JSON.stringify({
          emails: selectedEmails,
          subject,
        }),
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

  // Loading Screen
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-nn-cream">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-nn-forest-deep border-t-transparent rounded-full animate-spin"></div>
          <p className="text-sm font-semibold text-nn-forest-deep tracking-wider uppercase">Loading Admin Portal...</p>
        </div>
      </div>
    );
  }

  // Authwall: Not Logged In
  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#FFFDF7] via-[#FBF5E8] to-[#F3E7D3] p-4">
        <div className="bg-white p-8 sm:p-10 rounded-3xl shadow-2xl text-center max-w-md w-full border border-nn-hairline relative overflow-hidden">
          {/* Decorative Festive Banner */}
          <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-[#D4A017] via-[#8A1B14] to-[#5E0B10]"></div>

          <div className="w-20 h-20 bg-gradient-to-br from-[#FFFDF7] to-[#F3E7D3] rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-inner border border-[#EAD7BC]">
            <Sparkles className="w-10 h-10 text-[#8A1B14]" />
          </div>

          <h1 className="text-3xl font-serif font-bold text-nn-forest-deep mb-2">Namo Narayana</h1>
          <p className="text-xs uppercase tracking-widest text-[#D4A017] font-bold mb-4">Command Center &amp; Sales Analyzer</p>
          <p className="text-nn-bark text-sm mb-8 leading-relaxed">
            Please sign in with your authorized administrator Google account to access sales data, orders, and customer management.
          </p>

          <button
            onClick={signIn}
            className="bg-gradient-to-r from-[#8A1B14] to-[#5E0B10] text-white w-full py-3.5 rounded-xl font-bold hover:shadow-lg hover:opacity-95 transition-all flex items-center justify-center gap-3 shadow-md"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path
                fill="currentColor"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="currentColor"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="currentColor"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
              />
              <path
                fill="currentColor"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
              />
            </svg>
            Sign In with Google
          </button>

          <div className="mt-6 flex items-center justify-center gap-2 text-xs text-gray-400">
            <ShieldCheck className="w-4 h-4 text-[#D4A017]" />
            Restricted to <strong>{ADMIN_EMAIL}</strong>
          </div>
        </div>
      </div>
    );
  }

  // Authwall: Signed In with UNAUTHORIZED Account
  if (user.email?.toLowerCase() !== ADMIN_EMAIL.toLowerCase()) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-nn-cream p-4">
        <div className="bg-white p-8 rounded-3xl shadow-2xl text-center max-w-md w-full border border-red-200">
          <div className="w-16 h-16 bg-red-50 text-red-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <ShieldAlert className="w-8 h-8" />
          </div>
          <h2 className="text-2xl font-serif font-bold text-red-700 mb-2">Access Denied</h2>
          <p className="text-sm text-gray-600 mb-4">
            You are signed in as <strong className="text-gray-900">{user.email}</strong>, which is not authorized to access this administration panel.
          </p>
          <p className="text-xs text-gray-500 mb-6 bg-red-50 p-3 rounded-lg border border-red-100">
            Administrative clearance is strictly restricted to <strong>{ADMIN_EMAIL}</strong>.
          </p>
          <button
            onClick={signOut}
            className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-3 rounded-xl transition flex items-center justify-center gap-2 shadow-md"
          >
            <LogOut className="w-4 h-4" />
            Sign Out &amp; Switch Account
          </button>
        </div>
      </div>
    );
  }

  // AUTHENTICATED ADMIN DASHBOARD
  return (
    <div className="min-h-screen bg-[#FAF6EE] text-nn-ink pb-20">
      {/* Top Navbar */}
      <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-nn-hairline shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#8A1B14] to-[#5E0B10] flex items-center justify-center text-white shadow-md font-serif font-bold text-lg">
              NN
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-lg font-serif font-bold text-nn-forest-deep leading-tight">
                  Namo Narayana
                </h1>
                <span className="bg-[#FFF4E5] text-[#8A1B14] text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full border border-[#F5BD47]/40 tracking-wider">
                  Admin Hub
                </span>
              </div>
              <p className="text-xs text-nn-bark">Vedic Ghee Sales Intelligence &amp; Orders</p>
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="flex items-center gap-2 bg-[#F3E7D3]/60 p-1 rounded-xl border border-nn-hairline">
            <button
              onClick={() => setActiveTab("sales")}
              className={`px-4 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-2 ${
                activeTab === "sales"
                  ? "bg-gradient-to-r from-[#8A1B14] to-[#5E0B10] text-white shadow-sm"
                  : "text-nn-bark hover:text-nn-ink"
              }`}
            >
              <TrendingUp className="w-3.5 h-3.5" />
              Sales &amp; Orders
            </button>
            <button
              onClick={() => setActiveTab("promo")}
              className={`px-4 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-2 ${
                activeTab === "promo"
                  ? "bg-gradient-to-r from-[#8A1B14] to-[#5E0B10] text-white shadow-sm"
                  : "text-nn-bark hover:text-nn-ink"
              }`}
            >
              <Mail className="w-3.5 h-3.5" />
              Promo Mailer ({emails.length})
            </button>
          </div>

          {/* User profile & actions */}
          <div className="flex items-center gap-3">
            <div className="hidden sm:flex flex-col text-right">
              <span className="text-xs font-bold text-nn-forest-deep leading-none">{user.displayName || "Admin"}</span>
              <span className="text-[11px] text-nn-bark">{user.email}</span>
            </div>
            <button
              onClick={signOut}
              title="Sign Out"
              className="p-2 text-nn-bark hover:text-red-600 hover:bg-red-50 rounded-xl transition border border-transparent hover:border-red-100"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        {activeTab === "sales" ? (
          <div className="space-y-8">
            {/* Header Controls & Filter Bar */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-nn-hairline flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-2xl font-serif font-bold text-nn-forest-deep">Sales Analyzer</h2>
                  <span className="flex items-center gap-1.5 text-xs text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full font-semibold border border-emerald-200">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                    Live Firestore
                  </span>
                </div>
                <p className="text-xs text-nn-bark mt-1">
                  Real-time analytics and fulfillment details for every order placed.
                  {lastUpdated && ` Updated: ${lastUpdated.toLocaleTimeString("en-IN")}`}
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-3 w-full lg:w-auto">
                <button
                  onClick={fetchOrders}
                  disabled={isLoadingOrders}
                  className="px-3.5 py-2 rounded-xl text-xs font-bold text-nn-forest-deep bg-nn-cream hover:bg-[#F3E7D3] border border-nn-hairline transition flex items-center gap-1.5 shadow-2xs"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${isLoadingOrders ? "animate-spin" : ""}`} />
                  Refresh
                </button>

                <button
                  onClick={exportToCSV}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-[#8A1B14] to-[#5E0B10] hover:opacity-90 transition flex items-center gap-1.5 shadow-md"
                >
                  <Download className="w-3.5 h-3.5" />
                  Export CSV ({filteredOrders.length})
                </button>
              </div>
            </div>

            {/* Filter Pills & Search Bar */}
            <div className="bg-white rounded-2xl p-5 shadow-xs border border-nn-hairline space-y-4">
              <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
                {/* Search Input */}
                <div className="relative flex-1 max-w-md">
                  <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search Order ID, Customer, Phone, City, Product..."
                    className="w-full pl-10 pr-4 py-2.5 bg-[#FAF6EE] border border-nn-hairline rounded-xl text-xs text-nn-ink placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#8A1B14]"
                  />
                  {searchQuery && (
                    <button
                      onClick={() => setSearchQuery("")}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>

                {/* Exclude Admin Tests Toggle */}
                <label className="flex items-center gap-2 cursor-pointer bg-[#FBF5E8] px-3.5 py-2 rounded-xl border border-nn-hairline text-xs font-semibold text-nn-forest-deep select-none">
                  <input
                    type="checkbox"
                    checked={excludeAdminTests}
                    onChange={(e) => setExcludeAdminTests(e.target.checked)}
                    className="w-4 h-4 rounded text-[#8A1B14] focus:ring-[#8A1B14]"
                  />
                  <span>Exclude ₹1 Admin Tests</span>
                </label>
              </div>

              {/* Time Range Pills */}
              <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-nn-hairline/60">
                <span className="text-[11px] font-bold uppercase tracking-wider text-nn-bark mr-2 flex items-center gap-1">
                  <Calendar className="w-3 h-3 text-[#D4A017]" /> Period:
                </span>
                {[
                  { key: "all", label: "All Time" },
                  { key: "today", label: "Today (28 Oct)" },
                  { key: "yesterday", label: "Yesterday (27 Oct)" },
                  { key: "27_28", label: "27 & 28 Oct" },
                  { key: "7days", label: "Last 7 Days" },
                  { key: "30days", label: "Last 30 Days" },
                ].map((t) => (
                  <button
                    key={t.key}
                    onClick={() => setTimeFilter(t.key as any)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
                      timeFilter === t.key
                        ? "bg-[#8A1B14] text-white shadow-xs"
                        : "bg-[#FAF6EE] text-nn-bark hover:bg-[#F3E7D3] border border-nn-hairline"
                    }`}
                  >
                    {t.label}
                  </button>
                ))}
              </div>

              {/* Status Filter Pills */}
              <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-nn-hairline/60">
                <span className="text-[11px] font-bold uppercase tracking-wider text-nn-bark mr-2 flex items-center gap-1">
                  <Filter className="w-3 h-3 text-[#D4A017]" /> Status:
                </span>
                {[
                  { key: "all", label: "All Statuses" },
                  { key: "paid", label: "Paid / Processing" },
                  { key: "shipped", label: "Shipped" },
                  { key: "pending", label: "Pending / Abandoned" },
                  { key: "cod", label: "COD Orders" },
                ].map((s) => (
                  <button
                    key={s.key}
                    onClick={() => setStatusFilter(s.key)}
                    className={`px-3 py-1 rounded-lg text-xs font-semibold transition ${
                      statusFilter === s.key
                        ? "bg-nn-forest-deep text-white shadow-xs"
                        : "bg-[#FAF6EE] text-nn-bark hover:bg-[#F3E7D3] border border-nn-hairline"
                    }`}
                  >
                    {s.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Executive KPI Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-4">
              {/* Total Revenue */}
              <div className="bg-gradient-to-br from-white to-[#FFFDF7] p-5 rounded-2xl border border-[#F5BD47]/60 shadow-xs relative overflow-hidden">
                <div className="flex justify-between items-start">
                  <div>
                    <span className="text-[11px] uppercase tracking-wider font-extrabold text-[#8A1B14]">
                      Total Net Revenue
                    </span>
                    <h3 className="text-2xl font-serif font-extrabold text-[#5E0B10] mt-1">
                      ₹{analytics.totalRevenue.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </h3>
                  </div>
                  <div className="w-10 h-10 rounded-xl bg-[#FFF4E5] border border-[#F5BD47]/40 flex items-center justify-center text-[#8A1B14]">
                    <IndianRupee className="w-5 h-5" />
                  </div>
                </div>
                <p className="text-[11px] text-nn-bark mt-2">
                  From <strong>{analytics.paidOrdersCount}</strong> paid orders
                </p>
              </div>

              {/* Total Orders */}
              <div className="bg-white p-5 rounded-2xl border border-nn-hairline shadow-xs">
                <div className="flex justify-between items-start">
                  <div>
                    <span className="text-[11px] uppercase tracking-wider font-extrabold text-gray-500">
                      Total Orders
                    </span>
                    <h3 className="text-2xl font-serif font-extrabold text-nn-forest-deep mt-1">
                      {analytics.totalOrders}
                    </h3>
                  </div>
                  <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-700 flex items-center justify-center">
                    <Package className="w-5 h-5" />
                  </div>
                </div>
                <p className="text-[11px] text-nn-bark mt-2">
                  <span className="text-emerald-700 font-bold">{analytics.paidOrdersCount} Paid</span> •{" "}
                  <span className="text-purple-700 font-bold">{analytics.shippedOrdersCount} Shipped</span>
                </p>
              </div>

              {/* AOV */}
              <div className="bg-white p-5 rounded-2xl border border-nn-hairline shadow-xs">
                <div className="flex justify-between items-start">
                  <div>
                    <span className="text-[11px] uppercase tracking-wider font-extrabold text-gray-500">
                      Average Order (AOV)
                    </span>
                    <h3 className="text-2xl font-serif font-extrabold text-nn-forest-deep mt-1">
                      ₹{analytics.aov.toLocaleString("en-IN")}
                    </h3>
                  </div>
                  <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center">
                    <TrendingUp className="w-5 h-5" />
                  </div>
                </div>
                <p className="text-[11px] text-nn-bark mt-2">Per paid customer cart</p>
              </div>

              {/* Litres Sold */}
              <div className="bg-white p-5 rounded-2xl border border-nn-hairline shadow-xs">
                <div className="flex justify-between items-start">
                  <div>
                    <span className="text-[11px] uppercase tracking-wider font-extrabold text-gray-500">
                      Ghee Volume
                    </span>
                    <h3 className="text-2xl font-serif font-extrabold text-nn-forest-deep mt-1">
                      {analytics.totalLitres} <span className="text-base font-normal">Litres</span>
                    </h3>
                  </div>
                  <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center">
                    <Sparkles className="w-5 h-5" />
                  </div>
                </div>
                <p className="text-[11px] text-nn-bark mt-2">Vedic Bilona Ghee sold</p>
              </div>

              {/* Prepaid % */}
              <div className="bg-white p-5 rounded-2xl border border-nn-hairline shadow-xs">
                <div className="flex justify-between items-start">
                  <div>
                    <span className="text-[11px] uppercase tracking-wider font-extrabold text-gray-500">
                      Prepaid Ratio
                    </span>
                    <h3 className="text-2xl font-serif font-extrabold text-emerald-700 mt-1">
                      {analytics.prepaidPercent}%
                    </h3>
                  </div>
                  <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center">
                    <CreditCard className="w-5 h-5" />
                  </div>
                </div>
                <p className="text-[11px] text-nn-bark mt-2">
                  {analytics.prepaidCount} UPI / Razorpay vs {analytics.codCount} COD
                </p>
              </div>

              {/* Free Gifts */}
              <div className="bg-white p-5 rounded-2xl border border-nn-hairline shadow-xs">
                <div className="flex justify-between items-start">
                  <div>
                    <span className="text-[11px] uppercase tracking-wider font-extrabold text-gray-500">
                      Free Gifts Sent
                    </span>
                    <h3 className="text-2xl font-serif font-extrabold text-nn-forest-deep mt-1">
                      {analytics.totalFreeGifts}
                    </h3>
                  </div>
                  <div className="w-10 h-10 rounded-xl bg-rose-50 text-rose-700 flex items-center justify-center">
                    <Gift className="w-5 h-5" />
                  </div>
                </div>
                <p className="text-[11px] text-nn-bark mt-2">Promotional cold pressed oils</p>
              </div>
            </div>

            {/* Sales Intelligence: Daily Chart & Product Mix */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Daily Revenue Distribution */}
              <div className="lg:col-span-2 bg-white rounded-2xl p-6 shadow-xs border border-nn-hairline">
                <div className="flex justify-between items-center mb-6">
                  <div>
                    <h4 className="text-base font-serif font-bold text-nn-forest-deep">
                      Daily Revenue Breakdown
                    </h4>
                    <p className="text-xs text-nn-bark">Revenue generated per day in selected period</p>
                  </div>
                  <span className="text-xs font-semibold text-nn-forest-deep bg-nn-cream px-3 py-1 rounded-lg border border-nn-hairline">
                    {analytics.dailyChart.length} Day(s) Active
                  </span>
                </div>

                {analytics.dailyChart.length === 0 ? (
                  <div className="h-44 flex items-center justify-center text-xs text-gray-400">
                    No sales data available for this filter.
                  </div>
                ) : (
                  <div className="space-y-3">
                    {analytics.dailyChart.map((d) => {
                      const maxDaily = Math.max(...analytics.dailyChart.map((item) => item.revenue), 1);
                      const percent = Math.round((d.revenue / maxDaily) * 100);

                      return (
                        <div key={d.date} className="space-y-1">
                          <div className="flex justify-between text-xs">
                            <span className="font-semibold text-nn-ink">{d.date}</span>
                            <span className="text-nn-forest-deep font-bold">
                              ₹{d.revenue.toLocaleString("en-IN", { minimumFractionDigits: 2 })} ({d.count} orders)
                            </span>
                          </div>
                          <div className="h-4 bg-[#FAF6EE] rounded-full overflow-hidden border border-nn-hairline/60">
                            <div
                              className="h-full bg-gradient-to-r from-[#D4A017] via-[#8A1B14] to-[#5E0B10] rounded-full transition-all duration-500"
                              style={{ width: `${Math.max(percent, 8)}%` }}
                            />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Product Pack Breakdown */}
              <div className="bg-white rounded-2xl p-6 shadow-xs border border-nn-hairline space-y-4">
                <div>
                  <h4 className="text-base font-serif font-bold text-nn-forest-deep">Product Sales Mix</h4>
                  <p className="text-xs text-nn-bark">Best selling pack sizes &amp; units</p>
                </div>

                <div className="space-y-3 pt-2">
                  {analytics.topProducts.slice(0, 5).map((p) => {
                    const totalUnits = analytics.topProducts.reduce((acc, curr) => acc + curr.units, 0) || 1;
                    const percent = Math.round((p.units / totalUnits) * 100);

                    return (
                      <div key={p.name} className="space-y-1">
                        <div className="flex justify-between text-xs">
                          <span className="font-medium text-nn-ink truncate max-w-[160px]">{p.name}</span>
                          <span className="font-bold text-nn-forest-deep">
                            {p.units} units ({percent}%)
                          </span>
                        </div>
                        <div className="h-2.5 bg-gray-100 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-[#8A1B14] rounded-full"
                            style={{ width: `${percent}%` }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Top Delivery States */}
                <div className="pt-4 border-t border-nn-hairline">
                  <span className="text-xs font-bold text-nn-bark uppercase tracking-wider block mb-2">
                    Top Delivery Regions:
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {analytics.topStates.map((s) => (
                      <span
                        key={s.state}
                        className="text-[11px] bg-[#FAF6EE] border border-nn-hairline px-2.5 py-1 rounded-lg text-nn-ink font-medium"
                      >
                        {s.state}: <strong>{s.count}</strong>
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Orders Data Table */}
            <div className="bg-white rounded-2xl shadow-xs border border-nn-hairline overflow-hidden">
              <div className="p-6 border-b border-nn-hairline flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-gradient-to-r from-[#FFFDF7] to-white">
                <div>
                  <h3 className="text-lg font-serif font-bold text-nn-forest-deep flex items-center gap-2">
                    <ShoppingBag className="w-5 h-5 text-[#8A1B14]" />
                    Orders Directory ({filteredOrders.length})
                  </h3>
                  <p className="text-xs text-nn-bark">Complete customer order ledger with direct Firestore sync</p>
                </div>
                <span className="text-xs text-gray-500 font-medium">
                  Showing <strong>{filteredOrders.length}</strong> of {orders.length} total
                </span>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-[#FAF6EE] text-nn-forest-deep text-xs font-bold uppercase tracking-wider border-b border-nn-hairline">
                      <th className="p-4">Order ID</th>
                      <th className="p-4">Customer</th>
                      <th className="p-4">Items &amp; Gifts</th>
                      <th className="p-4">Total Amount</th>
                      <th className="p-4">Payment</th>
                      <th className="p-4">Fulfillment</th>
                      <th className="p-4">Date (IST)</th>
                      <th className="p-4 text-center">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-nn-hairline text-xs">
                    {filteredOrders.length === 0 ? (
                      <tr>
                        <td colSpan={8} className="p-12 text-center text-gray-400">
                          No orders matched your active filter. Try resetting period or search query.
                        </td>
                      </tr>
                    ) : (
                      filteredOrders.map((order) => {
                        const amounts = getOrderAmounts(order);
                        const dateObj = getOrderDate(order);
                        const isPaid =
                          order.paymentStatus === "paid" ||
                          order.status === "paid" ||
                          order.status === "processing" ||
                          order.status === "shipped";
                        const isShipped = order.status === "shipped" || order.shippingStatus === "shipped";
                        const itemsCount = (order.items || []).filter((i: any) => !i.isGift).length;
                        const giftsCount = (order.freeGifts || []).length;
                        const displayId = order.orderId || order.id;

                        return (
                          <tr
                            key={order.id}
                            className="hover:bg-[#FCFAF5] transition group cursor-pointer"
                            onClick={() => openOrderDetails(order)}
                          >
                            {/* Order ID */}
                            <td className="p-4 font-mono font-bold text-nn-forest-deep flex items-center gap-1.5">
                              <span>#{displayId.slice(0, 10)}...</span>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  copyToClipboard(displayId, displayId, "Order ID copied");
                                }}
                                className="text-gray-400 hover:text-nn-forest-deep transition"
                                title="Copy full Order ID"
                              >
                                {copiedKey === displayId ? (
                                  <Check className="w-3.5 h-3.5 text-emerald-600" />
                                ) : (
                                  <Copy className="w-3.5 h-3.5" />
                                )}
                              </button>
                            </td>

                            {/* Customer */}
                            <td className="p-4">
                              <div className="font-bold text-nn-ink text-sm">
                                {order.shippingAddress?.name || "Customer"}
                              </div>
                              <div className="text-gray-500 text-[11px] flex items-center gap-2 mt-0.5">
                                <span>{order.contactInfo?.phone}</span>
                                {order.shippingAddress?.city && (
                                  <span className="text-nn-bark font-medium">• {order.shippingAddress.city}</span>
                                )}
                              </div>
                            </td>

                            {/* Items & Gifts */}
                            <td className="p-4 max-w-xs">
                              <div className="truncate font-medium text-nn-ink">
                                {(order.items || [])
                                  .filter((it: any) => !it.isGift)
                                  .map((it: any) => `${it.quantity}x ${it.name || it.title}`)
                                  .join(", ") || "Pure Ghee"}
                              </div>
                              {giftsCount > 0 && (
                                <span className="inline-flex items-center gap-1 text-[10px] text-rose-700 bg-rose-50 border border-rose-200 px-2 py-0.5 rounded-full font-bold mt-1">
                                  <Gift className="w-2.5 h-2.5" /> {giftsCount} Free Gift(s)
                                </span>
                              )}
                            </td>

                            {/* Total Amount */}
                            <td className="p-4">
                              <div className="font-extrabold text-sm text-[#5E0B10]">
                                ₹{amounts.total.toLocaleString("en-IN", { minimumFractionDigits: 2 })}
                              </div>
                              {amounts.discount > 0 && (
                                <span className="text-[10px] text-emerald-700 font-semibold block">
                                  Saved ₹{amounts.discount.toFixed(0)} ({order.couponCode || "Discount"})
                                </span>
                              )}
                            </td>

                            {/* Payment Status */}
                            <td className="p-4">
                              {isPaid ? (
                                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                                  <CheckCircle2 className="w-3 h-3 text-emerald-600" /> Paid
                                </span>
                              ) : order.paymentMethod === "cod" ? (
                                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-blue-50 text-blue-700 border border-blue-200">
                                  COD
                                </span>
                              ) : (
                                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-amber-50 text-amber-700 border border-amber-200">
                                  <Clock className="w-3 h-3 text-amber-600" /> Pending
                                </span>
                              )}
                            </td>

                            {/* Fulfillment Status */}
                            <td className="p-4">
                              {isShipped ? (
                                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-purple-50 text-purple-700 border border-purple-200">
                                  <Truck className="w-3 h-3" /> Shipped
                                </span>
                              ) : order.status === "processing" ? (
                                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-orange-50 text-orange-700 border border-orange-200">
                                  Processing
                                </span>
                              ) : (
                                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-medium bg-gray-50 text-gray-600 border border-gray-200">
                                  Pending
                                </span>
                              )}
                            </td>

                            {/* Date */}
                            <td className="p-4 text-nn-bark whitespace-nowrap">
                              <div>{dateObj.toLocaleDateString("en-IN", { day: "numeric", month: "short" })}</div>
                              <div className="text-[10px] text-gray-400">
                                {dateObj.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" })}
                              </div>
                            </td>

                            {/* Action */}
                            <td className="p-4 text-center">
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  openOrderDetails(order);
                                }}
                                className="px-3 py-1.5 rounded-lg bg-[#FAF6EE] text-nn-forest-deep hover:bg-nn-forest-deep hover:text-white border border-nn-hairline text-xs font-bold transition flex items-center gap-1 mx-auto shadow-2xs"
                              >
                                <Eye className="w-3.5 h-3.5" /> View
                              </button>
                            </td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        ) : (
          /* Promo Mailer Tab (Existing tool) */
          <div className="max-w-4xl mx-auto space-y-8">
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-nn-hairline flex justify-between items-center">
              <div>
                <h3 className="text-2xl font-serif font-bold text-nn-forest-deep">Promo Email Campaigns</h3>
                <p className="text-nn-bark text-xs mt-1">Direct inbox campaigns for collected customer leads</p>
              </div>
              <span className="text-xs bg-[#FDF2E9] text-[#8A1B14] font-bold px-3 py-1 rounded-full border border-[#F5BD47]/40 flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-[#8A1B14]" /> Verified Sender
              </span>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-nn-hairline overflow-hidden">
              <div className="p-6 border-b border-nn-hairline flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <h4 className="text-lg font-bold text-nn-forest-deep flex items-center gap-2">
                  <Mail className="w-5 h-5 text-[#D4A017]" />
                  Collected Leads ({emails.length})
                </h4>
                <div className="flex items-center gap-3">
                  <button
                    onClick={handleSelectAllEmails}
                    className="text-xs font-bold text-nn-forest-deep hover:underline px-2 py-1"
                  >
                    {selectedEmails.length === emails.length ? "Deselect All" : "Select All"}
                  </button>
                  <button
                    onClick={() => setShowPreview(true)}
                    disabled={selectedEmails.length === 0}
                    className="bg-gradient-to-r from-[#8A1B14] to-[#5E0B10] text-white px-5 py-2 rounded-xl text-xs font-bold hover:opacity-90 transition disabled:opacity-50 flex items-center gap-2 shadow-md"
                  >
                    <Send className="w-3.5 h-3.5" />
                    Preview &amp; Send ({selectedEmails.length})
                  </button>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="bg-[#FAF6EE] text-nn-forest-deep font-bold">
                      <th className="p-4 w-12">
                        <input
                          type="checkbox"
                          checked={emails.length > 0 && selectedEmails.length === emails.length}
                          onChange={handleSelectAllEmails}
                          className="w-4 h-4 rounded text-[#8A1B14] focus:ring-[#8A1B14]"
                        />
                      </th>
                      <th className="p-4">Email Address</th>
                      <th className="p-4">Collected Date</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-nn-hairline">
                    {emails.length === 0 ? (
                      <tr>
                        <td colSpan={3} className="p-8 text-center text-gray-400">
                          No promotional emails collected yet.
                        </td>
                      </tr>
                    ) : (
                      emails.map((e) => (
                        <tr key={e.id} className="hover:bg-[#FAF9F5] transition">
                          <td className="p-4">
                            <input
                              type="checkbox"
                              checked={selectedEmails.includes(e.email)}
                              onChange={() => handleSelectEmail(e.email)}
                              className="w-4 h-4 rounded text-[#8A1B14] focus:ring-[#8A1B14]"
                            />
                          </td>
                          <td className="p-4 font-semibold text-nn-ink">{e.email}</td>
                          <td className="p-4 text-gray-500">
                            {e.createdAt?.seconds
                              ? new Date(e.createdAt.seconds * 1000).toLocaleString()
                              : "Recently"}
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Deep Order Details Drawer / Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-end">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-xs transition-opacity"
            onClick={() => setSelectedOrder(null)}
          />

          {/* Slide-over Drawer Panel */}
          <div className="relative w-full max-w-2xl bg-white h-full shadow-2xl flex flex-col z-10 overflow-hidden border-l border-nn-hairline">
            {/* Drawer Header */}
            <div className="p-6 border-b border-nn-hairline bg-gradient-to-r from-[#FFFDF7] to-[#FAF6EE] flex justify-between items-start">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-xl font-serif font-bold text-nn-forest-deep">
                    Order #{selectedOrder.orderId || selectedOrder.id}
                  </h3>
                  <button
                    onClick={() =>
                      copyToClipboard(
                        selectedOrder.orderId || selectedOrder.id,
                        "drawer-id",
                        "Order ID copied!"
                      )
                    }
                    className="text-gray-400 hover:text-nn-forest-deep"
                    title="Copy Order ID"
                  >
                    {copiedKey === "drawer-id" ? (
                      <Check className="w-4 h-4 text-emerald-600" />
                    ) : (
                      <Copy className="w-4 h-4" />
                    )}
                  </button>
                </div>
                <p className="text-xs text-nn-bark mt-1">
                  Placed on {getOrderDate(selectedOrder).toLocaleString("en-IN", { timeZone: "Asia/Kolkata" })}
                </p>
              </div>

              <button
                onClick={() => setSelectedOrder(null)}
                className="text-gray-400 hover:text-gray-700 p-1.5 rounded-lg hover:bg-gray-100 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Quick Actions Bar */}
            <div className="p-4 bg-[#FBF5E8] border-b border-nn-hairline flex flex-wrap items-center justify-between gap-3 text-xs">
              <button
                onClick={() => {
                  const addr = selectedOrder.shippingAddress;
                  const label = [
                    addr?.name || "Customer",
                    `Phone: ${selectedOrder.contactInfo?.phone || ""}`,
                    addr?.address || "",
                    `${addr?.city || ""}, ${addr?.state || ""} - ${addr?.pincode || ""}`,
                    `Country: ${addr?.country || "India"}`,
                    `Items: ${(selectedOrder.items || []).map((i: any) => `${i.quantity}x ${i.name}`).join(", ")}`,
                  ].join("\n");
                  copyToClipboard(label, "drawer-label", "Shipping label copied to clipboard!");
                }}
                className="px-3.5 py-2 rounded-xl bg-white border border-nn-hairline font-bold text-nn-forest-deep hover:bg-gray-50 transition flex items-center gap-1.5 shadow-2xs"
              >
                <Copy className="w-3.5 h-3.5" />
                Copy Shipping Label
              </button>

              <button
                onClick={() => window.print()}
                className="px-3.5 py-2 rounded-xl bg-white border border-nn-hairline font-bold text-nn-forest-deep hover:bg-gray-50 transition flex items-center gap-1.5 shadow-2xs"
              >
                <Printer className="w-3.5 h-3.5" />
                Print Packing Slip
              </button>
            </div>

            {/* Drawer Body Scroll */}
            <div className="p-6 overflow-y-auto space-y-6 flex-1 text-xs">
              {/* Status Update Card */}
              <div className="bg-[#FCFAF5] p-5 rounded-2xl border border-nn-hairline space-y-4">
                <h4 className="text-xs font-bold text-nn-forest-deep uppercase tracking-wider flex items-center gap-1.5">
                  <Truck className="w-4 h-4 text-[#D4A017]" />
                  Fulfillment &amp; Status Management
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="text-[11px] font-bold text-gray-600 block mb-1">Order Status:</label>
                    <select
                      value={editStatus}
                      onChange={(e) => setEditStatus(e.target.value)}
                      className="w-full bg-white border border-gray-300 rounded-xl px-3 py-2 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-[#8A1B14]"
                    >
                      <option value="processing">Processing</option>
                      <option value="shipped">Shipped</option>
                      <option value="delivered">Delivered</option>
                      <option value="pending">Pending</option>
                      <option value="cancelled">Cancelled</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-[11px] font-bold text-gray-600 block mb-1">Courier Partner:</label>
                    <input
                      type="text"
                      value={editCourier}
                      onChange={(e) => setEditCourier(e.target.value)}
                      placeholder="e.g. Delhivery Express"
                      className="w-full bg-white border border-gray-300 rounded-xl px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-[#8A1B14]"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] font-bold text-gray-600 block mb-1">Tracking AWB #:</label>
                    <input
                      type="text"
                      value={editTracking}
                      onChange={(e) => setEditTracking(e.target.value)}
                      placeholder="e.g. NNG123456IN"
                      className="w-full bg-white border border-gray-300 rounded-xl px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-[#8A1B14]"
                    />
                  </div>
                </div>

                <div className="flex justify-end pt-2">
                  <button
                    onClick={handleUpdateOrderStatus}
                    disabled={isUpdatingStatus}
                    className="bg-gradient-to-r from-[#8A1B14] to-[#5E0B10] text-white px-5 py-2 rounded-xl text-xs font-bold hover:opacity-90 transition disabled:opacity-50 flex items-center gap-1.5 shadow-md"
                  >
                    {isUpdatingStatus ? (
                      <>
                        <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        Saving to Firestore...
                      </>
                    ) : (
                      <>
                        <Check className="w-3.5 h-3.5" />
                        Save to Firestore
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* Customer & Shipping Address */}
              <div className="bg-white p-5 rounded-2xl border border-nn-hairline space-y-3">
                <h4 className="text-xs font-bold text-nn-forest-deep uppercase tracking-wider flex items-center gap-1.5">
                  <MapPin className="w-4 h-4 text-[#D4A017]" />
                  Customer &amp; Shipping Destination
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
                  <div>
                    <span className="text-gray-400 block text-[11px]">Customer Name:</span>
                    <strong className="text-sm text-nn-ink">
                      {selectedOrder.shippingAddress?.name || "Customer"}
                    </strong>

                    <span className="text-gray-400 block text-[11px] mt-2">Contact Phone:</span>
                    <div className="flex items-center gap-2">
                      <a
                        href={`tel:${selectedOrder.contactInfo?.phone}`}
                        className="font-bold text-[#8A1B14] hover:underline"
                      >
                        {selectedOrder.contactInfo?.phone || "N/A"}
                      </a>
                      <button
                        onClick={() =>
                          copyToClipboard(selectedOrder.contactInfo?.phone || "", "cust-phone", "Phone copied!")
                        }
                        className="text-gray-400 hover:text-gray-600"
                      >
                        <Copy className="w-3 h-3" />
                      </button>
                    </div>

                    <span className="text-gray-400 block text-[11px] mt-2">Email Address:</span>
                    <a
                      href={`mailto:${selectedOrder.contactInfo?.email}`}
                      className="text-nn-forest-deep font-medium hover:underline block truncate"
                    >
                      {selectedOrder.contactInfo?.email || "N/A"}
                    </a>
                  </div>

                  <div>
                    <span className="text-gray-400 block text-[11px]">Full Delivery Address:</span>
                    <p className="text-nn-ink font-medium leading-relaxed mt-0.5">
                      {selectedOrder.shippingAddress?.address}
                      <br />
                      {selectedOrder.shippingAddress?.city}, {selectedOrder.shippingAddress?.state} -{" "}
                      <strong>{selectedOrder.shippingAddress?.pincode}</strong>
                      <br />
                      {selectedOrder.shippingAddress?.country || "India"}
                    </p>
                  </div>
                </div>
              </div>

              {/* Items Purchased Table */}
              <div className="bg-white rounded-2xl border border-nn-hairline overflow-hidden">
                <div className="p-4 bg-[#FAF6EE] border-b border-nn-hairline font-bold text-nn-forest-deep flex items-center gap-1.5">
                  <Package className="w-4 h-4 text-[#D4A017]" /> Items in Shipment
                </div>

                <div className="divide-y divide-nn-hairline">
                  {(selectedOrder.items || []).map((item: any, idx: number) => {
                    const price = item.isGift ? 0 : Number(item.price || 0) / 100;
                    const lineTotal = price * Number(item.quantity || 1);

                    return (
                      <div key={idx} className="p-4 flex items-center justify-between gap-4">
                        <div className="flex items-center gap-3">
                          {item.image ? (
                            <img
                              src={item.image}
                              alt={item.name}
                              className="w-12 h-12 object-cover rounded-xl border border-nn-hairline"
                            />
                          ) : (
                            <div className="w-12 h-12 rounded-xl bg-nn-cream flex items-center justify-center font-bold text-nn-forest-deep">
                              NN
                            </div>
                          )}
                          <div>
                            <div className="font-bold text-nn-ink text-xs">
                              {item.name || item.title}
                            </div>
                            <span className="text-[11px] text-gray-500">
                              Variant: {item.variantTitle || "Standard"} • Qty: <strong>{item.quantity}</strong>
                            </span>
                          </div>
                        </div>

                        <div className="text-right">
                          <div className="font-bold text-xs text-nn-forest-deep">
                            {item.isGift ? (
                              <span className="text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded font-bold">
                                FREE GIFT
                              </span>
                            ) : (
                              `₹${lineTotal.toFixed(2)}`
                            )}
                          </div>
                          {!item.isGift && item.quantity > 1 && (
                            <span className="text-[10px] text-gray-400">₹{price.toFixed(2)} each</span>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Financial Breakdown Card */}
              <div className="bg-[#FAF6EE] p-5 rounded-2xl border border-nn-hairline space-y-2">
                <h4 className="text-xs font-bold text-nn-forest-deep uppercase tracking-wider mb-2">
                  Pricing &amp; Settlement
                </h4>

                {(() => {
                  const amounts = getOrderAmounts(selectedOrder);
                  return (
                    <div className="space-y-1.5 text-xs">
                      <div className="flex justify-between text-gray-600">
                        <span>Cart Subtotal:</span>
                        <span>₹{amounts.subtotal.toFixed(2)}</span>
                      </div>
                      {amounts.discount > 0 && (
                        <div className="flex justify-between text-emerald-700 font-semibold">
                          <span>
                            Promotional Discount ({selectedOrder.couponCode || "Coupon"}):
                          </span>
                          <span>-₹{amounts.discount.toFixed(2)}</span>
                        </div>
                      )}
                      <div className="flex justify-between text-gray-600">
                        <span>Express Delivery:</span>
                        <span className="text-emerald-700 font-bold uppercase">FREE</span>
                      </div>
                      <div className="flex justify-between text-sm font-extrabold text-[#5E0B10] pt-2 border-t border-nn-hairline">
                        <span>Total Settlement Amount:</span>
                        <span>₹{amounts.total.toFixed(2)}</span>
                      </div>
                    </div>
                  );
                })()}
              </div>

              {/* Gateway & Payment Audit */}
              <div className="bg-white p-5 rounded-2xl border border-nn-hairline space-y-3">
                <h4 className="text-xs font-bold text-nn-forest-deep uppercase tracking-wider flex items-center gap-1.5">
                  <CreditCard className="w-4 h-4 text-[#D4A017]" /> Payment Gateway Telemetry
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div>
                    <span className="text-gray-400 block text-[11px]">Payment Method:</span>
                    <strong className="text-nn-ink uppercase">
                      {selectedOrder.paymentMethod || "PREPAID"}
                    </strong>

                    <span className="text-gray-400 block text-[11px] mt-2">Payment Status:</span>
                    <span className="inline-block mt-0.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                      {selectedOrder.paymentStatus || "Verified"}
                    </span>
                  </div>

                  <div>
                    <span className="text-gray-400 block text-[11px]">Razorpay Payment ID:</span>
                    <div className="flex items-center gap-1 font-mono text-gray-700 mt-0.5">
                      <span className="truncate">
                        {selectedOrder.paymentSessionId ||
                          selectedOrder.paymentDetails?.razorpay_payment_id ||
                          "None"}
                      </span>
                      {selectedOrder.paymentSessionId && (
                        <button
                          onClick={() =>
                            copyToClipboard(
                              selectedOrder.paymentSessionId,
                              "pay-id",
                              "Payment ID copied!"
                            )
                          }
                          className="text-gray-400 hover:text-gray-600"
                        >
                          <Copy className="w-3 h-3" />
                        </button>
                      )}
                    </div>

                    <span className="text-gray-400 block text-[11px] mt-2">Razorpay Order ID:</span>
                    <span className="font-mono text-gray-700 block truncate">
                      {selectedOrder.paymentDetails?.razorpay_order_id || "N/A"}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Drawer Footer */}
            <div className="p-4 bg-[#FAF6EE] border-t border-nn-hairline flex justify-end">
              <button
                onClick={() => setSelectedOrder(null)}
                className="px-6 py-2.5 rounded-xl font-bold bg-nn-forest-deep text-white hover:bg-nn-forest transition shadow-md text-xs"
              >
                Close Drawer
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Preview Modal for Promo Mailer */}
      {showPreview && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-xs" onClick={() => setShowPreview(false)} />
          <div className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl relative z-10 overflow-hidden flex flex-col max-h-[90vh]">
            <div className="p-5 border-b border-nn-hairline flex justify-between items-center bg-[#FAF9F5]">
              <div>
                <h3 className="text-xl font-bold text-nn-forest-deep">Inbox Mailer Preview</h3>
                <span className="text-xs text-[#8A1B14] font-semibold flex items-center gap-1 mt-0.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#D4A017]" /> High deliverability plain-text letter format
                </span>
              </div>
              <button
                onClick={() => setShowPreview(false)}
                className="text-nn-bark hover:text-nn-ink font-bold text-2xl leading-none"
              >
                &times;
              </button>
            </div>

            <div className="p-5 overflow-y-auto bg-gray-50 flex-1 space-y-4">
              <div className="bg-white p-3.5 rounded-xl border border-gray-200">
                <label className="text-xs font-bold text-gray-700 block mb-1">Subject Line:</label>
                <input
                  type="text"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#8A1B14]"
                  placeholder="A quick note from Namo Narayana"
                />
              </div>

              <div className="bg-white p-6 rounded-xl border border-gray-200 mx-auto max-w-lg text-left text-[#2A1612] text-xs leading-relaxed space-y-3.5">
                <p>Namaste,</p>
                <p>I noticed you were browsing our A2 Gir Cow Bilona Ghee earlier today.</p>
                <p>
                  I wanted to write to you personally from our farm. Unlike commercial market ghee made by separating cream with machines, we still make our ghee the ancient Vedic way — converting fresh milk from free-grazing Gir cows into curd first, and then slowly churning it with a wooden bilona to separate fresh makkhan.
                </p>
                <div className="bg-[#FCFAF5] border border-[#EAD7BC] rounded-lg p-3 my-2">
                  <p className="text-xs font-semibold text-[#5E0B10]">Special 10% Farm Welcome:</p>
                  <p className="text-xs text-[#4A352F]">
                    Use coupon code <strong className="font-mono text-[#8A1B14]">DIWALI</strong> at checkout.
                  </p>
                </div>
                <div className="border-t border-gray-200 pt-3 text-[11px] text-gray-500">
                  Anurag Sharma • Founder &amp; Farm Lead, Namo Narayana
                </div>
              </div>
            </div>

            <div className="p-5 border-t border-nn-hairline bg-white flex justify-between items-center">
              <span className="text-xs text-nn-bark">
                Sending to <strong className="text-nn-forest-deep">{selectedEmails.length}</strong> recipient(s)
              </span>
              <div className="flex gap-3">
                <button
                  onClick={() => setShowPreview(false)}
                  className="px-4 py-2 font-medium text-xs text-nn-bark hover:text-nn-ink"
                >
                  Cancel
                </button>
                <button
                  onClick={sendPromoEmails}
                  disabled={isSending}
                  className="bg-gradient-to-r from-[#8A1B14] to-[#5E0B10] text-white px-5 py-2 rounded-xl font-bold text-xs hover:opacity-90 transition disabled:opacity-50 flex items-center gap-2"
                >
                  {isSending ? "Sending..." : "Send Campaign"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
