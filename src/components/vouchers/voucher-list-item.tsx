import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Trash2, Calendar, Copy, Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { formatDueDate, daysUntil } from "@/lib/date-utils";
import type { Voucher, VoucherCategory } from "@/types/voucher";
import { CATEGORY_CARD_CLASSES } from "@/types/voucher";
import { useState } from "react";

type TranslationShape = {
  markAsUsedAndRemove: (name: string) => string;
  remove: (name: string) => string;
  soon: string;
  expired: string;
  daysLeft: (n: number) => string;
  category: Record<VoucherCategory, string>;
};

type VoucherListItemProps = {
  voucher: Voucher;
  isExpired: boolean;
  isExpiringSoon: boolean;
  dateLocale: string;
  onRemove: (id: string) => void;
  onMarkUsed: (id: string) => void;
  t: TranslationShape;
};

export function VoucherListItem({
  voucher,
  isExpired,
  isExpiringSoon,
  dateLocale,
  onRemove,
  onMarkUsed,
  t,
}: VoucherListItemProps) {
  const [copied, setCopied] = useState(false);
  const [removing, setRemoving] = useState(false);
  const days = daysUntil(voucher.dueDate);

  const handleCheck = (checked: boolean | "indeterminate") => {
    if (checked === true) {
      setRemoving(true);
      setTimeout(() => onMarkUsed(voucher.id), 400);
    }
  };

  const handleRemove = () => {
    setRemoving(true);
    setTimeout(() => onRemove(voucher.id), 300);
  };

  const handleCopyCode = async () => {
    if (!voucher.code) return;
    try {
      await navigator.clipboard.writeText(voucher.code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard API not available
    }
  };

  return (
    <li
      className={cn(
        "group flex items-start gap-3 rounded-2xl border bg-card p-4 transition-all duration-300 hover:shadow-md",
        voucher.category && !isExpired && !isExpiringSoon && CATEGORY_CARD_CLASSES[voucher.category],
        isExpiringSoon &&
          !isExpired &&
          "border-amber-500/30 bg-amber-500/10",
        isExpired &&
          "border-red-500/25 bg-red-500/10",
        removing && "scale-95 opacity-0"
      )}
    >
      <div className="flex items-center pt-0.5">
        <Checkbox
          checked={false}
          onCheckedChange={handleCheck}
          aria-label={t.markAsUsedAndRemove(voucher.name)}
        />
      </div>

      <div className="min-w-0 flex-1">
        <div className="flex items-start justify-between gap-2">
          <p
            className={cn(
              "font-medium leading-snug transition-all duration-200",
              isExpired && "text-muted-foreground line-through"
            )}
          >
            {voucher.name}
          </p>
          <div className="flex shrink-0 items-center gap-1.5">
            {voucher.category && (
              <Badge variant={voucher.category} className="text-[11px]">
                {t.category[voucher.category]}
              </Badge>
            )}
            {isExpiringSoon && !isExpired && (
              <Badge variant="warning">{t.soon}</Badge>
            )}
            {isExpired && <Badge variant="destructive">{t.expired}</Badge>}
          </div>
        </div>

        <div className="mt-1.5 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-muted-foreground">
          <span className="inline-flex items-center gap-1.5">
            <Calendar className="h-3.5 w-3.5" />
            {formatDueDate(voucher.dueDate, dateLocale)}
            {!isExpired && days >= 0 && (
              <span
                className={cn(
                  "text-xs",
                  days <= 7 && "font-medium text-amber-400",
                  days <= 3 && "font-semibold text-red-400"
                )}
              >
                ({t.daysLeft(days)})
              </span>
            )}
          </span>
          {voucher.code && (
            <button
              type="button"
              onClick={handleCopyCode}
              className="inline-flex cursor-pointer items-center gap-1.5 rounded-lg bg-muted px-2.5 py-1 font-mono text-xs transition-all duration-200 hover:bg-accent active:scale-95"
              title="Copy code"
            >
              {voucher.code}
              {copied ? (
                <Check className="h-3 w-3 text-emerald-400" />
              ) : (
                <Copy className="h-3 w-3 opacity-40" />
              )}
            </button>
          )}
        </div>
      </div>

      <Button
        type="button"
        variant="ghost"
        size="icon"
        className="shrink-0 opacity-0 transition-all duration-200 group-hover:opacity-100 focus-visible:opacity-100 hover:text-destructive"
        onClick={handleRemove}
        aria-label={t.remove(voucher.name)}
      >
        <Trash2 className="h-4 w-4" />
      </Button>
    </li>
  );
}
