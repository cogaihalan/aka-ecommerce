"use client";

import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";

export default function NotFound() {
  const router = useRouter();

  return (
    <div className="flex flex-col items-center justify-center text-center min-h-[60vh] py-16">
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
