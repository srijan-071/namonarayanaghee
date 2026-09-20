# Direct Razorpay Integration

Since the payment hub (potter-world) is causing issues, we will integrate Razorpay directly into this app to bypass the security layers and Firestore dependencies.

## Proposed Changes
1. **Install Razorpay:** `npm install razorpay` in this project.
2. **Update Environment Variables:** Add Razorpay keys to `.env.local` here.
3. **Modify `api/create-payment-session/route.ts`:**
   - Instead of fetching from `potter-world.com`, use the `razorpay` SDK to create an order directly.
   - Return the Razorpay `order_id` and amount to the frontend.
4. **Modify `checkout/page.tsx`:**
   - Load the Razorpay checkout script.
   - When the user clicks "Pay", open the Razorpay modal.
   - On success, redirect to `/checkout/success`.

