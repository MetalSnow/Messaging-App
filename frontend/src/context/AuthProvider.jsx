import { useEffect, useState } from 'react';
import useFetch from '../hooks/useFetch';
import AuthContext from './AuthContext';

const API_URL = import.meta.env.VITE_API_URL;

const AuthProvider = ({ children }) => {
  const { fetchData } = useFetch(`${API_URL}/user`);
  const [user, setUser] = useState(null);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    const getUserData = async () => {
      try {
        const userData = await fetchData();
        setUser(userData);
      } catch (error) {
        console.error(error);
        setUser(null);
      } finally {
        setChecking(false);
      }
    };
    getUserData();
  }, [fetchData]);

  return (
    <AuthContext.Provider value={{ user, setUser, checking }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
