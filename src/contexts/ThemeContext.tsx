
import React, { createContext, useContext, useEffect, useState } from 'react';

// Define available theme options
export type Theme = 'light' | 'dark' | 'system' | 'purple' | 'blue' | 'green';

interface ThemeContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

// CSS variables for different themes
const themeStyles = {
  light: {
    '--background': '210 20% 98%',
    '--foreground': '220 20% 10%',
    '--card': '0 0% 100%',
    '--card-foreground': '220 20% 10%',
    '--popover': '0 0% 100%',
    '--popover-foreground': '220 20% 10%',
    '--primary': '220 70% 50%',
    '--primary-rgb': '34, 100, 204',
    '--primary-foreground': '210 20% 98%',
    '--secondary': '220 20% 96%',
    '--secondary-foreground': '220 20% 10%',
    '--muted': '220 20% 96%',
    '--muted-foreground': '220 10% 40%',
    '--accent': '220 70% 50%',
    '--accent-foreground': '210 20% 98%',
    '--destructive': '0 85% 60%',
    '--destructive-foreground': '210 20% 98%',
    '--border': '220 20% 90%',
    '--input': '220 20% 90%',
    '--ring': '220 70% 50%',
  },
  dark: {
    '--background': '220 20% 8%',
    '--foreground': '210 20% 98%',
    '--card': '224 25% 12%',
    '--card-foreground': '210 20% 98%',
    '--popover': '224 25% 12%',
    '--popover-foreground': '210 20% 98%',
    '--primary': '210 70% 60%',
    '--primary-rgb': '82, 146, 247',
    '--primary-foreground': '220 20% 10%',
    '--secondary': '215 25% 18%',
    '--secondary-foreground': '210 20% 98%',
    '--muted': '215 25% 18%',
    '--muted-foreground': '220 10% 70%',
    '--accent': '210 70% 60%',
    '--accent-foreground': '220 20% 10%',
    '--destructive': '0 70% 60%',
    '--destructive-foreground': '210 20% 98%',
    '--border': '215 25% 25%',
    '--input': '215 25% 25%',
    '--ring': '210 70% 60%',
  },
  purple: {
    '--background': '252 20% 98%',
    '--foreground': '250 20% 10%',
    '--card': '0 0% 100%',
    '--card-foreground': '250 20% 10%',
    '--popover': '0 0% 100%',
    '--popover-foreground': '250 20% 10%',
    '--primary': '265 83% 45%',
    '--primary-rgb': '124, 58, 237',
    '--primary-foreground': '252 20% 98%',
    '--secondary': '250 20% 96%',
    '--secondary-foreground': '250 20% 10%',
    '--muted': '250 20% 96%',
    '--muted-foreground': '250 10% 40%',
    '--accent': '265 83% 45%',
    '--accent-foreground': '252 20% 98%',
    '--destructive': '0 85% 60%',
    '--destructive-foreground': '252 20% 98%',
    '--border': '250 20% 90%',
    '--input': '250 20% 90%',
    '--ring': '265 83% 45%',
  },
  green: {
    '--background': '160 20% 98%',
    '--foreground': '170 20% 10%',
    '--card': '0 0% 100%',
    '--card-foreground': '170 20% 10%',
    '--popover': '0 0% 100%',
    '--popover-foreground': '170 20% 10%',
    '--primary': '142 76% 36%',
    '--primary-rgb': '34, 197, 94',
    '--primary-foreground': '160 20% 98%',
    '--secondary': '170 20% 96%',
    '--secondary-foreground': '170 20% 10%',
    '--muted': '170 20% 96%',
    '--muted-foreground': '170 10% 40%',
    '--accent': '142 76% 36%',
    '--accent-foreground': '160 20% 98%',
    '--destructive': '0 85% 60%',
    '--destructive-foreground': '160 20% 98%',
    '--border': '170 20% 90%',
    '--input': '170 20% 90%',
    '--ring': '142 76% 36%',
  },
  blue: {
    '--background': '210 20% 98%',
    '--foreground': '220 20% 10%',
    '--card': '0 0% 100%',
    '--card-foreground': '220 20% 10%',
    '--popover': '0 0% 100%',
    '--popover-foreground': '220 20% 10%',
    '--primary': '217 91% 60%',
    '--primary-rgb': '59, 130, 246',
    '--primary-foreground': '210 20% 98%',
    '--secondary': '220 20% 96%',
    '--secondary-foreground': '220 20% 10%',
    '--muted': '220 20% 96%',
    '--muted-foreground': '220 10% 40%',
    '--accent': '217 91% 60%',
    '--accent-foreground': '210 20% 98%',
    '--destructive': '0 85% 60%',
    '--destructive-foreground': '210 20% 98%',
    '--border': '220 20% 90%',
    '--input': '220 20% 90%',
    '--ring': '217 91% 60%',
  },
};

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setThemeState] = useState<Theme>(() => {
    const savedTheme = localStorage.getItem('theme') as Theme;
    return savedTheme || 'system';
  });

  const setTheme = (theme: Theme) => {
    setThemeState(theme);
    localStorage.setItem('theme', theme);
  };

  useEffect(() => {
    const root = window.document.documentElement;
    
    // Handle system theme
    if (theme === 'system') {
      const isDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      root.classList.remove('light', 'dark', 'purple', 'green', 'blue');
      root.classList.add(isDark ? 'dark' : 'light');
      
      // Apply appropriate CSS variables
      applyThemeVariables(isDark ? 'dark' : 'light');
    } else {
      // For explicit themes
      root.classList.remove('light', 'dark', 'purple', 'green', 'blue');
      
      if (theme === 'light' || theme === 'dark') {
        root.classList.add(theme);
      } else {
        // For color themes, add the base theme class plus color variables
        root.classList.add('light'); // Use light as base for colored themes
      }
      
      // Apply the CSS variables for the selected theme
      applyThemeVariables(theme);
    }
  }, [theme]);

  // Apply theme CSS variables to document root
  const applyThemeVariables = (themeName: string) => {
    const root = window.document.documentElement;
    const themeVars = themeStyles[themeName as keyof typeof themeStyles] || themeStyles.light;
    
    // Apply all theme variables
    Object.entries(themeVars).forEach(([property, value]) => {
      root.style.setProperty(property, value as string);
    });
  };

  // Listen for system theme changes
  useEffect(() => {
    if (theme === 'system') {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      
      const handleChange = () => {
        const root = window.document.documentElement;
        root.classList.remove('light', 'dark', 'purple', 'green', 'blue');
        root.classList.add(mediaQuery.matches ? 'dark' : 'light');
        
        // Apply theme variables
        applyThemeVariables(mediaQuery.matches ? 'dark' : 'light');
      };
      
      mediaQuery.addEventListener('change', handleChange);
      return () => mediaQuery.removeEventListener('change', handleChange);
    }
  }, [theme]);

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
