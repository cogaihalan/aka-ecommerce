"use client";

import { Contest } from "@/types/extensions/contest";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock } from "lucide-react";
import { format } from "date-fns";
import Image from "next/image";

interface ContestCardProps {
  contest: Contest;
  onView: () => void;
}

export function ContestCard({ contest, onView }: ContestCardProps) {
  const now = new Date();
  const startDate = new Date(contest.startDate);
  const endDate = new Date(contest.endDate);

  let statusText = "Inactive";
  let statusVariant: "default" | "secondary" | "destructive" | "outline" | "info" =
    "secondary";

  if (contest.active) {
    if (now < startDate) {
      statusText = "Upcoming";
      statusVariant = "info";
    } else if (now > endDate) {
      statusText = "Ended";
      statusVariant = "secondary";
    } else {
      statusText = "Live";
      statusVariant = "default";
    }
  }

  return (
    <Card
      disableBlockPadding={true}
      className="group hover:shadow-lg transition-shadow"
    >
      <div className="relative aspect-square overflow-hidden rounded-t-lg">
        <Image
          src={contest.thumbnailUrl || "/assets/placeholder-image.jpeg"}
          alt={contest.name}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-300"
        />
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 group-hover:bg-black/40 transition-colors cursor-pointer">
          <Button
            variant="default"
            size="sm"
            onClick={onView}
            disabled={!contest.active}
          >
            View Details
          </Button>
        </div>

        <div className="absolute top-2 left-2">
          <Badge variant={statusVariant}>{statusText}</Badge>
        </div>
      </div>

      <CardContent className="p-4">
        <div className="space-y-3">
          <h3 className="font-semibold line-clamp-2">{contest.name}</h3>
          <p className="text-sm text-muted-foreground line-clamp-3">
            {contest.description}
          </p>

          <div className="space-y-2 text-xs text-muted-foreground">
            <div className="flex items-center gap-2">
              <Calendar className="h-3 w-3" />
              <span>Starts: {format(startDate, "MMM dd, yyyy")}</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="h-3 w-3" />
              <span>Ends: {format(endDate, "MMM dd, yyyy")}</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
