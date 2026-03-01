import { useMemo, useState } from "react";
import { APP_CONFIG, getDateLocale } from "@/config/app";
import { useTranslations } from "@/lib/translations";
import { useVouchers } from "@/hooks/use-vouchers";
import type { Voucher } from "@/types/voucher";
import { useVoucherFilters } from "@/hooks/use-voucher-filters";
import { getExpiringSoonVouchers } from "@/lib/voucher-utils";
import { PageHeader } from "@/components/layout/page-header";
import { ExpiringSoonBanner } from "@/components/vouchers/expiring-soon-banner";
import { AddVoucherForm } from "@/components/vouchers/add-voucher-form";
import { VoucherList } from "@/components/vouchers/voucher-list";

export default function App() {
  const t = useTranslations(APP_CONFIG.locale);
  const dateLocale = getDateLocale(APP_CONFIG.locale);

  const { vouchers, addVoucher, updateVoucher, removeVoucher } = useVouchers();
  const [editingVoucher, setEditingVoucher] = useState<Voucher | null>(null);
  const {
    search,
    setSearch,
    filterCategory,
    setFilterCategory,
    filterDue,
    setFilterDue,
    sortField,
    setSortField,
    sortDirection,
    toggleSortDirection,
    filteredVouchers,
  } = useVoucherFilters(vouchers);

  const expiringSoon = useMemo(
    () => getExpiringSoonVouchers(vouchers),
    [vouchers]
  );

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="mx-auto max-w-2xl px-4 py-8 sm:px-6 lg:py-12">
        <div className="space-y-6">
          <PageHeader
            title={t.appTitle}
            subtitle={t.appSubtitle}
            voucherCount={vouchers.length}
          />

          <ExpiringSoonBanner
            vouchers={expiringSoon}
            dateLocale={dateLocale}
            t={t}
          />

          <AddVoucherForm
            onAdd={addVoucher}
            editingVoucher={editingVoucher}
            onEditCancel={() => setEditingVoucher(null)}
            onUpdate={updateVoucher}
            dateLocale={dateLocale}
            t={t}
          />

          <VoucherList
            vouchers={vouchers}
            filteredVouchers={filteredVouchers}
            search={search}
            onSearchChange={setSearch}
            filterCategory={filterCategory}
            onFilterCategoryChange={setFilterCategory}
            filterDue={filterDue}
            onFilterDueChange={setFilterDue}
            sortField={sortField}
            onSortFieldChange={setSortField}
            sortDirection={sortDirection}
            onToggleSortDirection={toggleSortDirection}
            dateLocale={dateLocale}
            onRemove={removeVoucher}
            onMarkUsed={removeVoucher}
            onEdit={setEditingVoucher}
            t={t}
          />
        </div>
      </div>
    </div>
  );
}
