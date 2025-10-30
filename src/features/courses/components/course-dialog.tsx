"use client";

import { useState, useEffect, useCallback } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { toast } from "sonner";
import { useI18n } from "@/components/providers/i18n-provider";
import { useVideoDuration } from "@/hooks/use-video-duration";

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
  CourseCreateRequest,
  CourseUpdateRequest,
} from "@/lib/api/types";
import { unifiedCourseService } from "@/lib/api/services/unified";
import type { Course } from "@/types";

const courseSchema = z.object({
  name: z.string().min(1, "Course name is required"),
  description: z.string().min(1, "Description is required"),
  videoUrl: z.string().optional(),
  thumbnailUrl: z.string().optional(),
  duration: z.number().min(1, "Duration must be at least 1 second").optional(),
  active: z.boolean().default(true),
});

type CourseFormValues = z.infer<typeof courseSchema>;

interface CourseDialogProps {
  course?: Course; // Optional - if provided, it's edit mode
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
}

export function CourseDialog({
  course,
  open,
  onOpenChange,
  onSuccess,
}: CourseDialogProps) {
  const [isLoading, setIsLoading] = useState(false);
  const { t } = useI18n();
  const [videoFiles, setVideoFiles] = useState<File[]>([]);
  const [thumbnailFiles, setThumbnailFiles] = useState<File[]>([]);
  const [useVideoUpload, setUseVideoUpload] = useState(false);
  const [useThumbnailUpload, setUseThumbnailUpload] = useState(false);
  const [isUploadingVideo, setIsUploadingVideo] = useState(false);
  const [isUploadingThumbnail, setIsUploadingThumbnail] = useState(false);
  const [uploadedVideoUrl, setUploadedVideoUrl] = useState<string>("");
  const [uploadedThumbnailUrl, setUploadedThumbnailUrl] = useState<string>("");

  const { getVideoDuration, isLoading: isDetectingDuration, error: durationError } = useVideoDuration();

  const isEditMode = !!course;

  const form = useForm<CourseFormValues>({
    resolver: zodResolver(courseSchema),
    defaultValues: {
      name: "",
      description: "",
      videoUrl: "",
      thumbnailUrl: "",
      duration: undefined,
      active: true,
    },
  });

  // Reset form when course changes or dialog opens
  useEffect(() => {
    if (course) {
      // Edit mode - populate with existing course data
      form.reset({
        name: course.name,
        description: course.description,
        videoUrl: course.videoUrl,
        thumbnailUrl: course.thumbnailUrl || "",
        duration: course.duration,
        active: course.active,
      });
    } else {
      // Add mode - reset to default values
      form.reset({
        name: "",
        description: "",
        videoUrl: "",
        thumbnailUrl: "",
        duration: undefined,
        active: true,
      });
    }

    // Reset switches when dialog opens
    if (open) {
      setUseVideoUpload(false);
      setUseThumbnailUpload(false);
      setVideoFiles([]);
      setThumbnailFiles([]);
      setUploadedVideoUrl("");
      setUploadedThumbnailUrl("");
      setIsUploadingVideo(false);
      setIsUploadingThumbnail(false);
    }
  }, [course, form, open]);

  const onSubmit = async (data: CourseFormValues) => {
    try {
      setIsLoading(true);

      if (isEditMode && course) {
        // Edit mode
        const updateData: CourseUpdateRequest = {
          ...data,
          videoUrl: useVideoUpload
            ? uploadedVideoUrl || course.videoUrl
            : data.videoUrl || course.videoUrl,
          thumbnailUrl: useThumbnailUpload
            ? uploadedThumbnailUrl || course.thumbnailUrl
            : data.thumbnailUrl || course.thumbnailUrl,
        };

        await unifiedCourseService.updateCourse(course.id, updateData);
        toast.success(t("courses.dialog.toast.updated"));
      } else {
        // Add mode - only include fields that are in CourseCreateRequest interface
        const createData: CourseCreateRequest = {
          name: data.name,
          description: data.description,
          duration: data.duration,
          active: data.active ?? true,
        };
        
        await unifiedCourseService.createCourse(createData);
        toast.success(t("courses.dialog.toast.created"));
        onSuccess?.();
        onOpenChange(false);
        form.reset();
      }
    } catch (error) {
      toast.error(t("courses.dialog.toast.failed", { action: isEditMode ? "update" : "create" }));
      console.error(
        `Error ${isEditMode ? "updating" : "creating"} course:`,
        error
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleVideoUpload = async (files: File[]) => {
    if (!course || files.length === 0) return;
    
    try {
      setIsUploadingVideo(true);
      const file = files[0];
      
      // Detect video duration before uploading
      const duration = await getVideoDuration(file);
      if (duration) {
        form.setValue("duration", duration);
      } else if (durationError) {
        toast.warning(t("courses.dialog.toast.detectDurationWarn"));
      }
      
      const uploadedCourse = await unifiedCourseService.uploadCourseVideo({
        id: course.id,
        file: file,
      });
      
      form.setValue("videoUrl", uploadedCourse.videoUrl || "");
      setUploadedVideoUrl(uploadedCourse.videoUrl || "");
      setVideoFiles(files);
      toast.success(t("courses.dialog.videoUploaded"));
    } catch (error) {
      toast.error(t("courses.dialog.toast.uploadVideoFailed"));
      console.error("Video upload error:", error);
    } finally {
      setUseVideoUpload(false);
      setIsUploadingVideo(false);
    }
  };

  const handleThumbnailUpload = async (files: File[]) => {
    if (!course || files.length === 0) return;
    
    try {
      setIsUploadingThumbnail(true);
      const file = files[0];
      
      const uploadedCourse = await unifiedCourseService.uploadCourseThumbnail({
        id: course.id,
        file: file,
      });

      // Update the form field with the uploaded thumbnail URL
      form.setValue("thumbnailUrl", uploadedCourse.thumbnailUrl || "");
      setUploadedThumbnailUrl(uploadedCourse.thumbnailUrl || "");
      setThumbnailFiles(files);
      toast.success(t("courses.dialog.thumbnailUploaded"));
    } catch (error) {
      toast.error(t("courses.dialog.toast.uploadThumbFailed"));
      console.error("Thumbnail upload error:", error);
    } finally {
      setUseThumbnailUpload(false);
      setIsUploadingThumbnail(false);
    }
  };

  // Clear fields when switching modes
  const handleVideoModeChange = (useUpload: boolean) => {
    setUseVideoUpload(useUpload);
  };

  const handleThumbnailModeChange = (useUpload: boolean) => {
    setUseThumbnailUpload(useUpload);
  };

  // Function to detect duration from video URL
  const detectDurationFromUrl = async (videoUrl: string) => {
    if (!videoUrl) return null;
    
    try {
      const video = document.createElement('video');
      video.crossOrigin = 'anonymous';
      
      return new Promise<number | null>((resolve) => {
        const handleLoadedMetadata = () => {
          const duration = Math.round(video.duration);
          resolve(duration);
        };

        const handleError = () => {
          resolve(null);
        };

        // Set a timeout to prevent hanging
        const timeout = setTimeout(() => {
          resolve(null);
        }, 10000); // 10 second timeout

        video.addEventListener('loadedmetadata', () => {
          clearTimeout(timeout);
          handleLoadedMetadata();
        });
        video.addEventListener('error', () => {
          clearTimeout(timeout);
          handleError();
        });
        
        video.src = videoUrl;
        video.load();
      });
    } catch (error) {
      console.error('Error detecting duration from URL:', error);
      return null;
    }
  };

  // Auto-detect duration when video URL changes (debounced)
  const handleVideoUrlChange = useCallback(
    async (url: string) => {
      form.setValue("videoUrl", url);
      
      if (url && !useVideoUpload) {
        const duration = await detectDurationFromUrl(url);
        if (duration) {
          form.setValue("duration", duration);
          const min = Math.floor(duration / 60);
          const sec = (duration % 60).toString().padStart(2, '0');
          toast.success(t("courses.dialog.toast.detectedDuration", { min, sec }));
        }
      }
    },
    [form, useVideoUpload]
  );

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] flex flex-col">
        <DialogHeader className="flex-shrink-0">
          <DialogTitle>
            {isEditMode ? t("courses.dialog.titleEdit") : t("courses.dialog.titleCreate")}
          </DialogTitle>
          <DialogDescription>
            {isEditMode
              ? t("courses.dialog.descEdit")
              : t("courses.dialog.descCreate")}
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
                      <FormLabel>{t("courses.dialog.name")}</FormLabel>
                      <FormControl>
                        <Input placeholder={t("courses.dialog.namePlaceholder")} {...field} />
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
                      <FormLabel>{t("courses.dialog.description")}</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder={t("courses.dialog.descriptionPlaceholder")}
                          className="min-h-[80px]"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {isEditMode && (
                <>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <FormLabel>{t("courses.dialog.videoSource")}</FormLabel>
                      <div className="flex items-center space-x-2">
                        <span className="text-sm text-muted-foreground">{t("courses.dialog.url")}</span>
                        <Switch
                          checked={useVideoUpload}
                          onCheckedChange={handleVideoModeChange}
                        />
                        <span className="text-sm text-muted-foreground">
                          {t("courses.dialog.upload")}
                        </span>
                      </div>
                    </div>

                    {!useVideoUpload ? (
                      <FormField
                        control={form.control}
                        name="videoUrl"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>{t("courses.dialog.videoUrl")}</FormLabel>
                            <FormControl>
                              <Input
                                placeholder={t("courses.dialog.videoUrlPlaceholder")}
                                {...field}
                                onChange={(e) => handleVideoUrlChange(e.target.value)}
                              />
                            </FormControl>
                            <FormDescription>
                              {t("courses.dialog.videoUrlHelp")}
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    ) : (
                      <div className="space-y-2">
                        <FormLabel>Video Upload</FormLabel>
                        <FileUploader
                          value={videoFiles}
                          onValueChange={setVideoFiles}
                          onUpload={handleVideoUpload}
                          accept={{ "video/*": [] }}
                          maxSize={1024 * 1024 * 100} // 100MB
                          maxFiles={1}
                          disabled={isUploadingVideo}
                        />
                        {(isUploadingVideo || isDetectingDuration) && (
                          <div className="text-sm text-muted-foreground">
                            {isDetectingDuration ? t("courses.dialog.videoDetecting") : t("courses.dialog.videoUploading")}
                          </div>
                        )}
                        {uploadedVideoUrl && (
                          <div className="text-sm text-green-600">
                            {t("courses.dialog.videoUploaded")}
                          </div>
                        )}
                        {durationError && (
                          <div className="text-sm text-yellow-600">
                            {durationError}
                          </div>
                        )}
                      </div>
                    )}
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <FormLabel>{t("courses.dialog.thumbnailSource")}</FormLabel>
                      <div className="flex items-center space-x-2">
                        <span className="text-sm text-muted-foreground">{t("courses.dialog.url")}</span>
                        <Switch
                          checked={useThumbnailUpload}
                          onCheckedChange={handleThumbnailModeChange}
                        />
                        <span className="text-sm text-muted-foreground">
                          {t("courses.dialog.upload")}
                        </span>
                      </div>
                    </div>

                    {!useThumbnailUpload ? (
                      <FormField
                        control={form.control}
                        name="thumbnailUrl"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>{t("courses.dialog.thumbnailUrl")}</FormLabel>
                            <FormControl>
                              <Input
                                placeholder={t("courses.dialog.thumbnailUrlPlaceholder")}
                                {...field}
                              />
                            </FormControl>
                            <FormDescription>
                              {t("courses.dialog.thumbnailUrlHelp")}
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
                            {t("courses.dialog.thumbnailUploading")}
                          </div>
                        )}
                        {uploadedThumbnailUrl && (
                          <div className="text-sm text-green-600">
                            {t("courses.dialog.thumbnailUploaded")}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </>
                )}

                <div className="grid grid-cols-2 gap-3">
                  <FormField
                    control={form.control}
                    name="duration"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t("courses.dialog.duration")}</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            placeholder={t("courses.dialog.durationPlaceholder")}
                            {...field}
                            onChange={(e) =>
                              field.onChange(
                                parseInt(e.target.value) || undefined
                              )
                            }
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="active"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3">
                        <div className="space-y-0.5">
                          <FormLabel className="text-sm">{t("courses.dialog.activeLabel")}</FormLabel>
                          <FormDescription className="text-xs">
                            {t("courses.dialog.activeHelp")}
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
              </div>
              <DialogFooter className="flex-shrink-0 border-t pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => onOpenChange(false)}
                  disabled={isLoading}
                >
                  {t("courses.dialog.cancel")}
                </Button>
                <Button type="submit" disabled={isLoading}>
                  {isLoading
                    ? (isEditMode ? t("courses.dialog.updating") : t("courses.dialog.creating"))
                    : (isEditMode ? t("courses.dialog.update") : t("courses.dialog.create"))}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </div>
      </DialogContent>
    </Dialog>
  );
}
