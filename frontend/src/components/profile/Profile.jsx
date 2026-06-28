import { useParams } from 'react-router-dom';
import useFetch from '../../hooks/useFetch';
import { useEffect } from 'react';
import { Heading1, LoaderCircle, UserCheck, UserPlus } from 'lucide-react';
import { useState } from 'react';

const API_URL = import.meta.env.VITE_API_URL;

const Profile = ({ friendList, user }) => {
  const { username } = useParams();
  const { fetchData, loading, error } = useFetch(
    `${API_URL}/profile/${username}`,
  );
  const {
    fetchData: fetchUser,
    loading: userLoading,
    userError,
  } = useFetch(`${API_URL}/user/`);
  const [data, setData] = useState(null);

  useEffect(() => {
    const getProfile = async () => {
      try {
        const profile = await fetchData('GET');
        const { name, username } = await fetchUser('GET', profile.userId);

        setData({ ...profile, name, username });
        console.log({ ...profile, name, username });
      } catch (error) {
        console.error(error);
      }
    };
    getProfile();
  }, [fetchData, fetchUser]);

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
            <h1>{data?.name ?? data?.username}</h1>
            {user?.username !== data?.username && (
              <button>
                {friendList.some(
                  (friend) => friend.username === data?.username,
                ) ? (
                  <>
                    <UserCheck /> Friends
                  </>
                ) : (
                  <>
                    <UserPlus /> Add friend
                  </>
                )}
              </button>
            )}
          </div>
          <p>{data?.bio}</p>
        </>
      )}
    </div>
  );
};

export default Profile;
