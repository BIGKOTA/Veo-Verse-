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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeft, Mail, Lock, User, Eye, EyeOff } from "lucide-react";

export default function AccountPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("signin");

  const handleGoogleSignIn = () => {
    setIsLoading(true);
    // Simulate Google sign-in process
    setTimeout(() => {
      setIsLoading(false);
      // Store user data in localStorage to indicate they have an account
      const userData = {
        email: "user@example.com",
        firstName: "User",
        lastName: "Name",
        loginMethod: "google",
        loginDate: new Date().toISOString(),
      };
      localStorage.setItem("veoverse_user", JSON.stringify(userData));
      // Redirect to home page after successful login
      window.location.href = "/";
    }, 2000);
  };

  const handleEmailSignIn = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    // Simulate email sign-in process
    setTimeout(() => {
      setIsLoading(false);
      // Store user data in localStorage to indicate they have an account
      const userData = {
        email: "user@example.com",
        firstName: "User",
        lastName: "Name",
        loginMethod: "email",
        loginDate: new Date().toISOString(),
      };
      localStorage.setItem("veoverse_user", JSON.stringify(userData));
      // Redirect to home page after successful login
      window.location.href = "/";
    }, 2000);
  };

  const handleEmailSignUp = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    // Simulate email sign-up process
    setTimeout(() => {
      setIsLoading(false);
      // Store user data in localStorage to indicate they have an account
      const userData = {
        email: "user@example.com",
        firstName: "User",
        lastName: "Name",
        loginMethod: "email",
        signupDate: new Date().toISOString(),
      };
      localStorage.setItem("veoverse_user", JSON.stringify(userData));
      // Redirect to home page after successful signup
      window.location.href = "/";
    }, 2000);
  };

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

      <div className="relative z-10 min-h-screen flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          {/* Back Button */}
          <Link
            href="/"
            className="inline-flex items-center text-cyan-300 hover:text-cyan-100 mb-6 transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Home
          </Link>

          <Card className="border-cyan-500/30 bg-slate-900/95 backdrop-blur-xl shadow-2xl shadow-cyan-500/20">
            <CardHeader className="text-center">
              <div className="mx-auto w-16 h-16 bg-gradient-to-r from-cyan-500/20 to-purple-500/20 rounded-full flex items-center justify-center mb-4">
                <User className="w-8 h-8 text-cyan-400" />
              </div>
              <CardTitle className="text-2xl text-white">
                Account Required
              </CardTitle>
              <CardDescription className="text-cyan-100/80">
                Sign in or create an account to access VEO VERSE features
              </CardDescription>
            </CardHeader>

            <CardContent>
              <div className="w-full">
                <div className="grid w-full grid-cols-2 bg-slate-800/50 rounded-lg p-1 mb-6">
                  <Button
                    variant={activeTab === "signin" ? "default" : "ghost"}
                    onClick={() => setActiveTab("signin")}
                    className={`${
                      activeTab === "signin"
                        ? "bg-cyan-500/20 text-cyan-100"
                        : "text-cyan-300 hover:text-cyan-100"
                    } transition-all duration-200`}
                  >
                    Sign In
                  </Button>
                  <Button
                    variant={activeTab === "signup" ? "default" : "ghost"}
                    onClick={() => setActiveTab("signup")}
                    className={`${
                      activeTab === "signup"
                        ? "bg-cyan-500/20 text-cyan-100"
                        : "text-cyan-300 hover:text-cyan-100"
                    } transition-all duration-200`}
                  >
                    Sign Up
                  </Button>
                </div>

                {activeTab === "signin" && (
                  <div className="space-y-4">
                    {/* Google Sign In */}
                    <Button
                      onClick={handleGoogleSignIn}
                      disabled={isLoading}
                      className="w-full bg-white hover:bg-gray-100 text-gray-900 border border-gray-300 font-medium"
                    >
                      {isLoading ? (
                        <div className="animate-spin w-4 h-4 border-2 border-gray-400 border-t-transparent rounded-full mr-2"></div>
                      ) : (
                        <svg className="w-4 h-4 mr-2" viewBox="0 0 24 24">
                          <path
                            fill="#4285F4"
                            d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                          />
                          <path
                            fill="#34A853"
                            d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                          />
                          <path
                            fill="#FBBC05"
                            d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                          />
                          <path
                            fill="#EA4335"
                            d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                          />
                        </svg>
                      )}
                      Continue with Google
                    </Button>

                    <div className="relative">
                      <div className="absolute inset-0 flex items-center">
                        <Separator className="bg-cyan-500/20" />
                      </div>
                      <div className="relative flex justify-center text-xs uppercase">
                        <span className="bg-slate-900 px-2 text-cyan-300">
                          OR
                        </span>
                      </div>
                    </div>

                    {/* Email Sign In Form */}
                    <form onSubmit={handleEmailSignIn} className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="signin-email" className="text-cyan-300">
                          Email Address
                        </Label>
                        <div className="relative">
                          <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-cyan-400" />
                          <Input
                            id="signin-email"
                            type="email"
                            placeholder="your@email.com"
                            className="pl-10 bg-slate-800/50 border-cyan-500/30 text-white placeholder:text-slate-400 focus:border-cyan-400"
                            required
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label
                          htmlFor="signin-password"
                          className="text-cyan-300"
                        >
                          Password
                        </Label>
                        <div className="relative">
                          <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-cyan-400" />
                          <Input
                            id="signin-password"
                            type={showPassword ? "text" : "password"}
                            placeholder="Enter your password"
                            className="pl-10 pr-10 bg-slate-800/50 border-cyan-500/30 text-white placeholder:text-slate-400 focus:border-cyan-400"
                            required
                          />
                          <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-cyan-400 hover:text-cyan-300"
                          >
                            {showPassword ? (
                              <EyeOff className="w-4 h-4" />
                            ) : (
                              <Eye className="w-4 h-4" />
                            )}
                          </button>
                        </div>
                      </div>

                      <Button
                        type="submit"
                        disabled={isLoading}
                        className="w-full bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-600 hover:from-cyan-600 hover:via-blue-600 hover:to-purple-700 text-white font-bold"
                      >
                        {isLoading ? (
                          <>
                            <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full mr-2"></div>
                            Signing In...
                          </>
                        ) : (
                          "Sign In"
                        )}
                      </Button>
                    </form>
                  </div>
                )}

                {activeTab === "signup" && (
                  <div className="space-y-4">
                    {/* Google Sign Up */}
                    <Button
                      onClick={handleGoogleSignIn}
                      disabled={isLoading}
                      className="w-full bg-white hover:bg-gray-100 text-gray-900 border border-gray-300 font-medium"
                    >
                      {isLoading ? (
                        <div className="animate-spin w-4 h-4 border-2 border-gray-400 border-t-transparent rounded-full mr-2"></div>
                      ) : (
                        <svg className="w-4 h-4 mr-2" viewBox="0 0 24 24">
                          <path
                            fill="#4285F4"
                            d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                          />
                          <path
                            fill="#34A853"
                            d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                          />
                          <path
                            fill="#FBBC05"
                            d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                          />
                          <path
                            fill="#EA4335"
                            d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                          />
                        </svg>
                      )}
                      Continue with Google
                    </Button>

                    <div className="relative">
                      <div className="absolute inset-0 flex items-center">
                        <Separator className="bg-cyan-500/20" />
                      </div>
                      <div className="relative flex justify-center text-xs uppercase">
                        <span className="bg-slate-900 px-2 text-cyan-300">
                          OR
                        </span>
                      </div>
                    </div>

                    {/* Email Sign Up Form */}
                    <form onSubmit={handleEmailSignUp} className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="signup-email" className="text-cyan-300">
                          Email Address
                        </Label>
                        <div className="relative">
                          <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-cyan-400" />
                          <Input
                            id="signup-email"
                            type="email"
                            placeholder="your@email.com"
                            className="pl-10 bg-slate-800/50 border-cyan-500/30 text-white placeholder:text-slate-400 focus:border-cyan-400"
                            required
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label
                          htmlFor="signup-password"
                          className="text-cyan-300"
                        >
                          Password
                        </Label>
                        <div className="relative">
                          <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-cyan-400" />
                          <Input
                            id="signup-password"
                            type={showPassword ? "text" : "password"}
                            placeholder="Enter your password"
                            className="pl-10 pr-10 bg-slate-800/50 border-cyan-500/30 text-white placeholder:text-slate-400 focus:border-cyan-400"
                            required
                          />
                          <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-cyan-400 hover:text-cyan-300"
                          >
                            {showPassword ? (
                              <EyeOff className="w-4 h-4" />
                            ) : (
                              <Eye className="w-4 h-4" />
                            )}
                          </button>
                        </div>
                      </div>

                      <Button
                        type="submit"
                        disabled={isLoading}
                        className="w-full bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-600 hover:from-cyan-600 hover:via-blue-600 hover:to-purple-700 text-white font-bold"
                      >
                        {isLoading ? (
                          <>
                            <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full mr-2"></div>
                            Signing In...
                          </>
                        ) : (
                          "Sign In"
                        )}
                      </Button>
                    </form>
                  </div>
                )}
              </div>
            </CardContent>

            <CardFooter>
              <div className="w-full text-center text-xs text-cyan-100/60">
                <p>
                  By continuing, you agree to our Terms of Service and Privacy
                  Policy
                </p>
              </div>
            </CardFooter>
          </Card>

          {/* Features Reminder */}
          <div className="mt-6 text-center text-sm text-cyan-100/60 space-y-1">
            <p className="flex items-center justify-center gap-2">
              <span>✨</span> Access unlimited AI prompts for Google Veo 3
            </p>
            <p className="flex items-center justify-center gap-2">
              <span>🎯</span> Character consistency & scene management
            </p>
            <p className="flex items-center justify-center gap-2">
              <span>🚀</span> Professional-grade video generation
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
