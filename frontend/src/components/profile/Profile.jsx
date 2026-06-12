import { useParams } from 'react-router-dom';
import useFetch from '../../hooks/useFetch';
import { useEffect } from 'react';
import { Heading1, LoaderCircle } from 'lucide-react';

const API_URL = import.meta.env.VITE_API_URL;

const Profile = () => {
  const { username } = useParams();
  const { fetchData, loading, error } = useFetch(
    `${API_URL}/profile/${username}`,
  );
  console.log(username);
  useEffect(() => {
    const getProfile = async () => {
      try {
        const res = await fetchData('GET');
        console.log(res);
      } catch (error) {
        console.error(error);
      }
    };
    getProfile();
  }, [fetchData]);

  return (
    <div>
      {error ? (
        <p>Server error occured!</p>
      ) : loading ? (
        <LoaderCircle />
      ) : (
        <h1>User Profile</h1>
      )}
    </div>
  );
};

export default Profile;
