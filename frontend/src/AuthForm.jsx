import React, { useState } from 'react';
import { supabase } from './supabaseClient';

export default function AuthForm({ onAuth }) {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('Reporter');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  function getFriendlyError(msg) {
    if (!msg) return '';
    if (msg.toLowerCase().includes('invalid login credentials')) return 'Incorrect email or password.';
    if (msg.toLowerCase().includes('invalid email')) return 'Please enter a valid email address.';
    if (msg.toLowerCase().includes('password')) return 'Password must be at least 6 characters.';
    if (msg.toLowerCase().includes('user already registered')) return 'User already registered. Please login.';
    if (msg.toLowerCase().includes('network')) return 'Network error. Please try again.';
    return msg;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    if (isLogin) {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      setLoading(false);
      if (error) setError(getFriendlyError(error.message));
      else if (!data.user) setError('Login failed. Please check your credentials.');
      else onAuth(data.user, data.session);
    } else {
      // Register via backend to set role
      try {
        const res = await fetch('http://localhost:5000/api/auth/register', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, password, role })
        });
        const result = await res.json();
        setLoading(false);
        if (!res.ok) setError(getFriendlyError(result.error || 'Registration failed'));
        else setIsLogin(true);
      } catch (err) {
        setLoading(false);
        setError('Registration failed. Please try again.');
      }
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-blue-200 via-violet-100 to-orange-100">
      {/* Logo and heading row */}
      <div className="flex items-center w-full max-w-md mt-8 mb-10">
  <img src="/assets/logo.png" alt="Logo" className="h-48 w-48 object-contain mr-8 rounded-3xl shadow-xl border-2 border-fuchsia-300 bg-white" />
        <div>
          <h1 className="text-4xl sm:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-orange-500 via-fuchsia-600 to-blue-700 drop-shadow-2xl">Mangrove Guardian</h1>
          <p className="mt-1 text-lg sm:text-xl font-semibold text-gray-700 italic">The unseen machinery that keeps time alive.</p>
        </div>
      </div>
  <div className="w-full max-w-md p-10 bg-white/90 rounded-2xl shadow-xl border-2 border-green-400 z-10 mx-auto">
        <h2 className="text-3xl font-extrabold text-orange-700 mb-6 text-center drop-shadow">{isLogin ? 'Login' : 'Register'}</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            className="w-full p-3 border-2 border-green-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-300 bg-green-50 text-green-900 placeholder-green-400 shadow"
            type="email"
            placeholder="Email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
          />
          <input
            className="w-full p-3 border-2 border-green-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-300 bg-green-50 text-green-900 placeholder-green-400 shadow"
            type="password"
            placeholder="Password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
          />
          {!isLogin && (
            <select
              className="w-full p-3 border-2 border-green-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-300 bg-green-50 text-green-900 shadow"
              value={role}
              onChange={e => setRole(e.target.value)}
            >
              <option value="Reporter">Reporter</option>
              <option value="Verifier">Verifier</option>
              <option value="Government">Government</option>
            </select>
          )}
          {error && <div className="text-orange-600 text-base text-center font-semibold drop-shadow">{error}</div>}
          <button
            className="w-full bg-gradient-to-r from-orange-500 via-fuchsia-600 to-blue-700 hover:from-orange-600 hover:to-fuchsia-700 text-white font-bold p-3 rounded-lg shadow-lg transition duration-150 text-lg"
            type="submit"
            disabled={loading}
          >
            {loading ? 'Please wait...' : isLogin ? 'Login' : 'Register'}
          </button>
        </form>
        <button
          className="w-full mt-6 text-fuchsia-700 hover:text-orange-700 underline text-base font-semibold"
          onClick={() => { setIsLogin(!isLogin); setError(''); }}
        >
          {isLogin ? 'Need an account? Register' : 'Already have an account? Login'}
        </button>
      </div>
    </div>
  );
}
