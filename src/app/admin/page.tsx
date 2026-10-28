"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
import { toast } from "sonner";
import {
  Mail,
  Send,
  CheckCircle2,
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
  MessageSquare,
  RotateCw,
  ChevronDown,
  ChevronUp,
  Percent,
  Flame,
  FileText,
  CheckCheck,
} from "lucide-react";

// Whitelisted Administrator Email
const ADMIN_EMAIL = "littlecodr@gmail.com";

// Helper: Universal date parser that reliably handles Firestore Timestamps, ISO strings, epoch timestamps, etc.
export function parseAnyDate(val: any): Date {
  if (!val) return new Date(0);
  if (val instanceof Date) return isNaN(val.getTime()) ? new Date(0) : val;
  if (typeof val.toDate === "function") {
    try {
      const d = val.toDate();
      if (d instanceof Date && !isNaN(d.getTime())) return d;
    } catch {}
  }
  if (typeof val.seconds === "number") return new Date(val.seconds * 1000);
  if (typeof val._seconds === "number") return new Date(val._seconds * 1000);
  if (typeof val === "number") {
    return val < 10000000000 ? new Date(val * 1000) : new Date(val);
  }
  if (typeof val === "string") {
    const d = new Date(val);
    if (!isNaN(d.getTime())) return d;
    const num = Number(val);
    if (!isNaN(num) && num > 0) {
      return num < 10000000000 ? new Date(num * 1000) : new Date(num);
    }
  }
  return new Date(0);
}

// Helper: Formats Date into IST date-time and relative elapsed string
export function formatDateTime(date: Date): { formatted: string; relative: string } {
  if (!date || isNaN(date.getTime()) || date.getTime() === 0) {
    return { formatted: "Recently", relative: "Active cart" };
  }

  const formatted = date.toLocaleString("en-IN", {
    day: "numeric",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
    timeZone: "Asia/Kolkata",
  });

  const now = Date.now();
  const diffSec = Math.max(0, Math.floor((now - date.getTime()) / 1000));
  let relative = "just now";
  if (diffSec < 60) {
    relative = "just now";
  } else if (diffSec < 3600) {
    const mins = Math.floor(diffSec / 60);
    relative = `${mins}m ago`;
  } else if (diffSec < 86400) {
    const hrs = Math.floor(diffSec / 3600);
    relative = `${hrs}h ago`;
  } else {
    const days = Math.floor(diffSec / 86400);
    relative = `${days}d ago`;
  }

  return { formatted, relative };
}

