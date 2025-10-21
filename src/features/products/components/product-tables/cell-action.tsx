"use client";
import { AlertModal } from "@/components/modal/alert-modal";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Product } from "@/types/product";
import { Edit, MoreVertical, Trash2, Image } from "lucide-react";
import { useState } from "react";
import { ProductDialog } from "../product-dialog";
import { ProductImageManager } from "../product-image-manager";
import { unifiedProductService } from "@/lib/api/services/unified";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

interface CellActionProps {
  data: Product;
}

export const CellAction: React.FC<CellActionProps> = ({ data }) => {
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [imageManagerOpen, setImageManagerOpen] = useState(false);

  return (
    <>
      <ProductDialog
        open={editDialogOpen}
        onOpenChange={setEditDialogOpen}
        product={data}
        onSuccess={() => {
          // Refresh the page or refetch data
          window.location.reload();
        }}
      />

      <ProductImageManager
        open={imageManagerOpen}
        onOpenChange={setImageManagerOpen}
        productId={data.id}
        existingImages={data.images || []}
        onSuccess={() => {
          // Refresh the page or refetch data
          window.location.reload();
        }}
      />

      <DropdownMenu modal={false}>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 p-0">
            <span className="sr-only">Open menu</span>
            <MoreVertical className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>Actions</DropdownMenuLabel>

          <DropdownMenuItem onClick={() => setEditDialogOpen(true)}>
            <Edit className="mr-2 h-4 w-4" /> Update
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setImageManagerOpen(true)}>
            <Image className="mr-2 h-4 w-4" /> Manage Images
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
};
