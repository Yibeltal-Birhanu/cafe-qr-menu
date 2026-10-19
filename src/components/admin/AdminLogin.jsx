import React, { useState } from 'react';
import { LockIcon } from '../common/Icons.jsx';

export default function AdminLogin({ onSignIn, onLogin }) {
  const [loginMode, setLoginMode] = useState('manager'); // 'manager' | 'quick'
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (loginMode === 'manager') {
      if (!email.trim() || !password) {
        setError('Please enter your manager email and password.');
        return;
      }
    } else {
      if (!password) {
        setError('Please enter your admin password.');
        return;
      }
    }

    setLoading(true);
    try {
      const authFn = onSignIn || onLogin;
      if (typeof authFn === 'function') {
        if (loginMode === 'manager') {
          await authFn({ email: email.trim(), password });
        } else {
          await authFn({ password });
        }
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
    <section className="login" id="loginView">
      <div className="login__box" style={{ maxWidth: '440px', width: '100%' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '0.6rem' }}>
          <div style={{
            width: '40px',
            height: '40px',
            borderRadius: '10px',
            background: 'rgba(217, 119, 6, 0.12)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'var(--amber, #d97706)'
          }}>
            <LockIcon size={22} />
          </div>
          <div>
            <h1 style={{ margin: 0, fontSize: '1.45rem' }}>Cafe Admin Portal</h1>
            <p style={{ margin: 0, fontSize: '0.85rem', color: '#6b7280' }}>
              Sign in to manage your cafe menu, orders & QR displays
            </p>
          </div>
        </div>

        {/* Tab Switcher */}
        <div style={{
          display: 'flex',
          background: '#f3f4f6',
          borderRadius: '10px',
          padding: '4px',
          margin: '1.2rem 0',
          gap: '4px'
        }}>
          <button
            type="button"
            onClick={() => { setLoginMode('manager'); setError(null); }}
            style={{
              flex: 1,
              padding: '0.55rem 0.8rem',
              borderRadius: '8px',
              border: 'none',
              background: loginMode === 'manager' ? '#ffffff' : 'transparent',
              color: loginMode === 'manager' ? '#111827' : '#6b7280',
              fontWeight: 600,
              fontSize: '0.86rem',
              cursor: 'pointer',
              boxShadow: loginMode === 'manager' ? '0 1px 3px rgba(0,0,0,0.08)' : 'none',
              transition: 'all 0.15s ease'
            }}
          >
            Manager Sign In
          </button>
          <button
            type="button"
            onClick={() => { setLoginMode('quick'); setError(null); }}
            style={{
              flex: 1,
              padding: '0.55rem 0.8rem',
              borderRadius: '8px',
              border: 'none',
              background: loginMode === 'quick' ? '#ffffff' : 'transparent',
              color: loginMode === 'quick' ? '#111827' : '#6b7280',
              fontWeight: 600,
              fontSize: '0.86rem',
              cursor: 'pointer',
              boxShadow: loginMode === 'quick' ? '0 1px 3px rgba(0,0,0,0.08)' : 'none',
              transition: 'all 0.15s ease'
            }}
          >
            Quick Password
          </button>
        </div>

        <form id="loginForm" autoComplete="on" onSubmit={handleSubmit}>
          {loginMode === 'manager' ? (
            <>
              <label className="field" style={{ marginBottom: '0.9rem', display: 'block' }}>
                <span style={{ fontSize: '0.85rem', fontWeight: 600, color: '#374151', display: 'block', marginBottom: '0.3rem' }}>
                  Manager Email
                </span>
                <input
                  type="email"
                  id="email"
                  name="email"
                  required
                  autoComplete="username"
                  placeholder="manager@cafe.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '0.7rem 0.9rem',
                    borderRadius: '8px',
                    border: '1px solid #d1d5db',
                    fontSize: '0.95rem'
                  }}
                />
              </label>

              <label className="field" style={{ marginBottom: '1.2rem', display: 'block' }}>
                <span style={{ fontSize: '0.85rem', fontWeight: 600, color: '#374151', display: 'block', marginBottom: '0.3rem' }}>
                  Password
                </span>
                <input
                  type="password"
                  id="password"
                  name="password"
                  required
                  autoComplete="current-password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '0.7rem 0.9rem',
                    borderRadius: '8px',
                    border: '1px solid #d1d5db',
                    fontSize: '0.95rem'
                  }}
                />
              </label>
            </>
          ) : (
            <label className="field" style={{ marginBottom: '1.2rem', display: 'block' }}>
              <span style={{ fontSize: '0.85rem', fontWeight: 600, color: '#374151', display: 'block', marginBottom: '0.3rem' }}>
                Admin Master Password
              </span>
              <input
                type="password"
                id="password"
                name="password"
                required
                autoComplete="current-password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={{
                  width: '100%',
                  padding: '0.7rem 0.9rem',
                  borderRadius: '8px',
                  border: '1px solid #d1d5db',
                  fontSize: '0.95rem'
                }}
              />
            </label>
          )}

          <button
            className="btn btn--primary"
            type="submit"
            id="loginBtn"
            disabled={loading}
            style={{
              width: '100%',
              padding: '0.75rem',
              borderRadius: '8px',
              fontSize: '0.95rem',
              fontWeight: 600,
              cursor: loading ? 'wait' : 'pointer'
            }}
          >
            {loading ? 'Authenticating...' : loginMode === 'manager' ? 'Sign In to Cafe' : 'Sign In with Password'}
          </button>

          {error && (
            <div
              className="hint"
              id="loginError"
              style={{
                color: '#b91c1c',
                background: '#fef2f2',
                border: '1px solid #fecaca',
                padding: '0.6rem 0.8rem',
                borderRadius: '8px',
                marginTop: '1rem',
                fontSize: '0.85rem',
                fontWeight: 500,
              }}
            >
              {error}
            </div>
          )}
        </form>

        <p className="hint" style={{ marginTop: '1.2rem', fontSize: '0.8rem', color: '#6b7280' }}>
          {loginMode === 'manager'
            ? 'Managers are automatically scoped to their designated cafe branch.'
            : 'Master password defaults to admin123 (configurable via ADMIN_PASSWORD).'}
        </p>
      </div>
    </section>
  );
}
