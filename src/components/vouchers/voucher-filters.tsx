import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Search, ArrowUp, ArrowDown } from "lucide-react";
import { VOUCHER_CATEGORIES } from "@/types/voucher";
import type { VoucherCategory } from "@/types/voucher";
import type { SortField } from "@/types/voucher";
import type { FilterDue } from "@/lib/voucher-utils";

type TranslationShape = {
  searchPlaceholder: string;
  allCategories: string;
  allDates: string;
  expiringIn30Days: string;
  notExpired: string;
  sortDueDate: string;
  sortName: string;
  category: Record<VoucherCategory, string>;
};

type VoucherFiltersProps = {
  search: string;
  onSearchChange: (value: string) => void;
  filterCategory: string;
  onFilterCategoryChange: (value: string) => void;
  filterDue: FilterDue;
  onFilterDueChange: (value: FilterDue) => void;
  sortField: SortField;
  onSortFieldChange: (value: SortField) => void;
  sortDirection: "asc" | "desc";
  onToggleSortDirection: () => void;
  t: TranslationShape;
};

export function VoucherFilters({
  search,
  onSearchChange,
  filterCategory,
  onFilterCategoryChange,
  filterDue,
  onFilterDueChange,
  sortField,
  onSortFieldChange,
  sortDirection,
  onToggleSortDirection,
  t,
}: VoucherFiltersProps) {
  const SortIcon = sortDirection === "asc" ? ArrowUp : ArrowDown;

  return (
    <div className="animate-fade-in space-y-3">
      <div className="relative">
        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder={t.searchPlaceholder}
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-10"
          aria-label={t.searchPlaceholder}
        />
      </div>
      <div className="flex flex-wrap items-center gap-2">
        <Select
          value={filterCategory}
          onChange={(e) => onFilterCategoryChange(e.target.value)}
          className="w-auto min-w-[8rem]"
          aria-label={t.allCategories}
        >
          <option value="">{t.allCategories}</option>
          {VOUCHER_CATEGORIES.map((c) => (
            <option key={c} value={c}>
              {t.category[c]}
            </option>
          ))}
        </Select>
        <Select
          value={filterDue}
          onChange={(e) => onFilterDueChange(e.target.value as FilterDue)}
          className="w-auto min-w-[8rem]"
          aria-label={t.allDates}
        >
          <option value="all">{t.allDates}</option>
          <option value="expiring">{t.expiringIn30Days}</option>
          <option value="valid">{t.notExpired}</option>
        </Select>
        <div className="ml-auto flex items-center gap-1.5">
          <Select
            value={sortField}
            onChange={(e) => onSortFieldChange(e.target.value as SortField)}
            className="w-auto min-w-[7rem]"
            aria-label={t.sortDueDate}
          >
            <option value="dueDate">{t.sortDueDate}</option>
            <option value="name">{t.sortName}</option>
          </Select>
          <Button
            type="button"
            variant="outline"
            size="icon"
            onClick={onToggleSortDirection}
            aria-label={
              sortDirection === "asc" ? "Sort ascending" : "Sort descending"
            }
            className="shrink-0"
          >
            <SortIcon className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
