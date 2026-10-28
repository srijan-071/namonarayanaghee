import { NextResponse } from "next/server";
import { db } from "@/lib/firebase";
import { doc, getDoc, updateDoc } from "firebase/firestore/lite";
import { sendOrderStatusEmail, OrderStatusType } from "@/lib/transactional-emails";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const {
      orderId,
      status,
      courierPartner,
      trackingNumber,
      notifyCustomer = true,
      adminNotes
    } = body;

    if (!orderId || !status) {
      return NextResponse.json(
        { error: "orderId and status are required fields" },
        { status: 400 }
      );
    }

    const orderRef = doc(db, "orders", orderId);
    const snap = await getDoc(orderRef);

    if (!snap.exists()) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    const orderData = snap.data();
    const nowIso = new Date().toISOString();

    const previousHistory = Array.isArray(orderData.statusHistory)
      ? orderData.statusHistory
      : [];

    const newHistoryEntry = {
      status,
      timestamp: nowIso,
      courierPartner: courierPartner || orderData.courierPartner || null,
      trackingNumber: trackingNumber || orderData.trackingNumber || null,
      adminNotes: adminNotes || null,
      notified: Boolean(notifyCustomer),
    };

    const updatePayload: Record<string, any> = {
      status,
      updatedAt: new Date(),
      statusHistory: [...previousHistory, newHistoryEntry],
    };

    if (courierPartner) {
      updatePayload.courierPartner = courierPartner.trim();
    }
    if (trackingNumber) {
      updatePayload.trackingNumber = trackingNumber.trim();
      updatePayload.awbNumber = trackingNumber.trim();
    }
    if (adminNotes !== undefined) {
      updatePayload.adminNotes = adminNotes;
    }

    // If status is delivery_failed, record return & refund details
    if (status === "delivery_failed") {
      updatePayload.deliveryFailedAt = nowIso;
      updatePayload.deliveryFailureReason = "Logistics partner network issue - failed to connect";
      updatePayload.rtoInitiated = true;
      updatePayload.refundExpectedWithinDays = 14;
    }

    await updateDoc(orderRef, updatePayload);

    const mergedOrder = {
      ...orderData,
      ...updatePayload,
      id: orderId,
    };

    let emailResult: { success: boolean; error?: string; messageId?: string } = {
      success: false,
      error: "Notification skipped",
    };

    if (notifyCustomer) {
      emailResult = await sendOrderStatusEmail(
        orderId,
        status as OrderStatusType,
        mergedOrder,
        {
          courierPartner: courierPartner || orderData.courierPartner,
          trackingNumber: trackingNumber || orderData.trackingNumber,
        }
      );

      // Record dispatch result in order doc
      if (emailResult.success) {
        await updateDoc(orderRef, {
          lastNotificationSentAt: nowIso,
          lastNotificationStatus: status,
        }).catch(() => {});
      }
    }

    return NextResponse.json({
      success: true,
      order: mergedOrder,
      emailSent: emailResult.success,
      emailError: emailResult.error || null,
    });
  } catch (error: any) {
    console.error("Update order status API error:", error);
    return NextResponse.json(
      { error: error?.message || "Failed to update order status" },
      { status: 500 }
    );
  }
}
