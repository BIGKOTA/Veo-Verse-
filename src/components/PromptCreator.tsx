"use client";

import React, { useState } from "react";
import { Button } from "./ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { Label } from "./ui/label";
import { Slider } from "./ui/slider";
import { Switch } from "./ui/switch";
import { Badge } from "./ui/badge";
import { Separator } from "./ui/separator";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "./ui/alert-dialog";
import { Check, ChevronRight, Save, Sparkles, Video } from "lucide-react";

interface PromptCreatorProps {
  userAccountStatus?: "free" | "subscriber" | "premium";
  savedCharacters?: Character[];
  savedScenes?: Scene[];
  onSavePrompt?: (prompt: Prompt) => void;
}

interface Character {
  id: string;
  name: string;
  appearance: {
    height: string;
    weight: string;
    hair: string;
    eyes: string;
    clothing: string;
  };
  emotionalTraits: string[];
}

interface Scene {
  id: string;
  name: string;
  cameraAngles: string;
  lighting: string;
  audioPreferences: string;
}

interface Prompt {
  id: string;
  title: string;
  template: string;
  character: Character | null;
  scene: Scene | null;
  customText: string;
  finalPrompt: string;
}

const promptTemplates = [
  {
    id: "1",
    name: "Character Introduction",
    template:
      "Create a video featuring [CHARACTER_NAME] introducing themselves in [SCENE_SETTING]. They should [ACTION] while [EMOTION].",
  },
  {
    id: "2",
    name: "Storytelling",
    template:
      "Create a video where [CHARACTER_NAME] tells a story about [TOPIC] in [SCENE_SETTING]. The mood should be [EMOTION].",
  },
  {
    id: "3",
    name: "Tutorial",
    template:
      "Create a video where [CHARACTER_NAME] explains how to [TOPIC] in [SCENE_SETTING]. The explanation should be [STYLE].",
  },
  { id: "4", name: "Custom", template: "" },
];

const defaultCharacters: Character[] = [
  {
    id: "1",
    name: "Professional Alex",
    appearance: {
      height: "5'10\"",
      weight: "165 lbs",
      hair: "Short brown",
      eyes: "Blue",
      clothing: "Business casual attire",
    },
    emotionalTraits: ["Confident", "Articulate", "Friendly"],
  },
  {
    id: "2",
    name: "Creative Jordan",
    appearance: {
      height: "5'7\"",
      weight: "145 lbs",
      hair: "Shoulder-length blonde",
      eyes: "Green",
      clothing: "Artistic casual wear",
    },
    emotionalTraits: ["Enthusiastic", "Expressive", "Imaginative"],
  },
];

const defaultScenes: Scene[] = [
  {
    id: "1",
    name: "Modern Office",
    cameraAngles: "Medium shot, eye level",
    lighting: "Bright, professional lighting",
    audioPreferences: "Clear voice, minimal background noise",
  },
  {
    id: "2",
    name: "Creative Studio",
    cameraAngles: "Wide shot with occasional close-ups",
    lighting: "Warm, artistic lighting with soft shadows",
    audioPreferences: "Natural voice with subtle background music",
  },
];

