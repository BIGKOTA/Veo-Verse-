"use client";

import React, { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import PromptCreator from "./PromptCreator";
import CharacterManager from "./CharacterManager";
import PricingPlans from "./PricingPlans";
import { User, Settings, Users, Video, CreditCard } from "lucide-react";

interface DashboardProps {
  username?: string;
  accountType?: "free" | "subscription" | "premium";
}

const Dashboard = ({
  username = "User",
  accountType = "free",
}: DashboardProps) => {
  const [activeTab, setActiveTab] = useState("prompt-creation");

  // Mock data for scene settings
  const sceneSettings = [
    {
      id: 1,
      name: "Indoor Studio",
      cameraAngle: "Medium Shot",
      lighting: "Soft Key Light",
    },
    {
      id: 2,
      name: "Outdoor Daylight",
      cameraAngle: "Wide Angle",
      lighting: "Natural Sunlight",
    },
    {
      id: 3,
      name: "Night Scene",
      cameraAngle: "Close-Up",
      lighting: "Low Key Lighting",
    },
  ];

  // Mock data for user account
  const userAccount = {
    name: username,
    email: "user@example.com",
    accountType: accountType,
    promptsCreated: 12,
    charactersCreated: 5,
    scenesCreated: 3,
    promptsRemaining: accountType === "free" ? 3 : "Unlimited",
  };

  return (
    <div className="w-full min-h-screen bg-background p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
            <p className="text-muted-foreground mt-1">
              Create and manage your Veo 3 prompts, characters, and scenes.
            </p>
          </div>
          <div className="mt-4 md:mt-0 flex items-center gap-2 bg-muted/50 p-2 rounded-lg">
            <User className="h-5 w-5 text-primary" />
            <span className="font-medium">{username}</span>
            <span className="bg-primary/10 text-primary text-xs px-2 py-1 rounded-full">
              {accountType === "free"
                ? "Free Trial"
                : accountType === "subscription"
                  ? "Subscriber"
                  : "Premium"}
            </span>
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid grid-cols-2 md:grid-cols-4 gap-2 mb-8">
            <TabsTrigger
              value="prompt-creation"
              className="flex items-center gap-2"
            >
              <Video className="h-4 w-4" />
              <span>Prompt Creation</span>
            </TabsTrigger>
            <TabsTrigger
              value="character-profiles"
              className="flex items-center gap-2"
            >
              <Users className="h-4 w-4" />
              <span>Character Profiles</span>
            </TabsTrigger>
            <TabsTrigger
              value="scene-settings"
              className="flex items-center gap-2"
            >
              <Settings className="h-4 w-4" />
              <span>Scene Settings</span>
            </TabsTrigger>
            <TabsTrigger
              value="user-account"
              className="flex items-center gap-2"
            >
              <CreditCard className="h-4 w-4" />
              <span>Account</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="prompt-creation" className="space-y-4">
            <PromptCreator accountType={accountType} />
          </TabsContent>

          <TabsContent value="character-profiles" className="space-y-4">
            <CharacterManager />
          </TabsContent>

          <TabsContent value="scene-settings" className="space-y-4">
            <Card>
              <CardContent className="p-6">
                <h2 className="text-2xl font-semibold mb-4">Scene Settings</h2>
                <p className="text-muted-foreground mb-6">
                  Manage your saved scene settings for consistent video
                  production.
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {sceneSettings.map((scene) => (
                    <Card
                      key={scene.id}
                      className="bg-card hover:bg-accent/5 transition-colors cursor-pointer"
                    >
                      <CardContent className="p-4">
                        <h3 className="font-medium">{scene.name}</h3>
                        <div className="mt-2 space-y-1 text-sm text-muted-foreground">
                          <p>Camera: {scene.cameraAngle}</p>
                          <p>Lighting: {scene.lighting}</p>
                        </div>
                      </CardContent>
                    </Card>
                  ))}

                  <Card className="bg-primary/5 border-dashed border-2 flex items-center justify-center h-[120px] cursor-pointer hover:bg-primary/10 transition-colors">
                    <div className="text-center">
                      <p className="font-medium">Create New Scene</p>
                      <p className="text-xs text-muted-foreground mt-1">
                        Add camera, lighting, and audio settings
                      </p>
                    </div>
                  </Card>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="user-account" className="space-y-4">
            <Card>
              <CardContent className="p-6">
                <h2 className="text-2xl font-semibold mb-4">
                  Account Information
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <h3 className="text-lg font-medium">Profile</h3>
                      <div className="mt-2 space-y-2">
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Name:</span>
                          <span>{userAccount.name}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Email:</span>
                          <span>{userAccount.email}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">
                            Account Type:
                          </span>
                          <span className="capitalize">
                            {userAccount.accountType}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h3 className="text-lg font-medium">Usage Statistics</h3>
                      <div className="mt-2 space-y-2">
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">
                            Prompts Created:
                          </span>
                          <span>{userAccount.promptsCreated}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">
                            Characters Created:
                          </span>
                          <span>{userAccount.charactersCreated}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">
                            Scenes Created:
                          </span>
                          <span>{userAccount.scenesCreated}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">
                            Prompts Remaining:
                          </span>
                          <span>{userAccount.promptsRemaining}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-medium mb-4">
                      Subscription Plan
                    </h3>
                    <PricingPlans currentPlan={accountType} compact={true} />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Dashboard;
