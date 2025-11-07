import { useState, useCallback } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { usePromotionModal } from "@/hooks/use-promotion-modal";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import Image from "next/image";

const contactFormSchema = z.object({
  name: z.string().min(1, "Tên là bắt buộc"),
  email: z.string().email("Email không hợp lệ").min(1, "Email là bắt buộc"),
  phone: z.string().min(1, "Số điện thoại là bắt buộc"),
  message: z.string().optional(),
});

export type ContactFormValues = z.infer<typeof contactFormSchema>;

interface PromotionModalProps {
  // Manual control props (when autoShow is false or not provided)
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  
  // Auto-show props
  autoShow?: boolean;
  
  // Common props
  title?: string;
  description?: string;
  promotionImage?: string;
  promotionImageAlt?: string;
  startDate?: Date | string;
  endDate?: Date | string;
  onSubmit?: (data: ContactFormValues) => Promise<void> | void;
  onDismiss?: () => void;
}

export function PromotionModal({
  open: openProp,
  onOpenChange: onOpenChangeProp,
  autoShow = false,
  title = "Khuyến mãi đặc biệt",
  description = "Điền thông tin để nhận ưu đãi độc quyền",
  promotionImage = "/assets/placeholder-banner.png",
  promotionImageAlt = "Promotion",
  startDate,
  endDate,
  onSubmit,
  onDismiss,
}: PromotionModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  // Use hook for auto-show functionality
  const { shouldShow, handleDismiss, isMounted } = usePromotionModal({
    startDate: autoShow ? startDate : undefined,
    endDate: autoShow ? endDate : undefined,
    onDismiss,
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

  // Determine if modal should be open
  const isOpen = autoShow ? shouldShow : (openProp ?? false);
  
  // Determine change handler
  const handleOpenChange = useCallback((newOpen: boolean) => {
    if (autoShow) {
      if (!newOpen) {
        handleDismiss();
      }
    } else {
      onOpenChangeProp?.(newOpen);
    }
  }, [autoShow, onOpenChangeProp, handleDismiss]);

  const handleFormSubmit = async (data: ContactFormValues) => {
    try {
      setIsSubmitting(true);
      if (onSubmit) {
        await onSubmit(data);
      }
      setIsSubmitted(true);
      reset();
      // Auto close after 2 seconds on success
      setTimeout(() => {
        setIsSubmitted(false);
        handleClose();
      }, 2000);
    } catch (error) {
      console.error("Error submitting form:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = useCallback(() => {
    if (!isSubmitting) {
      handleDismiss();
      setIsSubmitted(false);
      reset();
      handleOpenChange(false);
    }
  }, [isSubmitting, reset, handleOpenChange, handleDismiss]);

  if (autoShow && !isMounted) {
    return null;
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-[90%] md:max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>
            {description}
          </DialogDescription>
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
                <div className="space-y-2">
                  <Label htmlFor="name">Tên *</Label>
                  <Input
                    id="name"
                    placeholder="Nhập tên của bạn"
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
                  {isSubmitting ? "Đang gửi..." : "Gửi thông tin"}
                </Button>
              </form>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

