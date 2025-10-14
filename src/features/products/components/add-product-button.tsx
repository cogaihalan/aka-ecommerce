"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { ProductDialog } from "./product-dialog";

export function AddProductButton() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button onClick={() => setOpen(true)}>
        <Plus className="mr-2 h-4 w-4" />
        Add Product
      </Button>

      <ProductDialog
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
