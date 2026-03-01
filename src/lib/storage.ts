import type { Voucher } from "@/types/voucher";

const STORAGE_KEY = "voucher-tracker-vouchers";

export function loadVouchers(): Voucher[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as unknown;
    if (!Array.isArray(parsed)) return [];
    return parsed.filter(
      (v): v is Voucher =>
        v &&
        typeof v === "object" &&
        typeof (v as Voucher).id === "string" &&
        typeof (v as Voucher).name === "string" &&
        typeof (v as Voucher).dueDate === "string"
    );
  } catch {
    return [];
  }
}

export function saveVouchers(vouchers: Voucher[]): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(vouchers));
}
