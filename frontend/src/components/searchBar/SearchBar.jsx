import { useEffect } from 'react';
import useFetch from '../../hooks/useFetch';
import { useState } from 'react';
import { LoaderCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

const API_URL = import.meta.env.VITE_API_URL;

const SearchBar = ({ searchInput }) => {
  const { fetchData, error, loading } = useFetch(
    `${API_URL}/users?q=${searchInput}`,
  );
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const timeoutId = setTimeout(async () => {
      if (!searchInput) {
        setUsers([]);
        return;
      }

      try {
        const res = await fetchData('GET');
        setUsers(res);
      } catch (err) {
        console.error(err);
      }
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [searchInput, fetchData]);

  return (
    <ul>
      {error ? (
        <p>Server error occured!</p>
      ) : loading ? (
        <LoaderCircle />
      ) : users.length === 0 && searchInput !== '' ? (
        <p>No users found</p>
      ) : (
        users.map((user) => (
          <li key={user.id}>
            <Link to={`/profile/${user.username}`}>
              <img width={40} src={user.profile?.profilePic} alt="profilePic" />
              <p>{user.name || user.username}</p>
            </Link>
          </li>
        ))
      )}
    </ul>
  );
};

export default SearchBar;
