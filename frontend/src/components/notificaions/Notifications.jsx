import { useEffect, useState } from 'react';
import useFetch from '../../hooks/useFetch';
import { Check, LoaderCircle, LoaderIcon, X } from 'lucide-react';

const API_URL = import.meta.env.VITE_API_URL;

const Notifications = () => {
  const { fetchData, loading, error } = useFetch(`${API_URL}/friend-requests`);
  const [requests, setRequests] = useState([]);

  useEffect(() => {
    const getNotif = async () => {
      try {
        const reqs = await fetchData('GET');
        setRequests(reqs);
      } catch (error) {
        console.error(error);
      }
    };
    getNotif();
  }, [fetchData]);

  return (
    <ul>
      {error ? (
        <p>Server error occured.</p>
      ) : loading ? (
        <LoaderCircle />
      ) : (
        requests.map((req) => (
          <li key={req.id}>
            <p>{req.username}</p>
            <button>
              Accepte <Check />
            </button>
            <button>
              Decline <X />
            </button>
          </li>
        ))
      )}
    </ul>
  );
};

export default Notifications;
