"use client";
import React, { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import {
  Check,
  Star,
  ArrowLeft,
  CreditCard,
  Shield,
  BookOpen,
  TrendingUp,
  DollarSign,
} from "lucide-react";

export default function CoachingCheckout() {
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentComplete, setPaymentComplete] = useState(false);

  const handlePayment = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);

    // Simulate payment processing
    setTimeout(() => {
      setIsProcessing(false);
      setPaymentComplete(true);
      alert(
        "Payment successful! You now have access to premium coaching. Check your email for next steps.",
      );
    }, 3000);
  };

  if (paymentComplete) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-4">
        <Card className="w-full max-w-md text-center">
          <CardHeader>
            <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
              <Check className="w-8 h-8 text-green-600" />
            </div>
            <CardTitle className="text-2xl text-green-600">
              Payment Successful!
            </CardTitle>
            <CardDescription>
              Welcome to Premium Coaching! Check your email for next steps and
              access details.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">
              You'll receive a welcome email with your coaching schedule and
              Discord access within 24 hours.
            </p>
            <Link href="/">
              <Button className="w-full">Return to Home</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500/20 rounded-full blur-3xl animate-pulse"></div>
        <div
          className="absolute -bottom-40 -left-40 w-80 h-80 bg-cyan-500/20 rounded-full blur-3xl animate-pulse"
          style={{ animationDelay: "2s" }}
        ></div>
      </div>

      <div className="container mx-auto px-4 py-8 relative z-10">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Link href="/">
            <Button
              variant="ghost"
              size="sm"
              className="text-cyan-300 hover:text-cyan-100"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Home
            </Button>
          </Link>
          <div className="flex items-center gap-3">
            <span className="text-xl font-bold text-white tracking-wider font-mono">
              VEO VERSE
            </span>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
          {/* Left Column - Coaching Details */}
          <div className="space-y-6">
            <Card className="border-purple-500/30 bg-slate-800/50 backdrop-blur-sm">
              <CardHeader>
                <div className="flex items-center gap-3 mb-2">
                  <Star className="w-8 h-8 text-yellow-500" />
                  <CardTitle className="text-2xl text-white">
                    Premium Coaching Program
                  </CardTitle>
                </div>
                <CardDescription className="text-cyan-100/80 text-lg">
                  Transform your AI video creation skills with personalized 1:1
                  mentorship (2 weekly calls with a professional mentor for 1
                  month)
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="text-center">
                  <div className="text-4xl font-bold text-white mb-2">$300</div>
                  <div className="text-cyan-300">
                    One-time payment • Full month of support
                  </div>
                </div>

                <Separator className="bg-purple-500/30" />

                {/* What You'll Master */}
                <div>
                  <h3 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
                    <BookOpen className="w-5 h-5 text-cyan-400" />
                    What You'll Master
                  </h3>
                  <div className="grid gap-3">
                    <div className="flex items-start gap-3">
                      <Check className="w-5 h-5 text-green-400 mt-0.5 flex-shrink-0" />
                      <div>
                        <div className="text-white font-medium">
                          Advanced Prompt Engineering
                        </div>
                        <div className="text-cyan-100/70 text-sm">
                          Create highly detailed, professional prompts that
                          generate consistent, high-quality videos
                        </div>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <Check className="w-5 h-5 text-green-400 mt-0.5 flex-shrink-0" />
                      <div>
                        <div className="text-white font-medium">
                          Character Consistency Mastery
                        </div>
                        <div className="text-cyan-100/70 text-sm">
                          Learn advanced techniques to maintain character
                          appearance and personality across multiple videos
                        </div>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <Check className="w-5 h-5 text-green-400 mt-0.5 flex-shrink-0" />
                      <div>
                        <div className="text-white font-medium">
                          Scene Composition & Cinematography
                        </div>
                        <div className="text-cyan-100/70 text-sm">
                          Master camera angles, lighting, and scene setup for
                          professional-grade video production
                        </div>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <Check className="w-5 h-5 text-green-400 mt-0.5 flex-shrink-0" />
                      <div>
                        <div className="text-white font-medium">
                          Storytelling & Narrative Structure
                        </div>
                        <div className="text-cyan-100/70 text-sm">
                          Develop compelling narratives and story arcs that
                          engage audiences and drive results
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <Separator className="bg-purple-500/30" />

                {/* Monetization Strategies */}
                <div>
                  <h3 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
                    <DollarSign className="w-5 h-5 text-green-400" />
                    Monetization Strategies You'll Learn
                  </h3>
                  <div className="grid gap-3">
                    <div className="flex items-start gap-3">
                      <TrendingUp className="w-5 h-5 text-green-400 mt-0.5 flex-shrink-0" />
                      <div>
                        <div className="text-white font-medium">
                          Freelancing Services
                        </div>
                        <div className="text-cyan-100/70 text-sm">
                          Offer AI video creation services for product demos,
                          social media content, and marketing materials
                        </div>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <TrendingUp className="w-5 h-5 text-green-400 mt-0.5 flex-shrink-0" />
                      <div>
                        <div className="text-white font-medium">
                          Platform Monetization
                        </div>
                        <div className="text-cyan-100/70 text-sm">
                          Monetize on YouTube, TikTok, or Instagram using
                          AI-generated videos
                        </div>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <TrendingUp className="w-5 h-5 text-green-400 mt-0.5 flex-shrink-0" />
                      <div>
                        <div className="text-white font-medium">
                          Affiliate Marketing
                        </div>
                        <div className="text-cyan-100/70 text-sm">
                          Affiliate marketing for AI tools or content
                        </div>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <TrendingUp className="w-5 h-5 text-green-400 mt-0.5 flex-shrink-0" />
                      <div>
                        <div className="text-white font-medium">
                          Course Creation
                        </div>
                        <div className="text-cyan-100/70 text-sm">
                          Create courses teaching others how to use Veo 3 or AI
                          video generation
                        </div>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <TrendingUp className="w-5 h-5 text-green-400 mt-0.5 flex-shrink-0" />
                      <div>
                        <div className="text-white font-medium">
                          Social Media Management & Ad Creation
                        </div>
                        <div className="text-cyan-100/70 text-sm">
                          Social Media Management and Ad Creation for businesses
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Payment Form */}
          <div className="space-y-6">
            <Card className="border-cyan-500/30 bg-slate-800/50 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-xl text-white flex items-center gap-2">
                  <CreditCard className="w-5 h-5 text-cyan-400" />
                  Secure Checkout
                </CardTitle>
                <CardDescription className="text-cyan-100/70">
                  Complete your payment to start your premium coaching journey
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handlePayment} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="firstName" className="text-cyan-100">
                        First Name
                      </Label>
                      <Input
                        id="firstName"
                        placeholder="John"
                        required
                        className="bg-slate-700/50 border-slate-600 text-white placeholder:text-slate-400"
                      />
                    </div>
                    <div>
                      <Label htmlFor="lastName" className="text-cyan-100">
                        Last Name
                      </Label>
                      <Input
                        id="lastName"
                        placeholder="Doe"
                        required
                        className="bg-slate-700/50 border-slate-600 text-white placeholder:text-slate-400"
                      />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="email" className="text-cyan-100">
                      Email Address
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="john@example.com"
                      required
                      className="bg-slate-700/50 border-slate-600 text-white placeholder:text-slate-400"
                    />
                  </div>
                  <div>
                    <Label htmlFor="cardNumber" className="text-cyan-100">
                      Card Number
                    </Label>
                    <Input
                      id="cardNumber"
                      placeholder="1234 5678 9012 3456"
                      required
                      className="bg-slate-700/50 border-slate-600 text-white placeholder:text-slate-400"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="expiry" className="text-cyan-100">
                        Expiry Date
                      </Label>
                      <Input
                        id="expiry"
                        placeholder="MM/YY"
                        required
                        className="bg-slate-700/50 border-slate-600 text-white placeholder:text-slate-400"
                      />
                    </div>
                    <div>
                      <Label htmlFor="cvc" className="text-cyan-100">
                        CVC
                      </Label>
                      <Input
                        id="cvc"
                        placeholder="123"
                        required
                        className="bg-slate-700/50 border-slate-600 text-white placeholder:text-slate-400"
                      />
                    </div>
                  </div>

                  <Separator className="bg-purple-500/30" />

                  <div className="bg-slate-700/30 p-4 rounded-lg">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-cyan-100">
                        Premium Coaching Program
                      </span>
                      <span className="text-white font-semibold">$300.00</span>
                    </div>
                    <div className="flex justify-between items-center text-sm text-cyan-100/70">
                      <span>One-time payment</span>
                      <span>No recurring charges</span>
                    </div>
                  </div>

                  <Button
                    type="submit"
                    className="w-full bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-600 hover:from-cyan-600 hover:via-blue-600 hover:to-purple-700 text-white font-bold py-3 text-lg shadow-lg hover:shadow-cyan-500/25 transition-all duration-300"
                    disabled={isProcessing}
                  >
                    {isProcessing ? (
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                        Processing Payment...
                      </div>
                    ) : (
                      "Complete Payment - $300"
                    )}
                  </Button>
                </form>
              </CardContent>
              <CardFooter>
                <div className="w-full text-center">
                  <div className="flex items-center justify-center gap-2 text-sm text-cyan-100/70 mb-2">
                    <Shield className="w-4 h-4" />
                    <span>Secure payment powered by Stripe</span>
                  </div>
                  <p className="text-xs text-cyan-100/50">
                    Your payment information is encrypted and secure. You'll
                    receive a confirmation email after purchase.
                  </p>
                </div>
              </CardFooter>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
