"use client";
import React from "react";
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Check,
  Star,
  Video,
  User,
  Settings,
  ChevronRight,
  Users,
  MessageCircle,
} from "lucide-react";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500/20 rounded-full blur-3xl animate-pulse"></div>
        <div
          className="absolute -bottom-40 -left-40 w-80 h-80 bg-cyan-500/20 rounded-full blur-3xl animate-pulse"
          style={{ animationDelay: "2s" }}
        ></div>
        <div
          className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse"
          style={{ animationDelay: "4s" }}
        ></div>
      </div>
      {/* Daily Updates Banner */}
      <div className="w-full bg-gradient-to-r from-cyan-500 via-purple-500 to-pink-500 text-white text-center py-2 px-4 text-sm font-medium animate-pulse">
        DAILY UPDATES with continuous improvements, ensuring you stay ahead and
        fully aligned with the latest advancements in Veo 3
      </div>

      {/* Navigation Bar */}
      <header className="sticky top-0 z-40 w-full border-b border-cyan-500/20 bg-slate-900/95 backdrop-blur-xl relative">
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-cyan-500/5 to-transparent"></div>
        <div className="container flex h-16 items-center justify-between relative z-10">
          <div className="flex items-center gap-3">
            <span className="text-xl font-bold bg-gradient-to-r from-cyan-400 via-purple-500 to-pink-500 bg-clip-text text-transparent tracking-wider font-mono animate-pulse">
              VEO VERSE
            </span>
          </div>
          <nav className="hidden md:flex items-center gap-6">
            <Link
              href="#features"
              className="text-sm font-medium text-cyan-300 hover:text-cyan-100 transition-colors duration-300 relative group"
            >
              Features
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-cyan-400 to-blue-400 group-hover:w-full transition-all duration-300"></span>
            </Link>
            <Link
              href="#pricing"
              className="text-sm font-medium text-cyan-300 hover:text-cyan-100 transition-colors duration-300 relative group"
            >
              Pricing
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-cyan-400 to-blue-400 group-hover:w-full transition-all duration-300"></span>
            </Link>
            <Link
              href="#faq"
              className="text-sm font-medium text-cyan-300 hover:text-cyan-100 transition-colors duration-300 relative group"
            >
              FAQ
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-cyan-400 to-blue-400 group-hover:w-full transition-all duration-300"></span>
            </Link>
          </nav>
          <div className="flex items-center gap-4">
            <Link href="/account">
              <Button
                variant="outline"
                size="sm"
                className="border-cyan-500/50 text-cyan-300 hover:bg-cyan-500/10 hover:border-cyan-400 transition-all duration-300"
              >
                Log In
              </Button>
            </Link>
            <Link href="/account">
              <Button
                size="sm"
                className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white shadow-lg hover:shadow-cyan-500/25 transition-all duration-300"
              >
                Sign Up
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container py-12 md:py-24 lg:py-32 relative z-10">
        <div className="flex flex-col items-center text-center gap-4">
          <div className="flex items-center gap-4 mb-4">
            <h1 className="text-3xl md:text-5xl font-bold tracking-tight text-white">
              Unlock the Power of AI with{" "}
              <span className="bg-gradient-to-r from-cyan-400 via-purple-500 to-pink-500 bg-clip-text text-transparent font-bold animate-pulse">
                Veo Verse
              </span>
            </h1>
          </div>
          <p className="text-xl text-cyan-100/80 max-w-[800px]">
            Professional AI Prompt Generator for Google Veo 3
          </p>
          <div className="flex flex-col sm:flex-row gap-4 mt-6">
            <Button
              size="lg"
              onClick={() => {
                const userData = localStorage.getItem("veoverse_user");
                if (userData) {
                  window.location.href = "/checkout";
                } else {
                  window.location.href = "/account";
                }
              }}
              className="bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-600 hover:from-cyan-600 hover:via-blue-600 hover:to-purple-700 text-white font-bold shadow-lg hover:shadow-cyan-500/25 transition-all duration-300 transform hover:scale-105 border-0 relative overflow-hidden group"
            >
              <span className="relative z-10">START PROMPTS</span>
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
              <ChevronRight className="ml-2 h-4 w-4 relative z-10" />
            </Button>
          </div>
          <div className="relative w-full max-w-5xl mt-12 rounded-lg overflow-hidden border border-cyan-500/30 shadow-2xl shadow-cyan-500/20">
            <div className="relative">
              <img
                src="https://images.unsplash.com/photo-1579546929518-9e396f3cc809?w=1200&q=80"
                alt="AI Prompt Generator Dashboard Preview"
                className="w-full h-auto opacity-80"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-transparent to-slate-900/40"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="container py-12 md:py-24 bg-muted/50">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold tracking-tight">
            Powerful Features
          </h2>
          <p className="text-muted-foreground mt-4 max-w-[700px] mx-auto">
            Everything you need to create professional-grade video prompts with
            consistency and ease.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <Card>
            <CardHeader>
              <User className="h-10 w-10 text-primary mb-2" />
              <CardTitle>Character Memory System</CardTitle>
              <CardDescription>
                Advanced character management with detailed memory storage for
                consistent character appearance across all your videos.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                <li className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-primary" />
                  <span>Physical appearance details</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-primary" />
                  <span>Personality & emotional traits</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-primary" />
                  <span>Clothing & style preferences</span>
                </li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <Settings className="h-10 w-10 text-primary mb-2" />
              <CardTitle>Scene Settings Manager</CardTitle>
              <CardDescription>
                Professional scene configuration tools for camera angles,
                lighting, and environment settings.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                <li className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-primary" />
                  <span>Camera angles & movements</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-primary" />
                  <span>Lighting & mood controls</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-primary" />
                  <span>Environment & audio settings</span>
                </li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <Users className="h-10 w-10 text-primary mb-2" />
              <CardTitle>Community Access</CardTitle>
              <CardDescription>
                Join our exclusive community with 24/7 support, resources, and
                networking opportunities.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                <li className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-primary" />
                  <span>Private Discord community</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-primary" />
                  <span>24/7 team support</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-primary" />
                  <span>WhatsApp group (100+ members)</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-primary" />
                  <span>Step-by-step guides & tutorials</span>
                </li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <Star className="h-10 w-10 text-primary mb-2" />
              <CardTitle>Professional Coaching</CardTitle>
              <CardDescription>
                Get specialized guidance from expert coaches in different niches
                to maximize your success.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                <li className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-primary" />
                  <span>TikTok shop/ad video specialists</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-primary" />
                  <span>Monetization strategies experts</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-primary" />
                  <span>Meta ads & company marketing experts</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-primary" />
                  <span>Entertainment content coaches</span>
                </li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="container py-12 md:py-24">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold tracking-tight">
            Simple, Transparent Pricing
          </h2>
          <p className="text-muted-foreground mt-4 max-w-[700px] mx-auto">
            Choose the plan that works best for your needs and budget.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          <Card className="border-primary">
            <CardHeader className="bg-primary/10">
              <div className="text-center text-sm font-medium text-primary mb-2">
                MOST POPULAR
              </div>
              <CardTitle>Subscription</CardTitle>
              <div className="text-4xl font-bold">
                $25<span className="text-base font-normal">/month</span>
              </div>
              <CardDescription>Full access to all features</CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                <li className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-primary" />
                  <span>Unlimited prompts</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-primary" />
                  <span>Advanced character memory system</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-primary" />
                  <span>Detailed scene configuration</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-primary" />
                  <span>Access to prompt templates</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-primary" />
                  <span>Private Discord community</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-primary" />
                  <span>24/7 team support</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-primary" />
                  <span>WhatsApp group (100+ members)</span>
                </li>
              </ul>
            </CardContent>
            <CardFooter>
              <Button
                className="w-full"
                onClick={() => {
                  const userData = localStorage.getItem("veoverse_user");
                  if (userData) {
                    window.location.href = "/checkout";
                  } else {
                    window.location.href = "/account";
                  }
                }}
              >
                Subscribe Now
              </Button>
            </CardFooter>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Premium Coaching</CardTitle>
              <div className="text-4xl font-bold">$300</div>
              <CardDescription>
                One-time payment for personalized coaching
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                <li className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-primary" />
                  <span>Everything in Subscription plan</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-primary" />
                  <span>1:1 coaching sessions</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-primary" />
                  <span>Personalized feedback</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-primary" />
                  <span>Monetization strategies</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-primary" />
                  <span>Full month of support</span>
                </li>
              </ul>
            </CardContent>
            <CardFooter>
              <Button
                className="w-full"
                onClick={() => {
                  const userData = localStorage.getItem("veoverse_user");
                  if (userData) {
                    window.location.href = "/checkout";
                  } else {
                    window.location.href = "/account";
                  }
                }}
              >
                Get Coaching
              </Button>
            </CardFooter>
          </Card>
        </div>
      </section>

      {/* Video Examples */}
      <section className="container py-12 md:py-24 bg-muted/50">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold tracking-tight">
            Create AI Content like this NOW
          </h2>
          <p className="text-muted-foreground mt-4 max-w-[700px] mx-auto">
            See examples of professional AI-generated videos you can create with
            our platform.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="text-center">
            <h3 className="text-xl font-bold mb-4">TikTok Shop</h3>
            <div className="rounded-lg overflow-hidden border shadow-lg">
              <iframe
                src="https://streamable.com/e/yt9xr5"
                width="100%"
                height="315"
                frameBorder="0"
                allowFullScreen
                className="w-full h-auto"
                style={{ minHeight: "315px" }}
              ></iframe>
            </div>
          </div>
          <div className="text-center">
            <h3 className="text-xl font-bold mb-4">Monetized Content</h3>
            <div className="rounded-lg overflow-hidden border shadow-lg">
              <iframe
                src="https://streamable.com/e/8yuvps"
                width="100%"
                height="315"
                frameBorder="0"
                allowFullScreen
                className="w-full h-auto"
                style={{ minHeight: "315px" }}
              ></iframe>
            </div>
          </div>
          <div className="text-center">
            <h3 className="text-xl font-bold mb-4">Marketing Advertisement</h3>
            <div className="rounded-lg overflow-hidden border shadow-lg">
              <iframe
                src="https://streamable.com/e/q48ihx"
                width="100%"
                height="315"
                frameBorder="0"
                allowFullScreen
                className="w-full h-auto"
                style={{ minHeight: "315px" }}
              ></iframe>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq" className="container py-12 md:py-24">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold tracking-tight">
            Frequently Asked Questions
          </h2>
          <p className="text-muted-foreground mt-4 max-w-[700px] mx-auto">
            Find answers to common questions about our AI Prompt Generator.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">What is Google Veo 3?</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Google Veo 3 is an advanced AI video generation tool that
                creates high-quality videos based on detailed text prompts.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">
                How does the character memory system work?
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Our system stores all details about your characters, including
                physical appearance, clothing, and emotional traits, ensuring
                consistency across all your videos.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">
                What's included in the coaching program?
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                The coaching program includes one-on-one mentorship,
                personalized feedback on your videos, strategies for
                monetization, and a full month of support.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">
                Can I upgrade from the subscription to coaching later?
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Yes, you can upgrade to the coaching program at any time. Your
                subscription benefits will be included in the coaching package.
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container py-12 md:py-24 bg-primary/10">
        <div className="flex flex-col items-center text-center gap-6 max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold tracking-tight">
            Ready to Create Professional AI Videos?
          </h2>
          <p className="text-xl text-muted-foreground">
            Experience the power of our AI Prompt Generator for Google Veo 3 and
            start creating professional-grade video content.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 mt-4">
            <Button
              size="lg"
              onClick={() => {
                const userData = localStorage.getItem("veoverse_user");
                if (userData) {
                  window.location.href = "/checkout";
                } else {
                  window.location.href = "/account";
                }
              }}
              className="bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-600 hover:from-cyan-600 hover:via-blue-600 hover:to-purple-700 text-white font-bold shadow-lg hover:shadow-cyan-500/25 transition-all duration-300 transform hover:scale-105 border-0 relative overflow-hidden group"
            >
              <span className="relative z-10">START PROMPTS</span>
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t bg-muted/30">
        <div className="container py-8 md:py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <span className="font-bold text-white tracking-wider font-mono">
                  VEO VERSE
                </span>
              </div>
              <p className="text-sm text-white">
                Professional AI prompt generation for Google Veo 3 videos with
                Veo Verse.
              </p>
            </div>

            <div>
              <h3 className="font-medium mb-4 text-white">Product</h3>
              <ul className="space-y-2 text-sm text-white">
                <li>
                  <Link href="#features" className="hover:underline">
                    Features
                  </Link>
                </li>
                <li>
                  <Link href="#pricing" className="hover:underline">
                    Pricing
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:underline">
                    Dashboard
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="font-medium mb-4 text-white">Resources</h3>
              <ul className="space-y-2 text-sm text-white">
                <li>
                  <Link href="#" className="hover:underline">
                    Blog
                  </Link>
                </li>
                <li>
                  <Link href="#faq" className="hover:underline">
                    FAQ
                  </Link>
                </li>
                <li>
                  <a
                    href="mailto:theveoverseai@gmail.com?subject=Support%20Inquiry&body=Hello%2C%20I%20need%20help%20with..."
                    className="hover:underline text-white text-sm"
                  >
                    Support
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="font-medium mb-4 text-white">Legal</h3>
              <ul className="space-y-2 text-sm text-white">
                <li>
                  <Link href="#" className="hover:underline">
                    Privacy Policy
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:underline">
                    Terms of Service
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:underline">
                    Cookie Policy
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t mt-8 pt-8 text-center text-sm text-white">
            <p>
              © {new Date().getFullYear()} Veo Prompt Pro. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
