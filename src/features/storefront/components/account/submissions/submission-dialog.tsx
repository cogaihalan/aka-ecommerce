"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { FileUploader } from "@/components/file-uploader";
import type { Submission } from "@/types";
import type {
  CreateSubmissionRequest,
  SubmissionMediaUploadRequest,
} from "@/lib/api/types";
import { storefrontSubmissionService } from "@/lib/api/services/storefront/extensions/submissions/submissions-client";
import { SubmissionForm, type SubmissionFormValues } from "./submission-form";

interface SubmissionDialogProps {
  submission?: Submission;
  children: React.ReactNode; // trigger
}

export function SubmissionDialog({ submission, children }: SubmissionDialogProps) {
  const [open, setOpen] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const router = useRouter();

  const onCreate = async (data: SubmissionFormValues) => {
    try {
      const payload: CreateSubmissionRequest = {
        name: data.name,
        description: data.description,
        contestId: 5,
        barberName: data.barberName,
        barberAddress: data.barberAddress,
      };
      await storefrontSubmissionService.createSubmission(payload);
      toast.success("Tạo bài dự thi thành công");
      setOpen(false);
      router.refresh();
    } catch (e) {
      toast.error("Lỗi khi tạo bài dự thi");
      throw e;
    }
  };

  const onUpload = async (files: File[]) => {
    if (!submission) return;
    setIsUploading(true);
    try {
      const payload: SubmissionMediaUploadRequest = {
        submissionId: submission.id,
        files,
      };
      await storefrontSubmissionService.uploadSubmissionMedia(payload);
      toast.success("Tải ảnh thành công");
      router.refresh();
    } catch (e) {
      toast.error("Lỗi khi tải ảnh");
      throw e;
    } finally {
      setIsUploading(false);
    }
  };

  const title = submission ? "Sửa bài dự thi" : "Thêm bài dự thi";
  const description = submission
    ? "Cập nhật chi tiết bài dự thi và quản lý ảnh."
    : "Tạo mới bài dự thi. Bạn có thể thêm ảnh sau khi tạo.";

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          <SubmissionForm
            submission={submission}
            onSubmit={onCreate}
            onCancel={() => setOpen(false)}
            isLoading={false}
          />

          {submission ? (
            <div className="space-y-2 pt-2">
              <div className="text-sm font-medium">Tải ảnh</div>
              <FileUploader onUpload={onUpload} multiple maxFiles={5} disabled={isUploading} />
            </div>
          ) : null}

          {!submission ? (
            <p className="text-xs text-muted-foreground">
              Sau khi tạo, hãy vào chi tiết bài dự thi để tải ảnh.
            </p>
          ) : null}
        </div>
      </DialogContent>
    </Dialog>
  );
}


