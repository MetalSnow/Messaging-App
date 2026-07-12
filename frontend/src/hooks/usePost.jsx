import { useState } from 'react';

const usePost = (url) => {
  const [validation, setValidation] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const postData = async (method, data, id) => {
    setError(null);
    setValidation(null);
    setLoading(true);
    const fullUrl = id ? url + id : url;
    try {
      const response = await fetch(fullUrl, {
        method,
        headers:
          data instanceof FormData
            ? {}
            : { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: data instanceof FormData ? data : JSON.stringify(data),
      });

      if (response.status === 500) {
        throw new Error(`HTTP error! status code:${response.status} `);
      }

      const result = await response.json();

      if (response.status === 400) {
        setValidation(result.errors);
        setLoading(false);
        return;
      }

      if (response.status === 401) {
        setValidation(result.error);
        setLoading(false);
        return;
      }

      setLoading(false);
      return result;
    } catch (error) {
      setLoading(false);
      setError(error);
    }
  };

  return { postData, loading, error, validation };
};

export default usePost;
