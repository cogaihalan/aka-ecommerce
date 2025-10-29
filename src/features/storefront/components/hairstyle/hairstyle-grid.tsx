"use client";

import { useState } from "react";
import { Hairstyle } from "@/types";
import { HairstyleCard } from "./hairstyle-card";
import { HairstyleDetailDialog } from "./hairstyle-detail-dialog";

interface HairstyleGridProps {
  hairstyles: Hairstyle[];
  total: number;
}

export function HairstyleGrid({ hairstyles, total }: HairstyleGridProps) {
  const [selectedHairstyle, setSelectedHairstyle] = useState<Hairstyle | null>(
    null
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          Showing {hairstyles.length} of {total} hairstyles
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {hairstyles.map((hairstyle) => (
          <HairstyleCard
            key={hairstyle.id}
            hairstyle={hairstyle}
            onView={() => setSelectedHairstyle(hairstyle)}
          />
        ))}
      </div>

      {hairstyles.length === 0 && (
        <div className="text-center py-12">
          <p className="text-muted-foreground">No hairstyles found</p>
        </div>
      )}

      <HairstyleDetailDialog
        hairstyle={selectedHairstyle}
        open={!!selectedHairstyle}
        onOpenChange={(open) => !open && setSelectedHairstyle(null)}
      />
    </div>
  );
}
