import {
  ArrowLeft,
  ArrowRightIcon,
  MessageCircleMore,
  Rotate3d,
  ShieldCheck,
  UsersRound,
  Zap,
} from 'lucide-react';
import Header from '../header/Header';
import styles from './HomePage.module.css';
import { Link, useParams } from 'react-router-dom';
import Signup from '../auth/Signup';
import Login from '../auth/Login';

const HomePage = () => {
  const { name } = useParams();
  return (
    <>
      <Header>
        <ul>
          <li>
            <Link to="/login">Login</Link>
          </li>
          <li>
            <Link to="/signup">Signup</Link>
          </li>
        </ul>
      </Header>
      {name === 'signup' ? (
        <Signup />
      ) : name === 'login' ? (
        <Login />
      ) : (
        <main className={styles.main}>
          <div>
            <img src="/icons/rippleLogo.png" alt="" width={100} />
            <h1>Ripple Chat</h1>
            <p>Connect with friends and grow your network.</p>
            <p>
              A modern messaging platform designed for smooth conversations,
              real-time connections, and meaningful interactions—all in one
              place. Stay close, chat instantly, and let every message create a
              ripple.
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
      )}
    </>
  );
};

export default HomePage;
