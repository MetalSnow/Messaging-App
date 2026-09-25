import {
  CloudAlert,
  EllipsisVertical,
  ImageUp,
  ListFilter,
  LoaderCircle,
  MessageCircleMore,
  Send,
} from 'lucide-react';
import styles from './Conversation.module.css';
import useFetch from '../../hooks/useFetch';
import { useEffect, useRef, useState } from 'react';
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
  const msgsBarRef = useRef(null);

  useEffect(() => {
    if (msgsBarRef.current) {
      msgsBarRef.current.scrollTop = msgsBarRef.current.scrollHeight;
    }
  }, [convo?.msgs]);

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
          <LoaderCircle className="loader" />
        ) : (
          <ul>
            {friendList?.map((friend) => (
              <li key={friend.id}>
                <button
                  onClick={() => handleMsgsBtn(friend)}
                  className={activeFriendId === friend.id ? styles.active : ''}
                >
                  <div className={styles.icon}>
                    <img
                      src={
                        friend.profile?.profilePic
                          ? friend.profile?.profilePic
                          : '/icons/user.png'
                      }
                      alt="profilePic"
                    />
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
                  <img
                    src={
                      convo.profilePic ? convo.profilePic : '/icons/user.png'
                    }
                    alt="pfp"
                  />
                  <span
                    style={{
                      backgroundColor: onlineUserIds.includes(convo.friend.id)
                        ? '#89fa89'
                        : '#8d8d8d',
                    }}
                  ></span>
                </div>

                <div>
                  <p>{convo?.friend.name ?? convo?.friend.username}</p>
                  <span>{convo?.friend.username}</span>
                </div>
              </Link>
            </div>
            <div className={styles.messages} ref={msgsBarRef}>
              {error ? (
                <p>Server error occured</p>
              ) : loading ? (
                <LoaderCircle className="loader" />
              ) : (
                <>
                  {convo?.msgs.length === 0 ? (
                    <div>
                      <MessageCircleMore size={60} />
                      <h2>Say hello 👋</h2>
                      <p>Start the conversation by sending a message.</p>
                    </div>
                  ) : (
                    <ul>
                      {convo?.msgs.map((msg) => (
                        <li
                          key={msg.id}
                          style={{
                            backgroundColor:
                              msg.senderId == user.id ? '#7646ff' : '#f1e3ff',
                            color: msg.senderId == user.id && 'white',
                            alignSelf: msg.senderId == user.id && 'flex-end',
                            borderRadius: msg.senderId !== user.id && '10px',
                          }}
                        >
                          {msg.senderId !== user.id && (
                            <img
                              src={
                                convo?.profilePic
                                  ? convo?.profilePic
                                  : '/icons/user.png'
                              }
                              alt="pfp"
                            />
                          )}
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
              <label className={styles.customFileUpload}>
                <ImageUp size={20} strokeWidth={2.5} />
                <input
                  type="file"
                  name="messageImg"
                  accept="image/png, image/jpeg"
                />
              </label>
              <textarea
                onKeyDown={handleKeyDown}
                name="message"
                id="message"
                placeholder="Type your message..."
              ></textarea>
              {errorPost ? (
                <CloudAlert />
              ) : loadingPost ? (
                <LoaderCircle className="loader" />
              ) : (
                <button type="submit">
                  <Send size={20} strokeWidth={2.5} />
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
