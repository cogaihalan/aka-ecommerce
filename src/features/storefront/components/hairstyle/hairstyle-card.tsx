"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { Hairstyle } from "@/types";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Heart, Eye, User, Scissors } from "lucide-react";
import Image from "next/image";
import { Fancybox } from "@fancyapps/ui";
import { storefrontHairstyleService } from "@/lib/api/services/storefront/extensions/hairstyles/hairstyles-client";
import { toast } from "sonner";

interface HairstyleCardProps {
  hairstyle: Hairstyle;
  onView: () => void;
}

export function HairstyleCard({ hairstyle, onView }: HairstyleCardProps) {
  const [isFavoriting, setIsFavoriting] = useState(false);
  const [isFavorite, setIsFavorite] = useState(hairstyle.liked || false);
  const [voteCount, setVoteCount] = useState(hairstyle.voteCount);
  const galleryRef = useRef<HTMLDivElement>(null);
  const galleryName = `hairstyle-gallery-${hairstyle.id}`;

  // Initialize Fancybox when component mounts
  useEffect(() => {
    if (galleryRef.current && hairstyle.photos && hairstyle.photos.length > 0) {
      Fancybox.bind(galleryRef.current, "[data-fancybox]", {
        // Enable keyboard navigation
        keyboard: {
          Escape: "close",
          Delete: "close",
          Backspace: "close",
          PageUp: "prev",
          PageDown: "next",
          ArrowRight: "next",
          ArrowLeft: "prev",
          ArrowUp: "prev",
          ArrowDown: "next",
        },
        // Close on backdrop click
        backdropClick: "close",
        // Ensure Fancybox renders above Dialog
        parentEl: document.body,
      });
    }

    // Cleanup Fancybox when component unmounts
    return () => {
      if (galleryRef.current) {
        Fancybox.unbind(galleryRef.current);
      }
    };
  }, [hairstyle.photos]);

  // Update vote count when hairstyle prop changes
  useEffect(() => {
    setVoteCount(hairstyle.voteCount);
  }, [hairstyle.voteCount]);

  const handleToggleFavorite = useCallback(
    async (e: React.MouseEvent) => {
      e.stopPropagation();
      setIsFavoriting(true);

      try {
        const updatedHairstyle =
          await storefrontHairstyleService.toggleFavoriteHairstyle(
            hairstyle.id
          );
        setIsFavorite(updatedHairstyle.liked || false);
        setVoteCount(updatedHairstyle.voteCount);
        toast.success(
          updatedHairstyle.liked
            ? "Added to favorites"
            : "Removed from favorites"
        );
      } catch (error) {
        console.error("Error toggling favorite:", error);
        toast.error("Failed to update favorite status");
      } finally {
        setIsFavoriting(false);
      }
    },
    [hairstyle.id]
  );

  const genderColors = {
    MALE: "bg-blue-100 text-blue-800",
    FEMALE: "bg-pink-100 text-pink-800",
  };

  return (
    <Card
      disableBlockPadding={true}
      className="group hover:shadow-lg transition-shadow cursor-pointer"
    >
      <div
        ref={galleryRef}
        className="relative aspect-square overflow-hidden rounded-t-lg"
      >
        {hairstyle.photos && hairstyle.photos.length > 0 ? (
          <>
            {/* Hidden links for all photos - allows Fancybox to create a gallery */}
            {hairstyle.photos.slice(1).map((photo, index) => (
              <a
                key={photo.id}
                href={photo.url}
                data-fancybox={galleryName}
                data-caption={`${hairstyle.name} - Photo ${index + 1}`}
                className="hidden"
                aria-hidden="true"
              >
                <Image
                  src={photo.url}
                  alt={`${hairstyle.name} - Photo ${index + 1}`}
                  fill
                />
              </a>
            ))}
            {/* Visible main image - clickable to open Fancybox */}
            <a
              href={hairstyle.photos[0].url}
              data-fancybox={galleryName}
              data-caption={hairstyle.name}
              className="w-full h-full block cursor-pointer"
              onClick={(e) => e.stopPropagation()}
            >
              <Image
                src={hairstyle.photos[0].url}
                alt={hairstyle.name}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-300"
              />
            </a>
          </>
        ) : (
          <div className="w-full h-full bg-muted flex items-center justify-center">
            <Scissors className="h-12 w-12 text-muted-foreground" />
          </div>
        )}

        <div className="absolute top-2 left-2 z-10">
          <Badge
            className={
              genderColors[hairstyle.gender as keyof typeof genderColors]
            }
          >
            {hairstyle.gender}
          </Badge>
        </div>

        <div className="absolute top-2 right-2 z-10">
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
      </div>

      <CardContent className="px-4 pb-4">
        <div className="space-y-2">
          <h3 className="font-semibold line-clamp-2">{hairstyle.name}</h3>
          <div className="flex items-center space-x-2 text-sm text-muted-foreground">
            <User className="h-4 w-4" />
            <span>{hairstyle.barberName}</span>
          </div>
          <div className="flex items-center space-x-2 text-sm text-muted-foreground">
            <Heart className="h-4 w-4" />
            <span>{voteCount} votes</span>
          </div>
          <Button
            variant="default"
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              onView();
            }}
            className="w-full"
          >
            <Eye className="h-4 w-4 mr-2" />
            View Details
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
