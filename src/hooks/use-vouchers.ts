import { useCallback, useEffect, useState } from "react";
import type { Voucher } from "@/types/voucher";
import { loadVouchers, saveVouchers } from "@/lib/storage";
import {
  createVoucher,
  DEFAULT_COLOR,
  type CreateVoucherInput,
} from "@/lib/voucher-utils";

export function useVouchers() {
  const [vouchers, setVouchers] = useState<Voucher[]>([]);

  useEffect(() => {
    setVouchers(loadVouchers());
  }, []);

  useEffect(() => {
    saveVouchers(vouchers);
  }, [vouchers]);

  const addVoucher = useCallback((input: CreateVoucherInput) => {
    if (!input.name.trim() || !input.dueDate) return;
    setVouchers((prev) => [...prev, createVoucher(input)]);
  }, []);

  const removeVoucher = useCallback((id: string) => {
    setVouchers((prev) => prev.filter((v) => v.id !== id));
  }, []);

  return {
    vouchers,
    addVoucher,
    removeVoucher,
    defaultColor: DEFAULT_COLOR,
  };
}
