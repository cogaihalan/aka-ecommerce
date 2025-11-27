"use client";

import { useEffect, useRef } from "react";

const SNOWFLAKE_ICON = "❄";

interface Snowflake {
  x: number;
  y: number;
  size: number;
  speed: number;
  opacity: number;
  swing: number;
  swingSpeed: number;
}

export const SnowflakeEffect = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const snowflakesRef = useRef<Snowflake[]>([]);
  const animationRef = useRef<number>(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    const createSnowflake = (): Snowflake => ({
      x: Math.random() * canvas.width,
      y: Math.random() * -canvas.height,
      size: Math.random() * 16 + 10,
      speed: Math.random() * 1.5 + 0.5,
      opacity: 1,
      swing: Math.random() * Math.PI * 2,
      swingSpeed: Math.random() * 0.02 + 0.01,
    });

    const initSnowflakes = () => {
      const count = Math.floor((canvas.width * canvas.height) / 25000);
      snowflakesRef.current = Array.from({ length: count }, createSnowflake);
      // Start some snowflakes already visible
      snowflakesRef.current.forEach((flake) => {
        flake.y = Math.random() * canvas.height;
      });
    };

    const drawSnowflake = (flake: Snowflake) => {
      ctx.save();
      ctx.globalAlpha = flake.opacity;
      ctx.font = `${flake.size}px sans-serif`;
      ctx.fillStyle = "white";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(SNOWFLAKE_ICON, flake.x, flake.y);
      ctx.restore();
    };

    const updateSnowflake = (flake: Snowflake) => {
      flake.y += flake.speed;
      flake.swing += flake.swingSpeed;
      flake.x += Math.sin(flake.swing) * 0.5;

      // Reset snowflake when it falls below canvas
      if (flake.y > canvas.height + flake.size) {
        flake.y = -flake.size;
        flake.x = Math.random() * canvas.width;
      }

      // Wrap horizontally
      if (flake.x > canvas.width + flake.size) {
        flake.x = -flake.size;
      } else if (flake.x < -flake.size) {
        flake.x = canvas.width + flake.size;
      }
    };

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      snowflakesRef.current.forEach((flake) => {
        updateSnowflake(flake);
        drawSnowflake(flake);
      });

      animationRef.current = requestAnimationFrame(animate);
    };

    resizeCanvas();
    initSnowflakes();
    animate();

    window.addEventListener("resize", () => {
      resizeCanvas();
      initSnowflakes();
    });

    return () => {
      cancelAnimationFrame(animationRef.current);
      window.removeEventListener("resize", resizeCanvas);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="pointer-events-none fixed left-0 top-0 z-50 h-full w-full"
    />
  );
};