// Helper: Universal Rupee currency formatter with strict 2-decimal precision (e.g. ₹1,151.50, ₹854.10)
export function formatINR(amountInRupees: number): string {
  const safe = Number.isFinite(amountInRupees) ? amountInRupees : 0;
  return `₹${safe.toLocaleString("en-IN", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}

// Helper: Convert raw amount (which is in Paise if >= 100) to clean Rupees
export function toRupees(rawAmount: any): number {
  const num = Number(rawAmount || 0);
  if (!Number.isFinite(num) || num <= 0) return 0;
  // If >= 100, it's stored in Paise (e.g. 115150 paise -> 1151.50 rupees, 100 paise -> 1.00 rupee)
  return num >= 100 ? num / 100 : num;
}

// Helper: Extract valid JS Date from order
function getOrderDate(order: any): Date {
  if (order.createdAt) {
    const d = parseAnyDate(order.createdAt);
    if (d.getTime() > 0) return d;
  }
  if (order.paymentDetails?.paidAt) {
    const d = parseAnyDate(order.paymentDetails.paidAt);
    if (d.getTime() > 0) return d;
  }
  if (order.updatedAt) {
    const d = parseAnyDate(order.updatedAt);
    if (d.getTime() > 0) return d;
  }
  return new Date(0);
}

// Helper: Format amount in Rupees
function getOrderAmounts(order: any) {
  const rawTotal = Number(order.totalAmount || order.amountToPay || 0);
  const rawSubtotal = Number(order.subtotal || rawTotal);
  const rawDiscount = Number(order.discount || 0);

  // Amounts >= 100 in Firestore are in Paise (e.g. 94900 -> ₹949.00)
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

export interface StatusConfig {
  key: string;
  label: string;
  badgeClass: string;
  dotClass: string;
  pillActiveClass: string;
  pillInactiveClass: string;
  pillDotClass: string;
  description: string;
}

export function getStatusConfig(statusRaw?: string, paymentStatusRaw?: string): StatusConfig {
  const s = (statusRaw || "").toLowerCase().trim();
  const p = (paymentStatusRaw || "").toLowerCase().trim();

  // If status is empty, fallback to paymentStatus or "pending"
  const normalized = s || (p === "paid" ? "paid" : "pending");

  switch (normalized) {
    case "paid":
      return {
        key: "paid",
        label: "Paid",
        badgeClass: "bg-teal-50 text-teal-900 border-teal-300 ring-1 ring-teal-200/80 shadow-2xs",
        dotClass: "bg-teal-500",
        pillActiveClass: "bg-teal-600 text-white font-bold ring-2 ring-teal-400 shadow-sm",
        pillInactiveClass: "bg-teal-50/70 text-teal-900 border border-teal-200 hover:bg-teal-100",
        pillDotClass: "bg-teal-500",
        description: "Payment captured successfully, awaiting fulfillment",
      };
    case "processing":
      return {
        key: "processing",
        label: "Processing",
        badgeClass: "bg-amber-50 text-amber-950 border-amber-300 ring-1 ring-amber-200/80 shadow-2xs",
        dotClass: "bg-amber-500 animate-pulse",
        pillActiveClass: "bg-amber-500 text-white font-bold ring-2 ring-amber-300 shadow-sm",
        pillInactiveClass: "bg-amber-50/70 text-amber-950 border border-amber-200 hover:bg-amber-100",
        pillDotClass: "bg-amber-500",
        description: "In warehouse hand-packing & preparation",
      };
    case "shipped":
      return {
        key: "shipped",
        label: "Shipped",
        badgeClass: "bg-blue-50 text-blue-950 border-blue-300 ring-1 ring-blue-200/80 shadow-2xs",
        dotClass: "bg-blue-600",
        pillActiveClass: "bg-blue-600 text-white font-bold ring-2 ring-blue-300 shadow-sm",
        pillInactiveClass: "bg-blue-50/70 text-blue-950 border border-blue-200 hover:bg-blue-100",
        pillDotClass: "bg-blue-600",
        description: "Dispatched & handed over to courier partner",
      };
    case "out_for_delivery":
      return {
        key: "out_for_delivery",
        label: "Out for Delivery",
        badgeClass: "bg-orange-50 text-orange-950 border-orange-300 ring-1 ring-orange-200/80 shadow-2xs",
        dotClass: "bg-orange-500 ring-2 ring-orange-200 animate-bounce",
        pillActiveClass: "bg-orange-600 text-white font-bold ring-2 ring-orange-400 shadow-sm",
        pillInactiveClass: "bg-orange-50/70 text-orange-950 border border-orange-200 hover:bg-orange-100",
        pillDotClass: "bg-orange-500",
        description: "On delivery vehicle, arriving at customer doorstep today",
      };
    case "delivered":
      return {
        key: "delivered",
        label: "Delivered",
        badgeClass: "bg-emerald-50 text-emerald-950 border-emerald-400 ring-1 ring-emerald-300/80 font-bold shadow-2xs",
        dotClass: "bg-emerald-600",
        pillActiveClass: "bg-emerald-700 text-white font-bold ring-2 ring-emerald-400 shadow-sm",
        pillInactiveClass: "bg-emerald-50/70 text-emerald-950 border border-emerald-300 hover:bg-emerald-100",
        pillDotClass: "bg-emerald-600",
        description: "Successfully handed over to customer",
      };
    case "delivery_failed":
      return {
        key: "delivery_failed",
        label: "Delivery Failed",
        badgeClass: "bg-rose-50 text-rose-950 border-rose-300 ring-1 ring-rose-200/90 font-bold shadow-2xs",
        dotClass: "bg-rose-600 animate-pulse",
        pillActiveClass: "bg-rose-700 text-white font-bold ring-2 ring-rose-400 shadow-sm",
        pillInactiveClass: "bg-rose-50/70 text-rose-950 border border-rose-300 hover:bg-rose-100",
        pillDotClass: "bg-rose-600",
        description: "Logistics network issue, returning to seller, refund initiated",
      };
    case "pending":
      return {
        key: "pending",
        label: "Pending",
        badgeClass: "bg-slate-100 text-slate-800 border-slate-300 ring-1 ring-slate-200/80 shadow-2xs",
        dotClass: "bg-slate-400",
        pillActiveClass: "bg-slate-700 text-white font-bold ring-2 ring-slate-400 shadow-sm",
        pillInactiveClass: "bg-slate-100/80 text-slate-800 border border-slate-300 hover:bg-slate-200",
        pillDotClass: "bg-slate-400",
        description: "Awaiting customer payment completion",
      };
    case "cancelled":
      return {
        key: "cancelled",
        label: "Cancelled",
        badgeClass: "bg-zinc-100 text-zinc-800 border-zinc-300 ring-1 ring-zinc-200/80 shadow-2xs",
        dotClass: "bg-zinc-500",
        pillActiveClass: "bg-zinc-800 text-white font-bold ring-2 ring-zinc-400 shadow-sm",
        pillInactiveClass: "bg-zinc-100/80 text-zinc-800 border border-zinc-300 hover:bg-zinc-200",
        pillDotClass: "bg-zinc-500",
        description: "Order cancelled or voided",
      };
    default:
      return {
        key: normalized,
        label: normalized.replace(/_/g, " "),
        badgeClass: "bg-gray-100 text-gray-800 border-gray-300",
        dotClass: "bg-gray-400",
        pillActiveClass: "bg-gray-800 text-white font-bold shadow-sm",
        pillInactiveClass: "bg-gray-100 text-gray-800 border border-gray-300 hover:bg-gray-200",
        pillDotClass: "bg-gray-400",
        description: normalized,
      };
  }
}

export default function AdminPage() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"analytics" | "orders" | "abandoned" | "promo">("analytics");

  // Orders State
  const [orders, setOrders] = useState<any[]>([]);
  const [isLoadingOrders, setIsLoadingOrders] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  // Abandoned Carts State
  const [abandonedCarts, setAbandonedCarts] = useState<any[]>([]);
  const [isLoadingCarts, setIsLoadingCarts] = useState(false);
  const [recoveringEmail, setRecoveringEmail] = useState<string | null>(null);

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
  const [notifyCustomerEmail, setNotifyCustomerEmail] = useState(true);
  const [showEmailPreview, setShowEmailPreview] = useState(false);
  const [showInvoicePrint, setShowInvoicePrint] = useState(false);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  // Promo Mailer State
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

  // Fetch abandoned carts & combine with pending orders
  const fetchAbandonedCarts = useCallback(async () => {
    setIsLoadingCarts(true);
    try {
      const { db } = await import("@/lib/firebase");
      const { collection, getDocs } = await import("firebase/firestore/lite");

      const cartSnap = await getDocs(collection(db, "abandoned_carts"));
      const rawCarts = cartSnap.docs.map((d) => {
        const data = d.data();
        const dateObj = parseAnyDate(data.lastActive || data.updatedAt || data.createdAt);
        // data.subtotal in abandoned_carts is stored in PAISE (e.g. 115150 paise -> 1151.50 rupees)
        const subtotalInRupees = toRupees(data.subtotal);

        return {
          id: d.id,
          ...data,
          subtotal: subtotalInRupees,
          dateObj,
          lastActive: dateObj.toISOString(),
          source: "cart_abandoned",
        };
      });

      // Also grab pending orders from orders collection that did not complete payment
      const pendingFromOrders = orders
        .filter((o) => (o.paymentStatus === "pending" || !o.paymentStatus) && !isTestOrder(o))
        .map((o) => {
          const dateObj = getOrderDate(o);
          const amounts = getOrderAmounts(o);
          return {
            id: o.id,
            orderId: o.orderId || o.id,
            email: o.contactInfo?.email || o.shippingAddress?.email,
            phone: o.contactInfo?.phone,
            name: o.shippingAddress?.name || o.contactInfo?.name || "Customer",
            subtotal: amounts.total, // Already in clean Rupees!
            cartItems: o.items || [],
            dateObj,
            lastActive: dateObj.toISOString(),
            notified: Boolean(o.recoveryEmailSent),
            source: "order_pending",
          };
        });

      // Combine and deduplicate by email
      const cartMap = new Map<string, any>();

      rawCarts.forEach((c: any) => {
        const email = (c.email || c.id || "").toLowerCase().trim();
        if (email && email.includes("@")) {
          cartMap.set(email, c);
        }
      });

      pendingFromOrders.forEach((p: any) => {
        const email = (p.email || "").toLowerCase().trim();
        if (email && email.includes("@") && !cartMap.has(email)) {
          cartMap.set(email, p);
        }
      });

      const merged = Array.from(cartMap.values());
      // Sort newest first using parsed Date
      merged.sort((a, b) => {
        const tA = (a.dateObj instanceof Date ? a.dateObj.getTime() : parseAnyDate(a.lastActive || a.updatedAt).getTime()) || 0;
        const tB = (b.dateObj instanceof Date ? b.dateObj.getTime() : parseAnyDate(b.lastActive || b.updatedAt).getTime()) || 0;
        return tB - tA;
      });

      setAbandonedCarts(merged);
    } catch (e: any) {
      console.error("Error fetching abandoned carts:", e);
    } finally {
      setIsLoadingCarts(false);
    }
  }, [orders]);

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

  // Trigger carts fetch when orders update
  useEffect(() => {
    if (orders.length > 0) {
      fetchAbandonedCarts();
    }
  }, [orders, fetchAbandonedCarts]);

  // Filtered Orders Calculation
  const filteredOrders = useMemo(() => {
    const now = new Date();

    return orders.filter((order) => {
      if (excludeAdminTests && isTestOrder(order)) {
        return false;
      }

      const orderDate = getOrderDate(order);
      const istDateStr = orderDate.toLocaleDateString("en-CA", { timeZone: "Asia/Kolkata" });

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

      const pStatus = (order.paymentStatus || "").toLowerCase();
      const sStatus = (order.status || "").toLowerCase();
      const pMethod = (order.paymentMethod || "").toLowerCase();

      if (statusFilter === "paid") {
        if (pStatus !== "paid" && sStatus !== "paid") return false;
      } else if (statusFilter === "processing") {
        if (sStatus !== "processing") return false;
      } else if (statusFilter === "shipped") {
        if (sStatus !== "shipped" && order.shippingStatus !== "shipped") return false;
      } else if (statusFilter === "out_for_delivery") {
        if (sStatus !== "out_for_delivery") return false;
      } else if (statusFilter === "delivery_failed") {
        if (sStatus !== "delivery_failed") return false;
      } else if (statusFilter === "delivered") {
        if (sStatus !== "delivered") return false;
      } else if (statusFilter === "pending") {
        if (pStatus === "paid" || sStatus === "shipped" || sStatus === "paid" || sStatus === "processing") return false;
      } else if (statusFilter === "cod") {
        if (pMethod !== "cod") return false;
      }

      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const idMatch = (order.id || "").toLowerCase().includes(q) || (order.orderId || "").toLowerCase().includes(q);
        const nameMatch = (order.shippingAddress?.name || "").toLowerCase().includes(q);
        const emailMatch = (order.contactInfo?.email || "").toLowerCase().includes(q);
        const phoneMatch = (order.contactInfo?.phone || "").toLowerCase().includes(q);
        const cityMatch = (order.shippingAddress?.city || "").toLowerCase().includes(q);
        const stateMatch = (order.shippingAddress?.state || "").toLowerCase().includes(q);
        const trackingMatch = (order.trackingNumber || order.awbNumber || "").toLowerCase().includes(q);
        const paymentIdMatch = (
          order.paymentSessionId ||
          order.paymentDetails?.razorpay_payment_id ||
          ""
        ).toLowerCase().includes(q);
        const itemMatch = (order.items || []).some((i: any) => (i.name || i.title || "").toLowerCase().includes(q));

        if (!idMatch && !nameMatch && !emailMatch && !phoneMatch && !cityMatch && !stateMatch && !trackingMatch && !paymentIdMatch && !itemMatch) {
          return false;
        }
      }

      return true;
    });
  }, [orders, timeFilter, statusFilter, searchQuery, excludeAdminTests]);

  // Live Counts for each Status Filter Button
  const statusCounts = useMemo(() => {
    const counts: Record<string, number> = {
      all: 0,
      paid: 0,
      processing: 0,
      shipped: 0,
      out_for_delivery: 0,
      delivered: 0,
      delivery_failed: 0,
      pending: 0,
    };

    const now = new Date();

    orders.forEach((order) => {
      if (excludeAdminTests && isTestOrder(order)) return;

      const orderDate = getOrderDate(order);
      const istDateStr = orderDate.toLocaleDateString("en-CA", { timeZone: "Asia/Kolkata" });

      if (timeFilter === "today") {
        const todayIst = now.toLocaleDateString("en-CA", { timeZone: "Asia/Kolkata" });
        if (istDateStr !== todayIst) return;
      } else if (timeFilter === "yesterday") {
        const yesterday = new Date(now.getTime() - 86400 * 1000);
        const yestIst = yesterday.toLocaleDateString("en-CA", { timeZone: "Asia/Kolkata" });
        if (istDateStr !== yestIst) return;
      } else if (timeFilter === "27_28") {
        if (istDateStr !== "2026-10-27" && istDateStr !== "2026-10-28") return;
      } else if (timeFilter === "7days") {
        const diffDays = (now.getTime() - orderDate.getTime()) / (1000 * 3600 * 24);
        if (diffDays > 7) return;
      } else if (timeFilter === "30days") {
        const diffDays = (now.getTime() - orderDate.getTime()) / (1000 * 3600 * 24);
        if (diffDays > 30) return;
      }

      counts.all++;

      const pStatus = (order.paymentStatus || "").toLowerCase();
      const sStatus = (order.status || "").toLowerCase();

      if (sStatus === "processing") counts.processing++;
      else if (sStatus === "shipped" || order.shippingStatus === "shipped") counts.shipped++;
      else if (sStatus === "out_for_delivery") counts.out_for_delivery++;
      else if (sStatus === "delivered") counts.delivered++;
      else if (sStatus === "delivery_failed") counts.delivery_failed++;
      else if (sStatus === "paid" || pStatus === "paid") counts.paid++;
      else counts.pending++;
    });

    return counts;
  }, [orders, timeFilter, excludeAdminTests]);

  // Aggregate Sales KPIs
  const analytics = useMemo(() => {
    let totalPaidRevenue = 0;
    let totalGrossRevenue = 0;
    let paidOrdersCount = 0;
    let processingCount = 0;
    let shippedOrdersCount = 0;
    let outForDeliveryCount = 0;
    let deliveryFailedCount = 0;
    let deliveredCount = 0;
    let pendingOrdersCount = 0;
    let prepaidCount = 0;
    let codCount = 0;
    let totalLitres = 0;
    let totalFreeGifts = 0;

    const dailyMap: Record<string, { revenue: number; count: number; date: string }> = {};
    const productMap: Record<string, { units: number; revenue: number }> = {};
    const stateMap: Record<string, number> = {};

    filteredOrders.forEach((order) => {
      const { total } = getOrderAmounts(order);
      totalGrossRevenue += total;

      const isPaid =
        order.paymentStatus === "paid" ||
        order.status === "paid" ||
        order.status === "processing" ||
        order.status === "shipped" ||
        order.status === "out_for_delivery" ||
        order.status === "delivered";

      const sStatus = (order.status || "").toLowerCase();

      if (sStatus === "processing") processingCount++;
      else if (sStatus === "shipped") shippedOrdersCount++;
      else if (sStatus === "out_for_delivery") outForDeliveryCount++;
      else if (sStatus === "delivery_failed") deliveryFailedCount++;
      else if (sStatus === "delivered") deliveredCount++;

      if (isPaid) {
        totalPaidRevenue += total;
        paidOrdersCount++;

        if (order.paymentMethod === "cod") {
          codCount++;
        } else {
          prepaidCount++;
        }

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

        (order.items || []).forEach((item: any) => {
          if (item.isGift) return;
          const title = item.name || item.title || "Ghee";
          const qty = Number(item.quantity || 1);
          const price = Number(item.price || 0) / 100;

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

        const giftsCount = (order.freeGifts || []).reduce((acc: number, g: any) => acc + (Number(g.quantity) || 1), 0);
        totalFreeGifts += giftsCount;

        const state = order.shippingAddress?.state || "Other";
        stateMap[state] = (stateMap[state] || 0) + 1;
      } else {
        pendingOrdersCount++;
      }
    });

    const aov = paidOrdersCount > 0 ? Math.round(totalPaidRevenue / paidOrdersCount) : 0;
    const paidConversionRate = filteredOrders.length > 0 ? Math.round((paidOrdersCount / filteredOrders.length) * 100) : 0;
    const prepaidPercent = paidOrdersCount > 0 ? Math.round((prepaidCount / paidOrdersCount) * 100) : 100;

    const dailyChart = Object.values(dailyMap);
    const topProducts = Object.entries(productMap)
      .map(([name, data]) => ({ name, ...data }))
      .sort((a, b) => b.units - a.units);

    const topStates = Object.entries(stateMap)
      .map(([state, count]) => ({ state, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);

    return {
      totalPaidRevenue,
      totalGrossRevenue,
      totalOrders: filteredOrders.length,
      paidOrdersCount,
      processingCount,
      shippedOrdersCount,
      outForDeliveryCount,
      deliveryFailedCount,
      deliveredCount,
      pendingOrdersCount,
      aov,
      paidConversionRate,
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
    setNotifyCustomerEmail(true);
    setShowEmailPreview(false);
  };

  // Update Order Status via dedicated transactional API
  const handleUpdateOrderStatus = async () => {
    if (!selectedOrder) return;
    setIsUpdatingStatus(true);
    try {
      const res = await fetch("/api/admin/update-order-status", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          orderId: selectedOrder.id,
          status: editStatus,
          courierPartner: editCourier,
          trackingNumber: editTracking,
          notifyCustomer: notifyCustomerEmail,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to update order");

      if (data.emailSent) {
        toast.success(`Order #${selectedOrder.id} status updated to ${editStatus} & Brevo email sent to customer!`);
      } else {
        toast.success(`Order #${selectedOrder.id} status updated to ${editStatus}! (Email notification skipped)`);
      }

      // Update local state
      setOrders((prev) =>
        prev.map((o) => (o.id === selectedOrder.id ? { ...o, ...data.order } : o))
      );
      setSelectedOrder(data.order);
    } catch (e: any) {
      console.error("Failed to update status:", e);
      toast.error("Status update error: " + e.message);
    } finally {
      setIsUpdatingStatus(false);
    }
  };

  // Send Abandoned Cart Recovery Email
  const handleSendRecoveryEmail = async (cart: any) => {
    setRecoveringEmail(cart.email);
    try {
      const res = await fetch("/api/admin/recover-cart", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: cart.email,
          name: cart.name,
          phone: cart.phone,
          orderId: cart.orderId,
          items: cart.cartItems,
          subtotal: cart.subtotal,
          couponCode: "DIWALI",
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to dispatch recovery email");

      toast.success(`Recovery email sent to ${cart.email} with 10% OFF code DIWALI!`);

      // Update cart local status
      setAbandonedCarts((prev) =>
        prev.map((c) => (c.email === cart.email ? { ...c, notified: true, recoveryEmailSent: true } : c))
      );
    } catch (e: any) {
      console.error("Recovery email error:", e);
      toast.error("Failed to send recovery email: " + e.message);
    } finally {
      setRecoveringEmail(null);
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
      "Courier Partner",
      "Tracking Number",
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
        `"${(o.courierPartner || "N/A").replace(/"/g, '""')}"`,
        `"${(o.trackingNumber || o.awbNumber || "N/A").replace(/"/g, '""')}"`,
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

  // Authwall: Unauthorized Account
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

  // Main Dashboard
  return (
    <div className="min-h-screen bg-[#FAF6EE] text-nn-ink pb-24">
      {/* Top Navbar */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-nn-hairline shadow-xs">
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
          <div className="flex items-center gap-1.5 bg-[#F3E7D3]/60 p-1.5 rounded-xl border border-nn-hairline">
            <button
              onClick={() => setActiveTab("analytics")}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 ${
                activeTab === "analytics"
                  ? "bg-gradient-to-r from-[#8A1B14] to-[#5E0B10] text-white shadow-sm"
                  : "text-nn-bark hover:text-nn-ink"
              }`}
            >
              <TrendingUp className="w-3.5 h-3.5" />
              Analytics
            </button>
            <button
              onClick={() => setActiveTab("orders")}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 ${
                activeTab === "orders"
                  ? "bg-gradient-to-r from-[#8A1B14] to-[#5E0B10] text-white shadow-sm"
                  : "text-nn-bark hover:text-nn-ink"
              }`}
            >
              <Package className="w-3.5 h-3.5" />
              Orders ({filteredOrders.length})
            </button>
            <button
              onClick={() => setActiveTab("abandoned")}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 ${
                activeTab === "abandoned"
                  ? "bg-gradient-to-r from-[#8A1B14] to-[#5E0B10] text-white shadow-sm"
                  : "text-nn-bark hover:text-nn-ink"
              }`}
            >
              <ShoppingBag className="w-3.5 h-3.5" />
              Abandoned ({abandonedCarts.length})
            </button>
            <button
              onClick={() => setActiveTab("promo")}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 ${
                activeTab === "promo"
                  ? "bg-gradient-to-r from-[#8A1B14] to-[#5E0B10] text-white shadow-sm"
                  : "text-nn-bark hover:text-nn-ink"
              }`}
            >
              <Mail className="w-3.5 h-3.5" />
              Promo ({emails.length})
            </button>
          </div>

          {/* User profile & refresh */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                fetchOrders();
                fetchAbandonedCarts();
                toast.success("Refreshing Firestore data...");
              }}
              title="Refresh Data"
              className="p-2 text-nn-bark hover:text-nn-forest-deep hover:bg-nn-cream rounded-xl transition border border-nn-hairline"
            >
              <RefreshCw className={`w-4 h-4 ${isLoadingOrders ? "animate-spin" : ""}`} />
            </button>
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

      {/* Main Container */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 space-y-8">
        {/* ─── TAB 1: EXECUTIVE ANALYTICS & CHARTS ─── */}
        {activeTab === "analytics" && (
          <div className="space-y-8">
            {/* Header with Quick Time Filter */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-nn-hairline shadow-xs">
              <div>
                <h2 className="text-xl font-serif font-bold text-nn-forest-deep flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-[#8A1B14]" /> Executive Sales Analyzer
                </h2>
                <p className="text-xs text-nn-bark">
                  Live Firestore metrics • Calculated across verified customer orders
                </p>
              </div>

              {/* Time Filter Pills */}
              <div className="flex flex-wrap items-center gap-1.5">
                {[
                  { key: "all", label: "All Time" },
                  { key: "today", label: "Today" },
                  { key: "yesterday", label: "Yesterday" },
                  { key: "27_28", label: "27-28 Oct Special" },
                  { key: "7days", label: "Last 7d" },
                  { key: "30days", label: "Last 30d" },
                ].map((tf) => (
                  <button
                    key={tf.key}
                    onClick={() => setTimeFilter(tf.key as any)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                      timeFilter === tf.key
                        ? "bg-nn-forest-deep text-white shadow-xs font-bold"
                        : "bg-[#F3E7D3]/60 text-nn-bark hover:text-nn-ink hover:bg-[#F3E7D3]"
                    }`}
                  >
                    {tf.label}
                  </button>
                ))}
              </div>
            </div>

            {/* KPI Cards Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Paid Revenue */}
              <div className="bg-gradient-to-br from-white to-[#FFFDF9] p-5 rounded-2xl border border-nn-hairline shadow-xs">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Net Realized Revenue</span>
                  <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center">
                    <IndianRupee className="w-4 h-4" />
                  </div>
                </div>
                <div className="text-2xl font-serif font-extrabold text-[#5E0B10]">
                  ₹{analytics.totalPaidRevenue.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </div>
                <div className="mt-2 text-xs text-emerald-700 font-semibold flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" /> {analytics.paidOrdersCount} Paid Orders Confirmed
                </div>
              </div>

              {/* Gross Pipeline */}
              <div className="bg-gradient-to-br from-white to-[#FFFDF9] p-5 rounded-2xl border border-nn-hairline shadow-xs">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Gross Sales Pipeline</span>
                  <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-700 flex items-center justify-center">
                    <Flame className="w-4 h-4 text-[#D4A017]" />
                  </div>
                </div>
                <div className="text-2xl font-serif font-extrabold text-nn-forest-deep">
                  ₹{analytics.totalGrossRevenue.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </div>
                <div className="mt-2 text-xs text-amber-700 font-semibold flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5" /> {analytics.pendingOrdersCount} Incomplete / Pending
                </div>
              </div>

              {/* AOV & Conversion */}
              <div className="bg-gradient-to-br from-white to-[#FFFDF9] p-5 rounded-2xl border border-nn-hairline shadow-xs">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Average Order Value</span>
                  <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-700 flex items-center justify-center">
                    <Percent className="w-4 h-4" />
                  </div>
                </div>
                <div className="text-2xl font-serif font-extrabold text-nn-forest-deep">
                  ₹{analytics.aov.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </div>
                <div className="mt-2 text-xs text-gray-500 font-medium">
                  Paid Conversion Rate: <strong className="text-nn-forest-deep">{analytics.paidConversionRate}%</strong>
                </div>
              </div>

              {/* Litres Churned */}
              <div className="bg-gradient-to-br from-white to-[#FFFDF9] p-5 rounded-2xl border border-nn-hairline shadow-xs">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Bilona Ghee Volume</span>
                  <div className="w-8 h-8 rounded-lg bg-[#FAF0E6] text-[#8A1B14] flex items-center justify-center">
                    <Sparkles className="w-4 h-4" />
                  </div>
                </div>
                <div className="text-2xl font-serif font-extrabold text-[#8A1B14]">
                  {analytics.totalLitres.toFixed(1)} <span className="text-sm font-sans font-bold">Litres</span>
                </div>
                <div className="mt-2 text-xs text-emerald-700 font-semibold flex items-center gap-1">
                  <Gift className="w-3.5 h-3.5" /> {analytics.totalFreeGifts} Festive Gifts Attached
                </div>
              </div>
            </div>

            {/* Interactive Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Daily Sales Trajectory Chart */}
              <div className="bg-white p-6 rounded-2xl border border-nn-hairline shadow-xs space-y-4">
                <div className="flex items-center justify-between border-b border-nn-hairline pb-3">
                  <div>
                    <h3 className="text-sm font-bold text-nn-forest-deep uppercase tracking-wider flex items-center gap-1.5">
                      <TrendingUp className="w-4 h-4 text-[#8A1B14]" /> Daily Sales Trajectory (INR)
                    </h3>
                    <p className="text-xs text-gray-400">Paid customer orders breakdown</p>
                  </div>
                  <span className="text-xs font-bold text-[#8A1B14] bg-[#FFF5F5] px-2.5 py-1 rounded-full border border-red-100">
                    Live Feed
                  </span>
                </div>

                {analytics.dailyChart.length === 0 ? (
                  <div className="h-48 flex items-center justify-center text-xs text-gray-400">
                    No sales data in selected range
                  </div>
                ) : (
                  <div className="space-y-3 pt-2">
                    {(() => {
                      const maxDaily = Math.max(...analytics.dailyChart.map((d) => d.revenue), 1);
                      return analytics.dailyChart.map((item, idx) => {
                        const pct = Math.round((item.revenue / maxDaily) * 100);
                        return (
                          <div key={idx} className="space-y-1">
                            <div className="flex justify-between text-xs">
                              <span className="font-semibold text-gray-700">{item.date}</span>
                              <span className="font-bold text-[#5E0B10]">
                                ₹{item.revenue.toLocaleString("en-IN", { minimumFractionDigits: 2 })}
                                <span className="text-[10px] text-gray-400 font-normal ml-1">({item.count} orders)</span>
                              </span>
                            </div>
                            <div className="h-3 w-full bg-[#FAF6EE] rounded-full overflow-hidden border border-nn-hairline">
                              <div
                                className="h-full bg-gradient-to-r from-[#D4A017] via-[#8A1B14] to-[#5E0B10] rounded-full transition-all duration-500"
                                style={{ width: `${Math.max(pct, 4)}%` }}
                              />
                            </div>
                          </div>
                        );
                      });
                    })()}
                  </div>
                )}
              </div>

              {/* Order Status Distribution Funnel */}
              <div className="bg-white p-6 rounded-2xl border border-nn-hairline shadow-xs space-y-4">
                <div className="flex items-center justify-between border-b border-nn-hairline pb-3">
                  <div>
                    <h3 className="text-sm font-bold text-nn-forest-deep uppercase tracking-wider flex items-center gap-1.5">
                      <Truck className="w-4 h-4 text-[#D4A017]" /> Fulfillment &amp; Status Funnel
                    </h3>
                    <p className="text-xs text-gray-400">Current order dispatch lifecycle</p>
                  </div>
                  <span className="text-xs font-bold text-nn-forest-deep">
                    Total: {analytics.totalOrders}
                  </span>
                </div>

                <div className="space-y-3 pt-1">
                  {[
                    { label: "Paid & Confirmed", count: analytics.paidOrdersCount, color: "bg-teal-500", text: "text-teal-900", dot: "bg-teal-500" },
                    { label: "Processing (Hand-Packing)", count: analytics.processingCount, color: "bg-amber-500", text: "text-amber-950", dot: "bg-amber-500" },
                    { label: "Shipped / In-Transit", count: analytics.shippedOrdersCount, color: "bg-blue-600", text: "text-blue-950", dot: "bg-blue-600" },
                    { label: "Out for Delivery", count: analytics.outForDeliveryCount, color: "bg-orange-500", text: "text-orange-950", dot: "bg-orange-500" },
                    { label: "Delivered Successfully", count: analytics.deliveredCount, color: "bg-emerald-600", text: "text-emerald-950", dot: "bg-emerald-600" },
                    { label: "Delivery Failed (Logistics RTO)", count: analytics.deliveryFailedCount, color: "bg-rose-600", text: "text-rose-950", dot: "bg-rose-600" },
                    { label: "Unpaid / Pending", count: analytics.pendingOrdersCount, color: "bg-slate-400", text: "text-slate-800", dot: "bg-slate-400" },
                  ].map((s, idx) => {
                    const totalSafe = Math.max(analytics.totalOrders, 1);
                    const pct = Math.round((s.count / totalSafe) * 100);
                    return (
                      <div key={idx} className="space-y-1">
                        <div className="flex justify-between text-xs">
                          <span className={`font-semibold flex items-center gap-1.5 ${s.text}`}>
                            <span className={`w-2 h-2 rounded-full ${s.dot}`} />
                            {s.label}
                          </span>
                          <span className="font-bold text-gray-900">
                            {s.count} <span className="text-[10px] text-gray-400 font-normal">({pct}%)</span>
                          </span>
                        </div>
                        <div className="h-2.5 w-full bg-[#FAF6EE] rounded-full overflow-hidden border border-nn-hairline">
                          <div
                            className={`h-full ${s.color} rounded-full transition-all duration-500`}
                            style={{ width: `${pct}%` }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Top Products & Top States Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Top Products Breakdown */}
              <div className="bg-white p-6 rounded-2xl border border-nn-hairline shadow-xs space-y-4">
                <h3 className="text-sm font-bold text-nn-forest-deep uppercase tracking-wider flex items-center gap-1.5 border-b border-nn-hairline pb-3">
                  <Package className="w-4 h-4 text-[#8A1B14]" /> Top Selling Jars &amp; SKUs
                </h3>
                {analytics.topProducts.length === 0 ? (
                  <p className="text-xs text-gray-400 py-6 text-center">No SKU data available</p>
                ) : (
                  <div className="space-y-3">
                    {analytics.topProducts.slice(0, 5).map((prod, idx) => (
                      <div key={idx} className="flex items-center justify-between p-3 rounded-xl bg-[#FAF6EE] border border-nn-hairline">
                        <div>
                          <div className="text-xs font-bold text-nn-forest-deep">{prod.name}</div>
                          <div className="text-[11px] text-gray-400">{prod.units} jars delivered</div>
                        </div>
                        <div className="text-right">
                          <div className="text-xs font-bold text-[#8A1B14]">₹{prod.revenue.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Geographic Distribution */}
              <div className="bg-white p-6 rounded-2xl border border-nn-hairline shadow-xs space-y-4">
                <h3 className="text-sm font-bold text-nn-forest-deep uppercase tracking-wider flex items-center gap-1.5 border-b border-nn-hairline pb-3">
                  <MapPin className="w-4 h-4 text-[#D4A017]" /> Top Buyer States &amp; Regions
                </h3>
                {analytics.topStates.length === 0 ? (
                  <p className="text-xs text-gray-400 py-6 text-center">No regional data available</p>
                ) : (
                  <div className="space-y-3">
                    {analytics.topStates.map((st, idx) => (
                      <div key={idx} className="flex items-center justify-between p-3 rounded-xl bg-[#FAF6EE] border border-nn-hairline">
                        <div className="flex items-center gap-2">
                          <span className="w-6 h-6 rounded-full bg-white text-xs font-bold flex items-center justify-center border border-nn-hairline">
                            {idx + 1}
                          </span>
                          <span className="text-xs font-bold text-nn-forest-deep">{st.state}</span>
                        </div>
                        <span className="text-xs font-bold text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
                          {st.count} orders
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* ─── TAB 2: LIVE ORDERS COMMAND CENTER ─── */}
        {activeTab === "orders" && (
          <div className="space-y-6">
            {/* Filter and Search Bar */}
            <div className="bg-white p-5 rounded-2xl border border-nn-hairline shadow-xs space-y-4">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                {/* Search Input */}
                <div className="relative flex-1 max-w-md">
                  <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search by Order ID, Name, Phone, Email, City, AWB..."
                    className="w-full pl-10 pr-4 py-2 text-xs border border-nn-hairline rounded-xl bg-[#FAF9F5] focus:outline-none focus:ring-2 focus:ring-[#8A1B14] text-gray-900"
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

                {/* Actions & Export */}
                <div className="flex items-center gap-3">
                  <label className="flex items-center gap-2 text-xs text-gray-600 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={excludeAdminTests}
                      onChange={(e) => setExcludeAdminTests(e.target.checked)}
                      className="rounded border-gray-300 text-[#8A1B14] focus:ring-[#8A1B14]"
                    />
                    <span>Hide ₹1 Admin Tests</span>
                  </label>

                  <button
                    onClick={exportToCSV}
                    className="px-4 py-2 rounded-xl bg-[#FAF6EE] hover:bg-[#F3E7D3] border border-nn-hairline text-xs font-bold text-nn-forest-deep transition flex items-center gap-1.5 shadow-xs"
                  >
                    <Download className="w-3.5 h-3.5" />
                    Export CSV
                  </button>
                </div>
              </div>

              {/* Status Filter Badges with Distinct Colors & Live Counts */}
              <div className="flex flex-wrap items-center gap-2 border-t border-nn-hairline pt-3">
                <span className="text-xs font-bold text-gray-400 mr-1 flex items-center gap-1">
                  <Filter className="w-3 h-3" /> Status:
                </span>
                {[
                  {
                    key: "all",
                    label: "All Orders",
                    count: statusCounts.all,
                    dotClass: "bg-[#8A1B14]",
                    activeClass: "bg-[#5E0B10] text-white ring-2 ring-[#8A1B14] shadow-sm font-bold",
                    inactiveClass: "bg-white text-gray-700 border border-nn-hairline hover:bg-[#F3E7D3]/60",
                  },
                  {
                    key: "paid",
                    label: "Paid",
                    count: statusCounts.paid,
                    dotClass: "bg-teal-500",
                    activeClass: "bg-teal-600 text-white ring-2 ring-teal-400 shadow-sm font-bold",
                    inactiveClass: "bg-teal-50/70 text-teal-900 border border-teal-200 hover:bg-teal-100",
                  },
                  {
                    key: "processing",
                    label: "Processing",
                    count: statusCounts.processing,
                    dotClass: "bg-amber-500 animate-pulse",
                    activeClass: "bg-amber-500 text-white ring-2 ring-amber-300 shadow-sm font-bold",
                    inactiveClass: "bg-amber-50/70 text-amber-950 border border-amber-200 hover:bg-amber-100",
                  },
                  {
                    key: "shipped",
                    label: "Shipped",
                    count: statusCounts.shipped,
                    dotClass: "bg-blue-600",
                    activeClass: "bg-blue-600 text-white ring-2 ring-blue-300 shadow-sm font-bold",
                    inactiveClass: "bg-blue-50/70 text-blue-950 border border-blue-200 hover:bg-blue-100",
                  },
                  {
                    key: "out_for_delivery",
                    label: "Out for Delivery",
                    count: statusCounts.out_for_delivery,
                    dotClass: "bg-orange-500",
                    activeClass: "bg-orange-600 text-white ring-2 ring-orange-400 shadow-sm font-bold",
                    inactiveClass: "bg-orange-50/70 text-orange-950 border border-orange-200 hover:bg-orange-100",
                  },
                  {
                    key: "delivered",
                    label: "Delivered",
                    count: statusCounts.delivered,
                    dotClass: "bg-emerald-600",
                    activeClass: "bg-emerald-700 text-white ring-2 ring-emerald-400 shadow-sm font-bold",
                    inactiveClass: "bg-emerald-50/70 text-emerald-950 border border-emerald-300 hover:bg-emerald-100",
                  },
                  {
                    key: "delivery_failed",
                    label: "Delivery Failed",
                    count: statusCounts.delivery_failed,
                    dotClass: "bg-rose-600 animate-pulse",
                    activeClass: "bg-rose-700 text-white ring-2 ring-rose-400 shadow-sm font-bold",
                    inactiveClass: "bg-rose-50/70 text-rose-950 border border-rose-300 hover:bg-rose-100",
                  },
                  {
                    key: "pending",
                    label: "Pending",
                    count: statusCounts.pending,
                    dotClass: "bg-slate-400",
                    activeClass: "bg-slate-700 text-white ring-2 ring-slate-400 shadow-sm font-bold",
                    inactiveClass: "bg-slate-100/80 text-slate-800 border border-slate-300 hover:bg-slate-200",
                  },
                ].map((st) => {
                  const isActive = statusFilter === st.key;
                  return (
                    <button
                      key={st.key}
                      onClick={() => setStatusFilter(st.key)}
                      className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs transition ${
                        isActive ? st.activeClass : st.inactiveClass
                      }`}
                    >
                      <span className={`w-2 h-2 rounded-full shrink-0 ${st.dotClass}`} />
                      <span>{st.label}</span>
                      <span
                        className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                          isActive ? "bg-white/20 text-white" : "bg-black/5 text-gray-600"
                        }`}
                      >
                        {st.count}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Orders Data Table */}
            <div className="bg-white rounded-2xl border border-nn-hairline shadow-xs overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-[#FAF6EE] text-nn-forest-deep uppercase text-[11px] font-bold border-b border-nn-hairline tracking-wider">
                    <tr>
                      <th className="py-3 px-4">Order ID &amp; Date</th>
                      <th className="py-3 px-4">Customer</th>
                      <th className="py-3 px-4">Purchased Items</th>
                      <th className="py-3 px-4">Status</th>
                      <th className="py-3 px-4">Courier / AWB</th>
                      <th className="py-3 px-4 text-right">Settlement</th>
                      <th className="py-3 px-4 text-center">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-nn-hairline">
                    {filteredOrders.length === 0 ? (
                      <tr>
                        <td colSpan={7} className="py-12 text-center text-gray-400">
                          No matching orders found.
                        </td>
                      </tr>
                    ) : (
                      filteredOrders.map((order) => {
                        const amounts = getOrderAmounts(order);
                        const dateObj = getOrderDate(order);
                        const dateStr = dateObj.toLocaleDateString("en-IN", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                          timeZone: "Asia/Kolkata",
                        });
                        const timeStr = dateObj.toLocaleTimeString("en-IN", {
                          hour: "2-digit",
                          minute: "2-digit",
                          hour12: true,
                          timeZone: "Asia/Kolkata",
                        });

                        const stConfig = getStatusConfig(order.status, order.paymentStatus);
                        const customerPhone = order.contactInfo?.phone || order.shippingAddress?.phone || "";
                        const cleanPhone = customerPhone.replace(/[^0-9]/g, "").slice(-10);

                        return (
                          <tr key={order.id} className="hover:bg-[#FFFDF9] transition">
                            <td className="py-3.5 px-4">
                              <span className="font-mono font-bold text-[#5E0B10] block">
                                #{order.orderId || order.id}
                              </span>
                              <span className="text-[10px] text-gray-400 block mt-0.5">
                                {dateStr} • {timeStr}
                              </span>
                            </td>

                            <td className="py-3.5 px-4">
                              <span className="font-bold text-nn-forest-deep block">
                                {order.shippingAddress?.name || order.contactInfo?.name || "Customer"}
                              </span>
                              <span className="text-[11px] text-gray-500 block truncate max-w-[180px]">
                                {order.contactInfo?.email || "No email"}
                              </span>
                              {cleanPhone && (
                                <span className="text-[10px] text-gray-400 block font-mono">
                                  +91 {cleanPhone}
                                </span>
                              )}
                            </td>

                            <td className="py-3.5 px-4 max-w-xs">
                              <div className="space-y-1">
                                {(order.items || []).slice(0, 2).map((it: any, i: number) => (
                                  <div key={i} className="truncate text-[11px] text-gray-700">
                                    • {it.quantity}x {it.name || it.title} {it.variantTitle ? `(${it.variantTitle})` : ""}
                                  </div>
                                ))}
                                {(order.items || []).length > 2 && (
                                  <span className="text-[10px] text-[#8A1B14] font-semibold">
                                    +{(order.items || []).length - 2} more items
                                  </span>
                                )}
                              </div>
                            </td>

                            <td className="py-3.5 px-4 whitespace-nowrap">
                              <span
                                className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-wider border ${stConfig.badgeClass}`}
                              >
                                <span className={`w-2 h-2 rounded-full shrink-0 ${stConfig.dotClass}`} />
                                {stConfig.label}
                              </span>
                            </td>

                            <td className="py-3.5 px-4">
                              {order.trackingNumber || order.awbNumber ? (
                                <div className="space-y-0.5">
                                  <span className="text-[11px] font-bold text-nn-forest-deep block">
                                    {order.courierPartner || "Delhivery"}
                                  </span>
                                  <span className="font-mono text-[10px] text-blue-700 bg-blue-50 px-1.5 py-0.5 rounded border border-blue-100 inline-block">
                                    {order.trackingNumber || order.awbNumber}
                                  </span>
                                </div>
                              ) : (
                                <span className="text-[10px] text-gray-400 italic">Unassigned</span>
                              )}
                            </td>

                            <td className="py-3.5 px-4 text-right">
                              <span className="font-bold text-[#8A1B14] block">
                                ₹{amounts.total.toFixed(2)}
                              </span>
                              <span className="text-[10px] text-gray-400 uppercase font-semibold">
                                {order.paymentMethod || "Prepaid"}
                              </span>
                            </td>

                            <td className="py-3.5 px-4 text-center">
                              <div className="flex items-center justify-center gap-1.5">
                                <button
                                  onClick={() => openOrderDetails(order)}
                                  className="px-3 py-1.5 rounded-lg bg-[#FAF6EE] hover:bg-[#8A1B14] hover:text-white border border-nn-hairline text-xs font-bold text-nn-forest-deep transition flex items-center gap-1 shadow-xs"
                                >
                                  <Eye className="w-3.5 h-3.5" />
                                  Manage
                                </button>
                                {cleanPhone && (
                                  <a
                                    href={`https://wa.me/91${cleanPhone}?text=Namaste%20${encodeURIComponent(
                                      order.shippingAddress?.name || "Customer"
                                    )}%2C%20here%20is%20an%20update%20on%20your%20Namo%20Narayana%20order%20%23${order.orderId || order.id}%3A%20your%20order%20is%20now%20${encodeURIComponent(stConfig.label)}.`}
                                    target="_blank"
                                    rel="noreferrer"
                                    title="WhatsApp Customer"
                                    className="p-1.5 text-emerald-600 hover:bg-emerald-50 rounded-lg transition"
                                  >
                                    <MessageSquare className="w-4 h-4" />
                                  </a>
                                )}
                              </div>
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
        )}

        {/* ─── TAB 3: ABANDONED CARTS & RECOVERY HUB ─── */}
        {activeTab === "abandoned" && (
          <div className="space-y-6">
            {/* Header Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="bg-white p-5 rounded-2xl border border-nn-hairline shadow-xs">
                <span className="text-xs font-bold text-gray-400 uppercase tracking-wider block mb-1">
                  Incomplete Checkouts
                </span>
                <div className="text-2xl font-serif font-extrabold text-[#5E0B10]">
                  {abandonedCarts.length}
                </div>
                <p className="text-[11px] text-gray-400 mt-1">Pending payments and dropped carts</p>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-nn-hairline shadow-xs">
                <span className="text-xs font-bold text-gray-400 uppercase tracking-wider block mb-1">
                  Revenue at Risk
                </span>
                <div className="text-2xl font-serif font-extrabold text-[#8A1B14]">
                  {formatINR(abandonedCarts.reduce((acc, c) => acc + (Number(c.subtotal) || 0), 0))}
                </div>
                <p className="text-[11px] text-gray-400 mt-1">Potential gross order value</p>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-nn-hairline shadow-xs">
                <span className="text-xs font-bold text-gray-400 uppercase tracking-wider block mb-1">
                  Recovery Strategy
                </span>
                <div className="text-2xl font-serif font-extrabold text-emerald-700">
                  Brevo + WhatsApp
                </div>
                <p className="text-[11px] text-emerald-600 font-semibold mt-1">
                  100% Primary Inbox Landing • Code DIWALI
                </p>
              </div>
            </div>

            {/* Abandoned Cart Directory Table */}
            <div className="bg-white rounded-2xl border border-nn-hairline shadow-xs overflow-hidden">
              <div className="p-4 bg-[#FAF6EE] border-b border-nn-hairline flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h3 className="text-sm font-bold text-nn-forest-deep uppercase tracking-wider flex items-center gap-1.5">
                    <ShoppingBag className="w-4 h-4 text-[#8A1B14]" /> Abandoned Carts Directory
                  </h3>
                  <p className="text-xs text-gray-400">1-click automated outreach with festive incentive</p>
                </div>
                <button
                  onClick={() => {
                    fetchAbandonedCarts();
                    toast.success("Refreshed abandoned carts");
                  }}
                  className="px-3 py-1.5 rounded-xl bg-white hover:bg-nn-cream border border-nn-hairline text-xs font-bold text-nn-forest-deep transition flex items-center gap-1.5 shadow-xs"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${isLoadingCarts ? "animate-spin" : ""}`} />
                  Refresh List
                </button>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-[#FCFAF5] text-nn-forest-deep uppercase text-[11px] font-bold border-b border-nn-hairline tracking-wider">
                    <tr>
                      <th className="py-3 px-4">Customer Details</th>
                      <th className="py-3 px-4">Cart Items</th>
                      <th className="py-3 px-4">Cart Value</th>
                      <th className="py-3 px-4">Elapsed Time</th>
                      <th className="py-3 px-4">Recovery Status</th>
                      <th className="py-3 px-4 text-center">Outreach Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-nn-hairline">
                    {abandonedCarts.length === 0 ? (
                      <tr>
                        <td colSpan={6} className="py-12 text-center text-gray-400">
                          No abandoned carts found in recent records.
                        </td>
                      </tr>
                    ) : (
                      abandonedCarts.map((cart, idx) => {
                        const dateObj = cart.dateObj instanceof Date && !isNaN(cart.dateObj.getTime())
                          ? cart.dateObj
                          : parseAnyDate(cart.lastActive || cart.updatedAt || cart.createdAt);
                        const { formatted, relative } = formatDateTime(dateObj);

                        const cleanPhone = (cart.phone || "").replace(/[^0-9]/g, "").slice(-10);

                        return (
                          <tr key={idx} className="hover:bg-[#FFFDF9] transition">
                            <td className="py-3.5 px-4">
                              <span className="font-bold text-nn-forest-deep block">
                                {cart.name || "Customer"}
                              </span>
                              <span className="text-[11px] text-gray-500 block">
                                {cart.email || "No email"}
                              </span>
                              {cleanPhone && (
                                <span className="text-[10px] text-gray-400 block font-mono">
                                  +91 {cleanPhone}
                                </span>
                              )}
                            </td>

                            <td className="py-3.5 px-4 max-w-xs">
                              <div className="space-y-0.5">
                                {(cart.cartItems || []).slice(0, 2).map((it: any, i: number) => (
                                  <div key={i} className="text-[11px] text-gray-700 truncate">
                                    • {it.quantity || 1}x {it.name || it.title || "A2 Gir Cow Ghee"}
                                  </div>
                                ))}
                                {(cart.cartItems || []).length > 2 && (
                                  <span className="text-[10px] text-[#8A1B14] font-semibold">
                                    +{(cart.cartItems || []).length - 2} more
                                  </span>
                                )}
                              </div>
                            </td>

                            <td className="py-3.5 px-4 whitespace-nowrap">
                              <span className="font-bold text-[#8A1B14] block text-xs">
                                {formatINR(cart.subtotal)}
                              </span>
                            </td>

                            <td className="py-3.5 px-4 whitespace-nowrap">
                              <span className="text-gray-900 font-semibold block text-xs">
                                {formatted}
                              </span>
                              <span className="text-gray-400 text-[10px] block font-medium">
                                {relative}
                              </span>
                            </td>

                            <td className="py-3.5 px-4">
                              {cart.notified || cart.recoveryEmailSent ? (
                                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-800 border border-emerald-200">
                                  <CheckCheck className="w-3 h-3 text-emerald-600" /> Email Sent
                                </span>
                              ) : (
                                <span className="inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-gray-100 text-gray-600 border border-gray-200">
                                  Pending Outreach
                                </span>
                              )}
                            </td>

                            <td className="py-3.5 px-4 text-center">
                              <div className="flex items-center justify-center gap-2">
                                <button
                                  onClick={() => handleSendRecoveryEmail(cart)}
                                  disabled={recoveringEmail === cart.email}
                                  className="px-3 py-1.5 rounded-lg bg-gradient-to-r from-[#8A1B14] to-[#5E0B10] text-white text-xs font-bold hover:opacity-95 transition disabled:opacity-50 flex items-center gap-1 shadow-xs"
                                >
                                  {recoveringEmail === cart.email ? (
                                    <RotateCw className="w-3 h-3 animate-spin" />
                                  ) : (
                                    <Send className="w-3 h-3" />
                                  )}
                                  Recover via Brevo
                                </button>

                                {cleanPhone && (
                                  <a
                                    href={`https://wa.me/91${cleanPhone}?text=Namaste%20${encodeURIComponent(
                                      cart.name || "Customer"
                                    )}%2C%20we%20noticed%20you%20were%20ordering%20pure%20Vedic%20Gir%20Cow%20Bilona%20Ghee%20at%20Namo%20Narayana.%20Use%20code%20DIWALI%20for%20an%20extra%2010%25%20OFF%20at%20namonarayanaghee.store`}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="p-1.5 text-emerald-600 hover:bg-emerald-50 rounded-lg transition"
                                    title="WhatsApp Recovery"
                                  >
                                    <MessageSquare className="w-4 h-4" />
                                  </a>
                                )}
                              </div>
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
        )}

        {/* ─── TAB 4: PROMO MAILER ─── */}
        {activeTab === "promo" && (
          <div className="bg-white p-6 rounded-2xl border border-nn-hairline shadow-xs space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-nn-hairline pb-4">
              <div>
                <h3 className="text-lg font-bold text-nn-forest-deep flex items-center gap-2">
                  <Mail className="w-5 h-5 text-[#8A1B14]" /> Customer Email Campaign Manager
                </h3>
                <p className="text-xs text-nn-bark">
                  Broadcast updates to collected visitor and customer leads via Brevo API
                </p>
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={handleSelectAllEmails}
                  className="px-3 py-1.5 text-xs font-semibold text-nn-forest-deep bg-[#FAF6EE] hover:bg-[#F3E7D3] rounded-lg transition border border-nn-hairline"
                >
                  {selectedEmails.length === emails.length ? "Deselect All" : "Select All"}
                </button>
                <button
                  onClick={() => setShowPreview(true)}
                  disabled={selectedEmails.length === 0}
                  className="bg-gradient-to-r from-[#8A1B14] to-[#5E0B10] text-white px-4 py-2 rounded-xl font-bold text-xs hover:opacity-90 transition disabled:opacity-50 flex items-center gap-2 shadow-sm"
                >
                  <Send className="w-3.5 h-3.5" />
                  Preview &amp; Send ({selectedEmails.length})
                </button>
              </div>
            </div>

            {/* Email Leads Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#FAF6EE] text-nn-forest-deep uppercase text-[11px] font-bold border-b border-nn-hairline tracking-wider">
                  <tr>
                    <th className="py-3 px-4 w-12 text-center">Select</th>
                    <th className="py-3 px-4">Recipient Email</th>
                    <th className="py-3 px-4">Captured Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-nn-hairline">
                  {emails.length === 0 ? (
                    <tr>
                      <td colSpan={3} className="py-8 text-center text-gray-400">
                        No collected promo leads found.
                      </td>
                    </tr>
                  ) : (
                    emails.map((e) => (
                      <tr key={e.id} className="hover:bg-[#FFFDF9] transition">
                        <td className="py-3 px-4 text-center">
                          <input
                            type="checkbox"
                            checked={selectedEmails.includes(e.email)}
                            onChange={() => handleSelectEmail(e.email)}
                            className="rounded border-gray-300 text-[#8A1B14] focus:ring-[#8A1B14]"
                          />
                        </td>
                        <td className="py-3 px-4 font-semibold text-nn-forest-deep">{e.email}</td>
                        <td className="py-3 px-4 text-gray-400 text-[11px]">
                          {e.createdAt?.seconds
                            ? new Date(e.createdAt.seconds * 1000).toLocaleDateString("en-IN")
                            : "Recent"}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </main>

      {/* ─── SLIDE-OVER ORDER DETAILS & FULFILLMENT DRAWER ─── */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 overflow-hidden bg-black/60 backdrop-blur-xs flex justify-end animate-fade-in">
          <div className="bg-white w-full max-w-2xl h-full shadow-2xl flex flex-col justify-between overflow-y-auto border-l border-nn-hairline">
            {/* Drawer Header */}
            <div className="p-6 bg-[#FAF6EE] border-b border-nn-hairline flex items-center justify-between sticky top-0 z-20">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#8A1B14] to-[#5E0B10] text-white flex items-center justify-center font-bold">
                  #{selectedOrder.id?.slice(-4)}
                </div>
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="font-serif font-bold text-lg text-nn-forest-deep">
                      Order #{selectedOrder.orderId || selectedOrder.id}
                    </h3>
                    <button
                      onClick={() =>
                        copyToClipboard(selectedOrder.orderId || selectedOrder.id, "order-id", "Order ID copied!")
                      }
                      className="text-gray-400 hover:text-gray-600"
                    >
                      <Copy className="w-3.5 h-3.5" />
                    </button>
                    {(() => {
                      const headerSt = getStatusConfig(selectedOrder.status, selectedOrder.paymentStatus);
                      return (
                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold border ${headerSt.badgeClass}`}>
                          <span className={`w-2 h-2 rounded-full shrink-0 ${headerSt.dotClass}`} />
                          {headerSt.label}
                        </span>
                      );
                    })()}
                  </div>
                  <span className="text-xs text-gray-500">
                    {getOrderDate(selectedOrder).toLocaleString("en-IN", { timeZone: "Asia/Kolkata" })}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setShowInvoicePrint(true)}
                  className="p-2 text-nn-bark hover:text-nn-forest-deep bg-white border border-nn-hairline rounded-xl shadow-xs"
                  title="Print Invoice / Packing Slip"
                >
                  <Printer className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setSelectedOrder(null)}
                  className="p-2 text-nn-bark hover:text-nn-ink bg-white border border-nn-hairline rounded-xl shadow-xs"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Drawer Body Content */}
            <div className="p-6 space-y-6 flex-1 bg-white">
              {/* 1. ORDER STATUS & EMAIL TRIGGER CONTROL HUB */}
              <div className="bg-gradient-to-br from-[#FFFDF9] to-[#FAF6EE] p-5 rounded-2xl border border-nn-hairline shadow-xs space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold text-nn-forest-deep uppercase tracking-wider flex items-center gap-1.5">
                    <Truck className="w-4 h-4 text-[#8A1B14]" /> Order Status &amp; Customer Email Dispatch
                  </h4>
                  <span className="text-[10px] bg-emerald-50 text-emerald-700 font-bold px-2 py-0.5 rounded-full border border-emerald-200">
                    Brevo Active
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  {/* Status Dropdown with Live Badge */}
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="font-bold text-gray-700 block">Update Order Status:</label>
                      {(() => {
                        const curCfg = getStatusConfig(editStatus);
                        return (
                          <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold border ${curCfg.badgeClass}`}>
                            <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${curCfg.dotClass}`} />
                            {curCfg.label}
                          </span>
                        );
                      })()}
                    </div>
                    <select
                      value={editStatus}
                      onChange={(e) => setEditStatus(e.target.value)}
                      className="w-full px-3 py-2 border border-nn-hairline rounded-xl bg-white text-gray-900 font-semibold focus:outline-none focus:ring-2 focus:ring-[#8A1B14]"
                    >
                      <option value="paid">🩵 Paid &amp; Confirmed (Awaiting Packing)</option>
                      <option value="processing">🟡 Processing (In Hand-Packing)</option>
                      <option value="shipped">🔵 Shipped (Handed to Courier)</option>
                      <option value="out_for_delivery">🟠 Out for Delivery (Arriving Today)</option>
                      <option value="delivered">🟢 Delivered Successfully</option>
                      <option value="delivery_failed">🔴 Delivery Failed (Logistics Issue &amp; 14d Refund)</option>
                      <option value="pending">⚪ Pending Payment</option>
                      <option value="cancelled">⚫ Cancelled &amp; Refunded</option>
                    </select>
                  </div>

                  {/* Courier Partner */}
                  <div>
                    <label className="font-bold text-gray-700 block mb-1">Courier Partner:</label>
                    <input
                      type="text"
                      value={editCourier}
                      onChange={(e) => setEditCourier(e.target.value)}
                      placeholder="e.g. Delhivery Express, Bluedart, DTDC"
                      className="w-full px-3 py-2 border border-nn-hairline rounded-xl bg-white text-gray-900 font-medium focus:outline-none focus:ring-2 focus:ring-[#8A1B14]"
                    />
                  </div>

                  {/* Tracking Number / AWB */}
                  <div className="sm:col-span-2">
                    <div className="flex justify-between items-center mb-1">
                      <label className="font-bold text-gray-700 block">AWB / Courier Tracking Number:</label>
                      {editTracking && (
                        <a
                          href={`https://www.namonarayanaghee.store/track-order?orderId=${selectedOrder.id}&awb=${encodeURIComponent(editTracking)}`}
                          target="_blank"
                          rel="noreferrer"
                          className="text-[#8A1B14] hover:underline font-bold text-[11px] flex items-center gap-1"
                        >
                          <ExternalLink className="w-3 h-3" /> Live Tracking Link
                        </a>
                      )}
                    </div>
                    <input
                      type="text"
                      value={editTracking}
                      onChange={(e) => setEditTracking(e.target.value)}
                      placeholder="e.g. 142093847291"
                      className="w-full px-3 py-2 border border-nn-hairline rounded-xl bg-white font-mono text-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-[#8A1B14]"
                    />
                  </div>
                </div>

                {/* Email Dispatch Checkbox */}
                <div className="flex items-center justify-between pt-2 border-t border-nn-hairline">
                  <label className="flex items-center gap-2 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={notifyCustomerEmail}
                      onChange={(e) => setNotifyCustomerEmail(e.target.checked)}
                      className="rounded border-gray-300 text-[#8A1B14] focus:ring-[#8A1B14]"
                    />
                    <span className="text-xs font-bold text-nn-forest-deep flex items-center gap-1">
                      <Mail className="w-3.5 h-3.5 text-[#8A1B14]" /> Notify Customer via Brevo Email (100% Inbox Delivery)
                    </span>
                  </label>

                  <button
                    type="button"
                    onClick={() => setShowEmailPreview(!showEmailPreview)}
                    className="text-xs font-semibold text-[#8A1B14] hover:underline flex items-center gap-1"
                  >
                    {showEmailPreview ? "Hide Preview" : "Preview Email"}
                    {showEmailPreview ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                  </button>
                </div>

                {/* Live Email Preview Accordion */}
                {showEmailPreview && (
                  <div className="bg-white p-4 rounded-xl border border-nn-hairline space-y-2 text-xs animate-fade-in">
                    <div className="text-[11px] text-gray-400 uppercase font-bold tracking-wider">
                      Subject Line Preview:
                    </div>
                    <div className="font-bold text-[#5E0B10] bg-[#FCFAF5] p-2.5 rounded-lg border border-[#EAD7BC]">
                      {editStatus === "processing" && `[Update] Your Order #${selectedOrder.orderId || selectedOrder.id} is Being Prepared | Namo Narayana`}
                      {editStatus === "shipped" && `[Shipped] Order #${selectedOrder.orderId || selectedOrder.id} is on the way via ${editCourier || "Delhivery"} | Namo Narayana`}
                      {editStatus === "out_for_delivery" && `[Arriving Today] Your Order #${selectedOrder.orderId || selectedOrder.id} is Out for Delivery | Namo Narayana`}
                      {editStatus === "delivery_failed" && `[Important Notice] Delivery Issue Regarding Order #${selectedOrder.orderId || selectedOrder.id} | Namo Narayana`}
                      {editStatus === "delivered" && `[Delivered] Your Namo Narayana Order #${selectedOrder.orderId || selectedOrder.id} Has Arrived! 🙏`}
                      {editStatus === "paid" && `Order Confirmed #${selectedOrder.orderId || selectedOrder.id} - Namo Narayana Pure A2 Ghee`}
                    </div>

                    <p className="text-gray-500 text-[11px] leading-relaxed pt-1">
                      {editStatus === "delivery_failed"
                        ? 'Includes logistics issue notification: "Delivery failed due to delivery partner logistics network issue, shipment failed to connect further, returning to seller, and refund will be initiated within 14 days."'
                        : "Includes item table, complimentary gifts badge, full shipping address, tracking button, and customer care links."}
                    </p>
                  </div>
                )}

                {/* Submit Status Change Button */}
                <button
                  onClick={handleUpdateOrderStatus}
                  disabled={isUpdatingStatus}
                  className="w-full bg-gradient-to-r from-[#8A1B14] to-[#5E0B10] text-white py-3 rounded-xl font-bold text-xs hover:opacity-95 transition disabled:opacity-50 flex items-center justify-center gap-2 shadow-sm"
                >
                  {isUpdatingStatus ? (
                    <>
                      <RotateCw className="w-4 h-4 animate-spin" />
                      Updating Status &amp; Dispatching Brevo Email...
                    </>
                  ) : (
                    <>
                      <Check className="w-4 h-4" />
                      Save Status &amp; Dispatch Notification
                    </>
                  )}
                </button>
              </div>

              {/* 2. CUSTOMER & DIRECT OUTREACH CARD */}
              <div className="bg-[#FAF6EE] p-5 rounded-2xl border border-nn-hairline space-y-3">
                <div className="flex items-center justify-between border-b border-nn-hairline pb-3">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400 block">
                      Customer Profile
                    </span>
                    <h4 className="font-bold text-sm text-nn-forest-deep">
                      {selectedOrder.shippingAddress?.name || selectedOrder.contactInfo?.name || "Customer"}
                    </h4>
                  </div>

                  {/* 1-Click WhatsApp & Call Actions */}
                  {(() => {
                    const phone = selectedOrder.contactInfo?.phone || selectedOrder.shippingAddress?.phone || "";
                    const cleanPhone = phone.replace(/[^0-9]/g, "").slice(-10);
                    return (
                      <div className="flex items-center gap-2">
                        {cleanPhone && (
                          <a
                            href={`https://wa.me/91${cleanPhone}?text=Namaste%20${encodeURIComponent(
                              selectedOrder.shippingAddress?.name || "Customer"
                            )}%2C%20update%20regarding%20your%20Namo%20Narayana%20order%20%23${selectedOrder.orderId || selectedOrder.id}%3A%20your%20order%20status%20is%20${encodeURIComponent(getStatusConfig(selectedOrder.status, selectedOrder.paymentStatus).label)}.`}
                            target="_blank"
                            rel="noreferrer"
                            className="px-3 py-1.5 rounded-lg bg-emerald-600 text-white font-bold text-xs hover:bg-emerald-700 transition flex items-center gap-1 shadow-xs"
                          >
                            <MessageSquare className="w-3.5 h-3.5" />
                            WhatsApp
                          </a>
                        )}
                        {cleanPhone && (
                          <a
                            href={`tel:${cleanPhone}`}
                            className="px-3 py-1.5 rounded-lg bg-white text-gray-700 font-bold text-xs hover:bg-gray-100 border border-nn-hairline transition flex items-center gap-1 shadow-xs"
                          >
                            <Phone className="w-3.5 h-3.5" />
                            Call
                          </a>
                        )}
                      </div>
                    );
                  })()}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  <div>
                    <span className="text-gray-400 block text-[11px]">Email Address:</span>
                    <strong className="text-nn-ink block truncate">{selectedOrder.contactInfo?.email || "N/A"}</strong>

                    <span className="text-gray-400 block text-[11px] mt-2">Contact Phone:</span>
                    <strong className="text-nn-ink block">{selectedOrder.contactInfo?.phone || "N/A"}</strong>
                  </div>

                  <div>
                    <span className="text-gray-400 block text-[11px]">Shipping Destination:</span>
                    <p className="text-gray-700 text-xs mt-0.5 leading-relaxed">
                      {selectedOrder.shippingAddress?.address}<br />
                      {selectedOrder.shippingAddress?.city}, {selectedOrder.shippingAddress?.state}{" "}
                      {selectedOrder.shippingAddress?.pincode}
                    </p>
                  </div>
                </div>
              </div>

              {/* 3. PURCHASED ITEMS & FREE GIFTS */}
              <div className="bg-white p-5 rounded-2xl border border-nn-hairline space-y-3">
                <h4 className="text-xs font-bold text-nn-forest-deep uppercase tracking-wider flex items-center gap-1.5">
                  <ShoppingBag className="w-4 h-4 text-[#8A1B14]" /> Order Parcel Items
                </h4>

                <div className="divide-y divide-nn-hairline">
                  {(selectedOrder.items || []).map((item: any, idx: number) => (
                    <div key={idx} className="py-2.5 flex items-center justify-between text-xs">
                      <div>
                        <strong className="text-nn-forest-deep text-xs block">{item.name || item.title}</strong>
                        {item.variantTitle && (
                          <span className="text-gray-400 text-[11px]">Size: {item.variantTitle}</span>
                        )}
                        {item.isGift && (
                          <span className="inline-block bg-emerald-50 text-emerald-700 text-[10px] font-bold px-2 py-0.5 rounded border border-emerald-200 mt-0.5">
                            COMPLIMENTARY GIFT
                          </span>
                        )}
                      </div>
                      <div className="text-right">
                        <span className="font-bold text-gray-900 block">x{item.quantity}</span>
                        <span className="text-[#8A1B14] font-bold">
                          {item.isGift ? "FREE" : `₹${(((item.price || 0) * (item.quantity || 1)) / 100).toFixed(2)}`}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* 4. FINANCIAL SETTLEMENT */}
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
                          <span>Discount Applied ({selectedOrder.couponCode || "Coupon"}):</span>
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

              {/* 5. PAYMENT GATEWAY AUDIT */}
              <div className="bg-white p-5 rounded-2xl border border-nn-hairline space-y-2 text-xs">
                <h4 className="text-xs font-bold text-nn-forest-deep uppercase tracking-wider flex items-center gap-1.5 mb-2">
                  <CreditCard className="w-4 h-4 text-[#D4A017]" /> Payment Gateway Telemetry
                </h4>
                <div className="grid grid-cols-2 gap-2 text-gray-600">
                  <div>
                    <span className="text-gray-400 block text-[11px]">Payment Method:</span>
                    <strong className="text-gray-900 uppercase">{selectedOrder.paymentMethod || "Prepaid"}</strong>
                  </div>
                  <div>
                    <span className="text-gray-400 block text-[11px]">Payment Status:</span>
                    <span className="inline-block px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-800 border border-emerald-200">
                      {selectedOrder.paymentStatus || "Verified"}
                    </span>
                  </div>
                  <div className="col-span-2 pt-1 font-mono text-[11px] text-gray-500">
                    Payment ID: {selectedOrder.paymentSessionId || selectedOrder.paymentDetails?.razorpay_payment_id || "None"}
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

      {/* ─── PRINTABLE INVOICE / PACKING SLIP MODAL ─── */}
      {showInvoicePrint && selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl p-8 max-h-[90vh] overflow-y-auto space-y-6">
            <div className="flex justify-between items-start border-b border-gray-200 pb-4">
              <div>
                <h2 className="text-xl font-serif font-bold text-[#5E0B10]">NAMO NARAYANA</h2>
                <p className="text-xs text-gray-500">Pure Vedic A2 Gir Cow Ghee • Packing Slip &amp; Tax Invoice</p>
              </div>
              <div className="text-right">
                <span className="font-mono font-bold text-sm text-gray-900 block">
                  #{selectedOrder.orderId || selectedOrder.id}
                </span>
                <span className="text-xs text-gray-400 block mb-1">
                  {getOrderDate(selectedOrder).toLocaleDateString("en-IN")}
                </span>
                {(() => {
                  const invSt = getStatusConfig(selectedOrder.status, selectedOrder.paymentStatus);
                  return (
                    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold border ${invSt.badgeClass}`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${invSt.dotClass}`} />
                      {invSt.label}
                    </span>
                  );
                })()}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 text-xs text-gray-700">
              <div>
                <strong className="block text-gray-900 mb-1">Delivered To:</strong>
                {selectedOrder.shippingAddress?.name}<br />
                {selectedOrder.shippingAddress?.address}<br />
                {selectedOrder.shippingAddress?.city}, {selectedOrder.shippingAddress?.state}{" "}
                {selectedOrder.shippingAddress?.pincode}<br />
                Phone: {selectedOrder.contactInfo?.phone}
              </div>
              <div>
                <strong className="block text-gray-900 mb-1">Dispatch Details:</strong>
                Courier: {editCourier || selectedOrder.courierPartner || "Delhivery"}<br />
                AWB Tracking: {editTracking || selectedOrder.trackingNumber || "Assigned"}<br />
                Payment: {selectedOrder.paymentMethod?.toUpperCase() || "PREPAID"} (PAID)
              </div>
            </div>

            <table className="w-full text-left text-xs border border-gray-200">
              <thead className="bg-gray-50 text-gray-700 font-bold">
                <tr>
                  <th className="p-2 border-b">Item</th>
                  <th className="p-2 border-b text-center">Qty</th>
                  <th className="p-2 border-b text-right">Amount</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {(selectedOrder.items || []).map((it: any, i: number) => (
                  <tr key={i}>
                    <td className="p-2">
                      <strong>{it.name || it.title}</strong>
                      {it.variantTitle && <span className="text-gray-500 block">Size: {it.variantTitle}</span>}
                    </td>
                    <td className="p-2 text-center">{it.quantity}</td>
                    <td className="p-2 text-right">
                      {it.isGift ? "FREE GIFT" : `₹${(((it.price || 0) * (it.quantity || 1)) / 100).toFixed(2)}`}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            <div className="flex justify-between items-center text-sm font-bold text-gray-900 border-t pt-3">
              <span>Total Paid Amount:</span>
              <span>₹{getOrderAmounts(selectedOrder).total.toFixed(2)}</span>
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t">
              <button
                onClick={() => setShowInvoicePrint(false)}
                className="px-4 py-2 text-xs font-semibold text-gray-600 hover:text-gray-900"
              >
                Close
              </button>
              <button
                onClick={() => window.print()}
                className="px-5 py-2 rounded-xl bg-gradient-to-r from-[#8A1B14] to-[#5E0B10] text-white text-xs font-bold hover:opacity-90 flex items-center gap-1.5"
              >
                <Printer className="w-3.5 h-3.5" />
                Print Packing Slip
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ─── PREVIEW MODAL FOR PROMO MAILER ─── */}
      {showPreview && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-xs" onClick={() => setShowPreview(false)} />
          <div className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl relative z-10 overflow-hidden flex flex-col max-h-[90vh]">
            <div className="p-5 border-b border-nn-hairline flex justify-between items-center bg-[#FAF9F5]">
              <div>
                <h3 className="text-xl font-bold text-nn-forest-deep">Campaign Mailer Preview</h3>
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
