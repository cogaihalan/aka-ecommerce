"use client";

import { useState, useEffect } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { FileUploader } from "@/components/file-uploader";
import { CreateContestRequest, UpdateContestRequest } from "@/lib/api/types";
import { unifiedContestService } from "@/lib/api/services/unified";
import type { Contest } from "@/types";

const contestSchema = z
  .object({
    name: z.string().min(1, "Tên cuộc thi là bắt buộc"),
    description: z.string().min(1, "Mô tả là bắt buộc"),
    startDate: z.string().min(1, "Ngày bắt đầu là bắt buộc"),
    endDate: z.string().min(1, "Ngày kết thúc là bắt buộc"),
    thumbnailUrl: z.string().optional(),
    active: z.boolean().default(true),
  })
  .refine(
    (data) => {
      const startDate = new Date(data.startDate);
      const endDate = new Date(data.endDate);
      return endDate > startDate;
    },
    {
      message: "Ngày kết thúc phải sau ngày bắt đầu",
      path: ["endDate"],
    }
  );

type ContestFormValues = z.infer<typeof contestSchema>;

interface ContestDialogProps {
  contest?: Contest;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
}

export function ContestDialog({
  contest,
  open,
  onOpenChange,
  onSuccess,
}: ContestDialogProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [thumbnailFiles, setThumbnailFiles] = useState<File[]>([]);
  const [useThumbnailUpload, setUseThumbnailUpload] = useState(false);
  const [isUploadingThumbnail, setIsUploadingThumbnail] = useState(false);
  const [uploadedThumbnailUrl, setUploadedThumbnailUrl] = useState<string>("");

  const isEditMode = !!contest;

  const form = useForm<ContestFormValues>({
    resolver: zodResolver(contestSchema),
    defaultValues: {
      name: "",
      description: "",
      startDate: "",
      endDate: "",
      thumbnailUrl: "",
      active: true,
    },
  });

  useEffect(() => {
    if (contest) {
      form.reset({
        name: contest.name,
        description: contest.description,
        startDate: contest.startDate.split("T")[0], // Convert to YYYY-MM-DD format
        endDate: contest.endDate.split("T")[0], // Convert to YYYY-MM-DD format
        thumbnailUrl: contest.thumbnailUrl || "",
        active: contest.active,
      });
    } else {
      // Add mode - reset to default values
      form.reset({
        name: "",
        description: "",
        startDate: "",
        endDate: "",
        thumbnailUrl: "",
        active: true,
      });
    }

    // Reset switches when dialog opens
    if (open) {
      setUseThumbnailUpload(false);
      setThumbnailFiles([]);
      setUploadedThumbnailUrl("");
      setIsUploadingThumbnail(false);
    }
  }, [contest, form, open]);

  const onSubmit = async (data: ContestFormValues) => {
    try {
      setIsLoading(true);

      // Convert dates to ISO format
      const startDate = new Date(data.startDate).toISOString();
      const endDate = new Date(data.endDate).toISOString();

      if (isEditMode && contest) {
        // Edit mode
        const updateData: UpdateContestRequest = {
          ...data,
          startDate,
          endDate,
        };

        await unifiedContestService.updateContest(contest.id, updateData);
        toast.success("Cập nhật cuộc thi thành công");
      } else {
        // Add mode
        const createData: CreateContestRequest = {
          name: data.name,
          description: data.description,
          startDate,
          endDate,
          active: data.active ?? true,
        };

        await unifiedContestService.createContest(createData);
        toast.success("Tạo cuộc thi thành công");
        onSuccess?.();
        onOpenChange(false);
        form.reset();
      }
    } catch (error) {
      toast.error(`Không thể ${isEditMode ? "cập nhật" : "tạo"} cuộc thi`);
      console.error(
        `Error ${isEditMode ? "updating" : "creating"} contest:`,
        error
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleThumbnailUpload = async (files: File[]) => {
    if (!contest || files.length === 0) return;

    try {
      setIsUploadingThumbnail(true);
      const file = files[0];

      const uploadedContest =
        await unifiedContestService.uploadContestThumbnail({
          id: contest.id,
          file: file,
        });

      // Update the form field with the uploaded thumbnail URL
      form.setValue("thumbnailUrl", uploadedContest.thumbnailUrl || "");
      setUploadedThumbnailUrl(uploadedContest.thumbnailUrl || "");
      setThumbnailFiles(files);
      toast.success("Tải ảnh bìa thành công");
    } catch (error) {
      toast.error("Tải ảnh bìa thất bại");
      console.error("Thumbnail upload error:", error);
    } finally {
      setUseThumbnailUpload(false);
      setIsUploadingThumbnail(false);
    }
  };

  const handleThumbnailModeChange = (useUpload: boolean) => {
    setUseThumbnailUpload(useUpload);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] flex flex-col">
        <DialogHeader className="flex-shrink-0">
          <DialogTitle>
            {isEditMode ? "Chỉnh sửa cuộc thi" : "Tạo cuộc thi mới"}
          </DialogTitle>
          <DialogDescription>
            {isEditMode
              ? "Cập nhật thông tin và chi tiết cuộc thi."
              : "Thêm một cuộc thi mới vào nền tảng của bạn."}
          </DialogDescription>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto pr-2">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <div className="grid grid-cols-1 gap-3">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Tên cuộc thi</FormLabel>
                      <FormControl>
                        <Input placeholder="Nhập tên cuộc thi" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Mô tả</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Nhập mô tả cuộc thi"
                          className="min-h-[80px]"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-2 gap-3">
                  <FormField
                    control={form.control}
                    name="startDate"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Ngày bắt đầu</FormLabel>
                        <FormControl>
                          <Input type="date" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="endDate"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Ngày kết thúc</FormLabel>
                        <FormControl>
                          <Input type="date" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                {isEditMode && (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <FormLabel>Nguồn ảnh bìa</FormLabel>
                      <div className="flex items-center space-x-2">
                        <span className="text-sm text-muted-foreground">
                          URL
                        </span>
                        <Switch
                          checked={useThumbnailUpload}
                          onCheckedChange={handleThumbnailModeChange}
                        />
                        <span className="text-sm text-muted-foreground">
                          Tải lên
                        </span>
                      </div>
                    </div>

                    {!useThumbnailUpload ? (
                      <FormField
                        control={form.control}
                        name="thumbnailUrl"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Đường dẫn ảnh bìa</FormLabel>
                            <FormControl>
                              <Input
                                placeholder="https://example.com/thumbnail.jpg"
                                {...field}
                              />
                            </FormControl>
                            <FormDescription>
                              Nhập đường dẫn ảnh bìa
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    ) : (
                      <div className="space-y-2">
                        <FormLabel>Tải lên ảnh bìa</FormLabel>
                        <FileUploader
                          value={thumbnailFiles}
                          onValueChange={setThumbnailFiles}
                          onUpload={handleThumbnailUpload}
                          accept={{ "image/*": [] }}
                          maxSize={1024 * 1024 * 5}
                          maxFiles={1}
                          disabled={isUploadingThumbnail}
                        />
                        {isUploadingThumbnail && (
                          <div className="text-sm text-muted-foreground">
                            Đang tải ảnh bìa...
                          </div>
                        )}
                        {uploadedThumbnailUrl && (
                          <div className="text-sm text-green-600">
                            Tải ảnh bìa thành công
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                )}

                <FormField
                  control={form.control}
                  name="active"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3">
                      <div className="space-y-0.5">
                        <FormLabel className="text-sm">Kích hoạt</FormLabel>
                        <FormDescription className="text-xs">
                          Hiển thị với người dùng
                        </FormDescription>
                      </div>
                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>
              <DialogFooter className="flex-shrink-0 border-t pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => onOpenChange(false)}
                  disabled={isLoading}
                >
                  Hủy
                </Button>
                <Button type="submit" disabled={isLoading}>
                  {isLoading
                    ? isEditMode
                      ? "Đang cập nhật..."
                      : "Đang tạo..."
                    : isEditMode
                      ? "Cập nhật cuộc thi"
                      : "Tạo cuộc thi"}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </div>
      </DialogContent>
    </Dialog>
  );
}
