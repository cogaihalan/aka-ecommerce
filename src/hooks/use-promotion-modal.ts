"use client";

import { useCallback, useEffect, useState } from "react";

export interface PromotionFormData {
  name: string;
  email: string;
  phone: string;
  message?: string;
}

interface UsePromotionModalProps {
  startDate?: Date | string;
  endDate?: Date | string;
  promotionTitle?: string;
  promotionDescription?: string;
}

interface SubmitResult {
  success: boolean;
  error?: string;
}

export function usePromotionModal({
  startDate,
  endDate,
  promotionTitle = "Khuyến mãi đặc biệt",
  promotionDescription = "Cảm ơn bạn đã quan tâm đến chương trình khuyến mãi của chúng tôi!",
}: UsePromotionModalProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const [isPromotionActive, setIsPromotionActive] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (!isMounted) {
      setIsPromotionActive(false);
      return;
    }

    // Check if promotion dates are provided
    if (!startDate || !endDate) {
      setIsPromotionActive(false);
      return;
    }

    // Parse dates
    const start =
      typeof startDate === "string" ? new Date(startDate) : startDate;
    const end = typeof endDate === "string" ? new Date(endDate) : endDate;
    const now = new Date();

    // Check if current date is within promotion period
    const isActive = now >= start && now <= end;
    setIsPromotionActive(isActive);
  }, [isMounted, startDate, endDate]);

  const openModal = useCallback(() => {
    setIsOpen(true);
    setSubmitError(null);
  }, []);

  const closeModal = useCallback(() => {
    setIsOpen(false);
    // Reset submitted state after closing
    setTimeout(() => {
      setIsSubmitted(false);
      setSubmitError(null);
    }, 300);
  }, []);

  const toggleModal = useCallback(() => {
    setIsOpen((prev) => {
      if (prev) {
        // Closing modal - reset states
        setTimeout(() => {
          setIsSubmitted(false);
          setSubmitError(null);
        }, 300);
      } else {
        setSubmitError(null);
      }
      return !prev;
    });
  }, []);

  const submitPromotion = useCallback(
    async (data: PromotionFormData): Promise<SubmitResult> => {
      setIsSubmitting(true);
      setSubmitError(null);

      try {
        const response = await fetch("/api/email/promotion", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            customerName: data.name,
            customerEmail: data.email,
            promotionTitle,
            promotionDescription: data.message
              ? `${promotionDescription}\n\nTin nhắn từ khách hàng:\n${data.message}\n\nSố điện thoại: ${data.phone}`
              : `${promotionDescription}\n\nSố điện thoại liên hệ: ${data.phone}`,
            ctaLink: typeof window !== "undefined" ? window.location.origin : "",
            ctaText: "Khám phá ngay",
          }),
        });

        const result = await response.json();

        if (!response.ok || !result.success) {
          throw new Error(result.error || "Gửi thông tin thất bại");
        }

        setIsSubmitted(true);

        // Auto close modal after success
        setTimeout(() => {
          closeModal();
        }, 2000);

        return { success: true };
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : "Đã có lỗi xảy ra";
        setSubmitError(errorMessage);
        return { success: false, error: errorMessage };
      } finally {
        setIsSubmitting(false);
      }
    },
    [promotionTitle, promotionDescription, closeModal]
  );

  const resetSubmitState = useCallback(() => {
    setIsSubmitted(false);
    setSubmitError(null);
  }, []);

  return {
    // Modal state
    isOpen,
    isPromotionActive,
    isMounted,
    // Submit state
    isSubmitting,
    isSubmitted,
    submitError,
    // Actions
    openModal,
    closeModal,
    toggleModal,
    submitPromotion,
    resetSubmitState,
  };
}
