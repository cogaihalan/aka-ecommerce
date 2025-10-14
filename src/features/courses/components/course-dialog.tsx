"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
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
import {
  Course,
  CourseCreateRequest,
  CourseUpdateRequest,
} from "@/types/course";
import { unifiedCourseService } from "@/lib/api/services/unified";

const courseSchema = z.object({
  name: z.string().min(1, "Course name is required"),
  description: z.string().min(1, "Description is required"),
  videoUrl: z.string().url("Please enter a valid video URL"),
  thumbnailUrl: z.string().url("Please enter a valid thumbnail URL").optional(),
  duration: z.number().min(1, "Duration must be at least 1 second").optional(),
  isActive: z.boolean().default(true),
});

type CourseFormValues = z.infer<typeof courseSchema>;

interface CourseDialogProps {
  course?: Course; // Optional - if provided, it's edit mode
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CourseDialog({
  course,
  open,
  onOpenChange,
}: CourseDialogProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [videoFiles, setVideoFiles] = useState<File[]>([]);
  const [thumbnailFiles, setThumbnailFiles] = useState<File[]>([]);
  const [useVideoUpload, setUseVideoUpload] = useState(false);
  const [useThumbnailUpload, setUseThumbnailUpload] = useState(false);
  const router = useRouter();

  const isEditMode = !!course;

  const form = useForm<CourseFormValues>({
    resolver: zodResolver(courseSchema),
    defaultValues: {
      name: "",
      description: "",
      videoUrl: "",
      thumbnailUrl: "",
      duration: undefined,
      isActive: true,
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
        isActive: course.isActive,
      });
    } else {
      // Add mode - reset to default values
      form.reset({
        name: "",
        description: "",
        videoUrl: "",
        thumbnailUrl: "",
        duration: undefined,
        isActive: true,
      });
    }

    // Reset switches when dialog opens
    if (open) {
      setUseVideoUpload(false);
      setUseThumbnailUpload(false);
      setVideoFiles([]);
      setThumbnailFiles([]);
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
            ? videoFiles.length > 0
              ? "uploaded-video-url"
              : course.videoUrl
            : data.videoUrl || course.videoUrl,
          thumbnailUrl: useThumbnailUpload
            ? thumbnailFiles.length > 0
              ? "uploaded-thumbnail-url"
              : course.thumbnailUrl
            : data.thumbnailUrl || course.thumbnailUrl,
        };

        await unifiedCourseService.updateCourse(course.id, updateData);
        toast.success("Course updated successfully");
      } else {
        // Add mode
        const createData: CourseCreateRequest = {
          ...data,
          videoUrl: useVideoUpload
            ? videoFiles.length > 0
              ? "uploaded-video-url"
              : "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4"
            : data.videoUrl ||
              "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
          thumbnailUrl: useThumbnailUpload
            ? thumbnailFiles.length > 0
              ? "uploaded-thumbnail-url"
              : "/assets/placeholder-image.jpeg"
            : data.thumbnailUrl || "/assets/placeholder-image.jpeg",
        };

        await unifiedCourseService.createCourse(createData);
        toast.success("Course created successfully");
      }

      onOpenChange(false);
      form.reset();
      setVideoFiles([]);
      setThumbnailFiles([]);
      setUseVideoUpload(false);
      setUseThumbnailUpload(false);
      router.refresh();
    } catch (error) {
      toast.error(`Failed to ${isEditMode ? "update" : "create"} course`);
      console.error(
        `Error ${isEditMode ? "updating" : "creating"} course:`,
        error
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleVideoUpload = async (files: File[]) => {
    // In a real app, upload to storage service and get URL
    toast.info("Video upload functionality would be implemented here");
    setVideoFiles(files);
  };

  const handleThumbnailUpload = async (files: File[]) => {
    // In a real app, upload to storage service and get URL
    toast.info("Thumbnail upload functionality would be implemented here");
    setThumbnailFiles(files);
  };

  // Clear fields when switching modes
  const handleVideoModeChange = (useUpload: boolean) => {
    setUseVideoUpload(useUpload);
    if (useUpload) {
      form.setValue("videoUrl", "");
    } else {
      setVideoFiles([]);
    }
  };

  const handleThumbnailModeChange = (useUpload: boolean) => {
    setUseThumbnailUpload(useUpload);
    if (useUpload) {
      form.setValue("thumbnailUrl", "");
    } else {
      setThumbnailFiles([]);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] flex flex-col">
        <DialogHeader className="flex-shrink-0">
          <DialogTitle>
            {isEditMode ? "Edit Course" : "Create New Course"}
          </DialogTitle>
          <DialogDescription>
            {isEditMode
              ? "Update the course information and video content."
              : "Add a new course with video content to your platform."}
          </DialogDescription>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto pr-2">
          <Form {...form}>
            <form
              id="course-form"
              onSubmit={form.handleSubmit(onSubmit)}
              className="space-y-4"
            >
              <div className="grid grid-cols-1 gap-3">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Course Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter course name" {...field} />
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
                      <FormLabel>Description</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Enter course description"
                          className="min-h-[80px]"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <FormLabel>Video Source</FormLabel>
                    <div className="flex items-center space-x-2">
                      <span className="text-sm text-muted-foreground">URL</span>
                      <Switch
                        checked={useVideoUpload}
                        onCheckedChange={handleVideoModeChange}
                      />
                      <span className="text-sm text-muted-foreground">
                        Upload
                      </span>
                    </div>
                  </div>

                  {!useVideoUpload ? (
                    <FormField
                      control={form.control}
                      name="videoUrl"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Video URL</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="https://example.com/video.mp4"
                              {...field}
                            />
                          </FormControl>
                          <FormDescription>
                            Enter the URL of the video file
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
                      />
                    </div>
                  )}
                </div>

                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <FormLabel>Thumbnail Source</FormLabel>
                    <div className="flex items-center space-x-2">
                      <span className="text-sm text-muted-foreground">URL</span>
                      <Switch
                        checked={useThumbnailUpload}
                        onCheckedChange={handleThumbnailModeChange}
                      />
                      <span className="text-sm text-muted-foreground">
                        Upload
                      </span>
                    </div>
                  </div>

                  {!useThumbnailUpload ? (
                    <FormField
                      control={form.control}
                      name="thumbnailUrl"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Thumbnail URL</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="https://example.com/thumbnail.jpg"
                              {...field}
                            />
                          </FormControl>
                          <FormDescription>
                            Enter the URL of the thumbnail image
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
                      />
                    </div>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <FormField
                    control={form.control}
                    name="duration"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Duration (seconds)</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            placeholder="3600"
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
                    name="isActive"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3">
                        <div className="space-y-0.5">
                          <FormLabel className="text-sm">Active</FormLabel>
                          <FormDescription className="text-xs">
                            Visible to users
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
            </form>
          </Form>
        </div>

        <DialogFooter className="flex-shrink-0 border-t pt-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isLoading}
          >
            Cancel
          </Button>
          <Button type="submit" disabled={isLoading} form="course-form">
            {isLoading
              ? isEditMode
                ? "Updating..."
                : "Creating..."
              : isEditMode
                ? "Update Course"
                : "Create Course"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
