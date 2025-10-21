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
import { Checkbox } from "@/components/ui/checkbox";
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
  const [primaryImageId, setPrimaryImageId] = useState<number | null>(
    existingImages.find((img) => img.primary)?.id || null
  );

  const handleImageUpload = async (files: File[]) => {
    setSelectedImages((prev) => [...prev, ...files]);
  };

  const removeNewImage = (index: number) => {
    const newImages = selectedImages.filter((_, i) => i !== index);
    setSelectedImages(newImages);
  };

  const removeExistingImage = (imageId: number) => {
    setRemovedImageIds((prev) => [...prev, imageId]);
    // If removing the primary image, clear the primary selection
    if (primaryImageId === imageId) {
      setPrimaryImageId(null);
    }
  };

  const handlePrimaryImageChange = (imageId: number, checked: boolean) => {
    if (checked) {
      setPrimaryImageId(imageId);
    } else {
      setPrimaryImageId(null);
    }
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
          primaryImageId,
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
      } else if (
        primaryImageId !== null &&
        primaryImageId !==
          (existingImages.find((img) => img.primary)?.id || null)
      ) {
        // Update: only changing primary image
        const updateData: ProductImageUpdateRequest = {
          id: productId,
          files: [],
          removedImageIds: [],
          primaryImageId,
        };
        await unifiedProductService.updateProductImages(updateData);
        toast.success("Primary image updated successfully");
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

  const handleClose = () => {
    setSelectedImages([]);
    setRemovedImageIds([]);
    if (!primaryImageId) {
      setPrimaryImageId(
        existingImages.find((img) => img.primary)?.id ||
          existingImages[0]?.id ||
          null
      );
    }
    onOpenChange(false);
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
                <div className="flex flex-wrap gap-4">
                  {selectedImages.map((file, index) => (
                    <div
                      key={index}
                      className="relative border rounded-lg p-2 w-40"
                    >
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
              <div className="flex flex-wrap gap-4">
                {visibleExistingImages.map((image) => (
                  <div
                    key={image.id}
                    className="relative border rounded-lg p-3 w-40"
                  >
                    <img
                      src={image.url}
                      alt={`Product image ${image.id}`}
                      className="w-full aspect-square object-cover rounded"
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
                    <div className="mt-3 flex items-center space-x-2">
                      <Checkbox
                        id={`primary-${image.id}`}
                        checked={primaryImageId === image.id}
                        onCheckedChange={(checked) =>
                          handlePrimaryImageChange(image.id, checked as boolean)
                        }
                      />
                      <label
                        htmlFor={`primary-${image.id}`}
                        className="text-xs text-foreground cursor-pointer"
                      >
                        Primary
                      </label>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <DialogFooter>
          <Button type="button" variant="outline" onClick={handleClose}>
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={
              isLoading ||
              (selectedImages.length === 0 &&
                removedImageIds.length === 0 &&
                primaryImageId ===
                  (existingImages.find((img) => img.primary)?.id || null))
            }
          >
            {isLoading ? "Saving..." : "Save Changes"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
