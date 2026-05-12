import { Bell, LoaderCircle, Search, User2Icon } from 'lucide-react';
import Header from '../header/Header';
import useFetch from '../../hooks/useFetch';
import { useEffect, useState } from 'react';

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

  if (error) return <p>Server error occured!</p>;

  return (
    <>
      {loading ? (
        <LoaderCircle />
      ) : (
        <Header>
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
                <User2Icon />
                <span>{user?.username}</span>
              </button>
            </li>
          </ul>
        </Header>
      )}
    </>
  );
};

export default Dashboard;
