import { createClient } from "@supabase/supabase-js";

if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
  throw new Error("Missing env.NEXT_PUBLIC_SUPABASE_URL");
}
if (!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
  throw new Error("Missing env.NEXT_PUBLIC_SUPABASE_ANON_KEY");
}

export const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
);

// Server-side client with service role key
export const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
);

// Database types
export interface User {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  referral_code?: string;
  created_at: string;
  updated_at: string;
}

export interface Payment {
  id: string;
  user_id: string;
  stripe_payment_intent_id: string;
  amount: number;
  currency: string;
  status: string;
  package_type: string;
  include_coaching: boolean;
  metadata?: any;
  created_at: string;
  updated_at: string;
}

export interface UserSubscription {
  id: string;
  user_id: string;
  package_type: string;
  include_coaching: boolean;
  status: string;
  expires_at?: string;
  created_at: string;
  updated_at: string;
}

// Helper functions
export async function createUser(userData: {
  email: string;
  first_name: string;
  last_name: string;
  referral_code?: string;
}) {
  const { data, error } = await supabase
    .from("users")
    .insert([userData])
    .select()
    .single();

  if (error) throw error;
  return data as User;
}

export async function getUserByEmail(email: string) {
  const { data, error } = await supabase
    .from("users")
    .select("*")
    .eq("email", email)
    .single();

  if (error && error.code !== "PGRST116") throw error;
  return data as User | null;
}

export async function createPayment(paymentData: {
  user_id: string;
  stripe_payment_intent_id: string;
  amount: number;
  currency: string;
  status: string;
  package_type: string;
  include_coaching: boolean;
  metadata?: any;
}) {
  const { data, error } = await supabaseAdmin
    .from("payments")
    .insert([paymentData])
    .select()
    .single();

  if (error) throw error;
  return data as Payment;
}

export async function updatePaymentStatus(
  paymentIntentId: string,
  status: string,
) {
  const { data, error } = await supabaseAdmin
    .from("payments")
    .update({ status, updated_at: new Date().toISOString() })
    .eq("stripe_payment_intent_id", paymentIntentId)
    .select()
    .single();

  if (error) throw error;
  return data as Payment;
}

export async function createUserSubscription(subscriptionData: {
  user_id: string;
  package_type: string;
  include_coaching: boolean;
  expires_at?: string;
}) {
  const { data, error } = await supabaseAdmin
    .from("user_subscriptions")
    .insert([subscriptionData])
    .select()
    .single();

  if (error) throw error;
  return data as UserSubscription;
}

export async function getUserSubscriptions(userId: string) {
  const { data, error } = await supabase
    .from("user_subscriptions")
    .select("*")
    .eq("user_id", userId)
    .eq("status", "active");

  if (error) throw error;
  return data as UserSubscription[];
}
