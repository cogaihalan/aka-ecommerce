"use client";

import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import { DEFAULT_LOCALE, LOCALE_COOKIE, SupportedLocale, isSupportedLocale, loadMessages } from "@/i18n";

type Messages = Record<string, unknown>;

type I18nContextValue = {
  locale: SupportedLocale;
  t: (path: string, vars?: Record<string, string | number>) => string;
  setLocale: (locale: SupportedLocale) => void;
};

const I18nContext = createContext<I18nContextValue | undefined>(undefined);

function getCookie(name: string): string | null {
  if (typeof document === "undefined") return null;
  const match = document.cookie.match(new RegExp("(^| )" + name + "=([^;]+)"));
  return match ? decodeURIComponent(match[2]) : null;
}

function setCookie(name: string, value: string) {
  if (typeof document === "undefined") return;
  document.cookie = `${name}=${encodeURIComponent(value)}; path=/; max-age=${60 * 60 * 24 * 365}`;
}

function resolvePath(obj: any, path: string): any {
  return path.split(".").reduce((acc, key) => (acc && typeof acc === "object" ? acc[key] : undefined), obj);
}

export function I18nProvider({ children }: { children: React.ReactNode }) {
  const [locale, setLocaleState] = useState<SupportedLocale>(() => {
    const fromCookie = getCookie(LOCALE_COOKIE);
    return isSupportedLocale(fromCookie) ? fromCookie : DEFAULT_LOCALE;
  });
  const [messages, setMessages] = useState<Messages>({});

  useEffect(() => {
    let cancelled = false;
    loadMessages(locale).then((loaded) => {
      if (!cancelled) setMessages(loaded as Messages);
    });
    return () => {
      cancelled = true;
    };
  }, [locale]);

  const t = useMemo(() => {
    return (path: string, vars?: Record<string, string | number>) => {
      const raw = resolvePath(messages, path);
      if (typeof raw !== "string") return path;
      if (!vars) return raw;
      return raw.replace(/\{(\w+)\}/g, (_, k) => String(vars[k] ?? ""));
    };
  }, [messages]);

  const setLocale = (next: SupportedLocale) => {
    setLocaleState(next);
    setCookie(LOCALE_COOKIE, next);
    // Optional: notify server via API (no-op if route not present)
    try {
      fetch("/api/locale", { method: "POST", body: JSON.stringify({ locale: next }) });
    } catch {}
  };

  const value: I18nContextValue = useMemo(
    () => ({ locale, t, setLocale }),
    [locale, t]
  );

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useI18n() {
  const ctx = useContext(I18nContext);
  if (!ctx) throw new Error("useI18n must be used within I18nProvider");
  return ctx;
}


