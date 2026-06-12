import {
  CloudAlert,
  EllipsisVertical,
  ListFilter,
  LoaderCircle,
  MessageCircleMore,
  Send,
} from 'lucide-react';
import styles from './Conversation.module.css';
import useFetch from '../../hooks/useFetch';
import { useEffect, useState } from 'react';
import { useLocation, Link } from 'react-router-dom';
import usePost from '../../hooks/usePost';
import Message from './Message';

const API_URL = import.meta.env.VITE_API_URL;

const Conversation = ({
  user,
  friendList,
  friendListError,
  friendListLoading,
}) => {
  const { fetchData, error, loading } = useFetch(`${API_URL}/msgs/`);
  const {
    postData,
    error: errorPost,
    loading: loadingPost,
  } = usePost(`${API_URL}/msgs/`);
  const [convo, setConvo] = useState(null);
  const location = useLocation();

  useEffect(() => {
    const fetchMsgs = async () => {
      if (location.state) {
        const friend = location.state;
        try {
          const msgs = await fetchData('GET', friend.id);
          setConvo({ friend, msgs });
        } catch (error) {
          console.error(error);
        }
      }
    };
    fetchMsgs();
  }, [location, fetchData]);

  const handleMsgsBtn = async (friend) => {
    try {
      const msgs = await fetchData('GET', friend.id);
      setConvo({ friend, msgs });
    } catch (error) {
      console.error(error);
    }
  };

  const sendMessage = async (formData) => {
    const message = formData.get('message');
    if (message === '') return;

    const friend = convo.friend;
    try {
      await postData('POST', { message }, convo.friend.id);
      // Update the UI
      const msgs = await fetchData('GET', friend.id);
      setConvo({ friend, msgs });
    } catch (error) {
      console.error(error);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      e.currentTarget.form?.requestSubmit();
    }
  };

  return (
    <div className={styles.conversation}>
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
                <button onClick={() => handleMsgsBtn(friend)}>
                  {friend.name ?? friend.username}
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
      <div className={styles.messages}>
        {convo === null ? (
          <>
            {' '}
            <MessageCircleMore size={46} />
            <h3>No conversation selected</h3>
            <p>Choose a friend from the list to start chatting.</p>
          </>
        ) : (
          <>
            <div>
              <Link to={`/profile/${convo.friend.username.toLowerCase()}`}>
                <img src={null} alt="pfp" />
                <div>
                  <p>{convo.friend.name ?? convo.friend.username}</p>
                  <p>{convo.friend.username}</p>
                </div>
              </Link>
              <button>
                <EllipsisVertical />
              </button>
            </div>
            <div>
              {error ? (
                <p>Server error occured</p>
              ) : loading ? (
                <LoaderCircle />
              ) : (
                <>
                  {convo.msgs.length === 0 ? (
                    <>
                      <MessageCircleMore size={46} />
                      <h2>Say hello 👋</h2>
                      <p>Start the conversation by sending a message.</p>
                    </>
                  ) : (
                    <>
                      <ul>
                        {convo.msgs.map((msg) => (
                          <li
                            key={msg.id}
                            style={{
                              backgroundColor:
                                msg.senderId == user.id ? '#7646ff' : '#2c2c2c',
                            }}
                          >
                            <Message
                              msg={msg}
                              user={user}
                              refetchMsgs={fetchData}
                              friend={convo.friend}
                              setConvo={setConvo}
                            />
                          </li>
                        ))}
                      </ul>
                    </>
                  )}
                </>
              )}
            </div>
            <form action={sendMessage}>
              <textarea
                onKeyDown={handleKeyDown}
                name="message"
                id="message"
                placeholder="Type your message..."
              ></textarea>
              {errorPost ? (
                <CloudAlert />
              ) : loadingPost ? (
                <LoaderCircle />
              ) : (
                <button type="submit">
                  <Send />
                </button>
              )}
            </form>
          </>
        )}
      </div>
    </div>
  );
};

export default Conversation;
