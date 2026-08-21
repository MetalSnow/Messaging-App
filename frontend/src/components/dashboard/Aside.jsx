import { Link, useNavigate } from 'react-router-dom';
import styles from './Dashboard.module.css';
import {
  LayoutDashboard,
  MessageCircle,
  Users,
  Settings,
  Plus,
  LoaderCircle,
  LogOut,
} from 'lucide-react';
import usePost from '../../hooks/usePost';
import { useState } from 'react';
import Modal from '../modal/Modal';

const API_URL = import.meta.env.VITE_API_URL;

const Aside = ({ setUser }) => {
  const {
    postData: postLogOut,
    loading: loadingLogOut,
    error: errorLogOut,
  } = usePost(`${API_URL}/logout`);
  const [modalIsOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogOut = async () => {
    try {
      await postLogOut('POST');
      setUser(null);
      navigate('/');
    } catch (error) {
      console.error(error);
    }
  };
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
      <button onClick={() => setIsOpen(true)} className={styles.logoutBtn}>
        Log out <LogOut size={15} absoluteStrokeWidth />
      </button>
      <Modal modalIsOpen={modalIsOpen} closeModal={() => setIsOpen(false)}>
        <h2>Log out?</h2>
        <p>Are you sure you want to log out?</p>
        {errorLogOut ? (
          <p>Server error!</p>
        ) : loadingLogOut ? (
          <LoaderCircle className={styles.loader} />
        ) : (
          <button onClick={handleLogOut}>Log out</button>
        )}
      </Modal>
    </aside>
  );
};

export default Aside;
