export type VoucherCategory =
  | "food"
  | "retail"
  | "travel"
  | "entertainment"
  | "other";

export const VOUCHER_CATEGORIES: VoucherCategory[] = [
  "food",
  "retail",
  "travel",
  "entertainment",
  "other",
];

/** Hex colors per category for consistent auto-coloring */
export const CATEGORY_COLORS: Record<VoucherCategory, string> = {
  food: "#22c55e",
  retail: "#3b82f6",
  travel: "#8b5cf6",
  entertainment: "#ec4899",
  other: "#6b7280",
};

export interface Voucher {
  id: string;
  name: string;
  dueDate: string; // ISO date
  code: string | null;
  category: VoucherCategory | null;
  color: string; // hex, either user-set or from category
  createdAt: string; // ISO
}

export type SortField = "dueDate" | "name";
export type SortDirection = "asc" | "desc";
