"use client";

import { useState, useEffect } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { toast } from "sonner";
import { useI18n } from "@/components/providers/i18n-provider";

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
import {
  CreateContestRequest,
  UpdateContestRequest,
} from "@/lib/api/types";
import { unifiedContestService } from "@/lib/api/services/unified";
import type { Contest } from "@/types";

const contestSchema = z.object({
  name: z.string().min(1, "Contest name is required"),
  description: z.string().min(1, "Description is required"),
  startDate: z.string().min(1, "Start date is required"),
  endDate: z.string().min(1, "End date is required"),
  thumbnailUrl: z.string().optional(),
  active: z.boolean().default(true),
}).refine((data) => {
  const startDate = new Date(data.startDate);
  const endDate = new Date(data.endDate);
  return endDate > startDate;
}, {
  message: "End date must be after start date",
  path: ["endDate"],
});

type ContestFormValues = z.infer<typeof contestSchema>;

interface ContestDialogProps {
  contest?: Contest; // Optional - if provided, it's edit mode
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
  const { t } = useI18n();
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

  // Reset form when contest changes or dialog opens
  useEffect(() => {
    if (contest) {
      // Edit mode - populate with existing contest data
      form.reset({
        name: contest.name,
        description: contest.description,
        startDate: contest.startDate.split('T')[0], // Convert to YYYY-MM-DD format
        endDate: contest.endDate.split('T')[0], // Convert to YYYY-MM-DD format
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
          endDate
        };

        await unifiedContestService.updateContest(contest.id, updateData);
        toast.success(t("contests.dialog.toast.updated"));
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
        toast.success(t("contests.dialog.toast.created"));
        onSuccess?.();
        onOpenChange(false);
        form.reset();
      }
    } catch (error) {
      toast.error(t("contests.dialog.toast.failed", { action: isEditMode ? "update" : "create" }));
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
      
      const uploadedContest = await unifiedContestService.uploadContestThumbnail({
        id: contest.id,
        file: file,
      });

      // Update the form field with the uploaded thumbnail URL
      form.setValue("thumbnailUrl", uploadedContest.thumbnailUrl || "");
      setUploadedThumbnailUrl(uploadedContest.thumbnailUrl || "");
      setThumbnailFiles(files);
      toast.success(t("contests.dialog.thumbnailUploaded"));
    } catch (error) {
      toast.error(t("contests.dialog.toast.uploadThumbFailed"));
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
            {isEditMode ? t("contests.dialog.titleEdit") : t("contests.dialog.titleCreate")}
          </DialogTitle>
          <DialogDescription>
            {isEditMode
              ? t("contests.dialog.descEdit")
              : t("contests.dialog.descCreate")}
          </DialogDescription>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto pr-2">
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="space-y-4"
            >
              <div className="grid grid-cols-1 gap-3">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t("contests.dialog.name")}</FormLabel>
                      <FormControl>
                        <Input placeholder={t("contests.dialog.namePlaceholder")} {...field} />
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
                      <FormLabel>{t("contests.dialog.description")}</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder={t("contests.dialog.descriptionPlaceholder")}
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
                        <FormLabel>{t("contests.dialog.startDate")}</FormLabel>
                        <FormControl>
                          <Input
                            type="date"
                            {...field}
                          />
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
                        <FormLabel>{t("contests.dialog.endDate")}</FormLabel>
                        <FormControl>
                          <Input
                            type="date"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                {isEditMode && (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <FormLabel>{t("contests.dialog.thumbnailSource")}</FormLabel>
                      <div className="flex items-center space-x-2">
                        <span className="text-sm text-muted-foreground">{t("contests.dialog.url")}</span>
                        <Switch
                          checked={useThumbnailUpload}
                          onCheckedChange={handleThumbnailModeChange}
                        />
                        <span className="text-sm text-muted-foreground">
                          {t("contests.dialog.upload")}
                        </span>
                      </div>
                    </div>

                    {!useThumbnailUpload ? (
                      <FormField
                        control={form.control}
                        name="thumbnailUrl"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>{t("contests.dialog.thumbnailUrl")}</FormLabel>
                            <FormControl>
                              <Input
                                placeholder={t("contests.dialog.thumbnailUrlPlaceholder")}
                                {...field}
                              />
                            </FormControl>
                            <FormDescription>
                              {t("contests.dialog.thumbnailUrlHelp")}
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    ) : (
                      <div className="space-y-2">
                        <FormLabel>Thumbnail Upload</FormLabel>
                        <FileUploader
                          value={thumbnailFiles}
                          onValueChange={setThumbnailFiles}
                          onUpload={handleThumbnailUpload}
                          accept={{ "image/*": [] }}
                          maxSize={1024 * 1024 * 5} // 5MB
                          maxFiles={1}
                          disabled={isUploadingThumbnail}
                        />
                        {isUploadingThumbnail && (
                          <div className="text-sm text-muted-foreground">
                            {t("contests.dialog.thumbnailUploading")}
                          </div>
                        )}
                        {uploadedThumbnailUrl && (
                          <div className="text-sm text-green-600">
                            {t("contests.dialog.thumbnailUploaded")}
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
                        <FormLabel className="text-sm">{t("contests.dialog.activeLabel")}</FormLabel>
                        <FormDescription className="text-xs">
                          {t("contests.dialog.activeHelp")}
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
                  {t("contests.dialog.cancel")}
                </Button>
                <Button type="submit" disabled={isLoading}>
                  {isLoading
                    ? (isEditMode ? t("contests.dialog.updating") : t("contests.dialog.creating"))
                    : (isEditMode ? t("contests.dialog.update") : t("contests.dialog.create"))}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </div>
      </DialogContent>
    </Dialog>
  );
}
