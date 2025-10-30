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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  CreateHairstyleRequest,
  UpdateHairstyleRequest,
} from "@/lib/api/types";
import { unifiedHairstyleService } from "@/lib/api/services/unified/extensions/hairstyles";
import type { Hairstyle } from "@/types";

const hairstyleSchema = z.object({
  name: z.string().min(1, "Hairstyle name is required"),
  barberName: z.string().min(1, "Barber name is required"),
  gender: z.enum(["MALE", "FEMALE"], {
    required_error: "Please select a gender",
  }),
});

type HairstyleFormValues = z.infer<typeof hairstyleSchema>;

interface HairstyleDialogProps {
  hairstyle?: Hairstyle;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
}

export function HairstyleDialog({
  hairstyle,
  open,
  onOpenChange,
  onSuccess,
}: HairstyleDialogProps) {
  const [isLoading, setIsLoading] = useState(false);

  const isEditMode = !!hairstyle;

  const form = useForm<HairstyleFormValues>({
    resolver: zodResolver(hairstyleSchema),
    defaultValues: {
      name: "",
      barberName: "",
      gender: "MALE",
    },
  });

  // Reset form when hairstyle changes or dialog opens
  useEffect(() => {
    if (open) {
      if (isEditMode && hairstyle) {
        form.reset({
          name: hairstyle.name,
          barberName: hairstyle.barberName,
          gender: hairstyle.gender,
        });
      } else {
        form.reset({
          name: "",
          barberName: "",
          gender: "MALE",
        });
      }
    }
  }, [open, isEditMode, hairstyle, form]);

  const onSubmit = async (values: HairstyleFormValues) => {
    setIsLoading(true);
    try {
      if (isEditMode && hairstyle) {
        const updateData: UpdateHairstyleRequest = {
          name: values.name,
          barberName: values.barberName,
          gender: values.gender,
        };

        await unifiedHairstyleService.updateHairstyle(hairstyle.id, updateData);
        toast.success("Hairstyle updated successfully");
      } else {
        const createData: CreateHairstyleRequest = {
          name: values.name,
          barberName: values.barberName,
          gender: values.gender,
        };

        const newHairstyle =
          await unifiedHairstyleService.createHairstyles(createData);

        toast.success("Hairstyle created successfully");
      }

      onSuccess?.();
      onOpenChange(false);
    } catch (error) {
      console.error("Error saving hairstyle:", error);
      toast.error("Failed to save hairstyle");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {isEditMode ? "Edit Hairstyle" : "Add New Hairstyle"}
          </DialogTitle>
          <DialogDescription>
            {isEditMode
              ? "Update the hairstyle information and media."
              : "Create a new hairstyle with details and media."}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Hairstyle Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter hairstyle name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="barberName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Barber Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter barber name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="gender"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Gender</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select gender" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="MALE">Male</SelectItem>
                      <SelectItem value="FEMALE">Female</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
                disabled={isLoading}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading
                  ? "Saving..."
                  : isEditMode
                    ? "Update Hairstyle"
                    : "Create Hairstyle"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
