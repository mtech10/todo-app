import React, { useState } from 'react';
import axios from 'axios';
import { useAuth } from '../AuthContext';
import './register.css';

const Register = ({ switchToLogin }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { login } = useAuth(); 

  const handleSubmit = (e) => {
    e.preventDefault();

    axios.post('https://todo-app-backend-jnox.onrender.com/register', { email, password })
      .then((response) => {
        const { token, user } = response.data;
        
        login(token, user); 
      })
      .catch((error) => {
       alert("Error Detail: " + (error.response?.data?.error || error.message));
  console.error(error.response?.data);
});
  };

  return (
    <div className="auth-container">
      <h2>Create an Account</h2>
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
        <button type="submit">Sign Up</button>
      </form>
      <p>Already have an account? <button onClick={switchToLogin}>Log in</button></p>
    </div>
  );
};

export default Register;
