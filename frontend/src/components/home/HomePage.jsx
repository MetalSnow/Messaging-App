import {
  ArrowRightIcon,
  LoaderCircle,
  MessageCircleMore,
  ShieldCheck,
  UsersRound,
  Zap,
} from 'lucide-react';
import styles from './HomePage.module.css';
import { Link, Navigate } from 'react-router-dom';
import { useContext } from 'react';
import AuthContext from '../../context/AuthContext';

const HomePage = () => {
  const { user, checking } = useContext(AuthContext);

  if (!checking && user) {
    return <Navigate to="/dashboard" replace />;
  }

  if (checking) return <LoaderCircle />;
  return (
    <main className={styles.main}>
      <div>
        <img src="/icons/rippleLogo.png" alt="" width={100} />
        <h1>Ripple Chat</h1>
        <p>Connect with friends and grow your network.</p>
        <p>
          A modern messaging platform designed for smooth conversations,
          real-time connections, and meaningful interactions—all in one place.
          Stay close, chat instantly, and let every message create a ripple.
        </p>
        <button>
          Start Chatting <ArrowRightIcon />
        </button>
      </div>
      <ul>
        <li>
          <MessageCircleMore color="#a875ef" />
          Real-time Messaging
        </li>
        <li>
          <ShieldCheck color="#75efa4" />
          End-to-End Encryption
        </li>
        <li>
          <UsersRound color="#5cbff1" />
          Build Your Network
        </li>
        <li>
          <Zap color="#a875ef" />
          Fast, Secure & Reliable
        </li>
      </ul>
    </main>
  );
};

export default HomePage;
