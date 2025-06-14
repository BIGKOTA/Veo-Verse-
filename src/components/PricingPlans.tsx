"use client";

import React from "react";
import { Button } from "./ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Check } from "lucide-react";

interface PricingPlanProps {
  onSelectPlan?: (plan: string) => void;
}

const PricingPlans = ({ onSelectPlan = () => {} }: PricingPlanProps) => {
  const plans = [
    {
      name: "Free Trial",
      price: "$0",
      description: "Try our AI prompt generator with limited access",
      features: [
        "3 free prompts",
        "Basic character profiles",
        "Standard scene settings",
        "Preview generated prompts",
      ],
      cta: "Start Free Trial",
      popular: false,
      planId: "free-trial",
    },
    {
      name: "Subscription",
      price: "$25",
      period: "/month",
      description: "Unlimited access to all prompt generation features",
      features: [
        "Unlimited prompts",
        "Advanced character memory system",
        "Custom scene settings library",
        "Save and edit prompts",
        "Export to Google Veo 3",
        "Priority support",
      ],
      cta: "Subscribe Now",
      popular: true,
      planId: "subscription",
    },
    {
      name: "Premium Coaching",
      price: "$300",
      description: "One-time payment for personalized coaching",
      features: [
        "Everything in Subscription",
        "1:1 coaching sessions",
        "Personalized prompt reviews",
        "Content monetization guidance",
        "Social media growth strategies",
        "Full access for 1 month",
        "Video feedback and analysis",
      ],
      cta: "Get Coaching",
      popular: false,
      planId: "premium-coaching",
    },
  ];

  return (
    <div className="w-full bg-background py-12 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            Choose Your Plan
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Select the plan that best fits your needs and start creating
            professional-grade prompts for Google Veo 3
          </p>
        </div>

        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
          {plans.map((plan) => (
            <Card
              key={plan.name}
              className={`flex flex-col h-full border ${plan.popular ? "border-primary shadow-lg" : "border-border"}`}
            >
              {plan.popular && (
                <div className="absolute top-0 right-0 transform translate-x-2 -translate-y-2">
                  <span className="inline-flex items-center rounded-full bg-primary px-3 py-1 text-xs font-medium text-primary-foreground">
                    Popular
                  </span>
                </div>
              )}
              <CardHeader>
                <CardTitle className="text-2xl">{plan.name}</CardTitle>
                <div className="flex items-baseline mt-2">
                  <span className="text-3xl font-bold tracking-tight">
                    {plan.price}
                  </span>
                  {plan.period && (
                    <span className="ml-1 text-muted-foreground">
                      {plan.period}
                    </span>
                  )}
                </div>
                <CardDescription className="mt-2">
                  {plan.description}
                </CardDescription>
              </CardHeader>
              <CardContent className="flex-grow">
                <ul className="space-y-3">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-start">
                      <Check className="h-5 w-5 text-primary flex-shrink-0 mr-2" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
              <CardFooter>
                <Button
                  className="w-full"
                  variant={plan.popular ? "default" : "outline"}
                  onClick={() => {
                    const userData = localStorage.getItem("veoverse_user");
                    if (userData) {
                      window.location.href = "/checkout";
                    } else {
                      window.location.href = "/account";
                    }
                  }}
                >
                  {plan.cta}
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>

        <div className="mt-12 text-center">
          <p className="text-sm text-muted-foreground">
            All plans include access to our AI prompt generator. Premium
            coaching is a one-time payment that includes 1 month of personalized
            coaching.
          </p>
        </div>
      </div>
    </div>
  );
};

export default PricingPlans;
