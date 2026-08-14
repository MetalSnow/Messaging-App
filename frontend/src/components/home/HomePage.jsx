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
import bubbleLeft from '../../assets/bubble-left.png';
import bubbleRight from '../../assets/bubble-right.png';

const HomePage = () => {
  const { user, checking } = useContext(AuthContext);

  if (!checking && user) {
    return <Navigate to="/dashboard" replace />;
  }

  if (checking) return <LoaderCircle />;
  return (
    <main className={styles.main}>
      <div>
        <img src="/icons/rippleLogo.png" alt="" width={120} />
        <h1>Ripple Chat</h1>
        <p>Connect with friends and grow your network.</p>
        <p className={styles.bio}>
          A modern messaging platform designed for smooth conversations,
          real-time connections, and meaningful interactions, all in one place.
          Stay close, chat instantly, and let every message create a ripple.
        </p>
        <Link to="/login">
          Start Chatting <ArrowRightIcon size={20} />
        </Link>
      </div>
      <ul>
        <li>
          <MessageCircleMore
            color="#a875ef"
            size={35}
            strokeWidth={3}
            absoluteStrokeWidth
          />
          Real-time Messaging
        </li>
        <li>
          <ShieldCheck color="#75efa4" size={35} strokeWidth={3} />
          End-to-End Encryption
        </li>
        <li>
          <UsersRound color="#5cbff1" size={35} strokeWidth={3} />
          Build Your Network
        </li>
        <li>
          <Zap color="#a875ef" size={35} strokeWidth={3} />
          Fast, Secure & Reliable
        </li>
      </ul>
      <img className={styles.bubbleLeft} src={bubbleLeft} alt="bubble-left" />
      <img
        className={styles.bubbleRight}
        src={bubbleRight}
        alt="bubble-right"
      />
    </main>
  );
};

export default HomePage;
