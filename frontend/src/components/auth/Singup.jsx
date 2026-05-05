const Signup = () => {
  const signupUser = async (formData) => {
    'use server';
    const username = formData.get('username');
    const email = formData.get('email');
    const password = formData.get('password');

    const data = { username, email, password };
    console.log(data);
  };
  return (
    <>
      <h2>Sign Up</h2>
      <form action={signupUser}>
        <label htmlFor="username">Username:</label>
        <input
          type="text"
          name="username"
          id="username"
          placeholder="Enter Username"
          required
        />
        <label htmlFor="email">Email:</label>
        <input
          type="email"
          name="email"
          id="email"
          placeholder="Email Address"
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
        <button type="submit">Sign up</button>
      </form>
    </>
  );
};

export default Signup;
