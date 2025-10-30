"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreVertical, Edit, Image } from "lucide-react";
import { HairstyleDialog } from "../hairstyle-dialog";
import { HairstyleImageManager } from "../hairstyle-image-manager";
import { Hairstyle } from "@/types";

interface CellActionProps {
  data: Hairstyle;
}

export const CellAction: React.FC<CellActionProps> = ({ data }) => {
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [imageManagerOpen, setImageManagerOpen] = useState(false);

  return (
    <>
      <HairstyleDialog
        open={editDialogOpen}
        onOpenChange={setEditDialogOpen}
        hairstyle={data}
        onSuccess={() => {
          // Refresh the page or refetch data
          window.location.reload();
        }}
      />

      <HairstyleImageManager
        open={imageManagerOpen}
        onOpenChange={setImageManagerOpen}
        hairstyleId={data.id}
        existingImages={data.photos || []}
        onSuccess={() => {
          // Refresh the page or refetch data
          window.location.reload();
        }}
      />

      <DropdownMenu modal={false}>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 p-0">
            <span className="sr-only">Mở menu</span>
            <MoreVertical className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>Hành động</DropdownMenuLabel>

          <DropdownMenuItem onClick={() => setEditDialogOpen(true)}>
            <Edit className="mr-2 h-4 w-4" /> Cập nhật
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setImageManagerOpen(true)}>
            <Image className="mr-2 h-4 w-4" /> Quản lý ảnh
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
};
