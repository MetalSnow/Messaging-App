import { useCallback, useState } from 'react';

const useFetch = (url) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchData = useCallback(
    async (method) => {
      setError(null);
      setLoading(true);
      try {
        const response = await fetch(url, {
          method,
          credentials: 'include',
        });

        if (response.status == 401) {
          throw new Error('You are not allowed to view this resources.');
        }

        if (response.status >= 400) {
          throw new Error(`HTTP error! status code:${response.status} `);
        }

        const result = await response.json();
        setLoading(false);
        return result.data;
      } catch (error) {
        setLoading(false);
        setError(error);
      }
    },
    [url],
  );

  return { fetchData, loading, error };
};

export default useFetch;
