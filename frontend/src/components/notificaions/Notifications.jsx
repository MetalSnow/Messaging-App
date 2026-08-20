import usePost from '../../hooks/usePost';
import { Link } from 'react-router-dom';
import { Check, LoaderCircle, X } from 'lucide-react';
import styles from './Notifications.module.css';

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
  const { postData } = usePost(`${API_URL}/friend-requests/`);

  const handleReq = async (senderId, method) => {
    setRequests((prev) =>
      prev.map((req) =>
        req.id === senderId ? { ...req, loading: true, error: null } : req,
      ),
    );
    try {
      await postData(method, undefined, senderId);
      //Update the UI
      const reqs = await fetchData('GET');
      setRequests(reqs);
      const friendList = await fetchFriendList('GET');
      setFriendList(friendList);
      // eslint-disable-next-line no-unused-vars
    } catch (error) {
      setRequests((prev) =>
        prev.map((req) =>
          req.id === senderId
            ? { ...req, loading: false, error: 'Server error!' }
            : req,
        ),
      );
    }
  };

  return (
    <ul ref={notifRef} className={styles.notif}>
      {error ? (
        <p>Server error occured.</p>
      ) : loading ? (
        <LoaderCircle />
      ) : requests.length === 0 ? (
        <p>No friend requests</p>
      ) : (
        requests.map((req) => (
          <li key={req.id}>
            <div>
              <Link to={`/profile/${req.username}`}>
                <img
                  width={40}
                  src={req.profile?.profilePic}
                  alt="profilePic"
                />
                <p>{req.username}</p>
              </Link>
              <span>Sent you a friend request</span>
            </div>
            {req.error ? (
              <p>Server Error!</p>
            ) : req.loading ? (
              <LoaderCircle />
            ) : (
              <>
                <button onClick={() => handleReq(req.id, 'PATCH')}>
                  Accepte <Check size={16} strokeWidth={3} />
                </button>
                <button onClick={() => handleReq(req.id, 'DELETE')}>
                  Decline <X size={16} strokeWidth={3} />
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
