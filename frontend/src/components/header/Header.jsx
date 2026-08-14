import { Link } from 'react-router-dom';
import ThemeToggle from './ThemeToggle';
import { Rotate3d } from 'lucide-react';
import styles from './Header.module.css';

const Header = () => {
  return (
    <>
      <header className={styles.header}>
        <Link to="/">
          <h1>
            <img src="/icons/rippleLogo.png" alt="ripple-logo" width={58} />
            <span>Ripple Chat</span>
          </h1>
        </Link>
        <ul>
          <li>
            <Link to="/login">Login</Link>
            <Link className={styles.signupBtn} to="/signup">
              Signup
            </Link>
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
