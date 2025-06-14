"use client";
import React, { useState, useEffect } from "react";
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
import { Checkbox } from "@/components/ui/checkbox";
import {
  CreditCard,
  Lock,
  ArrowLeft,
  Check,
  Star,
  BookOpen,
  TrendingUp,
  DollarSign,
  Shield,
  ChevronDown,
  ChevronUp,
  Users,
  MessageCircle,
  Headphones,
  Settings,
} from "lucide-react";
import Link from "next/link";
import { loadStripe } from "@stripe/stripe-js";
import {
  Elements,
  CardElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";

// Get Stripe publishable key
const stripePublishableKey = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY;

// Initialize Stripe
const stripePromise = stripePublishableKey
  ? loadStripe(stripePublishableKey)
  : null;

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

  useEffect(() => {
    // Create subscription or payment intent based on package type
    const createPayment = async () => {
      try {
        const endpoint = includeCoaching
          ? "/api/create-payment-intent"
          : "/api/create-subscription";
        const response = await fetch(endpoint, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            amount: includeCoaching ? totalPrice : 25, // Base subscription is always $25
            coachingAmount: includeCoaching ? 275 : 0, // Coaching add-on
            metadata: {
              includeCoaching: includeCoaching.toString(),
              package: includeCoaching ? "premium" : "basic",
              customerName: `${formData.firstName} ${formData.lastName}`,
              customerEmail: formData.email,
              referralCode: formData.referralCode || "",
            },
          }),
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || "Failed to create payment");
        }

        const data = await response.json();
        setClientSecret(data.clientSecret);
        if (data.subscriptionId) {
          setSubscriptionId(data.subscriptionId);
        }
      } catch (error: any) {
        console.error("Error creating payment:", error);
        setPaymentError(
          error.message ||
            "Failed to initialize payment. Please refresh the page.",
        );
      }
    };

    if (formData.firstName && formData.lastName && formData.email) {
      createPayment();
    }
  }, [totalPrice, includeCoaching, formData]);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!stripe || !elements || !clientSecret) {
      setPaymentError("Payment system not ready. Please try again.");
      return;
    }

    if (!formData.firstName || !formData.lastName || !formData.email) {
      setPaymentError("Please fill in all required fields.");
      return;
    }

    setIsProcessing(true);
    setPaymentError("");

    const cardElement = elements.getElement(CardElement);
    if (!cardElement) {
      setPaymentError("Card information not found.");
      setIsProcessing(false);
      return;
    }

    try {
      if (includeCoaching) {
        // Handle one-time payment for coaching package
        const { error, paymentIntent } = await stripe.confirmCardPayment(
          clientSecret,
          {
            payment_method: {
              card: cardElement,
              billing_details: {
                name: `${formData.firstName} ${formData.lastName}`,
                email: formData.email,
              },
            },
          },
        );

        if (error) {
          console.error("Stripe payment error:", error);
          setPaymentError(error.message || "Payment failed");
          setIsProcessing(false);
        } else if (paymentIntent && paymentIntent.status === "succeeded") {
          onPaymentSuccess();
        }
      } else {
        // Handle subscription setup for basic package
        const { error, setupIntent } = await stripe.confirmSetupIntent(
          clientSecret,
          {
            payment_method: {
              card: cardElement,
              billing_details: {
                name: `${formData.firstName} ${formData.lastName}`,
                email: formData.email,
              },
            },
          },
        );

        if (error) {
          console.error("Stripe setup error:", error);
          setPaymentError(error.message || "Subscription setup failed");
          setIsProcessing(false);
        } else if (setupIntent && setupIntent.status === "succeeded") {
          onPaymentSuccess();
        }
      }
    } catch (error: any) {
      console.error("Payment processing error:", error);
      setPaymentError(error.message || "Payment failed");
      setIsProcessing(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label className="text-cyan-100 mb-2 block">Card Information</Label>
        <div className="bg-slate-700/50 border border-slate-600 rounded-md p-3">
          <CardElement options={cardElementOptions} />
        </div>
      </div>

      <Separator className="bg-purple-500/30" />

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
        <Separator className="bg-slate-600 my-2" />
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

      <Button
        type="submit"
        disabled={isProcessing || !stripe || !clientSecret}
        className="w-full bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-600 hover:from-cyan-600 hover:via-blue-600 hover:to-purple-700 text-white font-bold py-3 text-lg shadow-lg hover:shadow-cyan-500/25 transition-all duration-300"
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
          `Complete Payment - ${totalPrice}`
        ) : (
          "Start Monthly Subscription - $25/month"
        )}
      </Button>
    </form>
  );
}

