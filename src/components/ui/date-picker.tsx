import { useState, useEffect, useMemo, useCallback, useRef } from "react";
import {
  format,
  parse,
  isValid,
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  addDays,
  addMonths,
  subMonths,
  isSameMonth,
  isSameDay,
  isToday,
} from "date-fns";
import { cs, enUS } from "date-fns/locale";
import { CalendarIcon, ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

type DatePickerProps = {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  locale?: string;
  id?: string;
};

export function DatePicker({
  value,
  onChange,
  placeholder = "Pick a date",
  locale = "cs-CZ",
  id,
}: DatePickerProps) {
  const [open, setOpen] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const containerRef = useRef<HTMLDivElement>(null);

  const dateLocale = locale.startsWith("cs") ? cs : enUS;
  const dateFormat = locale.startsWith("cs") ? "d.M.yyyy" : "MM/dd/yyyy";
  const weekStartsOn = locale.startsWith("cs") ? 1 : 0;

  const selectedDate = value ? new Date(value) : undefined;
  const [viewMonth, setViewMonth] = useState(
    () => selectedDate ?? new Date()
  );

  useEffect(() => {
    if (selectedDate) setViewMonth(selectedDate);
  }, [value]);

  useEffect(() => {
    if (value) {
      const d = new Date(value);
      if (isValid(d)) {
        setInputValue(format(d, dateFormat, { locale: dateLocale }));
      }
    } else {
      setInputValue("");
    }
  }, [value, dateFormat, dateLocale]);

  useEffect(() => {
    if (!open) return;
    const handleClick = (e: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setOpen(false);
      }
    };
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("mousedown", handleClick);
    document.addEventListener("keydown", handleEscape);
    return () => {
      document.removeEventListener("mousedown", handleClick);
      document.removeEventListener("keydown", handleEscape);
    };
  }, [open]);

  const handleSelect = useCallback(
    (date: Date) => {
      onChange(format(date, "yyyy-MM-dd"));
      setOpen(false);
    },
    [onChange]
  );

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setInputValue(val);
    const parsed = parse(val, dateFormat, new Date());
    if (isValid(parsed) && parsed.getFullYear() > 2000) {
      onChange(format(parsed, "yyyy-MM-dd"));
    }
  };

  const handleInputBlur = () => {
    if (value) {
      const d = new Date(value);
      if (isValid(d)) {
        setInputValue(format(d, dateFormat, { locale: dateLocale }));
      }
    }
  };

  const weekDayNames = useMemo(() => {
    const start = startOfWeek(new Date(), {
      weekStartsOn: weekStartsOn as 0 | 1,
    });
    return Array.from({ length: 7 }, (_, i) =>
      format(addDays(start, i), "EEEEEE", { locale: dateLocale })
    );
  }, [dateLocale, weekStartsOn]);

  const calendarDays = useMemo(() => {
    const monthStart = startOfMonth(viewMonth);
    const monthEnd = endOfMonth(viewMonth);
    const calStart = startOfWeek(monthStart, {
      weekStartsOn: weekStartsOn as 0 | 1,
    });
    const calEnd = endOfWeek(monthEnd, {
      weekStartsOn: weekStartsOn as 0 | 1,
    });

    const days: Date[] = [];
    let day = calStart;
    while (day <= calEnd) {
      days.push(day);
      day = addDays(day, 1);
    }
    return days;
  }, [viewMonth, weekStartsOn]);

  return (
    <div ref={containerRef} className="relative">
      <div className="relative">
        <Input
          id={id}
          value={inputValue}
          onChange={handleInputChange}
          onBlur={handleInputBlur}
          onFocus={() => setOpen(true)}
          placeholder={placeholder}
          className="pr-10"
          autoComplete="off"
        />
        <button
          type="button"
          onClick={() => setOpen((o) => !o)}
          className={cn(
            "absolute right-0 top-0 flex h-full w-10 cursor-pointer items-center justify-center rounded-r-lg text-muted-foreground transition-colors hover:text-foreground",
            value && "text-foreground"
          )}
        >
          <CalendarIcon className="h-4 w-4" />
        </button>
      </div>

      {open && (
        <div className="absolute left-0 right-0 z-50 mt-2 animate-scale-in rounded-2xl border border-border/80 bg-popover p-3 shadow-2xl ring-1 ring-white/5 sm:left-auto sm:w-[320px]">
          <div className="mb-2 flex items-center justify-between">
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={() => setViewMonth((m) => subMonths(m, 1))}
              className="h-9 w-9"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <span className="text-sm font-semibold capitalize">
              {format(viewMonth, "LLLL yyyy", { locale: dateLocale })}
            </span>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={() => setViewMonth((m) => addMonths(m, 1))}
              className="h-9 w-9"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>

          <div className="grid grid-cols-7 gap-0.5">
            {weekDayNames.map((name, i) => (
              <div
                key={i}
                className="flex h-9 items-center justify-center text-xs font-medium text-muted-foreground"
              >
                {name}
              </div>
            ))}
            {calendarDays.map((day, i) => {
              const inMonth = isSameMonth(day, viewMonth);
              const selected = selectedDate && isSameDay(day, selectedDate);
              const today = isToday(day);

              return (
                <button
                  key={i}
                  type="button"
                  onClick={() => handleSelect(day)}
                  className={cn(
                    "flex h-10 cursor-pointer items-center justify-center rounded-lg text-sm font-normal transition-all duration-150",
                    !inMonth && "text-muted-foreground/40",
                    inMonth && "text-foreground hover:bg-accent",
                    today &&
                      !selected &&
                      "bg-accent font-medium text-accent-foreground",
                    selected &&
                      "bg-primary font-semibold text-primary-foreground shadow-sm hover:bg-primary/90"
                  )}
                >
                  {format(day, "d")}
                </button>
              );
            })}
          </div>

          <div className="mt-2 flex justify-end">
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => handleSelect(new Date())}
              className="text-xs text-muted-foreground"
            >
              {locale.startsWith("cs") ? "Dnes" : "Today"}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
