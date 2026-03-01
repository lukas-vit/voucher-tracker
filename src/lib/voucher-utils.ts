import {
  CATEGORY_COLORS,
  type SortDirection,
  type SortField,
  type Voucher,
  type VoucherCategory,
} from "@/types/voucher";
import { isExpired, isExpiringWithinDays } from "@/lib/date-utils";

const DEFAULT_COLOR = "#6b7280";
const EXPIRING_DAYS_THRESHOLD = 30;

export function generateVoucherId(): string {
  return crypto.randomUUID();
}

export function getColorForCategory(category: VoucherCategory | null): string {
  return category ? CATEGORY_COLORS[category] : DEFAULT_COLOR;
}

export interface CreateVoucherInput {
  name: string;
  dueDate: string;
  price: number;
  code?: string | null;
  category?: VoucherCategory | null;
  color?: string | null;
}

export function createVoucher(input: CreateVoucherInput): Voucher {
  const category = input.category ?? null;
  const color =
    input.color && input.color !== DEFAULT_COLOR
      ? input.color
      : getColorForCategory(category);

  return {
    id: generateVoucherId(),
    name: input.name.trim(),
    dueDate: input.dueDate,
    code: input.code?.trim() || null,
    category,
    color,
    createdAt: new Date().toISOString(),
    price: input.price,
  };
}

export type UpdateVoucherInput = CreateVoucherInput;

export function updateVoucher(
  existing: Voucher,
  input: UpdateVoucherInput
): Voucher {
  const category = input.category ?? null;
  const color =
    input.color && input.color !== DEFAULT_COLOR
      ? input.color
      : getColorForCategory(category);

  return {
    ...existing,
    name: input.name.trim(),
    dueDate: input.dueDate,
    code: input.code?.trim() || null,
    category,
    color,
    price: input.price,
  };
}

export type FilterDue = "all" | "expiring" | "valid";

export interface VoucherFilterState {
  search: string;
  filterCategory: string;
  filterDue: FilterDue;
  sortField: SortField;
  sortDirection: SortDirection;
}

export function filterAndSortVouchers(
  vouchers: Voucher[],
  state: VoucherFilterState
): Voucher[] {
  let list = [...vouchers];

  const q = state.search.trim().toLowerCase();
  if (q) {
    list = list.filter(
      (v) =>
        v.name.toLowerCase().includes(q) ||
        (v.code?.toLowerCase().includes(q) ?? false)
    );
  }

  if (state.filterCategory) {
    list = list.filter((v) => v.category === state.filterCategory);
  }

  if (state.filterDue === "expiring") {
    list = list.filter(
      (v) =>
        !isExpired(v.dueDate) &&
        isExpiringWithinDays(v.dueDate, EXPIRING_DAYS_THRESHOLD)
    );
  } else if (state.filterDue === "valid") {
    list = list.filter((v) => !isExpired(v.dueDate));
  }

  const mult = state.sortDirection === "asc" ? 1 : -1;
  list.sort((a, b) => {
    if (state.sortField === "dueDate") {
      return (
        mult *
        (new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime())
      );
    }
    return mult * a.name.localeCompare(b.name);
  });

  return list;
}

export function getExpiringSoonVouchers(
  vouchers: Voucher[],
  withinDays: number = EXPIRING_DAYS_THRESHOLD
): Voucher[] {
  return vouchers.filter(
    (v) => !isExpired(v.dueDate) && isExpiringWithinDays(v.dueDate, withinDays)
  );
}

export function isVoucherExpiringSoon(
  dueDate: string,
  withinDays: number = EXPIRING_DAYS_THRESHOLD
): boolean {
  return !isExpired(dueDate) && isExpiringWithinDays(dueDate, withinDays);
}

export { DEFAULT_COLOR, EXPIRING_DAYS_THRESHOLD };
