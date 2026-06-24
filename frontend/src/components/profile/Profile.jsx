import { useParams } from 'react-router-dom';
import useFetch from '../../hooks/useFetch';
import { useEffect } from 'react';
import { Heading1, LoaderCircle } from 'lucide-react';
import { useState } from 'react';

const API_URL = import.meta.env.VITE_API_URL;

const Profile = () => {
  const { username } = useParams();
  const { fetchData, loading, error } = useFetch(
    `${API_URL}/profile/${username}`,
  );
  const [data, setData] = useState(null);

  useEffect(() => {
    const getProfile = async () => {
      try {
        const res = await fetchData('GET');
        console.log(res);
        setData(res);
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
        <h1>{data?.userId}</h1>
      )}
    </div>
  );
};

export default Profile;
