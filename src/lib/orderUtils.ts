export function getDynamicOrderStatus(
  createdAt: { seconds: number; nanoseconds: number } | Date | null | undefined,
  dbStatus: string,
  paymentStatus?: string,
  paymentMethod?: string
): string {
  if (paymentStatus === "pending") {
    return "Payment Pending";
  }

  if (!createdAt) return "Processing";

  let createdDate: Date;
  if (createdAt instanceof Date) {
    createdDate = createdAt;
  } else if (typeof createdAt.seconds === "number") {
    createdDate = new Date(createdAt.seconds * 1000);
  } else {
    return "Processing";
  }

  const now = new Date();
  const diffMs = now.getTime() - createdDate.getTime();
  const diffHours = diffMs / (1000 * 60 * 60);
  const diffDays = diffHours / 24;

  // If the database has a status other than pending, and we explicitly set it
  // (e.g., manually overriding to 'delivered' or 'cancelled'), we could return it here.
  // But per instructions, we follow the time-based logic. 
  // We'll let 'delivered' or 'cancelled' bypass the logic if it's explicitly set.
  const overrideStatuses = ['delivered', 'cancelled'];
  if (overrideStatuses.includes(dbStatus?.toLowerCase())) {
    return dbStatus.charAt(0).toUpperCase() + dbStatus.slice(1);
  }

  if (diffHours < 10) {
    return "Order Processing";
  } else if (diffDays < 6) {
    return "Order on the way";
  } else if (diffDays >= 6 && diffDays < 7) {
    return "Out for delivery";
  } else if (diffDays >= 7 && diffDays < 10) {
    return "Delivery partner was unable to connect to the customer, will try again delivery today";
  } else {
    return "Order completion failed, package returning to seller";
  }
}
