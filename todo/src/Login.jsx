import React, { useState } from 'react';
import axios from 'axios';
import { useAuth } from './AuthContext';
import "./Register/register.css";

const Login = ({ switchToRegister }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { login } = useAuth();

  const handleSubmit = (e) => {
    e.preventDefault();

    axios.post('https://todo-app-backend-jnox.onrender.com/login', { email, password })
      .then((response) => {
        // Grab the token and user from the backend
        const { token, user } = response.data;
        // This instantly logs them in and saves the token!
        login(token, user); 
      })
      .catch((error) => {
        alert(error.response?.data?.message || "Login failed");
      });
  };

  return (
    <div className="auth-container">
      <h2>Welcome Back</h2>
      <form onSubmit={handleSubmit}>
        <input 
          type="email" 
          value={email} 
          onChange={(e) => setEmail(e.target.value)} 
          placeholder="Email" 
          required 
        />
        <input 
          type="password" 
          value={password} 
          onChange={(e) => setPassword(e.target.value)} 
          placeholder="Password" 
          required 
        />
        <button type="submit">Log In</button>
      </form>
      <p>Don't have an account? <button onClick={switchToRegister}>Sign up</button></p>
    </div>
  );
};

export default Login;