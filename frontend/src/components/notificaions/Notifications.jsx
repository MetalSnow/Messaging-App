import usePost from '../../hooks/usePost';
import { Link } from 'react-router-dom';
import {
  Check,
  LoaderCircle,
  LoaderCircleIcon,
  LoaderIcon,
  X,
} from 'lucide-react';

const API_URL = import.meta.env.VITE_API_URL;

const Notifications = ({
  fetchFriendList,
  setFriendList,
  notifRef,
  requests,
  setRequests,
  fetchData,
  error,
  loading,
}) => {
  const {
    postData,
    loading: loadingPost,
    error: errorPost,
  } = usePost(`${API_URL}/friend-requests/`);

  const handleReq = async (senderId, method) => {
    try {
      await postData(method, undefined, senderId);
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
    <ul ref={notifRef}>
      {error ? (
        <p>Server error occured.</p>
      ) : loading ? (
        <LoaderCircle />
      ) : requests.length === 0 ? (
        <p>No friend requests</p>
      ) : (
        requests.map((req) => (
          <li key={req.id}>
            <Link to={`/profile/${req.username}`}>
              <img width={40} src={req.profile?.profilePic} alt="profilePic" />
              <p>{req.username}</p>
            </Link>
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
