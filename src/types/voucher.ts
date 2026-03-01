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

/** Tailwind classes for card tinting per category */
export const CATEGORY_CARD_CLASSES: Record<VoucherCategory, string> = {
  food: "border-emerald-500/20 bg-emerald-500/5",
  retail: "border-blue-500/20 bg-blue-500/5",
  travel: "border-violet-500/20 bg-violet-500/5",
  entertainment: "border-pink-500/20 bg-pink-500/5",
  other: "border-gray-500/20 bg-gray-500/5",
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
