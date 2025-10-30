"use client";

import { useMemo } from "react";
import { Submission } from "@/types";
import { SubmissionCard } from "./submission-card";

interface SubmissionGridProps {
  submissions: Submission[];
  total: number;
}

export function SubmissionGrid({ submissions, total }: SubmissionGridProps) {
  const hasItems = submissions && submissions.length > 0;

  const countText = useMemo(() => {
    const shown = submissions.length;
    return `Hiển thị ${shown} trên ${total} bài đăng`;
  }, [submissions, total]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">{countText}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {submissions.map((s) => (
          <SubmissionCard key={s.id} submission={s} />
        ))}
      </div>

      {!hasItems && (
        <div className="text-center py-12">
          <p className="text-muted-foreground">Không tìm thấy bài đăng</p>
        </div>
      )}
    </div>
  );
}


