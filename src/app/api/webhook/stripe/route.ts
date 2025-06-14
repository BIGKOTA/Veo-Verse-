import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import {
  updatePaymentStatus,
  createUserSubscription,
  getUserByEmail,
} from "@/lib/supabase";

if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error("STRIPE_SECRET_KEY is not set");
}

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: "2025-01-27.acacia",
});

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

export async function POST(request: NextRequest) {
  try {
    const body = await request.text();
    const signature = request.headers.get("stripe-signature");

    if (!signature || !webhookSecret) {
      console.error("Missing Stripe signature or webhook secret");
      return NextResponse.json(
        { error: "Webhook signature verification failed" },
        { status: 400 },
      );
    }

    let event: Stripe.Event;

    try {
      event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
    } catch (err: any) {
      console.error("Webhook signature verification failed:", err.message);
      return NextResponse.json(
        { error: "Webhook signature verification failed" },
        { status: 400 },
      );
    }

    // Handle the event
    switch (event.type) {
      case "payment_intent.succeeded":
        const paymentIntent = event.data.object as Stripe.PaymentIntent;
        await handlePaymentSuccess(paymentIntent);
        break;

      case "payment_intent.payment_failed":
        const failedPayment = event.data.object as Stripe.PaymentIntent;
        await handlePaymentFailure(failedPayment);
        break;

      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    return NextResponse.json({ received: true });
  } catch (error: any) {
    console.error("Webhook error:", error);
    return NextResponse.json(
      { error: error.message || "Webhook processing failed" },
      { status: 500 },
    );
  }
}

async function handlePaymentSuccess(paymentIntent: Stripe.PaymentIntent) {
  try {
    console.log(`Payment succeeded: ${paymentIntent.id}`);

    // Update payment status in database
    const payment = await updatePaymentStatus(paymentIntent.id, "succeeded");

    // Get user information
    const customerEmail = paymentIntent.metadata.customerEmail;
    if (!customerEmail) {
      console.error("No customer email found in payment intent metadata");
      return;
    }

    const user = await getUserByEmail(customerEmail);
    if (!user) {
      console.error(`User not found for email: ${customerEmail}`);
      return;
    }

    // Create user subscription
    const includeCoaching = paymentIntent.metadata.includeCoaching === "true";
    const packageType = includeCoaching ? "premium" : "basic";

    // Set expiration date (1 year from now for lifetime access)
    const expiresAt = new Date();
    expiresAt.setFullYear(expiresAt.getFullYear() + 1);

    await createUserSubscription({
      user_id: user.id,
      package_type: packageType,
      include_coaching: includeCoaching,
      expires_at: expiresAt.toISOString(),
    });

    console.log(
      `Subscription created for user ${user.email} with package ${packageType}`,
    );

    // Here you could add additional logic like:
    // - Send welcome email
    // - Add user to Discord/WhatsApp groups
    // - Trigger other post-purchase actions
  } catch (error) {
    console.error("Error handling payment success:", error);
  }
}

async function handlePaymentFailure(paymentIntent: Stripe.PaymentIntent) {
  try {
    console.log(`Payment failed: ${paymentIntent.id}`);

    // Update payment status in database
    await updatePaymentStatus(paymentIntent.id, "failed");

    // Here you could add additional logic like:
    // - Send failure notification email
    // - Log failure reasons
    // - Trigger retry mechanisms
  } catch (error) {
    console.error("Error handling payment failure:", error);
  }
}
