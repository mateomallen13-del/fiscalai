import { NextResponse } from "next/server";
import { stripe } from "@/lib/stripe/server";
import { createClient } from "@supabase/supabase-js";

function getSupabaseAdmin() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
}

export async function POST(request: Request) {
  const body = await request.text();
  const signature = request.headers.get("stripe-signature")!;

  let event;
  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err) {
    console.error("Webhook signature verification failed:", err);
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  switch (event.type) {
    case "checkout.session.completed": {
      const session = event.data.object;
      const userId = session.metadata?.user_id;
      if (userId) {
        await getSupabaseAdmin()
          .from("profiles")
          .update({
            stripe_customer_id: session.customer as string,
            subscription_status: "active",
            subscription_id: session.subscription as string,
          })
          .eq("id", userId);
      }
      break;
    }
    case "customer.subscription.updated": {
      const subscription = event.data.object;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const periodEnd = (subscription as any).current_period_end as number | undefined;
      await getSupabaseAdmin()
        .from("profiles")
        .update({
          subscription_status: subscription.status === "active" ? "active" : "past_due",
          ...(periodEnd
            ? { current_period_end: new Date(periodEnd * 1000).toISOString() }
            : {}),
        })
        .eq("stripe_customer_id", subscription.customer as string);
      break;
    }
    case "customer.subscription.deleted": {
      const subscription = event.data.object;
      await getSupabaseAdmin()
        .from("profiles")
        .update({ subscription_status: "cancelled" })
        .eq("stripe_customer_id", subscription.customer as string);
      break;
    }
  }

  return NextResponse.json({ received: true });
}
