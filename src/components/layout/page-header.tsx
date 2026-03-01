import { Ticket } from "lucide-react";

type PageHeaderProps = {
  title: string;
  subtitle: string;
  voucherCount: number;
};

export function PageHeader({ title, subtitle, voucherCount }: PageHeaderProps) {
  return (
    <header className="animate-fade-in-up flex items-center gap-4">
      <div className="relative flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-primary/15 text-primary shadow-sm">
        <Ticket className="h-7 w-7" />
        {voucherCount > 0 && (
          <span className="absolute -right-1.5 -top-1.5 flex h-5 min-w-5 items-center justify-center rounded-full bg-primary px-1 text-[10px] font-bold text-primary-foreground shadow-sm">
            {voucherCount}
          </span>
        )}
      </div>
      <div>
        <h1 className="text-2xl font-bold tracking-tight">{title}</h1>
        <p className="text-sm text-muted-foreground">{subtitle}</p>
      </div>
    </header>
  );
}
