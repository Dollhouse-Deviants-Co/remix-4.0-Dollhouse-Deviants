import type { Request, Response } from "express";
import Stripe from "stripe";
import {
  CHECKOUT_PRODUCT_DISPLAY,
  type CheckoutProductId,
} from "../lib/checkoutProducts";

/**
 * Stripe Checkout for the Boutique + Supporter tier.
 *
 * SETUP ONLY, test mode. The server boots and serves the site with no keys
 * configured — checkout buttons fall back to mailto until the test keys are
 * in the server .env (see .env.example + the setup checklist).
 *
 * Money rules (repo AGENTS.md): payment decisions are server-verified.
 * Prices live ONLY here, never in client-sent data. No card data ever
 * touches this server — Stripe Checkout hosts the payment form.
 * No fulfillment is built yet: the webhook below only logs
 * checkout.session.completed. Delivery / Telegram unlock come later.
 */

interface CheckoutPricing {
  /** Amount in cents, USD. */
  amountCents: number;
  mode: "payment" | "subscription";
}

const CHECKOUT_PRODUCT_PRICING: Record<CheckoutProductId, CheckoutPricing> = {
  "cyber-noir-preset-pack": { amountCents: 1099, mode: "payment" },
  "architect-noir": { amountCents: 1500, mode: "payment" },
  supporter: { amountCents: 800, mode: "subscription" },
};

export function isCheckoutConfigured(): boolean {
  const key = process.env.STRIPE_SECRET_KEY;
  return typeof key === "string" && key.length > 0;
}

let stripeClient: Stripe | null = null;

function getStripe(): Stripe | null {
  const secretKey = process.env.STRIPE_SECRET_KEY;
  if (!secretKey) {
    return null;
  }
  if (!stripeClient) {
    stripeClient = new Stripe(secretKey);
  }
  return stripeClient;
}

function siteUrl(): string {
  const configured = process.env.SITE_URL?.trim();
  if (configured) {
    return configured.replace(/\/$/, "");
  }
  return "https://dollhousedeviants.com";
}

/** Tells the client whether card checkout is live (no secrets returned). */
export function checkoutConfig(_req: Request, res: Response): void {
  res.json({ checkoutAvailable: isCheckoutConfigured() });
}

export async function createCheckoutSession(
  req: Request,
  res: Response,
): Promise<void> {
  // Validate the product before touching Stripe, so a bad id is a 400
  // even while checkout is unconfigured.
  const productId = req.body?.productId;
  if (
    typeof productId !== "string" ||
    !(productId in CHECKOUT_PRODUCT_PRICING)
  ) {
    res.status(400).json({
      error: "invalid_product",
      message: "Unknown product.",
    });
    return;
  }

  const stripe = getStripe();
  if (!stripe) {
    res.status(501).json({
      error: "checkout_unavailable",
      message: "Card checkout is not configured yet. Email to order instead.",
      checkoutAvailable: false,
    });
    return;
  }

  const id = productId as CheckoutProductId;
  const display = CHECKOUT_PRODUCT_DISPLAY[id];
  const pricing = CHECKOUT_PRODUCT_PRICING[id];
  const base = siteUrl();

  const priceData: Stripe.Checkout.SessionCreateParams.LineItem.PriceData = {
    currency: "usd",
    product_data: {
      name: display.name,
      description: `Dollhouse Deviants — ${display.name}`,
    },
    unit_amount: pricing.amountCents,
  };
  if (pricing.mode === "subscription") {
    priceData.recurring = { interval: "month" };
  }

  try {
    const session = await stripe.checkout.sessions.create({
      mode: pricing.mode,
      line_items: [{ price_data: priceData, quantity: 1 }],
      success_url: `${base}/boutique?checkout=success&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${base}/boutique?checkout=cancelled`,
    });
    res.json({ url: session.url, checkoutAvailable: true });
  } catch (error) {
    // Never leak Stripe's internals to the client.
    console.error(
      "[Stripe Checkout] session creation failed",
      error instanceof Error ? error.message : String(error),
    );
    res.status(502).json({
      error: "checkout_failed",
      message: "Checkout could not be started. Try again or email to order.",
    });
  }
}

/**
 * Webhook stub: verifies the Stripe signature when a webhook secret is
 * configured, logs checkout.session.completed, and does NOTHING else.
 * Fulfillment (delivery / Telegram unlock) is a separate, later step.
 *
 * This route must stay registered with express.raw() (see server.ts) —
 * the JSON parser would destroy the raw body the signature covers.
 */
export async function stripeWebhook(
  req: Request,
  res: Response,
): Promise<void> {
  const stripe = getStripe();
  const signature = req.get("stripe-signature") ?? "";
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  try {
    let event: Stripe.Event;
    if (stripe && webhookSecret && signature) {
      event = stripe.webhooks.constructEvent(
        req.body as Buffer,
        signature,
        webhookSecret,
      );
    } else {
      // Test-mode stub without a configured secret: parse + log only.
      // Nothing is fulfilled from an unverified event.
      const payload = Buffer.isBuffer(req.body)
        ? req.body.toString("utf8")
        : "";
      event = JSON.parse(payload) as Stripe.Event;
      console.warn(
        "[Stripe webhook] received without signature verification " +
          "(no webhook secret configured). No fulfillment ran.",
      );
    }

    if (event.type === "checkout.session.completed") {
      const session = event.data.object as Stripe.Checkout.Session;
      console.log("[Stripe webhook] checkout.session.completed", {
        id: session.id,
        mode: session.mode,
        amountTotal: session.amount_total,
        customerEmail: session.customer_details?.email ?? null,
      });
      // TODO: fulfillment — delivery / Telegram unlock. Not built yet.
    } else {
      console.log("[Stripe webhook] ignored event", event.type);
    }
    res.json({ received: true });
  } catch (error) {
    console.error(
      "[Stripe webhook] failed",
      error instanceof Error ? error.message : String(error),
    );
    res.status(400).json({
      error: "invalid_webhook",
      message: "Webhook payload could not be verified.",
    });
  }
}
