import React, { useState } from 'react';
import { CoffeeIcon, ShieldIcon } from './AdminIcons.jsx';

export default function AdminLogin({ onSignIn, onLogin }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (!email.trim() || !password) {
      setError('Please enter your email and password.');
      return;
    }

    setLoading(true);
    try {
      const authFn = onSignIn || onLogin;
      if (typeof authFn === 'function') {
        await authFn({ email: email.trim(), password });
      } else {
        throw new Error('Authentication handler not provided');
      }
    } catch (err) {
      setError(err.message || 'Authentication failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      width: '100%',
      maxWidth: '400px',
      margin: '0 auto',
      padding: '1rem',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Plus Jakarta Sans", "Segoe UI", Roboto, sans-serif'
    }}>
      <div style={{
        background: '#ffffff',
        borderRadius: '20px',
        padding: '2.6rem 2.2rem',
        boxShadow: '0 10px 30px -5px rgba(0, 0, 0, 0.05), 0 0 1px 1px rgba(0, 0, 0, 0.04)',
        border: '1px solid #e2e8f0',
      }}>
        {/* Brand Header */}
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div style={{
            width: '48px',
            height: '48px',
            borderRadius: '14px',
            background: 'linear-gradient(135deg, #059669 0%, #10b981 100%)',
            color: '#ffffff',
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: '1rem',
            boxShadow: '0 8px 16px -2px rgba(16, 185, 129, 0.3)',
          }}>
            <CoffeeIcon size={24} />
          </div>
          <h1 style={{
            margin: '0 0 0.4rem',
            fontSize: '1.45rem',
            fontWeight: 800,
            color: '#0f172a',
            letterSpacing: '-0.02em'
          }}>
            Cafe Admin Portal
          </h1>
          <p style={{
            margin: 0,
            fontSize: '0.85rem',
            color: '#64748b',
            lineHeight: 1.45
          }}>
            Sign in to manage dishes, menu categories &amp; QR stands
          </p>
        </div>

        {/* Clean Form */}
        <form onSubmit={handleSubmit} autoComplete="on">
          <div style={{ marginBottom: '1.1rem' }}>
            <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#334155', marginBottom: '0.4rem' }}>
              Email Address
            </label>
            <input
              type="email"
              name="email"
              required
              autoComplete="username"
              placeholder="name@cafe.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={{
                width: '100%',
                padding: '0.75rem 0.95rem',
                borderRadius: '10px',
                border: '1px solid #cbd5e1',
                fontSize: '0.92rem',
                color: '#0f172a',
                background: '#ffffff',
                outline: 'none',
                boxSizing: 'border-box',
                transition: 'border-color 0.15s ease, box-shadow 0.15s ease'
              }}
              onFocus={(e) => {
                e.target.style.borderColor = '#10b981';
                e.target.style.boxShadow = '0 0 0 3px rgba(16, 185, 129, 0.15)';
              }}
              onBlur={(e) => {
                e.target.style.borderColor = '#cbd5e1';
                e.target.style.boxShadow = 'none';
              }}
            />
          </div>

          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#334155', marginBottom: '0.4rem' }}>
              Password
            </label>
            <input
              type="password"
              name="password"
              required
              autoComplete="current-password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={{
                width: '100%',
                padding: '0.75rem 0.95rem',
                borderRadius: '10px',
                border: '1px solid #cbd5e1',
                fontSize: '0.92rem',
                color: '#0f172a',
                background: '#ffffff',
                outline: 'none',
                boxSizing: 'border-box',
                transition: 'border-color 0.15s ease, box-shadow 0.15s ease'
              }}
              onFocus={(e) => {
                e.target.style.borderColor = '#10b981';
                e.target.style.boxShadow = '0 0 0 3px rgba(16, 185, 129, 0.15)';
              }}
              onBlur={(e) => {
                e.target.style.borderColor = '#cbd5e1';
                e.target.style.boxShadow = 'none';
              }}
            />
          </div>

          {error && (
            <div style={{
              background: '#fef2f2',
              border: '1px solid #fecaca',
              color: '#b91c1c',
              padding: '0.7rem 0.9rem',
              borderRadius: '8px',
              fontSize: '0.82rem',
              fontWeight: 500,
              marginBottom: '1.3rem',
              lineHeight: 1.4
            }}>
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            style={{
              width: '100%',
              padding: '0.82rem',
              borderRadius: '10px',
              border: 'none',
              background: loading ? '#94a3b8' : '#0f172a',
              color: '#ffffff',
              fontSize: '0.92rem',
              fontWeight: 700,
              cursor: loading ? 'wait' : 'pointer',
              boxShadow: '0 4px 12px rgba(15, 23, 42, 0.15)',
              transition: 'background 0.15s ease, transform 0.1s ease',
            }}
          >
            {loading ? 'Authenticating...' : 'Sign In'}
          </button>
        </form>

        {/* Subtle Link to Super Admin Console */}
        <div style={{ marginTop: '1.8rem', textAlign: 'center' }}>
          <a
            href="/superadmin"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              fontSize: '0.8rem',
              color: '#64748b',
              textDecoration: 'none',
              fontWeight: 600,
              transition: 'color 0.15s ease'
            }}
            onMouseEnter={(e) => (e.target.style.color = '#0f172a')}
            onMouseLeave={(e) => (e.target.style.color = '#64748b')}
          >
            <ShieldIcon size={14} />
            <span>Platform Console &nearr;</span>
          </a>
        </div>
      </div>
    </div>
  );
}
