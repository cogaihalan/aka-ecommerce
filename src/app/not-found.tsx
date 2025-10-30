"use client";

import { usePathname, useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useI18n } from "@/components/providers/i18n-provider";

export default function NotFound() {
  const { t } = useI18n();
  const router = useRouter();
  const pathname = usePathname();
  const isAdmin = pathname.includes("/admin");

  return (  
    <div className={cn("flex flex-col items-center justify-center text-center py-16",
     isAdmin ? "min-h-screen" : "min-h-[60vh] ")}>
      <span className="from-foreground bg-linear-to-b to-transparent bg-clip-text text-[10rem] leading-none font-extrabold text-transparent">
        404
      </span>
      <h2 className="font-heading my-2 text-2xl font-bold">
        {t("errors.notFound.title")}
      </h2>
      <p>
        {t("errors.notFound.message")}
      </p>
      <div className="mt-8 flex justify-center gap-2">
        <Button onClick={() => router.back()} variant="default" size="lg">
          {t("errors.notFound.goBack")}
        </Button>
        <Button onClick={() => router.push("/")} variant="ghost" size="lg">
          {t("errors.notFound.backToHome")}
        </Button>
      </div>
    </div>
  );
}
