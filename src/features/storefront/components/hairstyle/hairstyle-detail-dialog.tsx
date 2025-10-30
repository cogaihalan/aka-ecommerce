"use client";

import { useState, useEffect } from "react";
import { Hairstyle } from "@/types";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
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
import { storefrontHairstyleService } from "@/lib/api/services/storefront/extensions/hairstyles/hairstyles-client";
import { toast } from "sonner";

interface HairstyleDetailDialogProps {
  hairstyle: Hairstyle | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function HairstyleDetailDialog({
  hairstyle,
  open,
  onOpenChange,
}: HairstyleDetailDialogProps) {
  const [isFavoriting, setIsFavoriting] = useState(false);
  const [isFavorite, setIsFavorite] = useState(hairstyle?.liked || false);
  const [voteCount, setVoteCount] = useState(hairstyle?.voteCount || 0);
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0);

  // Update vote count when hairstyle prop changes
  useEffect(() => {
    if (hairstyle) {
      setVoteCount(hairstyle.voteCount);
      setIsFavorite(hairstyle.liked || false);
    }
  }, [hairstyle?.voteCount, hairstyle?.liked]);

  if (!hairstyle) return null;

  const handleToggleFavorite = async () => {
    setIsFavoriting(true);

    try {
      const updatedHairstyle =
        await storefrontHairstyleService.toggleFavoriteHairstyle(hairstyle.id);
      setIsFavorite(updatedHairstyle.liked || false);
      setVoteCount(updatedHairstyle.voteCount);
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
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-left max-w-4/5">
            {hairstyle.name}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Photo Gallery */}
          {hairstyle.photos && hairstyle.photos.length > 0 ? (
            <div className="relative">
              <div className="aspect-video w-full overflow-hidden rounded-lg">
                <Image
                  src={hairstyle.photos[currentPhotoIndex].url}
                  alt={`${hairstyle.name} - Photo ${currentPhotoIndex + 1}`}
                  fill
                  className="object-contain"
                />
              </div>

              {hairstyle.photos.length > 1 && (
                <>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={prevPhoto}
                    className="absolute left-2 top-1/2 transform -translate-y-1/2"
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={nextPhoto}
                    className="absolute right-2 top-1/2 transform -translate-y-1/2"
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
                      className={`w-2 h-2 rounded-full ${
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

          {/* Hairstyle Info */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <Badge
                  className={
                    genderColors[hairstyle.gender as keyof typeof genderColors]
                  }
                >
                  {hairstyle.gender}
                </Badge>
                <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                  <User className="h-4 w-4" />
                  <span>{hairstyle.barberName}</span>
                </div>
                <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                  <Heart className="h-4 w-4" />
                  <span>{voteCount} votes</span>
                </div>
              </div>

              <Button
                variant="outline"
                size="sm"
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
        </div>
      </DialogContent>
    </Dialog>
  );
}
