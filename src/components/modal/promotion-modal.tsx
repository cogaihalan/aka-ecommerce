"use client";

import { useCallback, useEffect } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  usePromotionModal,
  PromotionFormData,
} from "@/hooks/use-promotion-modal";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Icons } from "@/components/icons";
import { cn } from "@/lib/utils";
import Image from "next/image";

const contactFormSchema = z.object({
  name: z.string().min(1, "Tên là bắt buộc"),
  email: z.string().email("Email không hợp lệ").min(1, "Email là bắt buộc"),
  phone: z.string().min(1, "Số điện thoại là bắt buộc"),
  message: z.string().optional(),
});

type ContactFormValues = z.infer<typeof contactFormSchema>;

interface PromotionModalProps {
  title?: string;
  description?: string;
  promotionImage?: string;
  promotionImageAlt?: string;
  startDate?: Date | string;
  endDate?: Date | string;
}

export function PromotionModal({
  title = "Khuyến mãi đặc biệt",
  description = "Điền thông tin để nhận ưu đãi độc quyền",
  promotionImage = "/assets/placeholder-banner.png",
  promotionImageAlt = "Promotion",
  startDate,
  endDate,
}: PromotionModalProps) {
  // Use hook for promotion modal state and submit logic
  const {
    isOpen,
    isPromotionActive,
    isMounted,
    isSubmitting,
    isSubmitted,
    submitError,
    closeModal,
    toggleModal,
    submitPromotion,
    resetSubmitState,
  } = usePromotionModal({
    startDate,
    endDate,
    promotionTitle: title,
    promotionDescription: description,
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<ContactFormValues>({
    resolver: zodResolver(contactFormSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      message: "",
    },
  });

  const handleFormSubmit = useCallback(
    async (data: ContactFormValues) => {
      const formData: PromotionFormData = {
        name: data.name,
        email: data.email,
        phone: data.phone,
        message: data.message,
      };

      const result = await submitPromotion(formData);
      if (result.success) {
        reset();
      }
    },
    [submitPromotion, reset]
  );

  const handleClose = useCallback(() => {
    if (!isSubmitting) {
      reset();
      closeModal();
    }
  }, [isSubmitting, reset, closeModal]);

  // Reset form when modal is opened
  useEffect(() => {
    if (isOpen) {
      resetSubmitState();
    }
  }, [isOpen, resetSubmitState]);

  // Enhance overlay animation for smooth effect
  useEffect(() => {
    if (isOpen) {
      const overlay = document.querySelector('[data-slot="dialog-overlay"]');
      if (overlay) {
        overlay.classList.add("duration-500", "ease-out");
      }
    }
  }, [isOpen]);

  // Don't render anything if not mounted or promotion is not active
  if (!isMounted || !isPromotionActive) {
    return null;
  }

  return (
    <>
      {/* Floating Promotion Trigger Button */}
      <Button
        onClick={toggleModal}
        size="icon"
        className={cn(
          "fixed bottom-20 right-6 z-50 h-12 w-12 rounded-full shadow-lg hover:shadow-xl transition-all duration-300",
          "bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600",
        )}
        aria-label="Mở khuyến mãi"
      >
        <Icons.gift className="h-5 w-5 text-white" />
      </Button>

      {/* Promotion Modal */}
      <Dialog open={isOpen} onOpenChange={handleClose}>
        <DialogContent className="max-w-[90%] md:max-w-4xl max-h-[80vh] overflow-y-auto !duration-500 ease-out">
          <DialogHeader>
            <DialogTitle>{title}</DialogTitle>
            <DialogDescription>{description}</DialogDescription>
          </DialogHeader>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
            {/* Promotion Image */}
            <div className="relative w-full h-full min-h-[250px] rounded-lg overflow-hidden">
              <Image
                src={promotionImage}
                alt={promotionImageAlt}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
            </div>

            {/* Contact Form */}
            <div className="flex flex-col justify-center">
              {isSubmitted ? (
                <div className="text-center py-8">
                  <div className="text-green-600 text-5xl mb-4">✓</div>
                  <h3 className="text-xl font-semibold mb-2">
                    Cảm ơn bạn đã liên hệ!
                  </h3>
                  <p className="text-muted-foreground">
                    Chúng tôi sẽ liên hệ với bạn sớm nhất có thể.
                  </p>
                </div>
              ) : (
                <form
                  onSubmit={handleSubmit(handleFormSubmit)}
                  className="space-y-4"
                >
                  {submitError && (
                    <div className="p-3 text-sm text-red-600 bg-red-50 border border-red-200 rounded-md">
                      {submitError}
                    </div>
                  )}

                  <div className="space-y-2">
                    <Label htmlFor="name">Tên *</Label>
                    <Input
                      id="name"
                      placeholder="Nhập tên của bạn"
                      disabled={isSubmitting}
                      {...register("name")}
                    />
                    {errors.name && (
                      <p className="text-sm text-destructive">
                        {errors.name.message}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email">Email *</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="Nhập email của bạn"
                      disabled={isSubmitting}
                      {...register("email")}
                    />
                    {errors.email && (
                      <p className="text-sm text-destructive">
                        {errors.email.message}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="phone">Số điện thoại *</Label>
                    <Input
                      id="phone"
                      type="tel"
                      placeholder="Nhập số điện thoại của bạn"
                      disabled={isSubmitting}
                      {...register("phone")}
                    />
                    {errors.phone && (
                      <p className="text-sm text-destructive">
                        {errors.phone.message}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="message">Tin nhắn (tùy chọn)</Label>
                    <Textarea
                      id="message"
                      placeholder="Nhập tin nhắn của bạn"
                      rows={4}
                      disabled={isSubmitting}
                      {...register("message")}
                    />
                    {errors.message && (
                      <p className="text-sm text-destructive">
                        {errors.message.message}
                      </p>
                    )}
                  </div>

                  <Button
                    type="submit"
                    className="w-full"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <>
                        <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
                        Đang gửi...
                      </>
                    ) : (
                      "Gửi thông tin"
                    )}
                  </Button>
                </form>
              )}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
