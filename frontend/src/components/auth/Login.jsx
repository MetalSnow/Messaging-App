import { Check } from 'lucide-react';
import { useLocation } from 'react-router-dom';

const Login = () => {
  const location = useLocation().state;

  const loginUser = async (formData) => {
    'use server';
    const username = formData.get('username');
    const password = formData.get('password');

    const data = { username, password };
    console.log(data);
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
      <form action={loginUser}>
        <label htmlFor="username">Username:</label>
        <input
          type="text"
          name="username"
          id="username"
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
        <button type="submit">Log in</button>
      </form>
    </>
  );
};

export default Login;
