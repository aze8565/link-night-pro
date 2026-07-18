import "server-only";
import Stripe from "stripe";

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export function priceIdForPlan(plan: "regional" | "global") {
  return plan === "regional"
    ? process.env.STRIPE_REGIONAL_PRICE_ID!
    : process.env.STRIPE_GLOBAL_PRICE_ID!;
}
