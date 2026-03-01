const MS_PER_DAY = 24 * 60 * 60 * 1000;

export function daysUntil(dateStr: string): number {
  const due = new Date(dateStr);
  due.setHours(0, 0, 0, 0);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return Math.ceil((due.getTime() - today.getTime()) / MS_PER_DAY);
}

export function isExpiringWithinDays(dateStr: string, days: number): boolean {
  const daysLeft = daysUntil(dateStr);
  return daysLeft >= 0 && daysLeft <= days;
}

export function isExpired(dateStr: string): boolean {
  return daysUntil(dateStr) < 0;
}

export function formatDueDate(dateStr: string, locale: string = "cs-CZ"): string {
  return new Date(dateStr).toLocaleDateString(locale, {
    weekday: "short",
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}
