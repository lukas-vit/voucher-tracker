import { useCallback, useEffect, useMemo, useState } from "react";
import {
  CATEGORY_COLORS,
  type SortDirection,
  type SortField,
  type Voucher,
  type VoucherCategory,
  VOUCHER_CATEGORIES,
} from "@/types/voucher";
import { loadVouchers, saveVouchers } from "@/lib/storage";
import {
  daysUntil,
  formatDueDate,
  isExpired,
  isExpiringWithinDays,
} from "@/lib/date-utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Select } from "@/components/ui/select";
import { Plus, Trash2, AlertTriangle } from "lucide-react";
import { cn } from "@/lib/utils";
import { useTranslations } from "@/lib/translations";

const DEFAULT_COLOR = "#6b7280";
const LOCALE: "en" | "cs" = "cs";

function generateId(): string {
  return crypto.randomUUID();
}

function getColorForCategory(category: VoucherCategory | null): string {
  return category ? CATEGORY_COLORS[category] : DEFAULT_COLOR;
}

export default function App() {
  const [vouchers, setVouchers] = useState<Voucher[]>([]);
  const [name, setName] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [code, setCode] = useState("");
  const [category, setCategory] = useState<VoucherCategory | "">("");
  const [color, setColor] = useState(DEFAULT_COLOR);
  const [sortField, setSortField] = useState<SortField>("dueDate");
  const [sortDir, setSortDir] = useState<SortDirection>("asc");
  const [filterCategory, setFilterCategory] = useState<string>("");
  const [filterDue, setFilterDue] = useState<"all" | "expiring" | "valid">("all");
  const [search, setSearch] = useState("");

  useEffect(() => {
    if (category) setColor(CATEGORY_COLORS[category as VoucherCategory]);
    else setColor(DEFAULT_COLOR);
  }, [category]);

  useEffect(() => {
    setVouchers(loadVouchers());
  }, []);

  useEffect(() => {
    saveVouchers(vouchers);
  }, [vouchers]);

  const addVoucher = useCallback(() => {
    const trimmedName = name.trim();
    if (!trimmedName || !dueDate) return;
    const cat = category || null;
    const finalColor =
      color && color !== DEFAULT_COLOR ? color : getColorForCategory(cat);
    setVouchers((prev) => [
      ...prev,
      {
        id: generateId(),
        name: trimmedName,
        dueDate,
        code: code.trim() || null,
        category: cat,
        color: finalColor,
        createdAt: new Date().toISOString(),
      },
    ]);
    setName("");
    setDueDate("");
    setCode("");
    setCategory("");
    setColor(DEFAULT_COLOR);
  }, [name, dueDate, code, category, color]);

  const removeVoucher = useCallback((id: string) => {
    setVouchers((prev) => prev.filter((v) => v.id !== id));
  }, []);

  const toggleCheckedToRemove = useCallback((id: string, checked: boolean) => {
    if (!checked) return;
    removeVoucher(id);
  }, [removeVoucher]);

  const filteredAndSorted = useMemo(() => {
    let list = [...vouchers];

    if (search.trim()) {
      const q = search.trim().toLowerCase();
      list = list.filter(
        (v) =>
          v.name.toLowerCase().includes(q) ||
          (v.code?.toLowerCase().includes(q) ?? false)
      );
    }
    if (filterCategory) {
      list = list.filter((v) => v.category === filterCategory);
    }
    if (filterDue === "expiring") {
      list = list.filter(
        (v) => !isExpired(v.dueDate) && isExpiringWithinDays(v.dueDate, 30)
      );
    } else if (filterDue === "valid") {
      list = list.filter((v) => !isExpired(v.dueDate));
    }

    list.sort((a, b) => {
      const mult = sortDir === "asc" ? 1 : -1;
      if (sortField === "dueDate") {
        return mult * (new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime());
      }
      return mult * a.name.localeCompare(b.name);
    });

    return list;
  }, [vouchers, search, filterCategory, filterDue, sortField, sortDir]);

  const expiringSoon = useMemo(
    () =>
      vouchers.filter(
        (v) => !isExpired(v.dueDate) && isExpiringWithinDays(v.dueDate, 30)
      ),
    [vouchers]
  );

  const hasExpiringSoon = expiringSoon.length > 0;
  const t = useTranslations(LOCALE);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="mx-auto max-w-3xl space-y-8 p-6">
        <header className="text-center">
          <h1 className="text-3xl font-bold tracking-tight">
            {t.appTitle}
          </h1>
          <p className="mt-1 text-muted-foreground">
            {t.appSubtitle}
          </p>
        </header>

        {hasExpiringSoon && (
          <Card className="border-amber-500/50 bg-amber-500/10">
            <CardContent className="flex items-start gap-3 p-4">
              <AlertTriangle className="h-6 w-6 shrink-0 text-amber-600 dark:text-amber-400" />
              <div>
                <p className="font-semibold text-amber-800 dark:text-amber-200">
                  {t.useVouchersSoon}
                </p>
                <p className="mt-1 text-sm text-amber-700 dark:text-amber-300">
                  {t.vouchersExpireWithin(expiringSoon.length)}
                </p>
                <ul className="mt-2 list-inside list-disc text-sm text-amber-700 dark:text-amber-300">
                  {expiringSoon.slice(0, 5).map((v) => (
                    <li key={v.id}>
                      {v.name} — {formatDueDate(v.dueDate, LOCALE === "cs" ? "cs-CZ" : "en")} (
                      {t.daysLeft(daysUntil(v.dueDate))})
                    </li>
                  ))}
                  {expiringSoon.length > 5 && (
                    <li>{t.andMore(expiringSoon.length - 5)}</li>
                  )}
                </ul>
              </div>
            </CardContent>
          </Card>
        )}

        <Card>
          <CardHeader>
            <CardTitle>{t.addVoucher}</CardTitle>
            <CardDescription>
              {t.addVoucherDescription}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-2 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="name">{t.name}</Label>
                <Input
                  id="name"
                  placeholder={t.namePlaceholder}
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="dueDate">{t.dueDate}</Label>
                <Input
                  id="dueDate"
                  type="date"
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                />
              </div>
            </div>
            <div className="grid gap-2 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="code">{t.voucherCodeOptional}</Label>
                <Input
                  id="code"
                  placeholder={t.codePlaceholder}
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="category">{t.categoryOptional}</Label>
                <Select
                  id="category"
                  value={category}
                  onChange={(e) =>
                    setCategory((e.target.value || "") as VoucherCategory | "")
                  }
                >
                  <option value="">{t.none}</option>
                  {VOUCHER_CATEGORIES.map((c) => (
                    <option key={c} value={c}>
                      {t.category[c]}
                    </option>
                  ))}
                </Select>
              </div>
            </div>
            <div className="flex flex-wrap items-end gap-4">
              <div className="space-y-2">
                <Label htmlFor="color">{t.color}</Label>
                <div className="flex gap-2">
                  <input
                    id="color"
                    type="color"
                    value={color}
                    onChange={(e) => setColor(e.target.value)}
                    className="h-9 w-14 cursor-pointer rounded border border-input"
                  />
                  <Input
                    value={color}
                    onChange={(e) => setColor(e.target.value)}
                    className="w-24 font-mono text-sm"
                  />
                </div>
              </div>
              <Button onClick={addVoucher} disabled={!name.trim() || !dueDate}>
                <Plus className="mr-2 h-4 w-4" />
                {t.addVoucher}
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>{t.yourVouchers}</CardTitle>
            <CardDescription>
              {t.yourVouchersDescription}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-wrap gap-2">
              <Input
                placeholder={t.searchPlaceholder}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="max-w-xs"
              />
              <Select
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value)}
                className="w-36"
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
                onChange={(e) =>
                  setFilterDue(e.target.value as "all" | "expiring" | "valid")
                }
                className="w-36"
              >
                <option value="all">{t.allDates}</option>
                <option value="expiring">{t.expiringIn30Days}</option>
                <option value="valid">{t.notExpired}</option>
              </Select>
              <div className="flex rounded-md border border-input">
                <Select
                  value={sortField}
                  onChange={(e) =>
                    setSortField(e.target.value as SortField)
                  }
                  className="w-32 border-0"
                >
                  <option value="dueDate">{t.sortDueDate}</option>
                  <option value="name">{t.sortName}</option>
                </Select>
                <Button
                  variant="outline"
                  size="sm"
                  className="rounded-l-none border-l"
                  onClick={() =>
                    setSortDir((d) => (d === "asc" ? "desc" : "asc"))
                  }
                >
                  {sortDir === "asc" ? "↑" : "↓"}
                </Button>
              </div>
            </div>

            {filteredAndSorted.length === 0 ? (
              <p className="py-8 text-center text-muted-foreground">
                {vouchers.length === 0
                  ? t.noVouchersYet
                  : t.noVouchersMatchFilters}
              </p>
            ) : (
              <ul className="space-y-2">
                {filteredAndSorted.map((v) => {
                  const expired = isExpired(v.dueDate);
                  const soon = !expired && isExpiringWithinDays(v.dueDate, 30);
                  return (
                    <li
                      key={v.id}
                      className={cn(
                        "flex items-center gap-3 rounded-lg border p-3 transition-colors",
                        soon && "border-amber-500/50 bg-amber-500/5",
                        expired && "border-red-500/30 bg-red-500/5 opacity-80"
                      )}
                    >
                      <Checkbox
                        checked={false}
                        onCheckedChange={(checked) =>
                          toggleCheckedToRemove(v.id, !!checked)
                        }
                        aria-label={t.markAsUsedAndRemove(v.name)}
                      />
                      <div
                        className="h-4 w-4 shrink-0 rounded-full border border-white/50"
                        style={{ backgroundColor: v.color }}
                        title={v.color}
                      />
                      <div className="min-w-0 flex-1">
                        <p className="font-medium">{v.name}</p>
                        <p className="text-sm text-muted-foreground">
                          {formatDueDate(v.dueDate, LOCALE === "cs" ? "cs-CZ" : "en")}
                          {v.code && (
                            <span className="ml-2 font-mono text-xs">
                              {v.code}
                            </span>
                          )}
                        </p>
                      </div>
                      {v.category && (
                        <Badge variant="secondary">{t.category[v.category]}</Badge>
                      )}
                      {soon && !expired && (
                        <Badge variant="outline" className="border-amber-500 text-amber-700 dark:text-amber-400">
                          {t.soon}
                        </Badge>
                      )}
                      {expired && (
                        <Badge variant="destructive">{t.expired}</Badge>
                      )}
                      <Button
                        variant="ghost"
                        size="icon"
                        className="shrink-0 text-destructive hover:bg-destructive/10"
                        onClick={() => removeVoucher(v.id)}
                        aria-label={t.remove(v.name)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </li>
                  );
                })}
              </ul>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
