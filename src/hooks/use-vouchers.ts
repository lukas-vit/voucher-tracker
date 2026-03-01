import { useCallback, useEffect, useState } from "react";
import type { Voucher } from "@/types/voucher";
import { loadVouchers, saveVouchers } from "@/lib/storage";
import {
  createVoucher,
  updateVoucher as updateVoucherUtil,
  DEFAULT_COLOR,
  type CreateVoucherInput,
  type UpdateVoucherInput,
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

  const updateVoucher = useCallback((id: string, input: UpdateVoucherInput) => {
    if (!input.name.trim() || !input.dueDate) return;
    setVouchers((prev) =>
      prev.map((v) =>
        v.id === id ? updateVoucherUtil(v, input) : v
      )
    );
  }, []);

  const removeVoucher = useCallback((id: string) => {
    setVouchers((prev) => prev.filter((v) => v.id !== id));
  }, []);

  return {
    vouchers,
    addVoucher,
    updateVoucher,
    removeVoucher,
    defaultColor: DEFAULT_COLOR,
  };
}
