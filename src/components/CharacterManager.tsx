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
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Search, Plus, Edit, Trash2, Save } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";

interface Character {
  id: string;
  name: string;
  avatar: string;
  appearance: {
    height: string;
    weight: string;
    hair: string;
    eyes: string;
    clothing: string;
  };
  personality: {
    traits: string[];
    emotions: string;
    background: string;
  };
  createdAt: Date;
}

export default function CharacterManager() {
  const [searchQuery, setSearchQuery] = useState("");
  const [characters, setCharacters] = useState<Character[]>([
    {
      id: "1",
      name: "Emma Johnson",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=emma",
      appearance: {
        height: "5'7\"",
        weight: "135 lbs",
        hair: "Long blonde, wavy",
        eyes: "Blue",
        clothing: "Business casual, often wears blazers with jeans",
      },
      personality: {
        traits: ["Confident", "Ambitious", "Friendly"],
        emotions: "Generally upbeat and positive",
        background: "Marketing executive at a tech startup",
      },
      createdAt: new Date(2023, 5, 15),
    },
    {
      id: "2",
      name: "Marcus Chen",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=marcus",
      appearance: {
        height: "6'0\"",
        weight: "180 lbs",
        hair: "Short black, styled",
        eyes: "Brown",
        clothing: "Smart casual, prefers dark colors",
      },
      personality: {
        traits: ["Analytical", "Reserved", "Detail-oriented"],
        emotions: "Calm and collected, rarely shows strong emotions",
        background: "Software engineer with 10 years experience",
      },
      createdAt: new Date(2023, 6, 22),
    },
    {
      id: "3",
      name: "Sophia Rodriguez",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=sophia",
      appearance: {
        height: "5'5\"",
        weight: "125 lbs",
        hair: "Medium length brown with highlights",
        eyes: "Hazel",
        clothing: "Trendy and colorful outfits",
      },
      personality: {
        traits: ["Creative", "Energetic", "Optimistic"],
        emotions: "Expressive and animated",
        background: "Freelance graphic designer and illustrator",
      },
      createdAt: new Date(2023, 7, 5),
    },
  ]);

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [currentCharacter, setCurrentCharacter] = useState<Character | null>(
    null,
  );
  const [isEditing, setIsEditing] = useState(false);

  // Filter characters based on search query
  const filteredCharacters = characters.filter((character) =>
    character.name.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const handleCreateNew = () => {
    const newCharacter: Character = {
      id: Date.now().toString(),
      name: "",
      avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${Date.now()}`,
      appearance: {
        height: "",
        weight: "",
        hair: "",
        eyes: "",
        clothing: "",
      },
      personality: {
        traits: [],
        emotions: "",
        background: "",
      },
      createdAt: new Date(),
    };
    setCurrentCharacter(newCharacter);
    setIsEditing(true);
    setIsDialogOpen(true);
  };

  const handleEdit = (character: Character) => {
    setCurrentCharacter(character);
    setIsEditing(true);
    setIsDialogOpen(true);
  };

  const handleView = (character: Character) => {
    setCurrentCharacter(character);
    setIsEditing(false);
    setIsDialogOpen(true);
  };

  const handleDelete = (id: string) => {
    setCharacters(characters.filter((character) => character.id !== id));
  };

  const handleSave = (updatedCharacter: Character) => {
    if (isEditing) {
      if (characters.some((char) => char.id === updatedCharacter.id)) {
        // Update existing character
        setCharacters(
          characters.map((char) =>
            char.id === updatedCharacter.id ? updatedCharacter : char,
          ),
        );
      } else {
        // Add new character
        setCharacters([...characters, updatedCharacter]);
      }
    }
    setIsDialogOpen(false);
  };

  return (
    <div className="bg-background w-full p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Character Manager</h2>
        <div className="flex gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Search characters..."
              className="pl-10 w-[250px]"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Button onClick={handleCreateNew}>
            <Plus className="mr-2 h-4 w-4" /> New Character
          </Button>
        </div>
      </div>

      {filteredCharacters.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-muted-foreground">
            No characters found. Create a new character to get started.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCharacters.map((character) => (
            <Card key={character.id} className="overflow-hidden">
              <CardHeader className="pb-2">
                <div className="flex justify-between items-start">
                  <div className="flex items-center gap-3">
                    <Avatar className="h-12 w-12">
                      <AvatarImage
                        src={character.avatar}
                        alt={character.name}
                      />
                      <AvatarFallback>
                        {character.name.substring(0, 2).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <CardTitle className="text-lg">
                        {character.name}
                      </CardTitle>
                      <CardDescription>
                        Created {character.createdAt.toLocaleDateString()}
                      </CardDescription>
                    </div>
                  </div>
                  <div className="flex gap-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleEdit(character)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDelete(character.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pb-2">
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div>
                    <p className="font-medium">Height:</p>
                    <p className="text-muted-foreground">
                      {character.appearance.height || "Not specified"}
                    </p>
                  </div>
                  <div>
                    <p className="font-medium">Hair:</p>
                    <p className="text-muted-foreground">
                      {character.appearance.hair || "Not specified"}
                    </p>
                  </div>
                  <div>
                    <p className="font-medium">Eyes:</p>
                    <p className="text-muted-foreground">
                      {character.appearance.eyes || "Not specified"}
                    </p>
                  </div>
                  <div>
                    <p className="font-medium">Traits:</p>
                    <p className="text-muted-foreground">
                      {character.personality.traits.join(", ") ||
                        "Not specified"}
                    </p>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => handleView(character)}
                >
                  View Details
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>
              {isEditing
                ? currentCharacter?.name
                  ? `Edit ${currentCharacter.name}`
                  : "Create New Character"
                : currentCharacter?.name}
            </DialogTitle>
            <DialogDescription>
              {isEditing
                ? "Fill in the details to create or update your character profile."
                : "View character details and information."}
            </DialogDescription>
          </DialogHeader>

          {currentCharacter && (
            <Tabs defaultValue="appearance" className="w-full">
              <TabsList className="grid grid-cols-2 mb-4">
                <TabsTrigger value="appearance">Appearance</TabsTrigger>
                <TabsTrigger value="personality">Personality</TabsTrigger>
              </TabsList>

              <TabsContent value="appearance" className="space-y-4">
                <div className="flex gap-4 items-start">
                  <div className="flex-shrink-0">
                    <Avatar className="h-24 w-24">
                      <AvatarImage
                        src={currentCharacter.avatar}
                        alt={currentCharacter.name}
                      />
                      <AvatarFallback>
                        {currentCharacter.name.substring(0, 2).toUpperCase() ||
                          "CH"}
                      </AvatarFallback>
                    </Avatar>
                  </div>
                  <div className="flex-grow space-y-4">
                    <div className="grid grid-cols-1 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="name">Character Name</Label>
                        <Input
                          id="name"
                          value={currentCharacter.name}
                          onChange={(e) =>
                            setCurrentCharacter({
                              ...currentCharacter,
                              name: e.target.value,
                            })
                          }
                          disabled={!isEditing}
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="height">Height</Label>
                    <Input
                      id="height"
                      value={currentCharacter.appearance.height}
                      onChange={(e) =>
                        setCurrentCharacter({
                          ...currentCharacter,
                          appearance: {
                            ...currentCharacter.appearance,
                            height: e.target.value,
                          },
                        })
                      }
                      disabled={!isEditing}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="weight">Weight</Label>
                    <Input
                      id="weight"
                      value={currentCharacter.appearance.weight}
                      onChange={(e) =>
                        setCurrentCharacter({
                          ...currentCharacter,
                          appearance: {
                            ...currentCharacter.appearance,
                            weight: e.target.value,
                          },
                        })
                      }
                      disabled={!isEditing}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="hair">Hair</Label>
                    <Input
                      id="hair"
                      value={currentCharacter.appearance.hair}
                      onChange={(e) =>
                        setCurrentCharacter({
                          ...currentCharacter,
                          appearance: {
                            ...currentCharacter.appearance,
                            hair: e.target.value,
                          },
                        })
                      }
                      disabled={!isEditing}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="eyes">Eyes</Label>
                    <Input
                      id="eyes"
                      value={currentCharacter.appearance.eyes}
                      onChange={(e) =>
                        setCurrentCharacter({
                          ...currentCharacter,
                          appearance: {
                            ...currentCharacter.appearance,
                            eyes: e.target.value,
                          },
                        })
                      }
                      disabled={!isEditing}
                    />
                  </div>
                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="clothing">Clothing Style</Label>
                    <Textarea
                      id="clothing"
                      value={currentCharacter.appearance.clothing}
                      onChange={(e) =>
                        setCurrentCharacter({
                          ...currentCharacter,
                          appearance: {
                            ...currentCharacter.appearance,
                            clothing: e.target.value,
                          },
                        })
                      }
                      disabled={!isEditing}
                    />
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="personality" className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="traits">
                    Personality Traits (comma separated)
                  </Label>
                  <Input
                    id="traits"
                    value={currentCharacter.personality.traits.join(", ")}
                    onChange={(e) =>
                      setCurrentCharacter({
                        ...currentCharacter,
                        personality: {
                          ...currentCharacter.personality,
                          traits: e.target.value
                            .split(",")
                            .map((trait) => trait.trim()),
                        },
                      })
                    }
                    disabled={!isEditing}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="emotions">Emotional Expression</Label>
                  <Textarea
                    id="emotions"
                    value={currentCharacter.personality.emotions}
                    onChange={(e) =>
                      setCurrentCharacter({
                        ...currentCharacter,
                        personality: {
                          ...currentCharacter.personality,
                          emotions: e.target.value,
                        },
                      })
                    }
                    disabled={!isEditing}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="background">Background Story</Label>
                  <Textarea
                    id="background"
                    value={currentCharacter.personality.background}
                    onChange={(e) =>
                      setCurrentCharacter({
                        ...currentCharacter,
                        personality: {
                          ...currentCharacter.personality,
                          background: e.target.value,
                        },
                      })
                    }
                    disabled={!isEditing}
                    className="min-h-[100px]"
                  />
                </div>
              </TabsContent>
            </Tabs>
          )}

          <DialogFooter>
            {isEditing ? (
              <Button onClick={() => handleSave(currentCharacter!)}>
                <Save className="mr-2 h-4 w-4" /> Save Character
              </Button>
            ) : (
              <Button
                onClick={() => handleEdit(currentCharacter!)}
                variant="outline"
              >
                <Edit className="mr-2 h-4 w-4" /> Edit Character
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
