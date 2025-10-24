"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Minus, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface QuantitySelectorProps {
  value: number;
  onChange: (quantity: number) => void;
  min?: number;
  max?: number;
  disabled?: boolean;
  isLoading?: boolean;
  size?: "sm" | "md" | "lg";
  variant?: "default" | "compact" | "minimal" | "pill";
  className?: string;
}

export function QuantitySelector({
  value,
  onChange,
  min = 1,
  max,
  disabled = false,
  isLoading = false,
  size = "md",
  variant = "default",
  className,
}: QuantitySelectorProps) {
  const [inputValue, setInputValue] = useState(value.toString());

  const handleIncrement = () => {
    const newValue = value + 1;
    if (!max || newValue <= max) {
      onChange(newValue);
    }
  };

  const handleDecrement = () => {
    const newValue = value - 1;
    if (newValue >= min) {
      onChange(newValue);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputVal = e.target.value;
    setInputValue(inputVal);

    // If the input is empty, don't update quantity
    if (inputVal === "" || parseInt(inputVal) <= 0) {
      return;
    }

    const newQuantity = parseInt(inputVal);
    if (
      !isNaN(newQuantity) &&
      newQuantity >= min &&
      (!max || newQuantity <= max)
    ) {
      onChange(newQuantity);
    }
  };

  const handleInputBlur = () => {
    // Reset input value to current value if invalid
    if (parseInt(inputValue) < min || (max && parseInt(inputValue) > max)) {
      setInputValue(value.toString());
    }
  };

  // Update input value when prop value changes
  React.useEffect(() => {
    setInputValue(value.toString());
  }, [value]);

  const sizeClasses = {
    sm: {
      button: "h-6 w-6",
      input: "w-8 h-6 text-xs",
      icon: "h-3 w-3",
    },
    md: {
      button: "h-8 w-8",
      input: "w-12 h-8 text-sm",
      icon: "h-4 w-4",
    },
    lg: {
      button: "h-10 w-10",
      input: "w-16 h-10 text-base",
      icon: "h-5 w-5",
    },
  };

  const currentSize = sizeClasses[size];

  if (variant === "minimal") {
    return (
      <div className={cn("flex items-center gap-1", className)}>
        <Button
          variant="ghost"
          size="icon"
          className={cn(currentSize.button, "hover:bg-muted")}
          onClick={handleDecrement}
          disabled={disabled || isLoading || value <= min}
        >
          {isLoading ? (
            <Loader2 className={cn(currentSize.icon, "animate-spin")} />
          ) : (
            <Minus className={currentSize.icon} />
          )}
        </Button>
        <Input
          type="number"
          value={inputValue}
          onChange={handleInputChange}
          onBlur={handleInputBlur}
          className={cn(
            currentSize.input,
            "text-center [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
          )}
          min={min}
          max={max}
          disabled={disabled || isLoading}
        />
        <Button
          variant="ghost"
          size="icon"
          className={cn(currentSize.button, "hover:bg-muted")}
          onClick={handleIncrement}
          disabled={disabled || isLoading || (max ? value >= max : false)}
        >
          {isLoading ? (
            <Loader2 className={cn(currentSize.icon, "animate-spin")} />
          ) : (
            <Plus className={currentSize.icon} />
          )}
        </Button>
      </div>
    );
  }

  if (variant === "compact") {
    return (
      <div className={cn("flex items-center gap-1", className)}>
        <Button
          variant="outline"
          size="icon"
          className={currentSize.button}
          onClick={handleDecrement}
          disabled={disabled || isLoading || value <= min}
        >
          {isLoading ? (
            <Loader2 className={cn(currentSize.icon, "animate-spin")} />
          ) : (
            <Minus className={currentSize.icon} />
          )}
        </Button>
        <Input
          type="number"
          value={inputValue}
          onChange={handleInputChange}
          onBlur={handleInputBlur}
          className={cn(
            currentSize.input,
            "text-center [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
          )}
          min={min}
          max={max}
          disabled={disabled || isLoading}
        />
        <Button
          variant="outline"
          size="icon"
          className={currentSize.button}
          onClick={handleIncrement}
          disabled={disabled || isLoading || (max ? value >= max : false)}
        >
          {isLoading ? (
            <Loader2 className={cn(currentSize.icon, "animate-spin")} />
          ) : (
            <Plus className={currentSize.icon} />
          )}
        </Button>
      </div>
    );
  }

  if (variant === "pill") {
    return (
      <div
        className={cn(
          "flex justify-between items-center border border-gray-300 rounded-sm overflow-hidden",
          className
        )}
      >
        <button
          onClick={handleDecrement}
          disabled={disabled || isLoading || value <= min}
          className={cn(
            "flex items-center justify-center bg-transparent border-r border-gray-300 hover:bg-gray-100 transition-colors cursor-pointer",
            currentSize.button,
            (disabled || isLoading || value <= min) &&
              "opacity-50 cursor-not-allowed"
          )}
        >
          {isLoading ? (
            <Loader2 className={cn(currentSize.icon, "animate-spin")} />
          ) : (
            <Minus className={currentSize.icon} />
          )}
        </button>
        <div
          className={cn(
            "flex items-center justify-center bg-transparent",
            currentSize.input
          )}
        >
          <input
            type="number"
            value={inputValue}
            onChange={handleInputChange}
            onBlur={handleInputBlur}
            className={cn(
              "w-full text-center bg-transparent border-none outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none",
              currentSize.input
            )}
            min={min}
            max={max}
            disabled={disabled || isLoading}
          />
        </div>
        <button
          onClick={handleIncrement}
          disabled={disabled || isLoading || (max ? value >= max : false)}
          className={cn(
            "flex items-center justify-center bg-transparent border-l border-gray-300 hover:bg-gray-100 transition-colors cursor-pointer",
            currentSize.button,
            (disabled || isLoading || (max ? value >= max : false)) &&
              "opacity-50 cursor-not-allowed"
          )}
        >
          {isLoading ? (
            <Loader2 className={cn(currentSize.icon, "animate-spin")} />
          ) : (
            <Plus className={currentSize.icon} />
          )}
        </button>
      </div>
    );
  }

  // Default variant
  return (
    <div className={cn("flex items-center gap-2", className)}>
      <Button
        variant="outline"
        size="icon"
        className={currentSize.button}
        onClick={handleDecrement}
        disabled={disabled || isLoading || value <= min}
      >
        {isLoading ? (
          <Loader2 className={cn(currentSize.icon, "animate-spin")} />
        ) : (
          <Minus className={currentSize.icon} />
        )}
      </Button>
      <Input
        type="number"
        value={inputValue}
        onChange={handleInputChange}
        onBlur={handleInputBlur}
        className={cn(
          currentSize.input,
          "text-center [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
        )}
        min={min}
        max={max}
        disabled={disabled || isLoading}
      />
      <Button
        variant="outline"
        size="icon"
        className={currentSize.button}
        onClick={handleIncrement}
        disabled={disabled || isLoading || (max ? value >= max : false)}
      >
        {isLoading ? (
          <Loader2 className={cn(currentSize.icon, "animate-spin")} />
        ) : (
          <Plus className={currentSize.icon} />
        )}
      </Button>
    </div>
  );
}
