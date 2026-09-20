# Checkout UX Improvements

## Proposed Changes

### 1. Toaster Configuration
- Updated `src/app/layout.tsx` to display toast notifications at `top-center` with a duration of 2 seconds. (Completed)

### 2. Order Summary Sticky Behavior
- Update `src/app/checkout/page.tsx` to ensure the order summary card is only sticky on desktop viewports (`lg:sticky`). This prevents it from ruining the mobile scrolling experience.

### 3. Pincode Auto-fetch
- Reorder the shipping address fields to ask for Pincode before City and State.
- Implement an `onChange` or `useEffect` hook to automatically fetch City and State data from `https://api.postalpincode.in/pincode/` when a 6-digit Pincode is entered.

### 4. Billing Address Placement
- Move the billing address selection ("Same as shipping" toggle and the alternative billing address form) from its own separate "Billing" step directly into the "Shipping" step.
- Update the step progress bar to remove the now-redundant "Billing" step, reducing the checkout friction.

### 5. Loading Spinner Between Steps
- Introduce a state variable `isTransitioning` to simulate a brief secure loading state between step changes.
- Add a spinner inside the "Continue" buttons when progressing between steps.

### 6. Icon Updates
- Scan `checkout/page.tsx` for any emojis (e.g., 💳, 🚚) and replace them with appropriate `lucide-react` vector icons (e.g., `CreditCard`, `Truck`).
