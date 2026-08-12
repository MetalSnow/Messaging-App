import { Moon, Sun } from 'lucide-react';
import { useEffect, useState } from 'react';
import styles from './Header.module.css';

const getInitialTheme = () => {
  const saved = localStorage.getItem('theme');
  if (saved === 'light' || saved === 'dark') return saved;
  return window.matchMedia('(prefers-color-scheme: dark)').matches
    ? 'dark'
    : 'light';
};

const ThemeToggle = () => {
  const [theme, setTheme] = useState(getInitialTheme);

  useEffect(() => {
    document.documentElement.style.colorScheme = theme;
    localStorage.setItem('theme', theme);
  }, [theme]);

  return (
    <button
      type="button"
      className={styles.themeToggle}
      role="switch"
      aria-checked={theme === 'dark'}
      aria-label="Switch to light mode"
      onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
    >
      <span className={styles.toggle__icons} aria-hidden="true">
        <Moon strokeWidth={2.3} size={15} absoluteStrokeWidth color="#c6b1de" />
        <Sun strokeWidth={2.3} size={15} absoluteStrokeWidth color="#7b3ac5" />
      </span>
      <span className={styles.toggle__knob} aria-hidden="true" />
    </button>
  );
};

export default ThemeToggle;
