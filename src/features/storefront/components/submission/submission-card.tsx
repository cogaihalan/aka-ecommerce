"use client";

import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Heart } from "lucide-react";
import { Submission } from "@/types";

interface SubmissionCardProps {
  submission: Submission;
}

export function SubmissionCard({ submission }: SubmissionCardProps) {
  const primaryPhoto = submission.photos.find((p) => p.primary) || submission.photos[0];

  return (
    <Card className="overflow-hidden">
      {primaryPhoto && (
        <div className="relative aspect-[4/3] bg-muted">
          <Image
            src={primaryPhoto.url}
            alt={submission.name}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            priority={false}
          />
        </div>
      )}
      <CardContent className="p-4">
        <div className="flex items-start justify-between gap-3">
          <div>
            <div className="font-semibold leading-tight">{submission.name}</div>
            <div className="text-sm text-muted-foreground">{submission.barberName}</div>
          </div>
          <Badge variant="secondary" className="shrink-0">
            <Heart className="h-3.5 w-3.5 mr-1" /> {submission.voteCount}
          </Badge>
        </div>
      </CardContent>
    </Card>
  );
}


