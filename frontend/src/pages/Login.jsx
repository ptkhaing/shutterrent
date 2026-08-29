import React, { useState } from 'react';
import api from '../api';
import { useNavigate } from 'react-router-dom';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setMessage('');
    try {
      const res = await api.post('/auth/login', { email, password });
      const { token } = res.data;
      localStorage.setItem('token', token);

      const decoded = JSON.parse(atob(token.split('.')[1]));
      const isAdmin = decoded.isAdmin;

      if (isAdmin) {
        navigate('/admin-profile');
      } else {
        navigate('/profile');
      }
    } catch (err) {
      setMessage('Invalid email or password.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-ink-50 px-4">
      <div className="w-full max-w-md bg-white p-8 rounded-xl shadow-sm border border-ink-100">
        <h2 className="font-display text-3xl mb-6 text-center text-ink-800">Welcome Back</h2>

        {message && (
          <p className="text-red-600 text-sm text-center mb-4 bg-red-50 border border-red-200 rounded-md py-2">{message}</p>
        )}

        <form onSubmit={handleLogin} className="space-y-5">
          <div>
            <label className="block mb-1 text-sm font-medium text-ink-700">Email</label>
            <input
              type="email"
              className="w-full px-4 py-2 border border-ink-200 rounded-md focus:ring-2 focus:ring-amber-400 focus:outline-none"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="Email"
            />
          </div>

          <div>
            <label className="block mb-1 text-sm font-medium text-ink-700">Password</label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                className="w-full px-4 py-2 border border-ink-200 rounded-md focus:ring-2 focus:ring-amber-400 focus:outline-none"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="Password"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-sm text-ink-400 hover:text-ink-600"
              >
                {showPassword ? 'Hide' : 'Show'}
              </button>
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-amber-400 text-ink-900 py-2.5 rounded-full font-semibold hover:bg-amber-300 transition-colors duration-200"
          >
            Login
          </button>
        </form>

        <p className="text-sm text-center mt-5 text-ink-500">
          Don't have an account?{' '}
          <a href="/register" className="text-amber-600 hover:underline font-medium">
            Register here
          </a>
        </p>
      </div>
    </div>
  );
}

export default Login;