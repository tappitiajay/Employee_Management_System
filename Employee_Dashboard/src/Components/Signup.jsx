import axios from 'axios';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Signup.css';

function Signup({ onLogin }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();
    try {
      // attempt to sign up the user
      const signupResponse = await axios.post('http://localhost:3000/users/signup', { username, password });

      // if signup is successful attempt to log in the user
      const loginResponse = await axios.post('http://localhost:3000/users/login', { username, password });
      localStorage.setItem('token', loginResponse.data.token);
      
      onLogin(); 
      navigate('/'); 'navigate to home page '
    } catch (error) {
      setError('User already exists');
    }
  };

  return (
    <div>
      <h1>Signup</h1>
      <form onSubmit={handleSignup}>
        {error && <div className="error">{error}</div>}
        <label>Username:</label>
        <input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />
        <label>Password:</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit">Signup</button>
      </form>
    </div>
  );
}

export default Signup;
