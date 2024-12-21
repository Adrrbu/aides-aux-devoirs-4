export * from "./config";
export * from "./plans";
export { createCheckoutSession, cancelSubscription, updateSubscription, createFreeSubscription, stripe } from './client';

// Stripe webhook code below is for the server-side (Deno Deploy)
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import Stripe from "https://esm.sh/stripe@14.14.0";

const stripe = new Stripe(Deno.env.get("STRIPE_SECRET_KEY") || "", {
  apiVersion: "2023-10-16"
});

const supabaseUrl = Deno.env.get("SUPABASE_URL");
const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

const supabase = createClient(supabaseUrl!, supabaseServiceKey!);

serve(async (req) => {
  const signature = req.headers.get("stripe-signature");
  if (!signature) {
    return new Response("No signature", { status: 400 });
  }

  try {
    const body = await req.text();
    const webhookSecret = Deno.env.get("STRIPE_WEBHOOK_SECRET");
    const event = stripe.webhooks.constructEvent(
      body,
      signature,
      webhookSecret!
    );

    switch (event.type) {
      case "customer.subscription.created":
      case "customer.subscription.updated":
        const subscription = event.data.object;
        await supabase.from("subscriptions").upsert({
          id: subscription.id,
          user_id: subscription.customer,
          plan_id: subscription.items.data[0].price.product,
          status: subscription.status,
          current_period_end: new Date(
            subscription.current_period_end * 1000
          ).toISOString(),
          cancel_at_period_end: subscription.cancel_at_period_end
        });
        break;

      case "customer.subscription.deleted":
        const deletedSubscription = event.data.object;
        await supabase
          .from("subscriptions")
          .update({ status: "canceled" })
          .eq("id", deletedSubscription.id);
        break;
    }

    return new Response(JSON.stringify({ ok: true }), { status: 200 });
  } catch (err) {
    console.error("Error processing webhook:", err);
    return new Response("Webhook Error", { status: 400 });
  }
});
