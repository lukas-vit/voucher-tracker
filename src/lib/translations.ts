export type Locale = "en" | "cs";

export const translations = {
  en: {
    appTitle: "Voucher Tracker",
    appSubtitle: "Add vouchers and never miss an expiry again.",
    useVouchersSoon: "Use your vouchers soon",
    vouchersExpireWithin: (count: number) =>
      `${count} voucher${count !== 1 ? "s" : ""} expire within 30 days. Don't let them go to waste!`,
    daysLeft: (n: number) => (n === 1 ? "1 day left" : `${n} days left`),
    andMore: (n: number) => `…and ${n} more`,
    addVoucher: "Add voucher",
    addVoucherDescription:
      "Name and due date are required. Code, category and color are optional.",
    name: "Name",
    namePlaceholder: "e.g. Restaurant gift card",
    dueDate: "Due date",
    voucherCodeOptional: "Voucher code (optional)",
    codePlaceholder: "e.g. SAVE20",
    categoryOptional: "Category (optional)",
    none: "None",
    color: "Color",
    yourVouchers: "Your vouchers",
    yourVouchersDescription:
      "Sort, filter and search. Check a voucher to mark it as used and remove it.",
    searchPlaceholder: "Search by name or code...",
    allCategories: "All categories",
    allDates: "All dates",
    expiringIn30Days: "Expiring in 30 days",
    notExpired: "Not expired",
    sortDueDate: "Due date",
    sortName: "Name",
    noVouchersYet: "No vouchers yet. Add one above.",
    noVouchersMatchFilters: "No vouchers match your filters.",
    markAsUsedAndRemove: (name: string) => `Mark ${name} as used and remove`,
    remove: (name: string) => `Remove ${name}`,
    soon: "Soon",
    expired: "Expired",
    category: {
      food: "Food",
      retail: "Retail",
      travel: "Travel",
      entertainment: "Entertainment",
      other: "Other",
    },
  },
  cs: {
    appTitle: "Správce voucherů",
    appSubtitle: "Přidávejte vouchery a už nikdy nepromeškáte expiraci.",
    useVouchersSoon: "Využijte své vouchery brzy",
    vouchersExpireWithin: (count: number) => {
      if (count === 1) return "1 voucher vyprší do 30 dnů. Nenechte ho propadnout!";
      if (count >= 2 && count <= 4)
        return `${count} vouchery vyprší do 30 dnů. Nenechte je propadnout!`;
      return `${count} voucherů vyprší do 30 dnů. Nenechte je propadnout!`;
    },
    daysLeft: (n: number) => {
      if (n === 1) return "1 den zbývá";
      if (n >= 2 && n <= 4) return `${n} dny zbývají`;
      return `${n} dní zbývá`;
    },
    andMore: (n: number) => `…a dalších ${n}`,
    addVoucher: "Přidat voucher",
    addVoucherDescription:
      "Název a datum platnosti jsou povinné. Kód, kategorie a barva jsou volitelné.",
    name: "Název",
    namePlaceholder: "např. Dárková karta do restaurace",
    dueDate: "Datum platnosti",
    voucherCodeOptional: "Kód voucheru (volitelné)",
    codePlaceholder: "např. SAVE20",
    categoryOptional: "Kategorie (volitelné)",
    none: "Žádná",
    color: "Barva",
    yourVouchers: "Vaše vouchery",
    yourVouchersDescription:
      "Řazení, filtrování a vyhledávání. Zaškrtnutím označíte voucher jako použitý a odeberete ho.",
    searchPlaceholder: "Hledat podle názvu nebo kódu...",
    allCategories: "Všechny kategorie",
    allDates: "Všechna data",
    expiringIn30Days: "Vyprší do 30 dnů",
    notExpired: "Neexpirované",
    sortDueDate: "Datum platnosti",
    sortName: "Název",
    noVouchersYet: "Zatím nemáte žádné vouchery. Přidejte první výše.",
    noVouchersMatchFilters: "Žádné vouchery nevyhovují filtrům.",
    markAsUsedAndRemove: (name: string) =>
      `Označit ${name} jako použitý a odebrat`,
    remove: (name: string) => `Odebrat ${name}`,
    soon: "Brzy",
    expired: "Expirovaný",
    category: {
      food: "Jídlo",
      retail: "Maloobchod",
      travel: "Cestování",
      entertainment: "Zábava",
      other: "Jiné",
    },
  },
} as const;

export function useTranslations(locale: Locale = "cs") {
  return translations[locale];
}
