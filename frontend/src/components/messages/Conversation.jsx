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
import socket from '../../socket';

const API_URL = import.meta.env.VITE_API_URL;

const Conversation = ({
  user,
  friendList,
  friendListError,
  friendListLoading,
  onlineUserIds,
}) => {
  const { fetchData, error, loading } = useFetch(`${API_URL}/msgs/`);
  const {
    postData,
    error: errorPost,
    loading: loadingPost,
  } = usePost(`${API_URL}/msgs/`);
  const [convo, setConvo] = useState(null);
  const location = useLocation();
  const [activeFriendId, setActiveFriendId] = useState(null);

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

  useEffect(() => {
    const handler = (msg) => {
      setConvo((prev) => ({
        ...prev,
        msgs: [...prev.msgs, msg],
      }));
    };

    socket.on('new message', handler);

    return () => socket.off('new message', handler);
  }, []);

  const handleMsgsBtn = async (friend) => {
    setActiveFriendId(friend.id);
    try {
      const msgs = await fetchData('GET', friend.id);
      setConvo({ friend, msgs, profilePic: friend.profile?.profilePic });
    } catch (error) {
      console.error(error);
    }
  };

  const sendMessage = async (formData) => {
    const message = formData.get('message');
    const image = formData.get('messageImg');
    if (!message && !image) return;

    const friend = convo.friend;
    try {
      const msg = await postData('POST', formData, friend.id);
      setConvo((prev) => ({
        ...prev,
        msgs: [...prev.msgs, msg.data],
      }));
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
      <div className={styles.sideBar}>
        <h2>Messages</h2>
        <div>
          <button>All</button>
          <ListFilter size={14} />
        </div>
        {friendListError ? (
          <p>Server error occured!</p>
        ) : friendListLoading ? (
          <LoaderCircle />
        ) : (
          <ul>
            {friendList.map((friend) => (
              <li key={friend.id}>
                <button
                  onClick={() => handleMsgsBtn(friend)}
                  className={activeFriendId === friend.id ? styles.active : ''}
                >
                  <div className={styles.icon}>
                    <img src={friend.profile?.profilePic} alt="profilePic" />
                    <span
                      style={{
                        backgroundColor: onlineUserIds.includes(friend.id)
                          ? '#89fa89'
                          : '#8d8d8d',
                      }}
                    ></span>
                  </div>
                  <div className={styles.userInfo}>
                    <p>{friend.name ?? friend.username}</p>
                    <span>
                      {onlineUserIds.includes(friend.id) ? 'Online' : 'Offline'}
                    </span>
                  </div>
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
      <div className={styles.messagesContainer}>
        {convo === null ? (
          <div className={styles.convoMsg}>
            {' '}
            <MessageCircleMore size={46} />
            <h3>No conversation selected</h3>
            <p>Choose a friend from the list to start chatting.</p>
          </div>
        ) : (
          <>
            <div className={styles.profile}>
              <Link to={`/profile/${convo.friend.username}`}>
                <div className={styles.icon}>
                  <img src={convo.profilePic} alt="pfp" />
                  <span
                    style={{
                      backgroundColor: onlineUserIds.includes(convo.friend.id)
                        ? '#89fa89'
                        : '#8d8d8d',
                    }}
                  ></span>
                </div>

                <div>
                  <p>{convo.friend.name ?? convo.friend.username}</p>
                  <span>{convo.friend.username}</span>
                </div>
              </Link>
            </div>
            <div className={styles.messages}>
              {error ? (
                <p>Server error occured</p>
              ) : loading ? (
                <LoaderCircle />
              ) : (
                <>
                  {convo.msgs.length === 0 ? (
                    <div>
                      <MessageCircleMore size={60} />
                      <h2>Say hello 👋</h2>
                      <p>Start the conversation by sending a message.</p>
                    </div>
                  ) : (
                    <ul>
                      {convo.msgs.map((msg) => (
                        <li
                          key={msg.id}
                          style={{
                            backgroundColor:
                              msg.senderId == user.id && '#7646ff',
                            color: msg.senderId == user.id && 'white',
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
              <input
                type="file"
                name="messageImg"
                accept="image/png, image/jpeg"
              />
            </form>
          </>
        )}
      </div>
    </div>
  );
};

export default Conversation;
