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
import { Trash2, X } from "lucide-react";
import { toast } from "sonner";
import {
  HairStyleMediaUploadRequest,
  HairStyleMediaDeleteRequest,
} from "@/lib/api/types";
import { unifiedHairstyleService } from "@/lib/api/services/unified/extensions/hairstyles";
import { HairstylePhoto } from "@/types/extensions/hairstyles";
import Image from "next/image";

interface HairstyleImageManagerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  hairstyleId: number;
  existingImages?: HairstylePhoto[];
  onSuccess?: () => void;
}

export function HairstyleImageManager({
  open,
  onOpenChange,
  hairstyleId,
  existingImages = [],
  onSuccess,
}: HairstyleImageManagerProps) {
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
      // Upload new images if any
      if (selectedImages.length > 0) {
        const uploadData: HairStyleMediaUploadRequest = {
          id: hairstyleId,
          files: selectedImages,
        };
        await unifiedHairstyleService.uploadHairstyleMedia(uploadData);
        toast.success("Hairstyle images uploaded successfully");
      }

      // Delete removed images if any
      if (removedImageIds.length > 0) {
        const deleteData: HairStyleMediaDeleteRequest = {
          id: hairstyleId,
          photoIds: removedImageIds,
        };
        await unifiedHairstyleService.deleteHairstyleMedia(deleteData);
        toast.success("Hairstyle images deleted successfully");
      }

      onSuccess?.();
      onOpenChange(false);
      setSelectedImages([]);
      setRemovedImageIds([]);
    } catch (error) {
      console.error("Error managing hairstyle images:", error);
      toast.error("Failed to manage hairstyle images");
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    setSelectedImages([]);
    setRemovedImageIds([]);
    setPrimaryImageId(existingImages.find((img) => img.primary)?.id || null);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Quản lý ảnh kiểu tóc</DialogTitle>
          <DialogDescription>
            Tải lên ảnh mới, xóa ảnh hiện có và đặt ảnh chính.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Existing Images */}
          {existingImages.length > 0 && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Ảnh hiện có</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
                {existingImages
                  .filter((img) => !removedImageIds.includes(img.id))
                  .map((image) => (
                    <div key={image.id} className="relative group">
                      <div className="aspect-square relative overflow-hidden rounded-lg border">
                        <Image
                          src={image.url}
                          alt={`Hairstyle image ${image.id}`}
                          fill
                          className="object-cover"
                        />
                        {image.primary && (
                          <div className="absolute top-2 left-2">
                            <span className="bg-primary text-primary-foreground text-xs px-2 py-1 rounded">
                              Ảnh chính
                            </span>
                          </div>
                        )}
                      </div>

                      <div className="mt-2 space-y-2">
                        <div className="flex items-center space-x-2">
                          <Checkbox
                            id={`primary-${image.id}`}
                            checked={primaryImageId === image.id}
                            onCheckedChange={(checked) =>
                              handlePrimaryImageChange(
                                image.id,
                                checked as boolean
                              )
                            }
                          />
                          <label
                            htmlFor={`primary-${image.id}`}
                            className="text-sm font-medium"
                          >
                            Đặt làm ảnh chính
                          </label>
                        </div>

                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => removeExistingImage(image.id)}
                          className="absolute top-2 right-2 h-6 w-6 p-0"
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          )}

          {/* Upload New Images */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Tải lên ảnh mới</h3>
            <FileUploader
              onUpload={handleImageUpload}
              accept={{ "image/*": [] }}
              multiple
              maxFiles={5}
            />

            {selectedImages.length > 0 && (
              <div className="space-y-2">
                <h4 className="font-medium">Ảnh đã chọn:</h4>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                  {selectedImages.map((file, index) => (
                    <div key={index} className="relative group">
                      <div className="aspect-square relative overflow-hidden rounded-lg border">
                        <Image
                          src={URL.createObjectURL(file)}
                          alt={`New image ${index + 1}`}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => removeNewImage(index)}
                        className="absolute top-2 right-2 h-6 w-6 p-0"
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            onClick={handleClose}
            disabled={isLoading}
          >
            Hủy
          </Button>
          <Button
            type="button"
            onClick={handleSubmit}
            disabled={
              isLoading ||
              (selectedImages.length === 0 && removedImageIds.length === 0)
            }
          >
            {isLoading ? "Đang lưu..." : "Lưu thay đổi"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
