import { Geist } from "next/font/google";
import { cn } from "@/lib/utils";

// Only load essential fonts for better performance
const fontSans = Geist({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap", // Improves loading performance
  preload: true,
});

// Export only the essential font variable
export const fontVariables = cn(fontSans.variable);
