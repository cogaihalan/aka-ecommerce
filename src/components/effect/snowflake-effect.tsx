"use client";

import { useEffect, useRef, useCallback } from "react";

interface Snowflake {
  x: number;
  y: number;
  radius: number;
  speed: number;
  opacity: number;
  swing: number;
  swingSpeed: number;
}

// Detect if device is mobile/low-power
const isMobile = typeof window !== "undefined" && 
  (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ||
   window.innerWidth < 768);

// Reduced count for mobile, reasonable for desktop
const getSnowflakeCount = (width: number, height: number): number => {
  const baseCount = Math.floor((width * height) / 50000);
  const maxCount = isMobile ? 30 : 60;
  return Math.min(baseCount, maxCount);
};

export const SnowflakeEffect = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const snowflakesRef = useRef<Snowflake[]>([]);
  const animationRef = useRef<number>(0);
  const lastTimeRef = useRef<number>(0);
  const isVisibleRef = useRef<boolean>(true);

  const createSnowflake = useCallback((canvasWidth: number, canvasHeight: number, startVisible = false): Snowflake => ({
    x: Math.random() * canvasWidth,
    y: startVisible ? Math.random() * canvasHeight : Math.random() * -canvasHeight,
    radius: Math.random() * 2.5 + 1.5, // Smaller circles instead of emoji
    speed: Math.random() * 0.8 + 0.3,
    opacity: Math.random() * 0.5 + 0.5,
    swing: Math.random() * Math.PI * 2,
    swingSpeed: Math.random() * 0.015 + 0.005,
  }), []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return;

    // Handle device pixel ratio for crisp rendering
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    
    const resizeCanvas = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;
      
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.scale(dpr, dpr);
    };

    const initSnowflakes = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;
      const count = getSnowflakeCount(width, height);
      snowflakesRef.current = Array.from({ length: count }, () => 
        createSnowflake(width, height, true)
      );
    };

    const updateSnowflake = (flake: Snowflake, deltaTime: number, width: number, height: number) => {
      // Use deltaTime for consistent speed across different frame rates
      const timeScale = deltaTime / 16.67; // Normalize to ~60fps
      
      flake.y += flake.speed * timeScale;
      flake.swing += flake.swingSpeed * timeScale;
      flake.x += Math.sin(flake.swing) * 0.3 * timeScale;

      // Reset snowflake when it falls below canvas
      if (flake.y > height + flake.radius * 2) {
        flake.y = -flake.radius * 2;
        flake.x = Math.random() * width;
      }

      // Wrap horizontally
      if (flake.x > width + flake.radius) {
        flake.x = -flake.radius;
      } else if (flake.x < -flake.radius) {
        flake.x = width + flake.radius;
      }
    };

    const animate = (currentTime: number) => {
      if (!isVisibleRef.current) {
        animationRef.current = requestAnimationFrame(animate);
        return;
      }

      const deltaTime = lastTimeRef.current ? currentTime - lastTimeRef.current : 16.67;
      lastTimeRef.current = currentTime;

      // Skip frames if too much time passed (tab was inactive)
      if (deltaTime > 100) {
        animationRef.current = requestAnimationFrame(animate);
        return;
      }

      const width = window.innerWidth;
      const height = window.innerHeight;

      ctx.clearRect(0, 0, width, height);

      // Batch similar operations - set fill style once
      ctx.fillStyle = "rgba(255, 255, 255, 1)";

      // Draw all snowflakes efficiently
      snowflakesRef.current.forEach((flake) => {
        updateSnowflake(flake, deltaTime, width, height);
        
        ctx.globalAlpha = flake.opacity;
        ctx.beginPath();
        ctx.arc(flake.x, flake.y, flake.radius, 0, Math.PI * 2);
        ctx.fill();
      });

      // Reset alpha
      ctx.globalAlpha = 1;

      animationRef.current = requestAnimationFrame(animate);
    };

    // Visibility change handler - pause when tab is hidden
    const handleVisibilityChange = () => {
      isVisibleRef.current = !document.hidden;
      if (!document.hidden) {
        lastTimeRef.current = 0; // Reset time tracking when becoming visible
      }
    };

    // Debounced resize handler
    let resizeTimeout: NodeJS.Timeout;
    const handleResize = () => {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(() => {
        resizeCanvas();
        initSnowflakes();
      }, 150);
    };

    resizeCanvas();
    initSnowflakes();
    animationRef.current = requestAnimationFrame(animate);

    window.addEventListener("resize", handleResize, { passive: true });
    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      cancelAnimationFrame(animationRef.current);
      clearTimeout(resizeTimeout);
      window.removeEventListener("resize", handleResize);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [createSnowflake]);

  return (
    <canvas
      ref={canvasRef}
      className="pointer-events-none fixed left-0 top-0 z-50 h-full w-full"
      style={{ willChange: "transform" }}
      aria-hidden="true"
    />
  );
};
