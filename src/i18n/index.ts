export type SupportedLocale = "en" | "vi";

export const DEFAULT_LOCALE: SupportedLocale = "vi";

export const isSupportedLocale = (value: string | undefined | null): value is SupportedLocale =>
  value === "en" || value === "vi";

export const LOCALE_COOKIE = "aka_locale";

export const messagesByLocale = {
  en: () => import("./messages/en").then((m) => m.enMessages),
  vi: () => import("./messages/vi").then((m) => m.viMessages),
} as const;

export async function loadMessages(locale: SupportedLocale) {
  return messagesByLocale[locale]();
}


