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
      <ul>
        <li>
          <Link to="/dashboard">
            <LayoutDashboard />
            Dashboard
          </Link>
        </li>
        <li>
          <Link to="/dashboard/messages">
            <MessageCircle />
            Messages
          </Link>
        </li>
        <li>
          <Link to="/dashboard/friends">
            <Users />
            Friends
          </Link>
        </li>
        <li>
          <Link>
            <UsersRound />
            Groups
          </Link>
        </li>
        <li>
          <Link>
            <Settings />
            Settings
          </Link>
        </li>
      </ul>
      <button>
        <Plus />
        New chat
      </button>
    </aside>
  );
};

export default Aside;
