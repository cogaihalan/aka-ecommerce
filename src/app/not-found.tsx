"use client";

import { usePathname, useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export default function NotFound() {
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
        Something&apos;s missing
      </h2>
      <p>
        Sorry, the page you are looking for doesn&apos;t exist or has been
        moved.
      </p>
      <div className="mt-8 flex justify-center gap-2">
        <Button onClick={() => router.back()} variant="default" size="lg">
          Go back
        </Button>
        <Button onClick={() => router.push("/")} variant="ghost" size="lg">
          Back to Home
        </Button>
      </div>
    </div>
  );
}
