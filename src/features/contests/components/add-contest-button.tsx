"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { ContestDialog } from "./contest-dialog";

export function AddContestButton() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button onClick={() => setOpen(true)}>
        <Plus className="mr-2 h-4 w-4" />
        Thêm cuộc thi
      </Button>
      
      <ContestDialog
        open={open}
        onOpenChange={setOpen}
        onSuccess={() => {
          // Refresh the page or refetch data
          window.location.reload();
        }}
      />
    </>
  );
}
