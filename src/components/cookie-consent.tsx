"use client";

import CookieConsent from "react-cookie-consent";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { Cookie, Shield } from "lucide-react";

export function CookieConsentBanner() {
  const [isReady, setIsReady] = useState(false);

  // Defer rendering until browser is idle to avoid blocking TBT
  useEffect(() => {
    let idleCallbackId: number | undefined;
    let timeoutId: NodeJS.Timeout | undefined;

    if ('requestIdleCallback' in window) {
      idleCallbackId = (window as any).requestIdleCallback(
        () => setIsReady(true),
        { timeout: 2500 }
      );
    } else {
      // Fallback: wait for page to be interactive
      timeoutId = setTimeout(() => setIsReady(true), 1500);
    }

    return () => {
      if (idleCallbackId !== undefined && 'cancelIdleCallback' in window) {
        (window as any).cancelIdleCallback(idleCallbackId);
      }
      if (timeoutId !== undefined) {
        clearTimeout(timeoutId);
      }
    };
  }, []);

  useEffect(() => {
    if (!isReady) return;

    // Hide default buttons and replace with custom UI buttons
    const hideDefaultButtons = () => {
      const confirmButton = document.getElementById("rcc-confirm-button");
      const declineButton = document.getElementById("rcc-decline-button");

      if (confirmButton) {
        confirmButton.style.display = "none";
      }
      if (declineButton) {
        declineButton.style.display = "none";
      }
    };

    const timer = setTimeout(hideDefaultButtons, 50);
    return () => clearTimeout(timer);
  }, [isReady]);

  // Don't render until page is interactive
  if (!isReady) return null;

  return (
    <CookieConsent
      location="bottom"
      buttonText=""
      declineButtonText=""
      enableDeclineButton
      cookieName="gdpr-consent"
      expires={365}
      disableStyles
      containerClasses="fixed bottom-4 left-4 right-4 md:left-auto md:right-6 md:bottom-6 md:max-w-md z-[99999] animate-in slide-in-from-bottom-5 fade-in duration-500"
      contentClasses=""
      onAccept={() => {
        if (typeof window !== "undefined" && window.gtag) {
          window.gtag("consent", "update", {
            analytics_storage: "granted",
            ad_storage: "granted",
          });
          console.log("Cookie consent accepted - Analytics enabled");
        }
      }}
      onDecline={() => {
        if (typeof window !== "undefined" && window.gtag) {
          window.gtag("consent", "update", {
            analytics_storage: "denied",
            ad_storage: "denied",
          });
          console.log("Cookie consent declined - Analytics disabled");
        }
      }}
    >
      <div className="rounded-xl border border-border bg-background/95 backdrop-blur-md shadow-lg dark:bg-card/95 dark:shadow-2xl dark:shadow-black/20">
        {/* Header */}
        <div className="flex items-center gap-3 border-b border-border/50 px-5 py-4">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 dark:bg-primary/20">
            <Cookie className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h3 className="font-semibold text-foreground">Cookie Settings</h3>
            <p className="text-xs text-muted-foreground">Manage your preferences</p>
          </div>
        </div>

        {/* Content */}
        <div className="px-5 py-4">
          <p className="text-sm leading-relaxed text-muted-foreground">
            Chúng tôi sử dụng cookie để cải thiện trải nghiệm của bạn. Bằng cách
            tiếp tục sử dụng trang web, bạn đồng ý với{" "}
            <Link
              href="/"
              className="font-medium text-primary underline-offset-4 transition-colors hover:underline"
            >
              Chính sách cookie
            </Link>{" "}
            của chúng tôi.
          </p>

          {/* Privacy note */}
          <div className="mt-3 flex items-center gap-2 rounded-lg bg-muted/50 px-3 py-2 dark:bg-muted/30">
            <Shield className="h-4 w-4 text-muted-foreground" />
            <span className="text-xs text-muted-foreground">
              Dữ liệu của bạn được bảo vệ an toàn
            </span>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-3 border-t border-border/50 px-5 py-4">
          <CustomDeclineButton />
          <CustomAcceptButton />
        </div>
      </div>
    </CookieConsent>
  );
}

function CustomAcceptButton() {
  const handleClick = () => {
    const acceptBtn = document.getElementById("rcc-confirm-button");
    if (acceptBtn) {
      acceptBtn.click();
    }
  };

  return (
    <Button 
      variant="default" 
      size="default" 
      onClick={handleClick}
      className="flex-1 shadow-sm"
    >
      Chấp nhận
    </Button>
  );
}

function CustomDeclineButton() {
  const handleClick = () => {
    const declineBtn = document.getElementById("rcc-decline-button");
    if (declineBtn) {
      declineBtn.click();
    }
  };

  return (
    <Button 
      variant="outline" 
      size="default" 
      onClick={handleClick}
      className="flex-1"
    >
      Từ chối
    </Button>
  );
}
