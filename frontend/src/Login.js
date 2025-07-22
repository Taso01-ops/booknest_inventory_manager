import React, { useState } from 'react';
import axios from 'axios';

const Login = ({ setToken }) => {
  const [emailOrUsername, setEmailOrUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isAdmin, setIsAdmin] = useState(false);

  const handleLogin = async () => {
    const endpoint = isAdmin ? '/admin/login' : '/auth/login';
    const credentials = isAdmin
      ? { username: emailOrUsername, password }
      : { email: emailOrUsername, password };

    try {
      const res = await axios.post(`http://localhost:3001${endpoint}`, credentials);
      localStorage.setItem('token', res.data.token);
      setToken(res.data.token);
      alert('Login successful!');
    } catch (err) {
      console.error(err);
      alert('Login failed');
    }
  };

  return (
    <div>
      <h2>{isAdmin ? 'Admin' : 'User'} Login</h2>
      <input
        placeholder={isAdmin ? "Username" : "Email"}
        onChange={(e) => setEmailOrUsername(e.target.value)}
      />
      <input
        placeholder="Password"
        type="password"
        onChange={(e) => setPassword(e.target.value)}
      />
      <label>
        <input
          type="checkbox"
          checked={isAdmin}
          onChange={() => setIsAdmin(!isAdmin)}
        />
        Admin
      </label>
      <button onClick={handleLogin}>Login</button>
    </div>
  );
};

export default Login;
