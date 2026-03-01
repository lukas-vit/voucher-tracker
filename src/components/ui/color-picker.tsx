import { cn } from "@/lib/utils";
import { Check } from "lucide-react";

const PRESET_COLORS = [
  "#ef4444",
  "#f97316",
  "#f59e0b",
  "#eab308",
  "#84cc16",
  "#22c55e",
  "#10b981",
  "#14b8a6",
  "#06b6d4",
  "#0ea5e9",
  "#3b82f6",
  "#6366f1",
  "#8b5cf6",
  "#a855f7",
  "#d946ef",
  "#ec4899",
  "#f43f5e",
  "#78716c",
  "#6b7280",
  "#64748b",
] as const;

type ColorPickerProps = {
  value: string;
  onChange: (color: string) => void;
  label?: string;
};

export function ColorPicker({ value, onChange, label }: ColorPickerProps) {
  return (
    <div className="space-y-2">
      {label && (
        <span className="text-sm font-medium leading-none">{label}</span>
      )}
      <div className="flex flex-wrap gap-1.5">
        {PRESET_COLORS.map((color) => (
          <button
            key={color}
            type="button"
            onClick={() => onChange(color)}
            className={cn(
              "flex h-7 w-7 items-center justify-center rounded-full transition-all hover:scale-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
              value === color && "ring-2 ring-ring ring-offset-2"
            )}
            style={{ backgroundColor: color }}
            aria-label={color}
          >
            {value === color && (
              <Check className="h-3.5 w-3.5 text-white drop-shadow-sm" />
            )}
          </button>
        ))}
      </div>
    </div>
  );
}

export { PRESET_COLORS };
