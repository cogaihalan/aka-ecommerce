"use client";

import { useState } from "react";
import { Contest } from "@/types/extensions/contest";
import { ContestCard } from "./contest-card";
import { ContestDetailDialog } from "./contest-detail-dialog";

interface ContestGridProps {
  contests: Contest[];
  total: number;
}

export function ContestGrid({ contests, total }: ContestGridProps) {
  const [selectedContest, setSelectedContest] = useState<Contest | null>(null);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          Hiển thị {contests.length} trên {total} cuộc thi
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {contests.map((contest) => (
          <ContestCard
            key={contest.id}
            contest={contest}
            onView={() => setSelectedContest(contest)}
          />
        ))}
      </div>

      {contests.length === 0 && (
        <div className="text-center py-12">
          <p className="text-muted-foreground">Không tìm thấy cuộc thi</p>
        </div>
      )}

      <ContestDetailDialog
        contest={selectedContest}
        open={!!selectedContest}
        onOpenChange={(open) => !open && setSelectedContest(null)}
      />
    </div>
  );
}
