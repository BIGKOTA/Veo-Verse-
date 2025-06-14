import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import {
  createUser,
  getUserByEmail,
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
    const { amount, metadata = {} } = await request.json();

    // Validate amount (should be $25 for basic subscription)
    if (!amount || amount !== 25) {
      return NextResponse.json(
        { error: "Invalid subscription amount" },
        { status: 400 },
      );
    }

    // Validate required metadata
    if (!metadata.customerEmail || !metadata.customerName) {
      return NextResponse.json(
        { error: "Customer information is required" },
        { status: 400 },
      );
    }

    // Store user information in Supabase first
    let user;
    try {
      // Check if user exists, if not create them
      user = await getUserByEmail(metadata.customerEmail);

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
    } catch (supabaseError) {
      console.error("Error handling user data in Supabase:", supabaseError);
      return NextResponse.json(
        { error: "Failed to process user information" },
        { status: 500 },
      );
    }

    // Create or retrieve Stripe customer
    let customer;
    try {
      // Check if customer already exists
      const existingCustomers = await stripe.customers.list({
        email: metadata.customerEmail,
        limit: 1,
      });

      if (existingCustomers.data.length > 0) {
        customer = existingCustomers.data[0];
      } else {
        // Create new customer
        customer = await stripe.customers.create({
          email: metadata.customerEmail,
          name: metadata.customerName,
          metadata: {
            user_id: user.id,
            referral_code: metadata.referralCode || "",
          },
        });
      }
    } catch (stripeError: any) {
      console.error("Error creating Stripe customer:", stripeError);
      return NextResponse.json(
        { error: "Failed to create customer" },
        { status: 500 },
      );
    }

    // Create product and price first
    let price;
    try {
      // Create or get existing product
      const product = await stripe.products.create({
        name: "VEO VERSE - AI Prompt Generator",
        description:
          "Monthly subscription to AI Prompt Generator with Discord community access",
      });

      // Create price for the product
      price = await stripe.prices.create({
        currency: "usd",
        unit_amount: amount * 100, // $25 in cents
        recurring: {
          interval: "month",
        },
        product: product.id,
      });
    } catch (priceError: any) {
      console.error("Error creating product/price:", priceError);
      return NextResponse.json(
        { error: "Failed to create pricing" },
        { status: 500 },
      );
    }

    // Create subscription
    try {
      const subscription = await stripe.subscriptions.create({
        customer: customer.id,
        items: [
          {
            price: price.id,
          },
        ],
        payment_behavior: "default_incomplete",
        payment_settings: { save_default_payment_method: "on_subscription" },
        expand: ["latest_invoice.payment_intent"],
        metadata: {
          user_id: user.id,
          package_type: "basic",
          include_coaching: "false",
        },
      });

      // Store subscription in Supabase
      try {
        await createUserSubscription({
          user_id: user.id,
          package_type: "basic",
          include_coaching: false,
        });

        console.log(
          `Subscription created for user ${user.email} with subscription ID ${subscription.id}`,
        );
      } catch (supabaseError) {
        console.error(
          "Error storing subscription data in Supabase:",
          supabaseError,
        );
        // Don't fail the subscription creation if Supabase fails
      }

      const invoice = subscription.latest_invoice as Stripe.Invoice;
      const paymentIntent = invoice.payment_intent as Stripe.PaymentIntent;

      return NextResponse.json({
        subscriptionId: subscription.id,
        clientSecret: paymentIntent.client_secret,
      });
    } catch (stripeError: any) {
      console.error("Error creating subscription:", stripeError);
      return NextResponse.json(
        { error: stripeError.message || "Failed to create subscription" },
        { status: 500 },
      );
    }
  } catch (error: any) {
    console.error("Error in create-subscription:", error);
    return NextResponse.json(
      { error: error.message || "Failed to create subscription" },
      { status: 500 },
    );
  }
}
