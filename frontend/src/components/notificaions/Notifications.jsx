import { useEffect, useState } from 'react';
import useFetch from '../../hooks/useFetch';
import usePost from '../../hooks/usePost';
import {
  Check,
  LoaderCircle,
  LoaderCircleIcon,
  LoaderIcon,
  X,
} from 'lucide-react';

const API_URL = import.meta.env.VITE_API_URL;

const Notifications = ({ fetchFriendList, setFriendList }) => {
  const { fetchData, loading, error } = useFetch(`${API_URL}/friend-requests`);
  const {
    postData,
    loading: loadingPost,
    error: errorPost,
  } = usePost(`${API_URL}/friend-requests/`);
  const [requests, setRequests] = useState([]);

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

  const handleReq = async (senderId, method) => {
    try {
      const res = await postData(method, undefined, senderId);
      console.log(res);
      //Update the UI
      const reqs = await fetchData('GET');
      setRequests(reqs);
      const friendList = await fetchFriendList('GET');
      setFriendList(friendList);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <ul>
      {error ? (
        <p>Server error occured.</p>
      ) : loading ? (
        <LoaderCircle />
      ) : (
        requests.map((req) => (
          <li key={req.id}>
            <p>{req.username}</p>
            <span>Sent you a friend request</span>
            {errorPost ? (
              <p>Server Error!</p>
            ) : loadingPost ? (
              <LoaderCircle />
            ) : (
              <>
                <button onClick={() => handleReq(req.id, 'PATCH')}>
                  Accepte <Check />
                </button>
                <button onClick={() => handleReq(req.id, 'DELETE')}>
                  Decline <X />
                </button>
              </>
            )}
          </li>
        ))
      )}
    </ul>
  );
};

export default Notifications;
