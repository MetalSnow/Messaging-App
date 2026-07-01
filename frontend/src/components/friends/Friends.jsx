import { useState } from 'react';
import useFetch from '../../hooks/useFetch';
import { LoaderCircle, MessageCircleMore, UserRoundX } from 'lucide-react';
import Modal from '../modal/Modal';
import { useNavigate, Link } from 'react-router-dom';

const API_URL = import.meta.env.VITE_API_URL;

const Friends = ({ fetchData, error, loading, setFriendList, friendList }) => {
  const [friend, setFriend] = useState(null);
  const {
    fetchData: removeFriend,
    error: errorRemove,
    loading: loadingRemove,
  } = useFetch(`${API_URL}/friend-requests/`);
  const [modalIsOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  const openModal = (friend) => {
    setFriend(friend);
    setIsOpen(true);
  };

  const handleRemoveFriend = async () => {
    try {
      await removeFriend('DELETE', friend.id);
      //Update the UI
      const data = await fetchData('GET');
      setFriendList(data);
      setIsOpen(false);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <>
      <h2>Friend list</h2>
      {error ? (
        <p>Server error occured!</p>
      ) : loading ? (
        <LoaderCircle />
      ) : friendList.length == 0 ? (
        <p>You haven't added any friends yet.</p>
      ) : (
        <ul>
          {friendList.map((friend) => (
            <li key={friend.id}>
              <Link to={`/profile/${friend.username}`}>{friend.username}</Link>{' '}
              <button onClick={() => navigate('/messages', { state: friend })}>
                <MessageCircleMore />
                Chat
              </button>
              <button onClick={() => openModal(friend)}>
                <UserRoundX />
                Unfriend
              </button>
            </li>
          ))}
        </ul>
      )}
      <Modal modalIsOpen={modalIsOpen} closeModal={() => setIsOpen(false)}>
        <h2>Unfriend {friend?.name ?? friend?.username}</h2>

        <p>
          Are you sure you want to remove {friend?.name ?? friend?.username} as
          your friend?
        </p>
        {errorRemove ? (
          <p>Server error occured!</p>
        ) : loadingRemove ? (
          'Removing...'
        ) : (
          <button onClick={handleRemoveFriend}>Confirm</button>
        )}
      </Modal>
    </>
  );
};

export default Friends;
