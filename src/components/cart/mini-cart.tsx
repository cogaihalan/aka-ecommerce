"use client";

import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { ShoppingCart, X, ArrowRight, ShoppingBag } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import {
    useCartStore,
    useCartItems,
    useCartTotal,
    useCartItemCount,
} from "@/stores/cart-store";
import { CartItem } from "./cart-item";

interface MiniCartProps {
    className?: string;
}

export function MiniCart({ className }: MiniCartProps) {
    const { isOpen, closeCart, getTotalItems } = useCartStore();
    const items = useCartItems();
    const total = useCartTotal();
    const itemCount = useCartItemCount();
    const [isVisible, setIsVisible] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    // Handle visibility with smooth transitions
    useEffect(() => {
        if (isOpen) {
            setIsVisible(true);
        } else {
            const timer = setTimeout(() => setIsVisible(false), 200);
            return () => clearTimeout(timer);
        }
    }, [isOpen]);

    // Close on outside click
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (
                dropdownRef.current &&
                !dropdownRef.current.contains(event.target as Node)
            ) {
                closeCart();
            }
        };

        if (isOpen) {
            document.addEventListener("mousedown", handleClickOutside);
            return () =>
                document.removeEventListener("mousedown", handleClickOutside);
        }
    }, [isOpen, closeCart]);

    // Close on escape key
    useEffect(() => {
        const handleEscape = (e: KeyboardEvent) => {
            if (e.key === "Escape" && isOpen) {
                closeCart();
            }
        };

        document.addEventListener("keydown", handleEscape);
        return () => document.removeEventListener("keydown", handleEscape);
    }, [isOpen, closeCart]);

    if (!isVisible) return null;

    return (
        <div
            ref={dropdownRef}
            className={cn(
                "absolute right-0 top-full w-96 bg-background/95 backdrop-blur-md border border-border rounded-lg shadow-xl z-50",
                "transform transition-all duration-300 ease-out",
                "animate-in slide-in-from-top-2 fade-in-0 zoom-in-95",
                isOpen
                    ? "opacity-100 scale-100 translate-y-0"
                    : "opacity-0 scale-95 -translate-y-2 pointer-events-none",
                className
            )}
        >
            {/* Header */}
            <div className="px-4 py-2 border-b border-border">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <ShoppingCart className="w-5 h-5" />
                        <h3 className="font-semibold text-lg">Cart ({itemCount})</h3>
                    </div>
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={closeCart}
                        className="h-8 w-8 hover:bg-secondary transition-all duration-200"
                    >
                        <X className="h-4 w-4" />
                    </Button>
                </div>
            </div>

            {/* Content */}
            {items.length === 0 ? (
                <div className="p-8 text-center">
                    <ShoppingBag className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                    <h4 className="font-medium text-lg mb-2">Your cart is empty</h4>
                    <p className="text-muted-foreground text-sm mb-6">
                        Add some items to get started
                    </p>
                    <Button asChild onClick={closeCart}>
                        <Link href="/products">
                            Start Shopping
                            <ArrowRight className="w-4 h-4 ml-2" />
                        </Link>
                    </Button>
                </div>
            ) : (
                <>
                    {/* Cart Items */}
                    <div className="max-h-64 overflow-auto">
                        <ScrollArea className="h-full">
                            <div className="p-3 space-y-1">
                                {items.map((item, index) => (
                                    <div
                                        key={item.id}
                                        className="animate-in slide-in-from-left-2 fade-in-0"
                                        style={{ animationDelay: `${index * 50}ms` }}
                                    >
                                        <CartItem
                                            item={item}
                                            variant="minimal"
                                            showRemoveButton={true}
                                            showQuantityControls={false}
                                            className="hover:bg-muted/50 rounded-md px-2 py-1 -mx-2 -my-1 transition-all duration-200"
                                        />
                                    </div>
                                ))}
                            </div>
                        </ScrollArea>
                    </div>

                    <Separator />

                    {/* Summary */}
                    <div className="p-4 space-y-4">
                        <div className="flex justify-between items-center">
                            <span className="font-medium">Total</span>
                            <span className="font-bold text-lg">${total.toFixed(2)}</span>
                        </div>

                        {/* Action Buttons */}
                        <div className="space-y-2">
                            <Button asChild className="w-full" size="lg" onClick={closeCart}>
                                <Link href="/checkout">
                                    Checkout
                                    <ArrowRight className="w-4 h-4 ml-2" />
                                </Link>
                            </Button>
                            <Button
                                asChild
                                variant="outline"
                                className="w-full"
                                onClick={closeCart}
                            >
                                <Link href="/cart">View Cart</Link>
                            </Button>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
}
