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
import { useContext, useEffect, useRef, useState } from 'react';
import styles from './Dashboard.module.css';
import Aside from './Aside';
import ThemeToggle from '../header/ThemeToggle';
import { Outlet, useParams, Link, Navigate } from 'react-router-dom';
import Friends from '../friends/Friends';
import ErrorPage from '../../error/ErrorPage';
import Conversation from '../messages/Conversation';
import Profile from '../profile/Profile';
import Settings from '../settings/Settings';
import Notifications from '../notificaions/Notifications';
import SearchBar from '../searchBar/SearchBar';
import AuthContext from '../../context/AuthContext';

const API_URL = import.meta.env.VITE_API_URL;

const Dashboard = () => {
  const { user, setUser, checking } = useContext(AuthContext);
  const {
    fetchData: fetchFriendList,
    error: friendListError,
    loading: friendListLoading,
  } = useFetch(`${API_URL}/friends`);
  const { fetchData: fetchProfile } = useFetch(
    `${API_URL}/profile/${user?.username}`,
  );
  const { fetchData, loading, error } = useFetch(`${API_URL}/friend-requests`);
  const [friendList, setFriendList] = useState([]);
  const { name, username } = useParams();
  const [notifToggle, setNotifToggle] = useState(false);
  const [searchInput, setSearchInput] = useState('');
  const notifRef = useRef(null);
  const [avatarUrl, setAvatarUrl] = useState(null);
  const [requests, setRequests] = useState([]);

  useEffect(() => {
    const getUserData = async () => {
      try {
        const friends = await fetchFriendList('GET');
        setFriendList(friends);
      } catch (error) {
        console.error(error);
      }
    };
    getUserData();
  }, [fetchFriendList]);

  useEffect(() => {
    if (!user?.username) return;
    const getProfileData = async () => {
      try {
        const profile = await fetchProfile('GET');
        setAvatarUrl(profile?.profilePic);
      } catch (error) {
        console.error(error);
      }
    };
    getProfileData();
  }, [fetchProfile, user?.username]);

  useEffect(() => {
    if (!notifToggle) return;

    const handleClickOutside = (e) => {
      if (notifRef.current && !notifRef.current.contains(e.target)) {
        setNotifToggle(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [notifToggle]);

  useEffect(() => {
    const getNotif = async () => {
      try {
        const reqs = await fetchData('GET');
        setRequests(reqs);
      } catch (error) {
        console.error(error);
      }
    };
    getNotif();
  }, [fetchData]);

  const validPages = [
    'dashboard',
    'friends',
    'messages',
    'profile',
    'settings',
  ];

  if (name && !validPages.includes(name)) return <ErrorPage />;
  if (name === 'profile' && !username) return <ErrorPage />;

  if (!checking && !user) {
    return <Navigate to="/login" replace />;
  }

  return (
    <>
      {checking ? (
        <LoaderCircle />
      ) : (
        <div className={styles.dashBoard}>
          <Aside />
          <div className={styles.contentArea}>
            <header>
              <div>
                <label htmlFor="q">
                  <Search size={18} strokeWidth={3} />
                  <input
                    type="search"
                    name="q"
                    id="q"
                    placeholder="Search users..."
                    value={searchInput}
                    onChange={(e) => setSearchInput(e.target.value)}
                  />
                </label>

                <SearchBar searchInput={searchInput} />
              </div>

              <ul>
                <li>
                  <button
                    className={styles.notifBtn}
                    onClick={() =>
                      notifToggle ? setNotifToggle(false) : setNotifToggle(true)
                    }
                  >
                    <Bell size={16} strokeWidth={2} absoluteStrokeWidth />
                    <span>{requests.length}</span>
                  </button>
                  {notifToggle && (
                    <Notifications
                      setFriendList={setFriendList}
                      fetchFriendList={fetchFriendList}
                      requests={requests}
                      setRequests={setRequests}
                      fetchData={fetchData}
                      error={error}
                      loading={loading}
                    />
                  )}
                </li>
                <li>
                  <Link to={`/profile/${user?.username}`}>
                    <div>
                      <img src={avatarUrl} alt="avatar" />
                      <span className={styles.status}></span>
                    </div>
                    <span>{user?.username}</span>
                  </Link>
                </li>
                <li>
                  <ThemeToggle />
                </li>
              </ul>
            </header>
            <main>
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
        </div>
      )}
    </>
  );
};

export default Dashboard;
