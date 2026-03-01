import { isExpired } from "@/lib/date-utils";
import { isVoucherExpiringSoon } from "@/lib/voucher-utils";
import type { Voucher, VoucherCategory } from "@/types/voucher";
import type { FilterDue } from "@/lib/voucher-utils";
import { VoucherFilters } from "./voucher-filters";
import { VoucherListItem } from "./voucher-list-item";
import { Ticket, Sparkles } from "lucide-react";

type TranslationShape = {
  yourVouchers: string;
  yourVouchersDescription: string;
  searchPlaceholder: string;
  allCategories: string;
  allDates: string;
  expiringIn30Days: string;
  notExpired: string;
  sortDueDate: string;
  sortName: string;
  noVouchersYet: string;
  noVouchersMatchFilters: string;
  markAsUsedAndRemove: (name: string) => string;
  remove: (name: string) => string;
  edit: (name: string) => string;
  soon: string;
  expired: string;
  daysLeft: (n: number) => string;
  voucherCount: (count: number) => string;
  category: Record<VoucherCategory, string>;
  priceFormat: (value: number) => string;
};

type VoucherListProps = {
  vouchers: Voucher[];
  filteredVouchers: Voucher[];
  search: string;
  onSearchChange: (value: string) => void;
  filterCategory: string;
  onFilterCategoryChange: (value: string) => void;
  filterDue: FilterDue;
  onFilterDueChange: (value: FilterDue) => void;
  sortField: "dueDate" | "name";
  onSortFieldChange: (value: "dueDate" | "name") => void;
  sortDirection: "asc" | "desc";
  onToggleSortDirection: () => void;
  dateLocale: string;
  onRemove: (id: string) => void;
  onMarkUsed: (id: string) => void;
  onEdit: (voucher: Voucher) => void;
  t: TranslationShape;
};

export function VoucherList({
  vouchers,
  filteredVouchers,
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
  dateLocale,
  onRemove,
  onMarkUsed,
  onEdit,
  t,
}: VoucherListProps) {
  const isEmpty = vouchers.length === 0;
  const hasNoMatches = filteredVouchers.length === 0;

  return (
    <section className="space-y-4">
      <div className="flex items-baseline justify-between">
        <div>
          <h2 className="text-lg font-semibold">{t.yourVouchers}</h2>
          <p className="text-sm text-muted-foreground">
            {t.yourVouchersDescription}
          </p>
        </div>
        {vouchers.length > 0 && (
          <span className="text-sm tabular-nums text-muted-foreground">
            {t.voucherCount(filteredVouchers.length)}
          </span>
        )}
      </div>

      {vouchers.length > 0 && (
        <VoucherFilters
          search={search}
          onSearchChange={onSearchChange}
          filterCategory={filterCategory}
          onFilterCategoryChange={onFilterCategoryChange}
          filterDue={filterDue}
          onFilterDueChange={onFilterDueChange}
          sortField={sortField}
          onSortFieldChange={onSortFieldChange}
          sortDirection={sortDirection}
          onToggleSortDirection={onToggleSortDirection}
          t={t}
        />
      )}

      {hasNoMatches ? (
        <div className="animate-fade-in flex flex-col items-center justify-center rounded-2xl border border-dashed py-16 text-center">
          <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/15">
            {isEmpty ? (
              <Sparkles className="h-8 w-8 text-primary" />
            ) : (
              <Ticket className="h-8 w-8 text-muted-foreground" />
            )}
          </div>
          <p className="font-medium text-muted-foreground">
            {isEmpty ? t.noVouchersYet : t.noVouchersMatchFilters}
          </p>
        </div>
      ) : (
        <ul className="space-y-2">
          {filteredVouchers.map((v, i) => (
            <div
              key={v.id}
              className="animate-fade-in-up"
              style={{ animationDelay: `${i * 30}ms`, animationFillMode: "both" }}
            >
              <VoucherListItem
                voucher={v}
                isExpired={isExpired(v.dueDate)}
                isExpiringSoon={isVoucherExpiringSoon(v.dueDate)}
                dateLocale={dateLocale}
                onRemove={onRemove}
                onMarkUsed={onMarkUsed}
                onEdit={onEdit}
                t={t}
              />
            </div>
          ))}
        </ul>
      )}
    </section>
  );
}
