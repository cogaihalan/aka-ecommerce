"use client";

import { useState } from "react";
import { Hairstyle } from "@/types";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Heart, Eye, User, Scissors } from "lucide-react";
import Image from "next/image";
import { storefrontHairstyleService } from "@/lib/api/services/storefront/extensions/hairstyles/hairstyles-client";
import { toast } from "sonner";

interface HairstyleCardProps {
  hairstyle: Hairstyle;
  onView: () => void;
}

export function HairstyleCard({ hairstyle, onView }: HairstyleCardProps) {
  const [isFavoriting, setIsFavoriting] = useState(false);
  const [isFavorite, setIsFavorite] = useState(hairstyle.liked || false);

  const handleToggleFavorite = async (e: React.MouseEvent) => {
    e.stopPropagation();
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

  const genderColors = {
    MALE: "bg-blue-100 text-blue-800",
    FEMALE: "bg-pink-100 text-pink-800",
    OTHER: "bg-purple-100 text-purple-800",
  };

  return (
    <Card
      className="group hover:shadow-lg transition-shadow cursor-pointer"
      onClick={onView}
    >
      <div className="relative aspect-square overflow-hidden rounded-t-lg">
        {hairstyle.photos && hairstyle.photos.length > 0 ? (
          <Image
            src={hairstyle.photos[0].url}
            alt={hairstyle.name}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full bg-muted flex items-center justify-center">
            <Scissors className="h-12 w-12 text-muted-foreground" />
          </div>
        )}

        <div className="absolute top-2 left-2">
          <Badge
            className={
              genderColors[hairstyle.gender as keyof typeof genderColors]
            }
          >
            {hairstyle.gender}
          </Badge>
        </div>

        <div className="absolute top-2 right-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleToggleFavorite}
            disabled={isFavoriting}
            className="h-8 w-8 p-0 bg-white/80 hover:bg-white/90"
          >
            <Heart
              className={`h-4 w-4 ${
                isFavorite ? "fill-red-500 text-red-500" : "text-gray-600"
              }`}
            />
          </Button>
        </div>

        <div className="absolute inset-0 flex items-center justify-center group-hover:bg-black/40 transition-colors">
          <Button
            variant="default"
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              onView();
            }}
            className="opacity-0 group-hover:opacity-100 transition-opacity"
          >
            <Eye className="h-4 w-4 mr-2" />
            View Details
          </Button>
        </div>
      </div>

      <CardContent className="p-4">
        <div className="space-y-2">
          <h3 className="font-semibold line-clamp-2">{hairstyle.name}</h3>
          <div className="flex items-center space-x-2 text-sm text-muted-foreground">
            <User className="h-4 w-4" />
            <span>{hairstyle.barberName}</span>
          </div>
          <div className="flex items-center space-x-2 text-sm text-muted-foreground">
            <Heart className="h-4 w-4" />
            <span>{hairstyle.voteCount} votes</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
