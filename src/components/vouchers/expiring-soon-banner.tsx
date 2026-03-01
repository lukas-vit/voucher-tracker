import { AlertTriangle, Clock } from "lucide-react";
import { daysUntil } from "@/lib/date-utils";
import type { Voucher } from "@/types/voucher";

type TranslationShape = {
  useVouchersSoon: string;
  vouchersExpireWithin: (count: number) => string;
  daysLeft: (n: number) => string;
  andMore: (n: number) => string;
};

type ExpiringSoonBannerProps = {
  vouchers: Voucher[];
  dateLocale: string;
  t: TranslationShape;
};

export function ExpiringSoonBanner({
  vouchers,
  t,
}: ExpiringSoonBannerProps) {
  if (vouchers.length === 0) return null;

  return (
    <div className="animate-fade-in-up rounded-2xl border border-amber-500/30 bg-amber-500/10 p-4 shadow-sm">
      <div className="flex items-start gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-amber-500/20">
          <AlertTriangle className="h-5 w-5 text-amber-400" />
        </div>
        <div className="min-w-0 flex-1">
          <p className="font-semibold text-amber-200">
            {t.useVouchersSoon}
          </p>
          <p className="mt-0.5 text-sm text-amber-300/80">
            {t.vouchersExpireWithin(vouchers.length)}
          </p>
          <div className="mt-3 flex flex-wrap gap-2">
            {vouchers.slice(0, 5).map((v) => {
              const days = daysUntil(v.dueDate);
              return (
                <div
                  key={v.id}
                  className="inline-flex items-center gap-1.5 rounded-full bg-amber-500/15 px-3 py-1.5 text-xs font-medium text-amber-200 ring-1 ring-amber-500/30"
                >
                  <Clock className="h-3 w-3 text-amber-400" />
                  <span className="max-w-[120px] truncate">{v.name}</span>
                  <span className="font-semibold text-amber-300">
                    {t.daysLeft(days)}
                  </span>
                </div>
              );
            })}
            {vouchers.length > 5 && (
              <div className="inline-flex items-center rounded-full bg-amber-500/15 px-3 py-1.5 text-xs font-medium text-amber-200 ring-1 ring-amber-500/30">
                {t.andMore(vouchers.length - 5)}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
