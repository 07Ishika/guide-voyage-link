import { useState, useEffect } from 'react';

export const useTheme = () => {
  const [isDark, setIsDark] = useState(true);

  const toggleTheme = () => {
    const newIsDark = !isDark;
    setIsDark(newIsDark);
    document.documentElement.classList.toggle("dark");
    // Store theme preference in localStorage
    localStorage.setItem('theme', newIsDark ? 'dark' : 'light');
  };

  useEffect(() => {
    // Initialize based on localStorage, existing class, or system preference
    const storedTheme = localStorage.getItem('theme');
    const hasDarkClass = document.documentElement.classList.contains("dark");
    const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    let nextIsDark;
    if (storedTheme) {
      nextIsDark = storedTheme === 'dark';
    } else {
      nextIsDark = hasDarkClass || prefersDark;
    }
    
    setIsDark(nextIsDark);
    
    if (nextIsDark && !hasDarkClass) {
      document.documentElement.classList.add("dark");
    } else if (!nextIsDark && hasDarkClass) {
      document.documentElement.classList.remove("dark");
    }
  }, []);

  return { isDark, toggleTheme };
};

