// This page has been moved to /checkout
// Redirecting users to the new checkout page
"use client";
import { useEffect } from "react";

export default function PaymentRedirect() {
  useEffect(() => {
    window.location.href = "/checkout";
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
      <div className="text-white text-center">
        <div className="animate-spin w-8 h-8 border-2 border-cyan-400 border-t-transparent rounded-full mx-auto mb-4"></div>
        <p>Redirecting to checkout...</p>
      </div>
    </div>
  );
}
