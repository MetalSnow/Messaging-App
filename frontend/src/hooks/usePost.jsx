import { useState } from 'react';

const usePost = (url) => {
  const [validation, setValidation] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const postData = async (data) => {
    setError(null);
    setValidation(null);
    setLoading(true);
    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (response.status === 500) {
        throw new Error(`HTTP error! status code:${response.status} `);
      }

      if (response.status === 400) {
        const result = await response.json();
        setValidation(result.errors);
        setLoading(false);
        return;
      }

      setLoading(false);
      return response;
    } catch (error) {
      setLoading(false);
      setError(error);
    }
  };

  return { postData, loading, error, validation };
};

export default usePost;
