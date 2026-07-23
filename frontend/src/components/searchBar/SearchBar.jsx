import { useEffect } from 'react';
import useFetch from '../../hooks/useFetch';

const API_URL = import.meta.env.VITE_API_URL;

const SearchBar = ({ searchInput }) => {
  const { fetchData, error, loading } = useFetch(`${API_URL}/users`);

  useEffect(() => {
    if (!searchInput) return;

    const timeoutId = setTimeout(async () => {
      try {
        const res = await fetchData('GET');
        console.log(res);
      } catch (err) {
        console.error(err);
      }
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [searchInput, fetchData]);

  return <ul></ul>;
};

export default SearchBar;
