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
import { Outlet, useParams, Link } from 'react-router-dom';
import Friends from '../friends/Friends';
import ErrorPage from '../../error/ErrorPage';
import Conversation from '../messages/Conversation';
import Profile from '../profile/Profile';
import Settings from '../settings/Settings';
import Notifications from '../notificaions/Notifications';

const API_URL = import.meta.env.VITE_API_URL;

const Dashboard = () => {
  const { fetchData, error, loading } = useFetch(`${API_URL}/user`);
  const {
    fetchData: fetchFriendList,
    error: friendListError,
    loading: friendListLoading,
  } = useFetch(`${API_URL}/friends`);
  const [friendList, setFriendList] = useState([]);
  const [user, setUser] = useState(null);
  const { name, username } = useParams();

  useEffect(() => {
    const getUserData = async () => {
      try {
        const userData = await fetchData();
        setUser(userData);
        const friends = await fetchFriendList('GET');
        setFriendList(friends);
      } catch (error) {
        console.error(error);
      }
    };
    getUserData();
  }, [fetchData, fetchFriendList]);

  const validPages = [
    'dashboard',
    'friends',
    'messages',
    'profile',
    'settings',
  ];

  if (name && !validPages.includes(name)) return <ErrorPage />;
  if (name === 'profile' && !username) return <ErrorPage />;

  if (error) return <p>{error.message}</p>;

  return (
    <>
      {loading ? (
        <LoaderCircle />
      ) : (
        <div className={styles.dashBoard}>
          <header>
            <h1>
              <img src="/icons/rippleLogo.png" alt="ripple-logo" width={80} />
              <span>RippleChat</span>
            </h1>
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
                <Notifications />
              </li>
              <li>
                <Link to={`/profile/${user?.username}`}>
                  <CircleUserRound />
                  <span>{user?.username}</span>
                </Link>
              </li>
              <li>
                <ThemeToggle />
              </li>
            </ul>
          </header>
          <main>
            <Aside />
            {name === 'friends' ? (
              <Friends
                setFriendList={setFriendList}
                friendList={friendList}
                fetchData={fetchFriendList}
                error={friendListError}
                loading={friendListLoading}
              />
            ) : name === 'messages' ? (
              <Conversation
                user={user}
                friendList={friendList}
                friendListError={friendListError}
                friendListLoading={friendListLoading}
              />
            ) : name === 'profile' && username ? (
              <Profile
                friendList={friendList}
                user={user}
                fetchData={fetchFriendList}
                setFriendList={setFriendList}
              />
            ) : name === 'settings' ? (
              <Settings user={user} setUser={setUser} />
            ) : (
              <div>
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

                  <Link to="/messages">
                    <Plus size={18} />
                    Start New Chat
                  </Link>
                  <img
                    src="/icons/rippleLogo.png"
                    alt="ripple-logo"
                    width={100}
                  />
                </div>
              </div>
            )}
          </main>
        </div>
      )}
    </>
  );
};

export default Dashboard;
