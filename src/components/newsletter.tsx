"use client";

import { Button } from "@/components/ui/button";

export default function Newsletter() {
    return (
        <section className="bg-muted/50 rounded-lg p-8 lg:p-16 text-center">
            <h2 className="text-3xl font-bold mb-4">Stay Updated</h2>
            <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
                Subscribe to our newsletter and be the first to know about new products,
                exclusive offers, and special promotions.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
                <input
                    type="email"
                    placeholder="Enter your email"
                    className="flex-1 px-4 py-2 border rounded-md bg-background"
                />
                <Button>Subscribe</Button>
            </div>
        </section>
    );
}
