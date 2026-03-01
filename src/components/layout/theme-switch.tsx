import { Moon, Sun } from "lucide-react";
import { useTheme } from "@/hooks/use-theme";
import { Switch } from "@/components/ui/switch";
import { cn } from "@/lib/utils";

type ThemeSwitchProps = {
  themeLabel: string;
  lightMode: string;
  darkMode: string;
  themeSwitchAria: string;
  className?: string;
};

export function ThemeSwitch({
  themeLabel,
  lightMode,
  darkMode,
  themeSwitchAria,
  className,
}: ThemeSwitchProps) {
  const { isDark, setTheme } = useTheme();

  const handleCheckedChange = (checked: boolean) => {
    setTheme(checked ? "dark" : "light");
  };

  return (
    <div
      className={cn("flex items-center gap-2", className)}
      role="group"
      aria-label={themeLabel}
    >
      <Sun
        className="h-4 w-4 text-muted-foreground"
        aria-hidden
      />
      <Switch
        checked={isDark}
        onCheckedChange={handleCheckedChange}
        aria-label={themeSwitchAria}
        title={isDark ? darkMode : lightMode}
      />
      <Moon
        className="h-4 w-4 text-muted-foreground"
        aria-hidden
      />
    </div>
  );
}
