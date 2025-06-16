"use client";
import React, { useState, useEffect, useCallback } from "react";
import { loadStripe, Stripe } from "@stripe/stripe-js";
import {
  Elements,
  CardElement,
  useStripe,
  useElements,
  StripeCardElement,
} from "@stripe/react-stripe-js";

// Simple UI components to avoid dynamic import issues
function SimpleButton({ children, className, disabled, onClick, type }: any) {
  return (
    <button
      type={type}
      className={className}
      disabled={disabled}
      onClick={onClick}
    >
      {children}
    </button>
  );
}

function SimpleLabel({ children, className }: any) {
  return <label className={className}>{children}</label>;
}

function SimpleSeparator({ className }: any) {
  return <div className={className}></div>;
}

// Get Stripe publishable key with fallback
const getStripePublishableKey = () => {
  if (typeof window !== "undefined") {
    return process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY;
  }
  return null;
};

// Initialize Stripe with better error handling and client-side only
const getStripePromise = () => {
  if (typeof window === "undefined") {
    return Promise.resolve(null);
  }

  const key = getStripePublishableKey();
  if (!key) {
    console.warn("Stripe publishable key not found");
    return Promise.resolve(null);
  }

  return loadStripe(key).catch((error) => {
    console.error("Failed to load Stripe:", error);
    return null;
  });
};

const cardElementOptions = {
  style: {
    base: {
      fontSize: "16px",
      color: "#ffffff",
      "::placeholder": {
        color: "#94a3b8",
      },
      backgroundColor: "transparent",
    },
    invalid: {
      color: "#ef4444",
    },
  },
  hidePostalCode: true,
};

// Payment Form Component with Stripe Elements
function PaymentForm({
  totalPrice,
  includeCoaching,
  formData,
  onPaymentSuccess,
}: {
  totalPrice: number;
  includeCoaching: boolean;
  formData: any;
  onPaymentSuccess: () => void;
}) {
  const stripe = useStripe();
  const elements = useElements();
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentError, setPaymentError] = useState("");
  const [clientSecret, setClientSecret] = useState("");
  const [subscriptionId, setSubscriptionId] = useState("");

  const createPayment = useCallback(async () => {
    if (!formData?.firstName || !formData?.lastName || !formData?.email) {
      return;
    }

    try {
      const endpoint = includeCoaching
        ? "/api/create-payment-intent"
        : "/api/create-subscription";

      const requestBody = {
        amount: includeCoaching ? totalPrice : 25, // Base subscription is always $25
        coachingAmount: includeCoaching ? 275 : 0, // Coaching add-on
        metadata: {
          includeCoaching: includeCoaching.toString(),
          package: includeCoaching ? "premium" : "basic",
          customerName: `${formData.firstName} ${formData.lastName}`,
          customerEmail: formData.email,
          referralCode: formData.referralCode || "",
        },
      };

      const response = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody),
      });

      if (!response.ok) {
        const errorData = await response
          .json()
          .catch(() => ({ error: "Unknown error" }));
        throw new Error(errorData.error || "Failed to create payment");
      }

      const data = await response.json();
      if (data?.clientSecret) {
        setClientSecret(data.clientSecret);
      }
      if (data?.subscriptionId) {
        setSubscriptionId(data.subscriptionId);
      }
    } catch (error: any) {
      console.error("Error creating payment:", error);
      setPaymentError(
        error?.message ||
          "Failed to initialize payment. Please refresh the page.",
      );
    }
  }, [totalPrice, includeCoaching, formData]);

  useEffect(() => {
    if (formData?.firstName && formData?.lastName && formData?.email) {
      createPayment();
    }
  }, [createPayment, formData]);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!stripe || !elements || !clientSecret) {
      setPaymentError("Payment system not ready. Please try again.");
      return;
    }

    if (!formData?.firstName || !formData?.lastName || !formData?.email) {
      setPaymentError("Please fill in all required fields.");
      return;
    }

    setIsProcessing(true);
    setPaymentError("");

    try {
      const cardElement = elements.getElement(
        CardElement,
      ) as StripeCardElement | null;
      if (!cardElement) {
        setPaymentError("Card information not found.");
        setIsProcessing(false);
        return;
      }

      // Both coaching and subscription payments use confirmCardPayment
      // because the subscription API returns a PaymentIntent, not a SetupIntent
      const paymentMethodData = {
        card: cardElement,
        billing_details: {
          name: `${formData.firstName} ${formData.lastName}`,
          email: formData.email,
        },
      };

      const result = await stripe.confirmCardPayment(clientSecret, {
        payment_method: paymentMethodData,
      });

      if (result.error) {
        console.error("Stripe payment error:", result.error);
        setPaymentError(result.error.message || "Payment failed");
        setIsProcessing(false);
      } else if (
        result.paymentIntent &&
        result.paymentIntent.status === "succeeded"
      ) {
        onPaymentSuccess();
      } else {
        setPaymentError("Payment was not completed successfully.");
        setIsProcessing(false);
      }
    } catch (error: any) {
      console.error("Payment processing error:", error);
      setPaymentError(error?.message || "Payment failed");
      setIsProcessing(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <SimpleLabel className="text-cyan-100 mb-2 block">
          Card Information
        </SimpleLabel>
        <div className="bg-slate-700/50 border border-slate-600 rounded-md p-3">
          <CardElement options={cardElementOptions} />
        </div>
      </div>

      <SimpleSeparator className="bg-purple-500/30 h-px w-full my-2" />

      {/* Mandatory Instructions */}
      <div className="bg-red-900/20 border border-red-500/50 p-4 rounded-lg mb-4">
        <div className="text-red-400 font-bold text-lg mb-2 flex items-center gap-2">
          <span className="text-red-500">⚠️</span>
          MANDATORY INSTRUCTIONS
        </div>
        <p className="text-red-300 font-semibold text-sm leading-relaxed">
          Once you receive your custom formatted prompt, you MUST read the
          BOTTOM INSTRUCTIONS for the prompt to work properly!
        </p>
      </div>

      <div className="bg-slate-700/30 p-4 rounded-lg">
        <div className="flex justify-between items-center mb-2">
          <div className="flex flex-col">
            <span className="text-cyan-100">AI Prompt Generator</span>
            {!includeCoaching && (
              <span className="text-xs text-yellow-400">
                Monthly Subscription
              </span>
            )}
          </div>
          <span className="text-white font-semibold">
            $25.00{!includeCoaching && "/month"}
          </span>
        </div>
        {includeCoaching && (
          <div className="flex justify-between items-center mb-2">
            <div className="flex flex-col">
              <span className="text-cyan-100">Premium Coaching</span>
              <span className="text-xs text-green-400">One-time add-on</span>
            </div>
            <span className="text-white font-semibold">$275.00</span>
          </div>
        )}
        <SimpleSeparator className="bg-slate-600 h-px w-full my-2" />
        <div className="flex justify-between items-center font-bold">
          <span className="text-white">Total</span>
          <span className="text-white text-lg">
            ${includeCoaching ? totalPrice : 25}.00
            {!includeCoaching && "/month"}
          </span>
        </div>
        <div className="flex justify-between items-center text-sm text-cyan-100/70 mt-1">
          {includeCoaching ? (
            <>
              <span>Monthly subscription + one-time coaching</span>
              <span>$25/month recurring</span>
            </>
          ) : (
            <>
              <span>Monthly subscription</span>
              <span>Recurring billing</span>
            </>
          )}
        </div>
      </div>

      {paymentError && (
        <div className="bg-red-900/20 border border-red-500/50 p-3 rounded-lg">
          <p className="text-red-400 text-sm">{paymentError}</p>
        </div>
      )}

      <SimpleButton
        type="submit"
        disabled={isProcessing || !stripe || !clientSecret}
        className="w-full bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-600 hover:from-cyan-600 hover:via-blue-600 hover:to-purple-700 text-white font-bold py-3 text-lg shadow-lg hover:shadow-cyan-500/25 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isProcessing ? (
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
            {includeCoaching
              ? "Processing Payment..."
              : "Setting up Subscription..."}
          </div>
        ) : !clientSecret ? (
          "Initializing Payment..."
        ) : includeCoaching ? (
          `Complete Payment - $${totalPrice}`
        ) : (
          "Start Monthly Subscription - $25/month"
        )}
      </SimpleButton>
    </form>
  );
}

