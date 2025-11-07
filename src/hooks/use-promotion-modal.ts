"use client";

import { useEffect, useState } from "react";
import { getCookie, setCookie } from "@/lib/utils/cookies";

const PROMOTION_DISMISSED_COOKIE = "promotion_modal_dismissed";
const COOKIE_EXPIRY_DAYS = 3;

interface UsePromotionModalProps {
  startDate?: Date | string;
  endDate?: Date | string;
  onDismiss?: () => void;
}

export function usePromotionModal({
  startDate,
  endDate,
  onDismiss,
}: UsePromotionModalProps) {
  const [shouldShow, setShouldShow] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (!isMounted) {
      setShouldShow(false);
      return;
    }

    // Check if user has dismissed the modal
    const dismissedCookie = getCookie(PROMOTION_DISMISSED_COOKIE);
    if (dismissedCookie === "true") {
      setShouldShow(false);
      return;
    }

    // Check if promotion dates are provided
    if (!startDate || !endDate) {
      setShouldShow(false);
      return;
    }

    // Parse dates
    const start = typeof startDate === "string" ? new Date(startDate) : startDate;
    const end = typeof endDate === "string" ? new Date(endDate) : endDate;
    const now = new Date();

    // Check if current date is within promotion period
    const isActive = now >= start && now <= end;

    setShouldShow(isActive);
  }, [isMounted, startDate, endDate]);

  const handleDismiss = () => {
    setCookie(PROMOTION_DISMISSED_COOKIE, "true", COOKIE_EXPIRY_DAYS);
    setShouldShow(false);
    onDismiss?.();
  };

  return {
    shouldShow,
    handleDismiss,
    isMounted,
  };
}

