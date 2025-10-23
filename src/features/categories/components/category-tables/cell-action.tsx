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
import { Category } from "@/types";
import { Edit, MoreHorizontal, Trash2 } from "lucide-react";
import { useState } from "react";
import { CategoryDialog } from "../category-dialog";
import { unifiedCategoryService } from "@/lib/api/services/unified";
import { toast } from "sonner";

interface CellActionProps {
  data: Category;
}

export const CellAction: React.FC<CellActionProps> = ({ data }) => {
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);

  const onConfirm = async () => {
    setLoading(true);
    try {
      await unifiedCategoryService.deleteCategory(data.id);
      toast.success("Category deleted successfully");
      window.location.reload();
    } catch (error) {
      toast.error("Failed to delete category");
      console.error("Error deleting category:", error);
    } finally {
      setLoading(false);
      setOpen(false);
    }
  };

  return (
    <>
      <AlertModal
        isOpen={open}
        onClose={() => setOpen(false)}
        onConfirm={onConfirm}
        loading={loading}
      />

      <CategoryDialog
        open={editDialogOpen}
        onOpenChange={setEditDialogOpen}
        category={data}
        onSuccess={() => {
          // Refresh the page or refetch data
          window.location.reload();
        }}
      />

      <DropdownMenu modal={false}>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 p-0">
            <span className="sr-only">Open menu</span>
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>Actions</DropdownMenuLabel>

          <DropdownMenuItem onClick={() => setEditDialogOpen(true)}>
            <Edit className="mr-2 h-4 w-4" /> Update
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setOpen(true)}>
            <Trash2 className="mr-2 h-4 w-4 text-destructive" /> Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
};
