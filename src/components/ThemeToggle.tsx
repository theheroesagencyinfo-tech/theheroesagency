import { Moon, Sun } from "lucide-react";
import { motion } from "framer-motion";
import { useTheme } from "@/components/ThemeProvider";
import { cn } from "@/lib/utils";

interface ThemeToggleProps {
  className?: string;
}

export function ThemeToggle({ className }: ThemeToggleProps) {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === "dark";

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
      className={cn(
        "relative inline-flex items-center w-14 h-7 rounded-full glass border border-primary/30 px-1 transition-colors",
        className,
      )}
    >
      <motion.span
        layout
        transition={{ type: "spring", stiffness: 500, damping: 30 }}
        className="inline-flex items-center justify-center w-5 h-5 rounded-full gradient-gold text-primary-foreground shadow"
        style={{ marginLeft: isDark ? "auto" : 0 }}
      >
        {isDark ? <Moon className="w-3 h-3" /> : <Sun className="w-3 h-3" />}
      </motion.span>
    </button>
  );
}
