import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Login = ({ onLogin }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [isRegister, setIsRegister] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isRegister) {
        await axios.post('/api/auth/register', { username, password, email });
        setError('');
        setIsRegister(false);
        setUsername('');
        setPassword('');
        setEmail('');
      } else {
        const response = await axios.post('/api/auth/login', { username, password });
        onLogin(response.data.token);
      }
    } catch (err) {
      setError(err.response?.data?.error || 'An error occurred');
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-lg">
        <h1 className="text-3xl font-bold mb-6">RR Enterprises Billing</h1>
        <form onSubmit={handleSubmit} className="w-80">
          <div className="mb-4">
            <label className="block mb-2">Username</label>
            <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} className="w-full p-2 border rounded" required />
          </div>
          {isRegister && (
            <div className="mb-4">
              <label className="block mb-2">Email</label>
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full p-2 border rounded" required />
            </div>
          )}
          <div className="mb-4">
            <label className="block mb-2">Password</label>
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full p-2 border rounded" required />
          </div>
          {error && <p className="text-red-600 mb-4">{error}</p>}
          <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded">
            {isRegister ? 'Register' : 'Login'}
          </button>
        </form>
        <button onClick={() => setIsRegister(!isRegister)} className="mt-4 text-blue-600">
          {isRegister ? 'Already have an account? Login' : 'Need an account? Register'}
        </button>
      </div>
    </div>
  );
};

export default Login;