export default function StripeWrapper({
  totalPrice,
  includeCoaching,
  formData,
  onPaymentSuccess,
}: {
  totalPrice: number;
  includeCoaching: boolean;
  formData: any;
  onPaymentSuccess: () => void;
}) {
  const [stripeInstance, setStripeInstance] = useState<Stripe | null>(null);
  const [stripeError, setStripeError] = useState<string | null>(null);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (!isClient) return;

    const initializeStripe = async () => {
      try {
        const stripeKey = getStripePublishableKey();
        if (!stripeKey) {
          setStripeError(
            "Stripe is not configured. Please check your environment variables.",
          );
          return;
        }

        const stripe = await getStripePromise();
        if (stripe) {
          setStripeInstance(stripe);
        } else {
          setStripeError("Failed to initialize payment system.");
        }
      } catch (error) {
        console.error("Failed to initialize Stripe:", error);
        setStripeError("Failed to initialize payment system.");
      }
    };

    // Add a small delay to ensure proper client-side initialization
    const timer = setTimeout(initializeStripe, 100);
    return () => clearTimeout(timer);
  }, [isClient]);

  // Don't render anything on server side or if there are errors
  if (!isClient) {
    return (
      <div className="bg-slate-700/30 p-4 rounded-lg">
        <p className="text-cyan-100 text-sm">Initializing payment system...</p>
      </div>
    );
  }

  if (stripeError) {
    return (
      <div className="bg-red-900/20 border border-red-500/50 p-4 rounded-lg">
        <p className="text-red-400 text-sm">{stripeError}</p>
        <SimpleButton
          onClick={() => window.location.reload()}
          className="mt-2 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
        >
          Retry
        </SimpleButton>
      </div>
    );
  }

  if (!stripeInstance) {
    return (
      <div className="bg-slate-700/30 p-4 rounded-lg">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 border-2 border-cyan-400/30 border-t-cyan-400 rounded-full animate-spin"></div>
          <p className="text-cyan-100 text-sm">Loading payment system...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full">
      <Elements stripe={stripeInstance}>
        <PaymentForm
          totalPrice={totalPrice}
          includeCoaching={includeCoaching}
          formData={formData}
          onPaymentSuccess={onPaymentSuccess}
        />
      </Elements>
    </div>
  );
}
