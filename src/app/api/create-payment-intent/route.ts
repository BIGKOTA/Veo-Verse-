import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import {
  createUser,
  getUserByEmail,
  createPayment,
  createUserSubscription,
} from "@/lib/supabase";

if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error("STRIPE_SECRET_KEY is not set");
}

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: "2025-01-27.acacia",
});

export async function POST(request: NextRequest) {
  try {
    const {
      amount,
      coachingAmount = 0,
      currency = "usd",
      metadata = {},
    } = await request.json();

    // Validate amount
    if (!amount || amount <= 0) {
      return NextResponse.json({ error: "Invalid amount" }, { status: 400 });
    }

    // Validate required metadata
    if (!metadata.customerEmail || !metadata.customerName) {
      return NextResponse.json(
        { error: "Customer information is required" },
        { status: 400 },
      );
    }

    // This endpoint is now only for coaching packages (subscription + one-time coaching fee)
    if (metadata.includeCoaching !== "true" || coachingAmount <= 0) {
      return NextResponse.json(
        { error: "This endpoint is only for coaching packages" },
        { status: 400 },
      );
    }

    // Create a PaymentIntent for the coaching fee only
    // The subscription will be handled separately
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(coachingAmount * 100), // Only charge for coaching, subscription handled separately
      currency,
      metadata: {
        ...metadata,
        coaching_fee: "true",
        subscription_amount: "25",
      },
      automatic_payment_methods: {
        enabled: true,
      },
      description: `VEO VERSE - Premium Coaching Add-on (${coachingAmount})`,
    });

    // Store user and payment information in Supabase
    try {
      // Check if user exists, if not create them
      let user = await getUserByEmail(metadata.customerEmail);

      if (!user) {
        const [firstName, ...lastNameParts] = metadata.customerName.split(" ");
        const lastName = lastNameParts.join(" ") || "";

        try {
          user = await createUser({
            email: metadata.customerEmail,
            first_name: firstName,
            last_name: lastName,
            referral_code: metadata.referralCode || undefined,
          });
        } catch (createUserError: any) {
          // If user creation fails due to duplicate email, try to get the existing user
          if (
            createUserError.code === "23505" &&
            createUserError.message.includes("users_email_key")
          ) {
            console.log(
              `User with email ${metadata.customerEmail} already exists, fetching existing user`,
            );
            user = await getUserByEmail(metadata.customerEmail);
            if (!user) {
              throw new Error("User exists but could not be retrieved");
            }
          } else {
            throw createUserError;
          }
        }
      }

      // Create payment record for coaching fee
      await createPayment({
        user_id: user.id,
        stripe_payment_intent_id: paymentIntent.id,
        amount: Math.round(coachingAmount * 100),
        currency,
        status: "pending",
        package_type: "coaching_addon",
        include_coaching: true,
        metadata: {
          ...metadata,
          stripe_payment_intent_id: paymentIntent.id,
          coaching_fee: "true",
          subscription_amount: "25",
        },
      });

      // Also create subscription record
      await createUserSubscription({
        user_id: user.id,
        package_type: "premium",
        include_coaching: true,
      });

      console.log(
        `Payment record created for user ${user.email} with payment intent ${paymentIntent.id}`,
      );
    } catch (supabaseError) {
      console.error("Error storing payment data in Supabase:", supabaseError);
      // Don't fail the payment intent creation if Supabase fails
      // The payment can still proceed, but we log the error
    }

    return NextResponse.json({
      clientSecret: paymentIntent.client_secret,
    });
  } catch (error: any) {
    console.error("Error creating payment intent:", error);
    return NextResponse.json(
      { error: error.message || "Failed to create payment intent" },
      { status: 500 },
    );
  }
}
