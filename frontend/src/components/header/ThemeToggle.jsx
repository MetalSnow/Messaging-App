import { Moon, Sun } from 'lucide-react';
import { useState } from 'react';

const ThemeToggle = () => {
  const [theme, setTheme] = useState(
    window.matchMedia('(prefers-color-scheme: dark)').matches
      ? 'dark'
      : 'light',
  );

  const handleToggle = () => {
    if (theme === 'dark') {
      setTheme('light');
    } else {
      setTheme('dark');
    }
  };

  return (
    <button onClick={handleToggle}>
      {theme == 'dark' ? <Moon /> : <Sun />}
    </button>
  );
};

export default ThemeToggle;
