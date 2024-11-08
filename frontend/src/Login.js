import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './Login.css';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post('http://localhost:5000/api/login', {
        email,
        password,
      });
      console.log('Response:', response.data);

      const { role, username } = response.data;

      if (role === 'admin') {
        navigate('/admin-dashboard');
      } else if (role === 'user') {
        alert('Login successful!');
        navigate('/user-dashboard', { state: { username } });
      } else {
        alert('Invalid role');
      }
    } catch (error) {
      console.error('Login error:', error);
      alert('Login failed, please try again.');
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        {/* Left side image */}
        <div className="login-image">
          <img src="https://images.ctfassets.net/lzny33ho1g45/best-fitness-tracking-apps-p-img/e2e0d9b19f341b84bc368acf6054ac9f/file.png?w=1520&fm=jpg&q=30&fit=thumb&h=760" alt="Login Visual" />
        </div>

        {/* Right side login form */}
        <div className="login-form">
          <h2>Sign-in</h2>
          <form onSubmit={handleLogin}>
            <div className="input-group">
              <label htmlFor="email">Email</label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter email"
                required
              />
            </div>
            <div className="input-group">
              <label htmlFor="password">Password</label>
              <div className="password-wrapper">
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter password"
                  required
                />
                <span
                  className="eye-icon"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? '👁️' : '🙈'}
                </span>
              </div>
            </div>
            <button type="submit" className="login-btn">Login</button>
          </form>
          <p>
            Don't have an account?{' '}
            <a href="/signup" className="signup-link">Sign up here</a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
