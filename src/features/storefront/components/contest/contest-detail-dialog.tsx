"use client";

import { Contest } from "@/types/extensions/contest";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, User } from "lucide-react";
import { format } from "date-fns";
import Image from "next/image";

interface ContestDetailDialogProps {
  contest: Contest | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ContestDetailDialog({
  contest,
  open,
  onOpenChange,
}: ContestDetailDialogProps) {
  if (!contest) return null;

  const now = new Date();
  const startDate = new Date(contest.startDate);
  const endDate = new Date(contest.endDate);

  let statusText = "Inactive";
  let statusVariant:
    | "default"
    | "secondary"
    | "destructive"
    | "outline"
    | "info" = "secondary";

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

  const canParticipate = contest.active && now >= startDate && now <= endDate;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl">{contest.name}</DialogTitle>
          <DialogDescription>
            Contest details and participation information
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          <Badge variant={statusVariant} className="text-sm">
            {statusText}
          </Badge>
          {/* Contest Image */}
          <div className="relative max-w-60 aspect-square overflow-hidden rounded-lg">
            <Image
              src={contest.thumbnailUrl || "/assets/placeholder-image.jpeg"}
              alt={contest.name}
              fill
              className="object-cover"
            />
          </div>

          {/* Contest Description */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Description</h3>
            <p className="text-muted-foreground leading-relaxed">
              {contest.description}
            </p>
          </div>

          {/* Contest Dates */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Contest Timeline</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                <Calendar className="h-5 w-5 text-primary" />
                <div>
                  <p className="text-sm font-medium">Start Date</p>
                  <p className="text-sm text-muted-foreground">
                    {format(startDate, "EEEE, MMMM dd, yyyy")}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                <Clock className="h-5 w-5 text-primary" />
                <div>
                  <p className="text-sm font-medium">End Date</p>
                  <p className="text-sm text-muted-foreground">
                    {format(endDate, "EEEE, MMMM dd, yyyy")}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Contest Info */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Contest Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div className="flex items-center gap-2">
                <User className="h-4 w-4 text-muted-foreground" />
                <span className="text-muted-foreground">Created by:</span>
                <span>{contest.createdBy}</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <span className="text-muted-foreground">Created:</span>
                <span>
                  {format(new Date(contest.createdAt), "MMM dd, yyyy")}
                </span>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4 border-t">
            <Button
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="flex-1"
            >
              Close
            </Button>
            {canParticipate && (
              <Button className="flex-1">Participate Now</Button>
            )}
            {!canParticipate && contest.active && now < startDate && (
              <Button disabled className="flex-1">
                Contest Not Started Yet
              </Button>
            )}
            {!canParticipate && contest.active && now > endDate && (
              <Button disabled className="flex-1">
                Contest Ended
              </Button>
            )}
            {!contest.active && (
              <Button disabled className="flex-1">
                Contest Inactive
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
