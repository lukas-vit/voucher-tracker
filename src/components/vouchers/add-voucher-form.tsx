import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import { DatePicker } from "@/components/ui/date-picker";
import { Plus, X, Sparkles } from "lucide-react";
import { VOUCHER_CATEGORIES } from "@/types/voucher";
import type { VoucherCategory } from "@/types/voucher";
import type { CreateVoucherInput } from "@/lib/voucher-utils";
import { cn } from "@/lib/utils";

type TranslationShape = {
  addVoucher: string;
  addVoucherDescription: string;
  name: string;
  namePlaceholder: string;
  dueDate: string;
  dueDatePlaceholder: string;
  voucherCodeOptional: string;
  codePlaceholder: string;
  categoryOptional: string;
  none: string;
  cancel: string;
  category: Record<VoucherCategory, string>;
};

type AddVoucherFormProps = {
  onAdd: (input: CreateVoucherInput) => void;
  dateLocale: string;
  t: TranslationShape;
};

export function AddVoucherForm({
  onAdd,
  dateLocale,
  t,
}: AddVoucherFormProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [name, setName] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [code, setCode] = useState("");
  const [category, setCategory] = useState<VoucherCategory | "">("");
  const [justAdded, setJustAdded] = useState(false);

  const resetForm = () => {
    setName("");
    setDueDate("");
    setCode("");
    setCategory("");
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedName = name.trim();
    if (!trimmedName || !dueDate) return;
    onAdd({
      name: trimmedName,
      dueDate,
      code: code || null,
      category: category || null,
    });
    resetForm();
    setIsOpen(false);
    setJustAdded(true);
    setTimeout(() => setJustAdded(false), 1500);
  };

  const handleCancel = () => {
    resetForm();
    setIsOpen(false);
  };

  if (!isOpen) {
    return (
      <Button
        onClick={() => setIsOpen(true)}
        size="lg"
        className={cn(
          "w-full gap-2.5 rounded-2xl py-7 text-base shadow-md transition-all duration-300 hover:shadow-lg",
          justAdded && "animate-bounce-subtle"
        )}
      >
        {justAdded ? (
          <>
            <Sparkles className="h-5 w-5" />
            <span className="font-semibold">Added!</span>
          </>
        ) : (
          <>
            <Plus className="h-5 w-5" />
            {t.addVoucher}
          </>
        )}
      </Button>
    );
  }

  return (
    <div className="animate-scale-in rounded-2xl border bg-card shadow-lg">
      <div className="flex items-center justify-between border-b px-5 py-4">
        <div>
          <h2 className="font-semibold">{t.addVoucher}</h2>
          <p className="text-sm text-muted-foreground">
            {t.addVoucherDescription}
          </p>
        </div>
        <Button
          type="button"
          variant="ghost"
          size="icon"
          onClick={handleCancel}
          className="shrink-0"
        >
          <X className="h-4 w-4" />
        </Button>
      </div>
      <form onSubmit={handleSubmit} className="space-y-5 p-5">
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="add-name">{t.name}</Label>
            <Input
              id="add-name"
              placeholder={t.namePlaceholder}
              value={name}
              onChange={(e) => setName(e.target.value)}
              autoFocus
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="add-dueDate">{t.dueDate}</Label>
            <DatePicker
              id="add-dueDate"
              value={dueDate}
              onChange={setDueDate}
              placeholder={t.dueDatePlaceholder}
              locale={dateLocale}
            />
          </div>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="add-code">{t.voucherCodeOptional}</Label>
            <Input
              id="add-code"
              placeholder={t.codePlaceholder}
              value={code}
              onChange={(e) => setCode(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="add-category">{t.categoryOptional}</Label>
            <Select
              id="add-category"
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

        <div className="flex justify-end gap-2 border-t pt-4">
          <Button type="button" variant="outline" onClick={handleCancel}>
            {t.cancel}
          </Button>
          <Button type="submit" disabled={!name.trim() || !dueDate}>
            <Plus className="mr-1.5 h-4 w-4" />
            {t.addVoucher}
          </Button>
        </div>
      </form>
    </div>
  );
}
