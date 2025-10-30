import { Inter } from "next/font/google";
import { cn } from "@/lib/utils";

// Inter for all text
const fontSans = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
  preload: true,
});

// Export font CSS variable to apply on <body>
export const fontVariables = cn(fontSans.variable);
