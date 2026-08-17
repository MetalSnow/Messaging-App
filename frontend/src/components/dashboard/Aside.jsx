import { Link } from 'react-router-dom';
import styles from './Dashboard.module.css';
import {
  LayoutDashboard,
  MessageCircle,
  Users,
  UsersRound,
  Settings,
  Plus,
} from 'lucide-react';

const Aside = () => {
  return (
    <aside className={styles.aside}>
      <h1>
        <img src="/icons/rippleLogo.png" alt="ripple-logo" width={65} />
        <span>RippleChat</span>
      </h1>
      <ul>
        <li>
          <Link to="/dashboard">
            <LayoutDashboard />
            Dashboard
          </Link>
        </li>
        <li>
          <Link to="/messages">
            <MessageCircle />
            Messages
          </Link>
        </li>
        <li>
          <Link to="/friends">
            <Users />
            Friends
          </Link>
        </li>
        <li>
          <Link to="/settings">
            <Settings />
            Settings
          </Link>
        </li>
      </ul>
      <Link to="/messages" className={styles.newChatBtn}>
        <Plus />
        New chat
      </Link>
    </aside>
  );
};

export default Aside;