const PromptCreator: React.FC<PromptCreatorProps> = ({
  userAccountStatus = "free",
  savedCharacters = defaultCharacters,
  savedScenes = defaultScenes,
  onSavePrompt = () => {},
}) => {
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [selectedTemplate, setSelectedTemplate] = useState<string>(
    promptTemplates[0].id,
  );
  const [selectedCharacter, setSelectedCharacter] = useState<string>("");
  const [selectedScene, setSelectedScene] = useState<string>("");
  const [customText, setCustomText] = useState<string>("");
  const [promptTitle, setPromptTitle] = useState<string>("");
  const [generatedPrompt, setGeneratedPrompt] = useState<string>("");
  const [promptsRemaining, setPromptsRemaining] = useState<number>(
    userAccountStatus === "free" ? 3 : -1,
  );
  const [showLimitWarning, setShowLimitWarning] = useState<boolean>(false);

  const handleTemplateChange = (templateId: string) => {
    setSelectedTemplate(templateId);
    if (templateId === "4") {
      // Custom template
      setCustomText("");
    }
  };

  const getSelectedTemplateObject = () => {
    return (
      promptTemplates.find((template) => template.id === selectedTemplate) ||
      promptTemplates[0]
    );
  };

  const getSelectedCharacterObject = () => {
    return savedCharacters.find(
      (character) => character.id === selectedCharacter,
    );
  };

  const getSelectedSceneObject = () => {
    return savedScenes.find((scene) => scene.id === selectedScene);
  };

  const generatePrompt = () => {
    if (userAccountStatus === "free" && promptsRemaining <= 0) {
      setShowLimitWarning(true);
      return;
    }

    const template = getSelectedTemplateObject();
    const character = getSelectedCharacterObject();
    const scene = getSelectedSceneObject();

    let finalPrompt = template.id === "4" ? customText : template.template;

    if (character) {
      finalPrompt = finalPrompt.replace(/\[CHARACTER_NAME\]/g, character.name);
      // Add character details
      finalPrompt += `\n\nCharacter Details:\n- Name: ${character.name}\n- Appearance: ${character.appearance.height}, ${character.appearance.weight}, ${character.appearance.hair} hair, ${character.appearance.eyes} eyes\n- Wearing: ${character.appearance.clothing}\n- Emotional traits: ${character.emotionalTraits.join(", ")}`;
    }

    if (scene) {
      finalPrompt = finalPrompt.replace(/\[SCENE_SETTING\]/g, scene.name);
      // Add scene details
      finalPrompt += `\n\nScene Details:\n- Setting: ${scene.name}\n- Camera: ${scene.cameraAngles}\n- Lighting: ${scene.lighting}\n- Audio: ${scene.audioPreferences}`;
    }

    setGeneratedPrompt(finalPrompt);

    if (userAccountStatus === "free") {
      setPromptsRemaining((prev) => prev - 1);
    }

    setCurrentStep(4);
  };

  const savePrompt = () => {
    const newPrompt: Prompt = {
      id: Date.now().toString(),
      title: promptTitle || "Untitled Prompt",
      template: getSelectedTemplateObject().template,
      character: getSelectedCharacterObject() || null,
      scene: getSelectedSceneObject() || null,
      customText,
      finalPrompt: generatedPrompt,
    };

    onSavePrompt(newPrompt);
    // Reset form or show success message
    setCurrentStep(1);
    setSelectedTemplate(promptTemplates[0].id);
    setSelectedCharacter("");
    setSelectedScene("");
    setCustomText("");
    setPromptTitle("");
    setGeneratedPrompt("");
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1: // Template Selection
        return (
          <div className="space-y-6 bg-background p-6 rounded-lg">
            <div className="space-y-2">
              <h3 className="text-lg font-medium">Select a Prompt Template</h3>
              <p className="text-sm text-muted-foreground">
                Choose a template as a starting point for your prompt
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {promptTemplates.map((template) => (
                <Card
                  key={template.id}
                  className={`cursor-pointer transition-all ${selectedTemplate === template.id ? "border-primary ring-2 ring-primary/20" : "hover:border-primary/50"}`}
                  onClick={() => handleTemplateChange(template.id)}
                >
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base">{template.name}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground line-clamp-3">
                      {template.id === "4"
                        ? "Create your own custom prompt from scratch"
                        : template.template}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>

            {selectedTemplate === "4" && (
              <div className="space-y-4 mt-4">
                <Label htmlFor="custom-template">Custom Prompt</Label>
                <Textarea
                  id="custom-template"
                  placeholder="Write your custom prompt here..."
                  className="min-h-[150px]"
                  value={customText}
                  onChange={(e) => setCustomText(e.target.value)}
                />
                <p className="text-xs text-muted-foreground">
                  Tip: Use placeholders like [CHARACTER_NAME] and
                  [SCENE_SETTING] to automatically insert your saved character
                  and scene details.
                </p>
              </div>
            )}

            <div className="flex justify-end">
              <Button
                onClick={() => setCurrentStep(2)}
                disabled={selectedTemplate === "4" && !customText.trim()}
              >
                Next <ChevronRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </div>
        );

      case 2: // Character Selection
        return (
          <div className="space-y-6 bg-background p-6 rounded-lg">
            <div className="space-y-2">
              <h3 className="text-lg font-medium">Select a Character</h3>
              <p className="text-sm text-muted-foreground">
                Choose a character profile to use in your prompt
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {savedCharacters.map((character) => (
                <Card
                  key={character.id}
                  className={`cursor-pointer transition-all ${selectedCharacter === character.id ? "border-primary ring-2 ring-primary/20" : "hover:border-primary/50"}`}
                  onClick={() => setSelectedCharacter(character.id)}
                >
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base">
                      {character.name}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <div className="flex flex-wrap gap-1">
                      {character.emotionalTraits.map((trait, index) => (
                        <Badge key={index} variant="secondary">
                          {trait}
                        </Badge>
                      ))}
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {character.appearance.height}, {character.appearance.hair}{" "}
                      hair, {character.appearance.eyes} eyes
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>

            <div className="flex justify-between">
              <Button variant="outline" onClick={() => setCurrentStep(1)}>
                Back
              </Button>
              <Button
                onClick={() => setCurrentStep(3)}
                disabled={!selectedCharacter}
              >
                Next <ChevronRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </div>
        );

      case 3: // Scene Selection
        return (
          <div className="space-y-6 bg-background p-6 rounded-lg">
            <div className="space-y-2">
              <h3 className="text-lg font-medium">Select a Scene</h3>
              <p className="text-sm text-muted-foreground">
                Choose a scene setting for your prompt
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {savedScenes.map((scene) => (
                <Card
                  key={scene.id}
                  className={`cursor-pointer transition-all ${selectedScene === scene.id ? "border-primary ring-2 ring-primary/20" : "hover:border-primary/50"}`}
                  onClick={() => setSelectedScene(scene.id)}
                >
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base">{scene.name}</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <p className="text-xs text-muted-foreground">
                      Camera: {scene.cameraAngles}
                      <br />
                      Lighting: {scene.lighting}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>

            <div className="flex justify-between">
              <Button variant="outline" onClick={() => setCurrentStep(2)}>
                Back
              </Button>
              <Button onClick={generatePrompt}>
                Generate Prompt <Sparkles className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </div>
        );

      case 4: // Generated Prompt
        return (
          <div className="space-y-6 bg-background p-6 rounded-lg">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-medium">Your Generated Prompt</h3>
                <Badge variant="outline" className="flex items-center gap-1">
                  <Check className="h-3 w-3" /> Ready for Veo 3
                </Badge>
              </div>
              <p className="text-sm text-muted-foreground">
                Copy this prompt to use with Google Veo 3 or save it to your
                library
              </p>
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="prompt-title">Prompt Title</Label>
                <Input
                  id="prompt-title"
                  placeholder="Give your prompt a name"
                  value={promptTitle}
                  onChange={(e) => setPromptTitle(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="generated-prompt">Generated Prompt</Label>
                <div className="relative">
                  <Textarea
                    id="generated-prompt"
                    className="min-h-[200px] font-mono text-sm"
                    value={generatedPrompt}
                    readOnly
                  />
                  <Button
                    variant="outline"
                    size="sm"
                    className="absolute top-2 right-2"
                    onClick={() =>
                      navigator.clipboard.writeText(generatedPrompt)
                    }
                  >
                    Copy
                  </Button>
                </div>
              </div>
            </div>

            <div className="flex justify-between">
              <Button variant="outline" onClick={() => setCurrentStep(3)}>
                Back
              </Button>
              <div className="flex gap-2">
                <Button variant="outline" onClick={() => setCurrentStep(1)}>
                  Create New
                </Button>
                <Button onClick={savePrompt}>
                  <Save className="mr-2 h-4 w-4" /> Save Prompt
                </Button>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="w-full bg-background rounded-lg border">
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold">Prompt Creator</h2>
            <p className="text-muted-foreground">
              Create professional-grade prompts for Google Veo 3
            </p>
          </div>

          {userAccountStatus === "free" && (
            <div className="flex items-center gap-2">
              <Badge variant={promptsRemaining > 0 ? "outline" : "destructive"}>
                {promptsRemaining > 0
                  ? `${promptsRemaining} prompts remaining`
                  : "No prompts remaining"}
              </Badge>
              <Button variant="outline" size="sm">
                Upgrade
              </Button>
            </div>
          )}
        </div>

        <div className="mb-8">
          <div className="relative">
            <div className="flex justify-between mb-2">
              {["Template", "Character", "Scene", "Generate"].map(
                (step, index) => (
                  <div
                    key={index}
                    className={`flex flex-col items-center ${index + 1 <= currentStep ? "text-primary" : "text-muted-foreground"}`}
                  >
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center mb-1 ${index + 1 <= currentStep ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"}`}
                    >
                      {index + 1}
                    </div>
                    <span className="text-xs hidden md:block">{step}</span>
                  </div>
                ),
              )}
            </div>
            <div className="absolute top-4 left-0 right-0 h-[2px] bg-muted -z-10">
              <div
                className="h-full bg-primary transition-all"
                style={{ width: `${((currentStep - 1) / 3) * 100}%` }}
              />
            </div>
          </div>
        </div>

        {renderStepContent()}
      </div>

      <AlertDialog open={showLimitWarning} onOpenChange={setShowLimitWarning}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Prompt Limit Reached</AlertDialogTitle>
            <AlertDialogDescription>
              You've used all your free prompts. Upgrade to our subscription
              plan for unlimited prompts and additional features.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction>Upgrade Now</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default PromptCreator;
