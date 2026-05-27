import { ListFilter, LoaderCircle, MessageCircleMore } from 'lucide-react';
import useFetch from '../../hooks/useFetch';
import { useState } from 'react';

const API_URL = import.meta.env.VITE_API_URL;

const Messages = ({ friendList, friendListError, friendListLoading }) => {
  const { fetchData, error, loading } = useFetch(`${API_URL}/msgs/`);
  const [msgs, setMsgs] = useState(null);

  const handleClickBtn = async (friendId) => {
    try {
      const msgs = await fetchData('GET', friendId);
      setMsgs(msgs);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div>
      <h2>Messages</h2>
      <div>
        <button>All</button>
        <ListFilter size={14} />
      </div>
      <div>
        {friendListError ? (
          <p>Server error occured!</p>
        ) : friendListLoading ? (
          <LoaderCircle />
        ) : (
          <ul>
            {friendList.map((friend) => (
              <li key={friend.id}>
                <button onClick={() => handleClickBtn(friend.id)}>
                  {friend.username}
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
      <div>
        {msgs === null ? (
          <>
            {' '}
            <MessageCircleMore size={46} />
            <h3>No conversation selected</h3>
            <p>Choose a friend from the list to start chatting.</p>
          </>
        ) : error ? (
          <p>Server error occured</p>
        ) : loading ? (
          <LoaderCircle />
        ) : msgs.length === 0 ? (
          <>
            <MessageCircleMore size={46} />
            <h2>Say hello 👋</h2>
            <p>Start the conversation by sending a message.</p>
          </>
        ) : (
          <ul>
            {msgs.map((msg) => (
              <li key={msg.id}>{msg.message}</li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default Messages;
