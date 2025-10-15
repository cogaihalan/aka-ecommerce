"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { FileUploader } from "@/components/file-uploader";
import { X } from "lucide-react";
import { toast } from "sonner";
import {
  ProductImageUploadRequest,
  ProductImageUpdateRequest,
  ProductImageDeleteRequest,
} from "@/lib/api/types";
import { unifiedProductService } from "@/lib/api/services/unified";

interface ProductImageManagerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  productId: number;
  existingImages?: any[];
  onSuccess?: () => void;
}

export function ProductImageManager({
  open,
  onOpenChange,
  productId,
  existingImages = [],
  onSuccess,
}: ProductImageManagerProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [selectedImages, setSelectedImages] = useState<File[]>([]);
  const [removedImageIds, setRemovedImageIds] = useState<number[]>([]);

  const handleImageUpload = async (files: File[]) => {
    setSelectedImages(files);
  };

  const removeNewImage = (index: number) => {
    const newImages = selectedImages.filter((_, i) => i !== index);
    setSelectedImages(newImages);
  };

  const removeExistingImage = (imageId: number) => {
    setRemovedImageIds((prev) => [...prev, imageId]);
  };

  const handleSubmit = async () => {
    setIsLoading(true);
    try {
      // Determine which API to call based on the state
      if (selectedImages.length > 0 && removedImageIds.length > 0) {
        // Update: both adding new images and removing existing ones
        const updateData: ProductImageUpdateRequest = {
          id: productId,
          files: selectedImages,
          removedImageIds,
        };
        await unifiedProductService.updateProductImages(updateData);
        toast.success("Product images updated successfully");
      } else if (selectedImages.length > 0) {
        // Upload: only adding new images
        const uploadData: ProductImageUploadRequest = {
          id: productId,
          files: selectedImages,
        };
        await unifiedProductService.uploadProductImages(uploadData);
        toast.success("Product images uploaded successfully");
      } else if (removedImageIds.length > 0) {
        // Delete: only removing existing images
        const deleteData: ProductImageDeleteRequest = {
          id: productId,
          files: [],
          removedImageIds,
        };
        await unifiedProductService.deleteProductImages(deleteData);
        toast.success("Product images deleted successfully");
      }

      onSuccess?.();
      onOpenChange(false);
      setSelectedImages([]);
      setRemovedImageIds([]);
    } catch (error) {
      toast.error("Failed to manage product images");
      console.error("Error managing product images:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const visibleExistingImages = existingImages.filter(
    (img) => !removedImageIds.includes(img.id)
  );

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Manage Product Images</DialogTitle>
          <DialogDescription>
            Upload new images or remove existing ones for this product.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Upload New Images */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Upload New Images</h3>
            <FileUploader
              onUpload={handleImageUpload}
              accept={{ "image/*": [] }}
              multiple
              maxFiles={5}
            />

            {selectedImages.length > 0 && (
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">
                  New images to upload ({selectedImages.length}):
                </p>
                <div className="grid grid-cols-2 gap-2">
                  {selectedImages.map((file, index) => (
                    <div key={index} className="relative border rounded-lg p-2">
                      <img
                        src={URL.createObjectURL(file)}
                        alt={`Preview ${index + 1}`}
                        className="w-full h-20 object-cover rounded"
                      />
                      <Button
                        type="button"
                        variant="destructive"
                        size="sm"
                        className="absolute -top-2 -right-2 h-6 w-6 rounded-full p-0"
                        onClick={() => removeNewImage(index)}
                      >
                        <X className="h-3 w-3" />
                      </Button>
                      <p className="text-xs text-muted-foreground mt-1 truncate">
                        {file.name}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Existing Images */}
          {visibleExistingImages.length > 0 && (
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Existing Images</h3>
              <div className="grid grid-cols-2 gap-2">
                {visibleExistingImages.map((image) => (
                  <div
                    key={image.id}
                    className="relative border rounded-lg p-2"
                  >
                    <img
                      src={image.url}
                      alt={`Product image ${image.id}`}
                      className="w-full h-20 object-cover rounded"
                    />
                    <Button
                      type="button"
                      variant="destructive"
                      size="sm"
                      className="absolute -top-2 -right-2 h-6 w-6 rounded-full p-0"
                      onClick={() => removeExistingImage(image.id)}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
          >
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={
              isLoading ||
              (selectedImages.length === 0 && removedImageIds.length === 0)
            }
          >
            {isLoading ? "Saving..." : "Save Changes"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
