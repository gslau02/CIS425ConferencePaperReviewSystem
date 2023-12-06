import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { setUserId } from '../../actions/userActions';
import './Login.css';

const Login = () => {
  const [credentials, setCredentials] = useState({
    username: '',
    password: '',
  });

  const [loginError, setLoginError] = useState(null);
  const navigate = useNavigate(); // Get the useNavigate hook
  const dispatch = useDispatch();

  const handleChange = (e) => {
    setCredentials({
      ...credentials,
      [e.target.name]: e.target.value,
    });
  };

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post('http://localhost:5000/api/login', credentials);
      dispatch(setUserId(response.data.userId));
      localStorage.setItem('userId', response.data.userId);
      navigate('/home'); // Redirect to home upon successful login using navigate
    } catch (error) {
      console.error('Login failed', error.response.data);
      setLoginError('Invalid credentials'); // Set login error
    }
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <h2>Welcome to <br/>Conference Paper Review System</h2>
        {loginError && <p className="error-message">{loginError}</p>}
        <form onSubmit={handleLogin}>
          <input
            type="text"
            name="username"
            value={credentials.username}
            onChange={handleChange}
            placeholder="Username"
            className="login-input"
          />
          <br />
          <input
            type="password"
            name="password"
            value={credentials.password}
            onChange={handleChange}
            placeholder="Password"
            className="login-input"
          />
          <br />
          <button type="submit" className="login-button">Login</button>
        </form>
      </div>
    </div>
  );
};

export default Login;
