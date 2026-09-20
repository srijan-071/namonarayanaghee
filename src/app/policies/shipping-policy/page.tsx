import PolicyLayout from "@/components/layout/PolicyLayout";

export const metadata = {
  title: "Shipping Policy",
  description: "Shipping Policy for Namo Narayana",
};

export default function ShippingPolicyPage() {
  return (
    <PolicyLayout title="Shipping Policy">
      <h2>Order Processing</h2>
      <p>
        All orders are processed within 1 to 2 business days (excluding weekends and holidays) after receiving your order confirmation email. You will receive another notification when your order has shipped.
      </p>

      <h2>Domestic Shipping Rates and Estimates</h2>
      <p>
        Shipping charges for your order will be calculated and displayed at checkout. We offer standard shipping across India.
      </p>
      <ul>
        <li><strong>Standard Shipping:</strong> Typically takes 3-7 business days for delivery depending on the destination pin code.</li>
      </ul>
      <p>
        <em>Please note: Deliveries to remote locations may take additional time.</em>
      </p>

      <h2>In-store Pickup</h2>
      <p>
        We do not currently offer in-store or warehouse pickup options. All orders are fulfilled via our shipping partners.
      </p>

      <h2>International Shipping</h2>
      <p>
        At this time, we only ship to addresses within India. We do not offer international shipping.
      </p>

      <h2>How do I check the status of my order?</h2>
      <p>
        When your order has shipped, you will receive an email notification from us which will include a tracking number you can use to check its status. Please allow 48 hours for the tracking information to become available.
      </p>
      <p>
        If you haven&apos;t received your order within 7 days of receiving your shipping confirmation email, please contact us at <a href="mailto:support@namonarayanaghee.store">support@namonarayanaghee.store</a> with your name and order number, and we will look into it for you.
      </p>

      <h2>Refunds, returns, and exchanges</h2>
      <p>
        We accept returns up to 30 days after delivery, if the item is unused and in its original condition. Please review our full <a href="/policies/refund-policy">Refund Policy</a> for details.
      </p>
      <p>
        In the event that your order arrives damaged in any way, please email us as soon as possible at <a href="mailto:support@namonarayanaghee.store">support@namonarayanaghee.store</a> with your order number and a photo of the item&apos;s condition. We address these on a case-by-case basis but will try our best to work towards a satisfactory solution.
      </p>
      <p>
        If you have any further questions, please don&apos;t hesitate to contact us at <a href="mailto:support@namonarayanaghee.store">support@namonarayanaghee.store</a>.
      </p>
    </PolicyLayout>
  );
}
