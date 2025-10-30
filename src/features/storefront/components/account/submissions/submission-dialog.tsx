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
      toast.success("Submission created");
      setOpen(false);
      router.refresh();
    } catch (e) {
      toast.error("Failed to create submission");
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
      toast.success("Photos uploaded");
      router.refresh();
    } catch (e) {
      toast.error("Failed to upload photos");
      throw e;
    } finally {
      setIsUploading(false);
    }
  };

  const title = submission ? "Edit Submission" : "New Submission";
  const description = submission
    ? "Update your submission details and manage photos."
    : "Create a new submission. You can add photos after creating.";

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
              <div className="text-sm font-medium">Upload Photos</div>
              <FileUploader onUpload={onUpload} multiple maxFiles={5} disabled={isUploading} />
            </div>
          ) : null}

          {!submission ? (
            <p className="text-xs text-muted-foreground">
              After creating, reopen this dialog on your submission to upload photos.
            </p>
          ) : null}
        </div>
      </DialogContent>
    </Dialog>
  );
}


