import { useParams, Link, useNavigate } from 'react-router-dom';
import useFetch from '../../hooks/useFetch';
import usePost from '../../hooks/usePost';
import { useEffect } from 'react';
import Modal from '../modal/Modal';
import {
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
        console.log({ ...profile, name, username });
      } catch (error) {
        console.error(error);
      }
    };
    getProfile();
  }, [fetchProfile, fetchUser]);

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
      console.log(res);
      setReqSatatus(res.data.status);
    } catch (error) {
      console.error(error);
    }
  };

  const handleCancelReq = async () => {
    try {
      const res = await postData('DELETE', undefined, data?.userId);
      console.log(res);
      setReqSatatus(res.data.status);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div>
      {error || userError ? (
        <p>Server error occured!</p>
      ) : loading || userLoading ? (
        <LoaderCircle />
      ) : (
        <>
          <div style={{ backgroundImage: `url(${data?.coverPic})` }}>
            <img src={data?.profilePic} alt="profile-pic" />
            <h1>
              {data?.name ?? data?.username}{' '}
              <span>
                {' '}
                {data?.gender === 'MALE' ? (
                  <Mars size={18} color="#297fff" absoluteStrokeWidth />
                ) : data?.gender === 'FEMALE' ? (
                  <Venus size={18} color="#f56bff" absoluteStrokeWidth />
                ) : (
                  ''
                )}
              </span>
            </h1>
            {user?.username !== data?.username && (
              <>
                {friendList.some(
                  (friend) => friend.username === data?.username,
                ) ? (
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
                    {reqStatus === 'PENDING' ? (
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
                      <button onClick={handleFriendReq}>
                        <UserPlus />
                        Add friend
                      </button>
                    )}
                  </>
                )}
              </>
            )}
          </div>
          <p>{data?.bio}</p>
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
          <button onClick={handleRemoveFriend}>Confirm</button>
        )}
      </Modal>
    </div>
  );
};

export default Profile;
