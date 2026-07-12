import { useState } from 'react';
import usePost from '../../hooks/usePost';
import { LoaderCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const API_URL = import.meta.env.VITE_API_URL;

const Signup = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const { postData, validation, error, loading } = usePost(`${API_URL}/signup`);
  const navigate = useNavigate();

  const signupUser = async (formData) => {
    const data = Object.fromEntries(formData.entries());

    setUsername(data.username);
    setEmail(data.email);

    try {
      const res = await postData('POST', data);
      console.log(res);
      if (res?.success) {
        navigate('/login', {
          state: { message: 'Account created successfully' },
        });
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <>
      <h2>Sign Up</h2>
      {error && <p>Server error occured!</p>}
      {validation && (
        <ul>
          {validation.map((error, index) => (
            <li key={index} style={{ color: 'red' }}>
              {error.msg}
            </li>
          ))}
        </ul>
      )}
      <form action={signupUser}>
        <label htmlFor="username">Username:</label>
        <input
          type="text"
          name="username"
          id="username"
          placeholder="Enter Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />
        <label htmlFor="email">Email:</label>
        <input
          type="email"
          name="email"
          id="email"
          placeholder="Email Address"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
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
        <label htmlFor="confirmedPassword">Confirm Password:</label>
        <input
          type="password"
          name="confirmedPassword"
          id="confirmedPassword"
          placeholder="Confirm password"
          required
        />
        {loading ? <LoaderCircle /> : <button type="submit">Sign up</button>}
      </form>
    </>
  );
};

export default Signup;
