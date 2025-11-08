"use client";

import CookieConsent from "react-cookie-consent";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useEffect } from "react";

export function CookieConsentBanner() {
  useEffect(() => {
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
  }, []);

  return (
    <CookieConsent
      location="bottom"
      buttonText=""
      declineButtonText=""
      enableDeclineButton
      cookieName="gdpr-consent"
      expires={365}
      disableStyles
      containerClasses="fixed bottom-0 left-0 right-0 z-[99999] bg-white border-t border-border shadow-[0_-4px_6px_-1px_rgb(0_0_0_/0.1),_0_-2px_4px_-2px_rgb(0_0_0_/0.1)] animate-slide-up"
      contentClasses="max-w-7xl mx-auto px-4 py-4 flex flex-col sm:flex-row items-start sm:items-center justify-start gap-4"
      onAccept={() => {
        if (typeof window !== "undefined" && window.gtag) {
          // Update Google Analytics consent to granted
          window.gtag("consent", "update", {
            analytics_storage: "granted",
            ad_storage: "granted",
          });
          console.log("Cookie consent accepted - Analytics enabled");
        }
      }}
      onDecline={() => {
        if (typeof window !== "undefined" && window.gtag) {
          // Update Google Analytics consent to denied
          window.gtag("consent", "update", {
            analytics_storage: "denied",
            ad_storage: "denied",
          });
          console.log("Cookie consent declined - Analytics disabled");
        }
      }}
    >
      <div className="flex-1 order-1 text-left">
        <p className="text-sm text-foreground leading-relaxed">
          Chúng tôi sử dụng cookie để cải thiện trải nghiệm của bạn. Bằng cách
          tiếp tục sử dụng trang web, bạn đồng ý với{" "}
          <Link
            href="/legal/cookies"
            className="text-primary hover:underline font-medium underline-offset-4 transition-colors"
          >
            Chính sách cookie
          </Link>{" "}
          của chúng tôi.
        </p>
      </div>
      <div className="flex gap-2 w-full sm:w-auto order-3 sm:order-none flex-shrink-0">
        <CustomDeclineButton />
        <CustomAcceptButton />
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
    <Button variant="default" size="default" onClick={handleClick}>
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
    <Button variant="outline" size="default" onClick={handleClick}>
      Từ chối
    </Button>
  );
}
