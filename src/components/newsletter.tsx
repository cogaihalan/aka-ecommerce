"use client";

import { Button } from "@/components/ui/button";
import { useI18n } from "@/components/providers/i18n-provider";

export default function Newsletter() {
    const { t } = useI18n();
    return (
        <section className="bg-muted/50 rounded-lg p-8 lg:p-16 text-center">
            <h2 className="text-3xl font-bold mb-4">{t("newsletter.title")}</h2>
            <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
                {t("newsletter.description")}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
                <input
                    type="email"
                    placeholder={t("newsletter.placeholder")}
                    className="flex-1 px-4 py-2 border rounded-md bg-background"
                />
                <Button>{t("newsletter.subscribe")}</Button>
            </div>
        </section>
    );
}
