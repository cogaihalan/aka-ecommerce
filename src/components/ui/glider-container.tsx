"use client";

import React, { forwardRef, ReactNode, useRef } from "react";
import Glider from "react-glider";
import { cn } from "@/lib/utils";

export interface GliderSettings {
  hasArrows?: boolean;
  hasDots?: boolean;
  slidesToShow?: number;
  slidesToScroll?: number;
  scrollLock?: boolean;
  duration?: number;
  draggable?: boolean;
  dragVelocity?: number;
  scrollLockDelay?: number;
  rewind?: boolean;
  autoPlay?: boolean;
  autoPlayDelay?: number;
  pauseOnHover?: boolean;
  pauseOnFocus?: boolean;
  responsive?: Array<{
    breakpoint: number;
    settings: Partial<GliderSettings>;
  }>;
  onSlideVisible?: (event: any) => void;
  onSlideHidden?: (event: any) => void;
  onAdd?: (event: any) => void;
  onRemove?: (event: any) => void;
  onRefresh?: (event: any) => void;
  onLoad?: (event: any) => void;
  onDestroy?: (event: any) => void;
  onAnimated?: (event: any) => void;
  onJumped?: (event: any) => void;
}

export interface GliderContainerProps {
  children: ReactNode;
  settings?: GliderSettings;
  className?: string;
  slideClassName?: string;
}

const GliderContainer = forwardRef<any, GliderContainerProps>(
  ({ 
    children, 
    settings = {}, 
    className, 
    slideClassName,
  }, ref) => {
    const gliderRef = useRef<any>(null);

    const defaultSettings: GliderSettings = {
      hasArrows: false, // Disable default arrows
      hasDots: false,   // Disable default dots
      slidesToShow: 3,
      slidesToScroll: 1,
      scrollLock: true,
      duration: 0.5,
      draggable: true,
      dragVelocity: 1.5,
      scrollLockDelay: 100,
      rewind: false,
      autoPlay: false,
      autoPlayDelay: 4000,
      pauseOnHover: true,
      pauseOnFocus: true,
      responsive: [
        {
          breakpoint: 1024,
          settings: {
            slidesToScroll: 1,
          },
        },
        {
          breakpoint: 768,
          settings: {
            slidesToScroll: 1,
          },
        },
        {
          breakpoint: 480,
          settings: {
            slidesToScroll: 1,
          },
        },
      ],
    };

    const mergedSettings = { ...defaultSettings, ...settings };

    return (
      <div className="relative">
        <Glider
          ref={(glider) => {
            gliderRef.current = glider;
            if (ref) {
              if (typeof ref === 'function') {
                ref(glider);
              } else {
                ref.current = glider;
              }
            }
          }}
          {...mergedSettings}
          className={cn("glider-container", className)}
        >
          {React.Children.map(children, (child, index) => (
            <div key={index} className={cn("glider-slide", slideClassName)}>
              {child}
            </div>
          ))}
        </Glider>
      </div>
    );
  }
);

GliderContainer.displayName = "GliderContainer";

export { GliderContainer };
