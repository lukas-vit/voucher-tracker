import type { Locale } from "@/lib/translations";

export const APP_LOCALE: Locale = "cs";

const DEFAULT_COLOR = "#6b7280";

export const APP_CONFIG = {
  locale: APP_LOCALE,
  defaultColor: DEFAULT_COLOR,
} as const;

export function getDateLocale(locale: Locale): string {
  return locale === "cs" ? "cs-CZ" : "en";
}
