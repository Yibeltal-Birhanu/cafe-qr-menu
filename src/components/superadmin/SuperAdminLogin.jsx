import React, { useState } from 'react';
import { ShieldIcon, KeyIcon } from '../admin/AdminIcons.jsx';

export default function SuperAdminLogin({ onLogin }) {
  const [loginMode, setLoginMode] = useState('email'); // 'email' | 'master'
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (loginMode === 'email' && !email.trim()) {
      setError('Please enter your Super Admin email address.');
      return;
    }
    if (!password) {
      setError('Please enter your password.');
      return;
    }

    setLoading(true);
    try {
      if (loginMode === 'email') {
        await onLogin({ email: email.trim(), password });
      } else {
        await onLogin({ password });
      }
    } catch (err) {
      setError(err.message || 'Authentication failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '1.5rem',
      background: '#f8fafc',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Plus Jakarta Sans", "Segoe UI", Roboto, sans-serif'
    }}>
      <div
        style={{
          width: '100%',
          maxWidth: '420px',
          background: '#ffffff',
          border: '1px solid #e2e8f0',
          borderRadius: '20px',
          padding: '2.6rem 2.2rem',
          boxShadow: '0 10px 30px -5px rgba(0, 0, 0, 0.05), 0 0 1px 1px rgba(0, 0, 0, 0.04)',
        }}
      >
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '1.8rem' }}>
          <div
            style={{
              width: '48px',
              height: '48px',
              borderRadius: '14px',
              background: 'linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)',
              color: '#ffffff',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 12px',
              boxShadow: '0 8px 16px -2px rgba(37, 99, 235, 0.3)',
            }}
          >
            <ShieldIcon size={24} />
          </div>
          <h1 style={{ margin: 0, fontSize: '1.45rem', fontWeight: 800, color: '#0f172a', letterSpacing: '-0.02em' }}>
            Super Admin Console
          </h1>
          <p style={{ margin: '6px 0 0', fontSize: '0.85rem', color: '#64748b' }}>
            Executive multi-tenant platform administration
          </p>
        </div>

        {/* Mode Selector Tabs */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '6px',
          background: '#f1f5f9',
          padding: '4px',
          borderRadius: '12px',
          marginBottom: '1.5rem',
        }}>
          <button
            type="button"
            onClick={() => { setLoginMode('email'); setError(null); }}
            style={{
              padding: '0.55rem',
              border: 'none',
              borderRadius: '9px',
              fontSize: '0.82rem',
              fontWeight: 700,
              cursor: 'pointer',
              background: loginMode === 'email' ? '#ffffff' : 'transparent',
              color: loginMode === 'email' ? '#0f172a' : '#64748b',
              boxShadow: loginMode === 'email' ? '0 1px 3px rgba(0,0,0,0.08)' : 'none',
              transition: 'all 0.15s ease',
            }}
          >
            Better Auth Email
          </button>
          <button
            type="button"
            onClick={() => { setLoginMode('master'); setError(null); }}
            style={{
              padding: '0.55rem',
              border: 'none',
              borderRadius: '9px',
              fontSize: '0.82rem',
              fontWeight: 700,
              cursor: 'pointer',
              background: loginMode === 'master' ? '#ffffff' : 'transparent',
              color: loginMode === 'master' ? '#0f172a' : '#64748b',
              boxShadow: loginMode === 'master' ? '0 1px 3px rgba(0,0,0,0.08)' : 'none',
              transition: 'all 0.15s ease',
            }}
          >
            Master Key
          </button>
        </div>

        {/* Clean Form */}
        <form onSubmit={handleSubmit} autoComplete="on">
          {loginMode === 'email' && (
            <div style={{ marginBottom: '1.1rem' }}>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#334155', marginBottom: '0.4rem' }}>
                Executive Email Address
              </label>
              <input
                type="email"
                name="email"
                required
                autoComplete="username"
                placeholder="superadmin@cafemenu.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                style={{
                  width: '100%',
                  padding: '0.75rem 0.95rem',
                  borderRadius: '10px',
                  border: '1px solid #cbd5e1',
                  background: '#ffffff',
                  color: '#0f172a',
                  fontSize: '0.92rem',
                  outline: 'none',
                  boxSizing: 'border-box',
                  transition: 'border-color 0.15s ease, box-shadow 0.15s ease',
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = '#2563eb';
                  e.target.style.boxShadow = '0 0 0 3px rgba(37, 99, 235, 0.15)';
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = '#cbd5e1';
                  e.target.style.boxShadow = 'none';
                }}
              />
            </div>
          )}

          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#334155', marginBottom: '0.4rem' }}>
              {loginMode === 'email' ? 'Account Password' : 'Master Admin Password'}
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
                background: '#ffffff',
                color: '#0f172a',
                fontSize: '0.92rem',
                outline: 'none',
                boxSizing: 'border-box',
                transition: 'border-color 0.15s ease, box-shadow 0.15s ease',
              }}
              onFocus={(e) => {
                e.target.style.borderColor = '#2563eb';
                e.target.style.boxShadow = '0 0 0 3px rgba(37, 99, 235, 0.15)';
              }}
              onBlur={(e) => {
                e.target.style.borderColor = '#cbd5e1';
                e.target.style.boxShadow = 'none';
              }}
            />
          </div>

          {error && (
            <div
              style={{
                background: '#fef2f2',
                border: '1px solid #fecaca',
                color: '#b91c1c',
                padding: '0.7rem 0.9rem',
                borderRadius: '8px',
                fontSize: '0.82rem',
                fontWeight: 500,
                marginBottom: '1.3rem',
                lineHeight: 1.4,
              }}
            >
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
            {loading ? 'Authenticating...' : loginMode === 'email' ? 'Sign In to Console' : 'Authenticate with Master Key'}
          </button>
        </form>

        {/* Link to Cafe Admin */}
        <div style={{ textAlign: 'center', marginTop: '1.8rem' }}>
          <a
            href="/admin"
            style={{
              color: '#64748b',
              fontSize: '0.8rem',
              textDecoration: 'none',
              fontWeight: 600,
              transition: 'color 0.15s ease',
            }}
            onMouseEnter={(e) => (e.target.style.color = '#0f172a')}
            onMouseLeave={(e) => (e.target.style.color = '#64748b')}
          >
            Switch to Cafe Admin Portal (/admin) &rarr;
          </a>
        </div>
      </div>
    </div>
  );
}
