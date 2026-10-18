import React, { useState } from 'react';
import { CoffeeIcon } from './AdminIcons.jsx';

export default function AdminLogin({ onSignIn, onLogin }) {
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const loginFn = onSignIn || onLogin;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!password) {
      setError('Please enter your admin password.');
      return;
    }
    setError(null);
    setLoading(true);
    try {
      if (typeof loginFn === 'function') {
        await loginFn(password);
      } else {
        throw new Error('Login handler is not configured.');
      }
    } catch (err) {
      setError(err.message || 'Incorrect password.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      id="loginView"
      style={{
        width: '100%',
        maxWidth: '440px',
        background: '#ffffff',
        borderRadius: '20px',
        padding: '2.5rem 2.2rem',
        boxShadow: '0 20px 40px rgba(0, 0, 0, 0.08), 0 1px 3px rgba(0, 0, 0, 0.04)',
        border: '1px solid #e5e7eb',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        textAlign: 'center',
      }}
    >
      {/* Brand Icon Header */}
      <div
        style={{
          width: '56px',
          height: '56px',
          borderRadius: '16px',
          background: '#142820',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#10b981',
          marginBottom: '1.2rem',
          boxShadow: '0 8px 20px rgba(20, 40, 32, 0.2)',
        }}
      >
        <CoffeeIcon size={28} />
      </div>

      <h1
        style={{
          margin: '0 0 0.4rem',
          fontSize: '1.6rem',
          fontWeight: 800,
          color: '#111827',
          letterSpacing: '-0.02em',
        }}
      >
        Admin Sign In
      </h1>

      <p
        style={{
          margin: '0 0 1.8rem',
          fontSize: '0.86rem',
          color: '#6b7280',
          lineHeight: 1.45,
        }}
      >
        Enter your admin password to manage categories, dishes, QR templates, and cafe settings.
      </p>

      {error && (
        <div
          id="loginError"
          style={{
            width: '100%',
            background: '#fef2f2',
            border: '1px solid #fecaca',
            color: '#dc2626',
            padding: '0.75rem 1rem',
            borderRadius: '10px',
            fontSize: '0.84rem',
            fontWeight: 600,
            marginBottom: '1.2rem',
            textAlign: 'left',
          }}
        >
          {error}
        </div>
      )}

      <form
        id="loginForm"
        autoComplete="on"
        onSubmit={handleSubmit}
        style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '1.2rem' }}
      >
        <div style={{ textAlign: 'left' }}>
          <label
            htmlFor="password"
            style={{
              display: 'block',
              fontSize: '0.82rem',
              fontWeight: 700,
              color: '#374151',
              marginBottom: '0.4rem',
            }}
          >
            Password
          </label>
          <input
            type="password"
            id="password"
            name="password"
            required
            autoComplete="current-password"
            placeholder="Enter password..."
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={{
              width: '100%',
              padding: '0.8rem 1rem',
              borderRadius: '10px',
              border: '1px solid #d1d5db',
              fontSize: '0.95rem',
              outline: 'none',
              boxSizing: 'border-box',
              transition: 'border-color 0.15s, box-shadow 0.15s',
            }}
            onFocus={(e) => {
              e.currentTarget.style.borderColor = '#10b981';
              e.currentTarget.style.boxShadow = '0 0 0 3px rgba(16, 185, 129, 0.15)';
            }}
            onBlur={(e) => {
              e.currentTarget.style.borderColor = '#d1d5db';
              e.currentTarget.style.boxShadow = 'none';
            }}
          />
        </div>

        <button
          type="submit"
          id="loginBtn"
          disabled={loading}
          style={{
            width: '100%',
            padding: '0.85rem 1rem',
            borderRadius: '10px',
            background: '#142820',
            color: '#ffffff',
            border: 'none',
            fontSize: '0.92rem',
            fontWeight: 700,
            cursor: loading ? 'not-allowed' : 'pointer',
            opacity: loading ? 0.75 : 1,
            transition: 'background 0.15s, transform 0.1s',
            marginTop: '0.4rem',
          }}
        >
          {loading ? 'Verifying...' : 'Sign In to Dashboard'}
        </button>
      </form>

      <div
        style={{
          marginTop: '1.8rem',
          paddingTop: '1.2rem',
          borderTop: '1px solid #f3f4f6',
          width: '100%',
          fontSize: '0.78rem',
          color: '#9ca3af',
        }}
      >
        Default password is <code style={{ color: '#10b981', fontWeight: 700, background: '#f3f4f6', padding: '2px 6px', borderRadius: '4px' }}>admin123</code>
      </div>
    </div>
  );
}
