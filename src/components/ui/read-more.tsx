"use client";

import React, { useState, useRef, useEffect } from "react";
import { cn } from "@/lib/utils";
import { ChevronDown, ChevronUp } from "lucide-react";
import { Button } from "./button";

export interface ReadMoreProps {
  /**
   * The text content to display
   */
  text: string;
  /**
   * Maximum number of characters to show before truncating
   * @default 150
   */
  maxLength?: number;
  /**
   * Custom className for the container
   */
  className?: string;
  /**
   * Custom className for the text content
   */
  textClassName?: string;
  /**
   * Custom className for the button
   */
  buttonClassName?: string;
  /**
   * Text to display on the "Read more" button
   * @default "Read more"
   */
  readMoreText?: string;
  /**
   * Text to display on the "Read less" button
   * @default "Read less"
   */
  readLessText?: string;
  /**
   * Show icon on the button
   * @default true
   */
  showIcon?: boolean;
  /**
   * Show truncation on the text
   * @default true
   */
  showTruncation?: boolean;
  /**
   * Button variant
   * @default "ghost"
   */
  buttonVariant?:
    | "default"
    | "destructive"
    | "outline"
    | "secondary"
    | "ghost"
    | "link";
  /**
   * Button size
   * @default "sm"
   */
  buttonSize?: "default" | "sm" | "lg" | "icon";
}

export function ReadMore({
  text,
  maxLength = 150,
  className,
  textClassName,
  buttonClassName,
  readMoreText = "Read more",
  readLessText = "Read less",
  showIcon = true,
  showTruncation = true,
  buttonVariant = "ghost",
  buttonSize = "sm",
}: ReadMoreProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [contentHeight, setContentHeight] = useState<number | "auto">("auto");
  const contentRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLParagraphElement>(null);

  // If text is shorter than maxLength, don't show the component
  if (text.length <= maxLength) {
    return <p className={cn("text-sm", textClassName, className)}>{text}</p>;
  }

  const truncatedText = text.slice(0, maxLength);
  const needsTruncation = text.length > maxLength;
  const displayText = isExpanded ? text : truncatedText;

  // Update height when expanded state changes
  useEffect(() => {
    if (textRef.current) {
      // Use requestAnimationFrame to ensure DOM is updated before measuring
      requestAnimationFrame(() => {
        if (textRef.current) {
          const newHeight = textRef.current.scrollHeight;
          setContentHeight(newHeight);
        }
      });
    }
  }, [isExpanded]);

  // Set initial height on mount
  useEffect(() => {
    if (textRef.current && contentHeight === "auto") {
      setContentHeight(textRef.current.scrollHeight);
    }
  }, [contentHeight]);

  const handleToggle = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <div className={cn("space-y-2", className)}>
      <div
        ref={contentRef}
        className="overflow-hidden transition-[height] duration-500 ease-in-out"
        style={{
          height: typeof contentHeight === "number" ? `${contentHeight}px` : "auto",
        }}
      >
        <p
          ref={textRef}
          className={cn(
            "text-sm transition-opacity duration-300 ease-in-out",
            textClassName
          )}
        >
          {displayText}
          {!isExpanded && showTruncation && (
            <span className="text-muted-foreground">...</span>
          )}
        </p>
      </div>
      {needsTruncation && (
        <Button
          variant={buttonVariant}
          size={buttonSize}
          onClick={handleToggle}
          className={cn("h-auto p-0 text-xs", buttonClassName)}
          aria-expanded={isExpanded}
          aria-label={isExpanded ? readLessText : readMoreText}
        >
          {isExpanded ? readLessText : readMoreText}
          {showIcon && (
            <span
              className={cn(
                "inline-block transition-transform duration-300 ease-in-out ml-1",
                isExpanded && "rotate-180"
              )}
            >
              <ChevronDown className="size-3" />
            </span>
          )}
        </Button>
      )}
    </div>
  );
}
