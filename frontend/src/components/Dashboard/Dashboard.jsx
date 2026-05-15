import {
  Bell,
  CircleUserRound,
  HeartHandshake,
  LoaderCircle,
  MessageCircle,
  Plus,
  Search,
  Users,
} from 'lucide-react';
import useFetch from '../../hooks/useFetch';
import { useEffect, useState } from 'react';
import styles from './Dashboard.module.css';
import Aside from './Aside';
import ThemeToggle from '../header/ThemeToggle';

const API_URL = import.meta.env.VITE_API_URL;

const Dashboard = () => {
  const { fetchData, error, loading } = useFetch(`${API_URL}/user`);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const getUserData = async () => {
      try {
        const data = await fetchData();
        setUser(data);
      } catch (error) {
        console.error(error);
      }
    };
    getUserData();
  }, [fetchData]);

  if (error) return <p>{error.message}</p>;

  return (
    <>
      {loading ? (
        <LoaderCircle />
      ) : (
        <>
          <header>
            <label htmlFor="q">
              <Search />
              <input
                type="search"
                name="q"
                id="q"
                placeholder="Search users..."
              />
            </label>
            <ul>
              <li>
                <button>
                  <Bell />
                </button>
              </li>
              <li>
                <button>
                  <CircleUserRound />
                  <span>{user?.username}</span>
                </button>
              </li>
              <li>
                <ThemeToggle />
              </li>
            </ul>
          </header>
          <div className={styles.container}>
            <main>
              <div>
                <h1>
                  Welcome back, {user?.username} <HeartHandshake />
                </h1>
                <p>Here's what's happening with your network today.</p>
              </div>
              <div>
                <div>
                  <MessageCircle size={18} />
                  <span>12 unread messages</span>
                </div>

                <div>
                  <Users size={18} />
                  <span>3 active groups</span>
                </div>

                <button>
                  <Plus size={18} />
                  Start New Chat
                </button>
                <img
                  src="/icons/rippleLogo.png"
                  alt="ripple-logo"
                  width={100}
                />
              </div>
            </main>
            <Aside />
          </div>
        </>
      )}
    </>
  );
};

export default Dashboard;
