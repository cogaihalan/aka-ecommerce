"use client";

import { useState } from "react";
import { Hairstyle } from "@/types";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Heart,
  User,
  Scissors,
  Calendar,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { format } from "date-fns";
import Image from "next/image";
import { storefrontHairstyleService } from "@/lib/api/services/storefront/extensions/hairstyles";
import { toast } from "sonner";

interface HairstyleDetailProps {
  hairstyle: Hairstyle;
}

export function HairstyleDetail({ hairstyle }: HairstyleDetailProps) {
  const [isFavoriting, setIsFavoriting] = useState(false);
  const [isFavorite, setIsFavorite] = useState(hairstyle.liked || false);
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0);

  const handleToggleFavorite = async () => {
    setIsFavoriting(true);

    try {
      const updatedHairstyle =
        await storefrontHairstyleService.toggleFavoriteHairstyle(hairstyle.id);
      setIsFavorite(updatedHairstyle.liked || false);
      toast.success(
        updatedHairstyle.liked ? "Added to favorites" : "Removed from favorites"
      );
    } catch (error) {
      console.error("Error toggling favorite:", error);
      toast.error("Failed to update favorite status");
    } finally {
      setIsFavoriting(false);
    }
  };

  const nextPhoto = () => {
    if (hairstyle.photos && hairstyle.photos.length > 0) {
      setCurrentPhotoIndex((prev) =>
        prev === hairstyle.photos!.length - 1 ? 0 : prev + 1
      );
    }
  };

  const prevPhoto = () => {
    if (hairstyle.photos && hairstyle.photos.length > 0) {
      setCurrentPhotoIndex((prev) =>
        prev === 0 ? hairstyle.photos!.length - 1 : prev - 1
      );
    }
  };

  const genderColors = {
    MALE: "bg-blue-100 text-blue-800",
    FEMALE: "bg-pink-100 text-pink-800",
    OTHER: "bg-purple-100 text-purple-800",
  };

  return (
    <div className="container mx-auto py-8">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Header */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold">{hairstyle.name}</h1>
              <div className="flex items-center space-x-4 mt-2">
                <Badge
                  className={
                    genderColors[hairstyle.gender as keyof typeof genderColors]
                  }
                >
                  {hairstyle.gender}
                </Badge>
                <div className="flex items-center space-x-2 text-muted-foreground">
                  <User className="h-4 w-4" />
                  <span>{hairstyle.barberName}</span>
                </div>
                <div className="flex items-center space-x-2 text-muted-foreground">
                  <Heart className="h-4 w-4" />
                  <span>{hairstyle.voteCount} votes</span>
                </div>
              </div>
            </div>

            <Button
              variant="outline"
              onClick={handleToggleFavorite}
              disabled={isFavoriting}
            >
              <Heart
                className={`h-4 w-4 mr-2 ${
                  isFavorite ? "fill-red-500 text-red-500" : ""
                }`}
              />
              {isFavorite ? "Favorited" : "Add to Favorites"}
            </Button>
          </div>
        </div>

        {/* Photo Gallery */}
        {hairstyle.photos && hairstyle.photos.length > 0 ? (
          <div className="relative">
            <div className="aspect-video w-full overflow-hidden rounded-lg">
              <Image
                src={hairstyle.photos[currentPhotoIndex].url}
                alt={`${hairstyle.name} - Photo ${currentPhotoIndex + 1}`}
                fill
                className="object-cover"
              />
            </div>

            {hairstyle.photos.length > 1 && (
              <>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={prevPhoto}
                  className="absolute left-4 top-1/2 transform -translate-y-1/2"
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={nextPhoto}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2"
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </>
            )}

            {/* Photo indicators */}
            {hairstyle.photos.length > 1 && (
              <div className="flex justify-center space-x-2 mt-4">
                {hairstyle.photos.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentPhotoIndex(index)}
                    className={`w-3 h-3 rounded-full transition-colors ${
                      index === currentPhotoIndex ? "bg-primary" : "bg-muted"
                    }`}
                  />
                ))}
              </div>
            )}
          </div>
        ) : (
          <div className="aspect-video w-full bg-muted rounded-lg flex items-center justify-center">
            <Scissors className="h-16 w-16 text-muted-foreground" />
          </div>
        )}
      </div>
    </div>
  );
}
