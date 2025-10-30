import Link from "next/link";
import Image from "next/image";
import { cn } from "@/lib/utils";

interface LogoProps {
  size?: "sm" | "md" | "lg";
  className?: string;
  href?: string;
}

export default function Logo({
  size = "md",
  className,
  href = "/",
}: LogoProps) {
  const sizeClasses = {
    sm: "h-8 w-16",
    md: "h-10 w-20",
    lg: "h-8 w-16 md:h-12 md:w-24",
  };

  const iconSize = sizeClasses[size];

  const logoContent = (
    <div className={cn("flex items-center", className)}>
      {/* Logo Image */}
      <div className={cn("relative", iconSize)}>
        <Image
          src="/assets/logo.png"
          alt="AKA Store Logo"
          fill
          className={cn("object-contain")}
          priority
        />
      </div>
    </div>
  );

  if (href) {
    return (
      <Link href={href} className="hover:opacity-80 transition-opacity">
        {logoContent}
      </Link>
    );
  }

  return logoContent;
}
