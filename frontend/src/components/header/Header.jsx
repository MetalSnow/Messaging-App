import { Link } from 'react-router-dom';
import ThemeToggle from './ThemeToggle';
import { Rotate3d } from 'lucide-react';
import styles from './Header.module.css';
// import logo from '../../assets/logo.png';

const Header = () => {
  return (
    <>
      <header className={styles.header}>
        <h1>
          <img src="/icons/rippleLogo.svg" alt="ripple-logo" width={80} />
          <span>RippleChat</span>
        </h1>
        <nav>
          <ul>
            <li>
              <ThemeToggle />
            </li>
            <li>
              <Link to="/login">Login</Link>
            </li>
            <li>
              <Link to="/signup">Signup</Link>
            </li>
          </ul>
        </nav>
      </header>
    </>
  );
};

export default Header;
