import React, { useState } from 'react';
import { LockIcon } from '../common/Icons.jsx';

export default function AdminLogin({ onSignIn }) {
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!password) {
      setError('Please enter your admin password.');
      return;
    }
    setError(null);
    setLoading(true);
    try {
      await onSignIn(password);
    } catch (err) {
      setError(err.message || 'Incorrect password.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="login" id="loginView">
      <div className="login__box">
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '0.4rem' }}>
          <LockIcon size={24} style={{ color: 'var(--amber)' }} />
          <h1 style={{ margin: 0 }}>Admin Sign In</h1>
        </div>
        <p>Enter the admin password to control menu categories, food items, prices, and settings.</p>
        <form id="loginForm" autoComplete="on" onSubmit={handleSubmit}>
          <label className="field">
            <span>Password</span>
            <input
              type="password"
              id="password"
              name="password"
              required
              autoComplete="current-password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </label>
          <button
            className="btn btn--primary"
            type="submit"
            id="loginBtn"
            disabled={loading}
          >
            {loading ? 'Signing in...' : 'Sign in'}
          </button>
          {error && (
            <p className="hint" id="loginError" style={{ color: '#ef4444', fontWeight: 600 }}>
              {error}
            </p>
          )}
        </form>
        <p className="hint">
          Default password is <code>admin123</code> &mdash; set via <code>ADMIN_PASSWORD</code> environment variable.
        </p>
      </div>
    </section>
  );
}
