export function getDynamicOrderStatus(
  createdAt: { seconds: number; nanoseconds: number } | Date | null | undefined,
  dbStatus: string,
  paymentStatus?: string,
  paymentMethod?: string
): string {
  // If explicitly marked as shipped, in_transit, delivered, or cancelled in the database
  const explicitStatuses = ['shipped', 'in_transit', 'delivered', 'cancelled'];
  if (explicitStatuses.includes(dbStatus?.toLowerCase())) {
    if (dbStatus?.toLowerCase() === 'shipped' || dbStatus?.toLowerCase() === 'in_transit') {
      return "Shipped (In Transit)";
    }
    return dbStatus.charAt(0).toUpperCase() + dbStatus.slice(1);
  }

  if (paymentStatus === "pending" && paymentMethod?.toLowerCase() !== "cod") {
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
