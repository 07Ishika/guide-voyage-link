import { Sun, Moon } from "lucide-react";
import { useTheme } from "../hooks/useTheme";

const ThemeToggle = ({ className = "" }) => {
  const { isDark, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className={`backdrop-blur-md bg-black/5 dark:bg-black/20 border border-black/10 dark:border-white/10 shadow-soft hover:bg-black/10 dark:hover:bg-white/10 transition-colors rounded-full w-10 h-10 sm:w-11 sm:h-11 flex items-center justify-center ${className}`}
      aria-label="Toggle theme"
    >
      {isDark ? <Sun className="h-5 w-5 text-white" /> : <Moon className="h-5 w-5 text-black" />}
    </button>
  );
};

export default ThemeToggle;

