import { useEffect, useState } from 'react';
import useFetch from '../../hooks/useFetch';
import { LoaderCircle } from 'lucide-react';

const API_URL = import.meta.env.VITE_API_URL;

const Friends = () => {
  const { fetchData, error, loading } = useFetch(`${API_URL}/friends`);
  const [friendList, setFriendList] = useState([]);

  useEffect(() => {
    const getFriends = async () => {
      try {
        const data = await fetchData();
        setFriendList(data);
      } catch (error) {
        console.error(error);
      }
    };
    getFriends();
  }, [fetchData]);

  if (error) return <p>Server error occured!</p>;
  return (
    <>
      <h2>Friend list</h2>
      {loading ? (
        <LoaderCircle />
      ) : (
        <ul>
          {friendList.map((friend) => (
            <li key={friend.id}>{friend.username}</li>
          ))}
        </ul>
      )}
    </>
  );
};

export default Friends;
