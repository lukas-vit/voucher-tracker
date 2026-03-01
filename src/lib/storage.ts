import type { Voucher } from "@/types/voucher";

const STORAGE_KEY = "voucher-tracker-vouchers";

export function loadVouchers(): Voucher[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as unknown;
    if (!Array.isArray(parsed)) return [];
    const list = parsed.filter(
      (v): v is Record<string, unknown> =>
        v &&
        typeof v === "object" &&
        typeof (v as Record<string, unknown>).id === "string" &&
        typeof (v as Record<string, unknown>).name === "string" &&
        typeof (v as Record<string, unknown>).dueDate === "string"
    );
    return list.map((v) => ({
      ...v,
      price:
        typeof (v as Voucher).price === "number" ? (v as Voucher).price : null,
    })) as Voucher[];
  } catch {
    return [];
  }
}

export function saveVouchers(vouchers: Voucher[]): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(vouchers));
}