export default function CheckoutPage() {
  const [paymentComplete, setPaymentComplete] = useState(false);
  const [includeCoaching, setIncludeCoaching] = useState(false);
  const [showBasicDetails, setShowBasicDetails] = useState(false);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    referralCode: "",
  });

  const basePrice = 25;
  const coachingPrice = 275; // Additional cost for coaching (total would be $300)
  const totalPrice = includeCoaching ? basePrice + coachingPrice : basePrice;

  const handlePaymentSuccess = async () => {
    setPaymentComplete(true);

    // Store user information in local storage for future reference
    const userData = {
      email: formData.email,
      firstName: formData.firstName,
      lastName: formData.lastName,
      packageType: includeCoaching ? "premium" : "basic",
      includeCoaching,
      purchaseDate: new Date().toISOString(),
    };

    try {
      localStorage.setItem("veoverse_user", JSON.stringify(userData));
    } catch (error) {
      console.error("Error storing user data:", error);
    }

    if (includeCoaching) {
      // For coaching package, show success message
    } else {
      // For basic package, redirect to ChatGPT after 2 seconds
      setTimeout(() => {
        const prompt = encodeURIComponent(
          "Detailed Prompt for ChatGPT to Generate Veo 3 Prompts:\nInstructions:\nYou are a professional video prompt generator for Google Veo 3, specializing in creating high-quality and consistent video prompts. Your job is to generate detailed prompts for AI video creation with a focus on character consistency, scene settings, camera angles, lighting, and more. I will provide detailed information about the character, the scene, the emotions, and the settings for each video prompt.\nImportant: For each prompt involving the same character and setting, I need you to retype EXACTLY the same detailed information for every single prompt because Veo 3 does not have memory capabilities.\nPrompt Template:\n[Character Information]\nName: [Character Name]\n\nAppearance: [Detailed description of physical traits such as height, weight, eye color, hair color, hairstyle, skin tone, and other defining features].\n\nClothing: [What the character is wearing – describe the outfit in detail, including color, type of clothing, accessories, etc.].\n\nPersonality: [Brief description of the character's personality – are they confident, humorous, serious, etc.?].\n\nExpression/Emotion: [Describe the emotional state of the character. Are they happy, sad, excited, angry, etc.?].\n\n[Scene Setting]\nLocation: [Describe the location in great detail, including environmental factors like time of day, weather, surroundings, and any objects or structures in the background].\n\nMood/Tone: [Describe the overall mood or tone of the scene. Should it feel uplifting, dramatic, suspenseful, peaceful, etc.?].\n\nLighting: [Describe the lighting for the scene – bright, soft, harsh shadows, natural daylight, artificial lighting, etc.].\n\nProps/Objects: [If relevant, include objects or props that are important in the scene].\n\n[Camera Details]\nCamera Angle: [Specify the angle of the camera – wide shot, medium shot, close-up, overhead shot, etc.].\n\nCamera Movement: [Is the camera still or is there any movement like panning, zooming in/out, tracking shots, etc.?].\n\nFraming: [How is the character framed in the shot? Is it a headshot, full body, or something else?].\n\n[Audio/Voice Details]\nSound Effects: [If any specific sound effects are needed, describe them in detail, such as footsteps, background music, or ambient noise].\n\nDialogue: [Provide any lines of dialogue or key phrases the character will say in the scene].\n\nSample Example Prompt:\nYou are generating a video prompt for a YouTube ad featuring a character named Ethan, who is a confident, upbeat guy promoting a new product.\nCharacter Information:\nName: Ethan\n\nAppearance: Ethan is a tall, athletic man, around 6'2\" with short brown hair and green eyes. He has a clean-shaven face and a strong build.\n\nClothing: Ethan is wearing a fitted black hoodie that says \"Urban Jungle\" across the chest, paired with dark jeans and white sneakers. He has a gold chain necklace and black sunglasses.\n\nPersonality: Ethan is confident, energetic, and persuasive. He speaks with enthusiasm and a smile.\n\nExpression/Emotion: Ethan is smiling, exuding confidence and excitement, as he promotes the product.\n\nScene Setting:\nLocation: The video takes place in a bright, urban city street with a bustling crowd in the background. Tall buildings and a busy intersection can be seen. The time of day is late afternoon, with the sun casting long shadows.\n\nMood/Tone: The tone is upbeat and positive, meant to create excitement and interest around the product.\n\nLighting: The lighting is bright, with sunlight filtering through the buildings, creating soft shadows on Ethan's face.\n\nProps/Objects: A product is placed on a table next to Ethan, which he occasionally gestures to while talking.\n\nCamera Details:\nCamera Angle: The camera is at eye level with Ethan, focusing on his face and upper body.\n\nCamera Movement: The camera pans slowly from left to right, following Ethan's movements as he walks down the street.\n\nFraming: Ethan is framed in a medium shot, showing his upper body and the product beside him.\n\nAudio/Voice Details:\nSound Effects: Light city sounds in the background, such as cars driving by and people chatting, but the main focus is Ethan's voice.\n\nDialogue: \"Hey everyone, Ethan here! Are you ready to take your product game to the next level? Check out this amazing new gadget that's going to change the way you work!\"\n\nImportant Notes for Each Prompt:\nRepetition of Character Details: For each prompt involving the same character and settings/scene, repeat all the EXACT detailed information (name, appearance, personality, clothing, etc.) as Veo 3 does not have memory capabilities. Each prompt should be self-contained with the necessary details about the character.\n\nSpecificity is Key: The more specific you are in describing the scene, character, camera details, and audio, the better the result. Always provide as much detail as possible to get high-quality, accurate prompts.\n\nCharacter Consistency: If you're creating a series of videos with the same character, keep the details consistent across prompts, but adjust the emotion or scene settings to match the context of the new video.\n\nMultiple Scenes: If you need to create a multi-scene video, break down each scene with all the same detail for each individual prompt.\n\nThis super-detailed template will help ChatGPT generate high-quality, consistent prompts for Google Veo 3, ensuring your videos maintain character and scene consistency across multiple sessions. Simply copy and paste this into ChatGPT and provide the required details for each prompt.\n\nREAD THIS BEFORE PROCEEDING!!!\nFinish Reading the Information Below: Carefully read all the details provided.\n\nJoin the Private Discord: After reading, join our private Discord community by clicking the link below. Just copy and paste it into your browser. (https://discord.gg/TvV8krrhGw)\n\nIf you paid for the PRIVATE COACHING program JOIN the discord and message \"KOTA\" \nor email theveoverseai@gmail.com \"Activate coaching\" \n\nJoin the WhatsApp Community: Also, join our WhatsApp group with over 100+ active members by copying and pasting the link into your browser. (https://chat.whatsapp.com/BF0egaMMayg84EWogAhxq8)\n\nDelete This Information: Once you've read everything and joined the communities, delete all the information below (read this before proceeding) DO NOT ENTER INTO CHAT GPT WITHOUT DELETING THIS.\n\nStart Prompting!: You're now ready to start using the prompts and diving into the content creation process!",
        );
        const chatGptUrl = `https://chat.openai.com/?prompt=${prompt}`;
        window.open(chatGptUrl, "_blank");
      }, 2000);
    }
  };

  if (paymentComplete) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-4">
        <Card className="w-full max-w-md border-green-500/50 bg-slate-900/95 backdrop-blur-xl">
          <CardHeader className="text-center">
            <div className="mx-auto w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mb-4">
              <Check className="w-8 h-8 text-green-400" />
            </div>
            <CardTitle className="text-green-400">
              Payment Successful!
            </CardTitle>
            <CardDescription className="text-green-300/80">
              {includeCoaching
                ? "Welcome to Premium Coaching! Check your email for next steps."
                : "Redirecting you to the AI Prompt Generator..."}
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center">
            {includeCoaching ? (
              <div className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  You'll receive a welcome email with your coaching schedule and
                  Discord access within 24 hours.
                </p>
                <Link href="/">
                  <Button className="w-full">Return to Home</Button>
                </Link>
              </div>
            ) : (
              <div className="animate-spin w-6 h-6 border-2 border-green-400 border-t-transparent rounded-full mx-auto"></div>
            )}
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
          {/* Left Column - Package Details */}
          <div className="space-y-6">
            <Card className="border-cyan-500/30 bg-slate-800/50 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-2xl text-white">
                  AI Prompt Generator
                </CardTitle>
                <CardDescription className="text-cyan-100/80 text-lg">
                  Professional Google Veo 3 prompt generation with character
                  consistency and scene management
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="text-center">
                  <div className="text-4xl font-bold text-white mb-2">
                    ${includeCoaching ? totalPrice : 25}
                    {!includeCoaching && "/month"}
                  </div>
                  <div className="text-cyan-300">
                    {includeCoaching
                      ? "Premium Package"
                      : "Monthly Subscription"}
                  </div>
                  {!includeCoaching && (
                    <div className="text-sm text-yellow-400 mt-1">
                      Recurring monthly billing
                    </div>
                  )}
                </div>

                {/* Basic Package Details */}
                <div className="bg-gradient-to-r from-cyan-500/10 to-blue-500/10 p-4 rounded-lg border border-cyan-500/30">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <DollarSign className="w-5 h-5 text-cyan-400" />
                      <span className="text-white font-semibold">
                        $25 Package Details
                      </span>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setShowBasicDetails(!showBasicDetails)}
                      className="text-cyan-300 hover:text-cyan-100 p-1"
                    >
                      {showBasicDetails ? (
                        <ChevronUp className="w-4 h-4" />
                      ) : (
                        <ChevronDown className="w-4 h-4" />
                      )}
                    </Button>
                  </div>

                  {showBasicDetails && (
                    <div className="mt-4 space-y-3">
                      <p className="text-cyan-100/80 text-sm leading-relaxed">
                        The $25 package includes exclusive access to a private
                        Discord community of like-minded individuals, sharing
                        valuable insights and experiences. You'll receive 24/7
                        support from our team, along with resources, tutorials,
                        and a step-by-step guide for newcomers. Share your
                        content for feedback and assistance.
                      </p>
                      <p className="text-cyan-100/80 text-sm leading-relaxed">
                        Additionally, gain access to an active WhatsApp group
                        with over 100 members, plus comprehensive character
                        memory and scene settings management tools for
                        consistent, professional video creation.
                      </p>

                      <div className="grid gap-2 mt-4">
                        <div className="flex items-center gap-2">
                          <Users className="w-4 h-4 text-cyan-400" />
                          <span className="text-cyan-100 text-sm">
                            Private Discord Community
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Headphones className="w-4 h-4 text-cyan-400" />
                          <span className="text-cyan-100 text-sm">
                            24/7 Team Support
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <BookOpen className="w-4 h-4 text-cyan-400" />
                          <span className="text-cyan-100 text-sm">
                            Resources & Step-by-Step Guide
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <MessageCircle className="w-4 h-4 text-cyan-400" />
                          <span className="text-cyan-100 text-sm">
                            WhatsApp Group (100+ Members)
                          </span>
                        </div>

                        <div className="flex items-center gap-2">
                          <Settings className="w-4 h-4 text-cyan-400" />
                          <span className="text-cyan-100 text-sm">
                            Character & Scene Management Tools
                          </span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                <Separator className="bg-purple-500/30" />

                {/* Coaching Option */}
                <div className="bg-gradient-to-r from-purple-500/10 to-cyan-500/10 p-4 rounded-lg border border-purple-500/30">
                  <div className="flex items-start space-x-3">
                    <Checkbox
                      id="coaching"
                      checked={includeCoaching}
                      onCheckedChange={(checked) =>
                        setIncludeCoaching(!!checked)
                      }
                      className="mt-1"
                    />
                    <div className="flex-1">
                      <label
                        htmlFor="coaching"
                        className="text-white font-semibold cursor-pointer flex items-center gap-2"
                      >
                        <Star className="w-5 h-5 text-yellow-500" />
                        Add Premium Coaching (+$275)
                      </label>
                      <p className="text-cyan-100/70 text-sm mt-1">
                        1:1 mentorship, personalized reviews, monetization
                        guidance, and full month support
                      </p>
                    </div>
                  </div>
                </div>

                {/* Coaching Details (shown when selected) */}
                {includeCoaching && (
                  <div className="space-y-4">
                    <Separator className="bg-purple-500/30" />

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
                              Create highly detailed, professional prompts
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
                              Maintain character appearance across videos
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
                              Master camera angles and lighting
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h3 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
                        <Star className="w-5 h-5 text-yellow-400" />
                        Expert Coaching Team
                      </h3>
                      <p className="text-cyan-100/80 text-sm mb-4 leading-relaxed">
                        Our professional coaching team consists of specialized
                        experts, each mastering specific niches to provide
                        targeted guidance. While we all create exceptional
                        high-quality AI content, each coach can direct you
                        toward the most effective strategies for your particular
                        goals.
                      </p>
                      <div className="grid gap-3">
                        <div className="flex items-start gap-3">
                          <TrendingUp className="w-5 h-5 text-green-400 mt-0.5 flex-shrink-0" />
                          <div>
                            <div className="text-white font-medium">
                              TikTok Commerce Specialists
                            </div>
                            <div className="text-cyan-100/70 text-sm">
                              Expert guidance for TikTok Shop and advertising
                              videos
                            </div>
                          </div>
                        </div>
                        <div className="flex items-start gap-3">
                          <TrendingUp className="w-5 h-5 text-green-400 mt-0.5 flex-shrink-0" />
                          <div>
                            <div className="text-white font-medium">
                              Performance Marketing Experts
                            </div>
                            <div className="text-cyan-100/70 text-sm">
                              TikTok PPV and high-converting marketing creatives
                            </div>
                          </div>
                        </div>
                        <div className="flex items-start gap-3">
                          <TrendingUp className="w-5 h-5 text-green-400 mt-0.5 flex-shrink-0" />
                          <div>
                            <div className="text-white font-medium">
                              Entertainment Content Creators
                            </div>
                            <div className="text-cyan-100/70 text-sm">
                              High-quality entertainment and viral content
                              strategies
                            </div>
                          </div>
                        </div>
                        <div className="flex items-start gap-3">
                          <TrendingUp className="w-5 h-5 text-green-400 mt-0.5 flex-shrink-0" />
                          <div>
                            <div className="text-white font-medium">
                              Monetization Strategy Consultants
                            </div>
                            <div className="text-cyan-100/70 text-sm">
                              Platform optimization and revenue generation
                              tactics
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
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
                  Complete your payment to access VEO VERSE
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="firstName" className="text-cyan-100">
                        First Name
                      </Label>
                      <Input
                        id="firstName"
                        placeholder="John"
                        required
                        value={formData.firstName}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            firstName: e.target.value,
                          })
                        }
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
                        value={formData.lastName}
                        onChange={(e) =>
                          setFormData({ ...formData, lastName: e.target.value })
                        }
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
                      value={formData.email}
                      onChange={(e) =>
                        setFormData({ ...formData, email: e.target.value })
                      }
                      className="bg-slate-700/50 border-slate-600 text-white placeholder:text-slate-400"
                    />
                  </div>
                  <div>
                    <Label htmlFor="referralCode" className="text-cyan-100">
                      Referral Code (Optional)
                    </Label>
                    <Input
                      id="referralCode"
                      placeholder="Enter referral code"
                      value={formData.referralCode}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          referralCode: e.target.value,
                        })
                      }
                      className="bg-slate-700/50 border-slate-600 text-white placeholder:text-slate-400"
                    />
                  </div>

                  {/* Stripe Elements Payment Form */}
                  <Elements stripe={stripePromise}>
                    <PaymentForm
                      totalPrice={totalPrice}
                      includeCoaching={includeCoaching}
                      formData={formData}
                      onPaymentSuccess={handlePaymentSuccess}
                    />
                  </Elements>
                </div>
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
