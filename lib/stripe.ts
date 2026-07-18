import "server-only";
import Stripe from "stripe";

let stripeClient: Stripe | null = null;

export function getStripe() {
  const secretKey = process.env.STRIPE_SECRET_KEY;
  if (!secretKey) {
    throw new Error("STRIPE_SECRET_KEY is not configured");
  }
  stripeClient ??= new Stripe(secretKey);
  return stripeClient;
}

export function priceIdForPlan(plan: "regional" | "global") {
  const priceId =
    plan === "regional"
      ? process.env.STRIPE_REGIONAL_PRICE_ID
      : process.env.STRIPE_GLOBAL_PRICE_ID;

  if (!priceId) {
    throw new Error(`Stripe price ID is not configured for ${plan}`);
  }
  return priceId;
}
