import { useCallback, useMemo, useState } from "react";
import type { SortDirection, SortField, Voucher } from "@/types/voucher";
import {
  filterAndSortVouchers,
  type FilterDue,
  type VoucherFilterState,
} from "@/lib/voucher-utils";

const initialFilterState: VoucherFilterState = {
  search: "",
  filterCategory: "",
  filterDue: "all",
  sortField: "dueDate",
  sortDirection: "asc",
};

export function useVoucherFilters(vouchers: Voucher[]) {
  const [search, setSearch] = useState(initialFilterState.search);
  const [filterCategory, setFilterCategory] = useState(
    initialFilterState.filterCategory
  );
  const [filterDue, setFilterDue] = useState<FilterDue>(
    initialFilterState.filterDue
  );
  const [sortField, setSortField] = useState<SortField>(
    initialFilterState.sortField
  );
  const [sortDirection, setSortDirection] = useState<SortDirection>(
    initialFilterState.sortDirection
  );

  const filterState: VoucherFilterState = {
    search,
    filterCategory,
    filterDue,
    sortField,
    sortDirection,
  };

  const filteredVouchers = useMemo(
    () => filterAndSortVouchers(vouchers, filterState),
    [vouchers, search, filterCategory, filterDue, sortField, sortDirection]
  );

  const toggleSortDirection = useCallback(() => {
    setSortDirection((d) => (d === "asc" ? "desc" : "asc"));
  }, []);

  return {
    search,
    setSearch,
    filterCategory,
    setFilterCategory,
    filterDue,
    setFilterDue,
    sortField,
    setSortField,
    sortDirection,
    setSortDirection,
    toggleSortDirection,
    filteredVouchers,
  };
}
