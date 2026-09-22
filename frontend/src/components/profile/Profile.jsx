import { useParams, Link, useNavigate } from 'react-router-dom';
import useFetch from '../../hooks/useFetch';
import usePost from '../../hooks/usePost';
import { useEffect } from 'react';
import Modal from '../modal/Modal';
import {
  Check,
  Heading1,
  LoaderCircle,
  Mars,
  MessageCircleMore,
  UserCheck,
  UserPlus,
  UserX,
  Venus,
} from 'lucide-react';
import { useState } from 'react';
import styles from './Profile.module.css';

const API_URL = import.meta.env.VITE_API_URL;

const Profile = ({ friendList, user, fetchData, setFriendList }) => {
  const { username } = useParams();
  const {
    fetchData: fetchProfile,
    loading,
    error,
  } = useFetch(`${API_URL}/profile/${username}`);
  const {
    fetchData: fetchUser,
    loading: userLoading,
    userError,
  } = useFetch(`${API_URL}/user/`);
  const [data, setData] = useState(null);
  const navigate = useNavigate();
  const [modalIsOpen, setIsOpen] = useState(false);
  const {
    fetchData: removeFriend,
    error: errorRemove,
    loading: loadingRemove,
  } = useFetch(`${API_URL}/friend-requests/`);
  const {
    postData,
    error: errorRequest,
    loading: loadingRequest,
  } = usePost(`${API_URL}/friend-requests/`);
  const [reqStatus, setReqSatatus] = useState(null);

  useEffect(() => {
    const getProfile = async () => {
      try {
        const profile = await fetchProfile('GET');
        const { name, username } = await fetchUser('GET', profile.userId);
        setData({ ...profile, name, username });

        //Get friend request status
        if (profile.userId !== user?.id) {
          const res = await removeFriend('GET', profile.userId);
          setReqSatatus({ senderId: res.userId1, status: res.status });
        }
      } catch (error) {
        console.error(error);
      }
    };
    getProfile();
  }, [fetchProfile, fetchUser, removeFriend, user]);

  const handleRemoveFriend = async () => {
    try {
      await removeFriend('DELETE', data?.userId);
      // Update the UI
      const list = await fetchData('GET');
      setFriendList(list);
      setIsOpen(false);
    } catch (error) {
      console.error(error);
    }
  };

  const handleFriendReq = async () => {
    try {
      const res = await postData('POST', undefined, data?.userId);
      setReqSatatus({ senderId: res.data.userId1, status: res.data.status });
    } catch (error) {
      console.error(error);
    }
  };

  const handleCancelReq = async () => {
    try {
      const res = await postData('DELETE', undefined, data?.userId);
      setReqSatatus({ senderId: res.data.userId1, status: res.data.status });
    } catch (error) {
      console.error(error);
    }
  };

  const handleAccepteReq = async () => {
    try {
      const res = await postData('PATCH', undefined, reqStatus.senderId);
      setReqSatatus({ senderId: res.data.userId1, status: res.data.status });
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className={styles.profileContainer}>
      {error || userError ? (
        <p>Server error occured!</p>
      ) : loading || userLoading ? (
        <LoaderCircle />
      ) : (
        <>
          <div
            className={styles.profile}
            style={{
              backgroundImage: `url(${data?.coverPic ? data?.coverPic : '/icons/cover.jpg'})`,
            }}
          >
            <img
              src={data?.profilePic ? data.profilePic : '/icons/user.png'}
              alt="profile-pic"
            />
            <p>
              {data?.name ?? data?.username}{' '}
              <span>
                {' '}
                {data?.gender === 'MALE' ? (
                  <Mars
                    size={25}
                    color="#297fff"
                    strokeWidth={3}
                    absoluteStrokeWidth
                  />
                ) : data?.gender === 'FEMALE' ? (
                  <Venus
                    size={25}
                    strokeWidth={3}
                    color="#f56bff"
                    absoluteStrokeWidth
                  />
                ) : (
                  ''
                )}
              </span>
            </p>
            {user?.username !== data?.username && (
              <div className={styles.btns}>
                {friendList.some(
                  (friend) => friend.username === data?.username,
                ) || reqStatus?.status === 'ACCEPTED' ? (
                  <>
                    <button onClick={() => setIsOpen(true)}>
                      <UserCheck /> Friends
                    </button>
                    <button
                      onClick={() => navigate('/messages', { state: data })}
                    >
                      <MessageCircleMore />
                      Message
                    </button>
                  </>
                ) : (
                  <>
                    {reqStatus?.status === 'PENDING' ? (
                      <>
                        {reqStatus?.senderId === user?.id ? (
                          <button onClick={handleCancelReq}>
                            <UserX />
                            {errorRequest ? (
                              'Error request'
                            ) : loadingRequest ? (
                              <LoaderCircle />
                            ) : (
                              'Cancel request'
                            )}
                          </button>
                        ) : (
                          <>
                            {' '}
                            <button
                              style={{ backgroundColor: '#0aff026b' }}
                              onClick={handleAccepteReq}
                            >
                              <UserCheck />
                              {errorRequest ? (
                                'Error request'
                              ) : loadingRequest ? (
                                <LoaderCircle />
                              ) : (
                                'Accepte request'
                              )}
                            </button>
                            <button
                              style={{ backgroundColor: '#ff02204f' }}
                              onClick={handleCancelReq}
                            >
                              <UserX />
                              {errorRequest ? (
                                'Error request'
                              ) : loadingRequest ? (
                                <LoaderCircle />
                              ) : (
                                'Decline request'
                              )}
                            </button>
                          </>
                        )}
                      </>
                    ) : (
                      <button onClick={handleFriendReq}>
                        <UserPlus />
                        Add friend
                      </button>
                    )}
                  </>
                )}
              </div>
            )}
          </div>
          <div className={styles.bio}>
            <span>
              {data?.bio ? data.bio : "This user hasn't added a bio yet"}
            </span>
          </div>
        </>
      )}
      <Modal modalIsOpen={modalIsOpen} closeModal={() => setIsOpen(false)}>
        <h2>Unfriend {data?.name ?? data?.username}</h2>

        <p>
          Are you sure you want to remove {data?.name ?? data?.username} as your
          friend?
        </p>
        {errorRemove ? (
          <p>Server error occured!</p>
        ) : loadingRemove ? (
          'Removing...'
        ) : (
          <button className={styles.confirmBtn} onClick={handleRemoveFriend}>
            Confirm <Check />
          </button>
        )}
      </Modal>
    </div>
  );
};

export default Profile;
