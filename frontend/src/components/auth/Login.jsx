import { Check } from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';
import usePost from '../../hooks/usePost';
import { useState } from 'react';

const API_URL = import.meta.env.VITE_API_URL;

const Login = () => {
  const location = useLocation().state;
  const [username, setUsername] = useState('');
  const { postData, validation, error, loading } = usePost(`${API_URL}/login`);
  const navigate = useNavigate();

  const loginUser = async (formData) => {
    const username = formData.get('username');
    const password = formData.get('password');

    const data = { username, password };
    setUsername(username);

    try {
      const res = await postData('POST', data);
      if (res?.success) {
        navigate('/dashboard');
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <>
      {location && (
        <p>
          {location.message}{' '}
          <Check color="green" size={16} strokeWidth={3} absoluteStrokeWidth />
        </p>
      )}
      <h2>Log in</h2>
      {error && <p>Server error occured!</p>}
      {validation && <p>{validation}</p>}
      <form action={loginUser}>
        <label htmlFor="username">Username:</label>
        <input
          type="text"
          name="username"
          id="username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="Enter Username"
          required
        />
        <label htmlFor="password">Password:</label>
        <input
          type="password"
          name="password"
          id="password"
          placeholder="Enter password"
          required
        />
        {loading ? <LoaderCircle /> : <button type="submit">Log in</button>}
      </form>
    </>
  );
};

export default Login;
