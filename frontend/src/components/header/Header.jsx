import { Link } from 'react-router-dom';
import ThemeToggle from './ThemeToggle';
import { Rotate3d } from 'lucide-react';
import styles from './Header.module.css';

const Header = () => {
  return (
    <>
      <header className={styles.header}>
        <h1>
          <img src="/icons/rippleLogo.png" alt="ripple-logo" width={80} />
          <span>RippleChat</span>
        </h1>
        <ul>
          <li>
            <Link to="/login">Login</Link>
          </li>
          <li>
            <Link to="/signup">Signup</Link>
          </li>
          <li>
            <ThemeToggle />
          </li>
        </ul>
      </header>
    </>
  );
};

export default Header;
