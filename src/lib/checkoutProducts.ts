/**
 * Client-safe Checkout catalog: product ids + display labels only.
 *
 * Prices actually charged are defined server-side in
 * src/server/stripe.ts — never trust a price sent from the browser.
 * The server re-validates the product id and looks up its own pricing.
 */
export type CheckoutProductId =
  | "cyber-noir-preset-pack"
  | "architect-noir"
  | "supporter";

export const CHECKOUT_PRODUCT_DISPLAY: Record<
  CheckoutProductId,
  {
    name: string;
    priceLabel: string;
    /** Label on the card-checkout button. */
    checkoutLabel: string;
    /** Label on the mailto fallback while checkout is not configured. */
    fallbackLabel: string;
  }
> = {
  "cyber-noir-preset-pack": {
    name: "Cyber-Noir Preset Pack",
    priceLabel: "$10.99",
    checkoutLabel: "Buy — $10.99",
    fallbackLabel: "Procure Asset",
  },
  "architect-noir": {
    name: "Architect Noir Preset",
    priceLabel: "$15.00",
    checkoutLabel: "Buy — $15.00",
    fallbackLabel: "Procure Asset",
  },
  supporter: {
    name: "Dollhouse Deviants Supporter",
    priceLabel: "$8/mo",
    checkoutLabel: "Subscribe — $8/mo",
    fallbackLabel: "Become a Supporter",
  },
};
