"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Icons } from "@/components/icons";

export function ScrollToTopButton() {
    const [isVisible, setIsVisible] = useState(false);

    // Show button when page is scrolled down
    useEffect(() => {
        const toggleVisibility = () => {
            // Show button when user scrolls down 300px from the top
            if (window.pageYOffset > 300) {
                setIsVisible(true);
            } else {
                setIsVisible(false);
            }
        };

        // Listen for scroll events
        window.addEventListener("scroll", toggleVisibility);

        // Cleanup
        return () => window.removeEventListener("scroll", toggleVisibility);
    }, []);

    // Scroll to top smoothly
    const scrollToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: "smooth",
        });
    };

    // Don't render if not visible
    if (!isVisible) {
        return null;
    }

    return (
        <Button
            onClick={scrollToTop}
            size="icon"
            className="fixed bottom-6 right-6 z-50 h-12 w-12 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 bg-primary hover:bg-primary/90"
            aria-label="Scroll to top"
        >
            <Icons.chevronUp className="h-5 w-5" />
        </Button>
    );
}
