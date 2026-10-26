import React from 'react';
import { createRoot } from 'react-dom/client';
import MenuApp from '../components/menu/MenuApp.jsx';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }
  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }
  componentDidCatch(error, errorInfo) {
    console.error('MenuApp render error:', error, errorInfo);
  }
  render() {
    if (this.state.hasError) {
      return (
        <div style={{ padding: '2rem', textAlign: 'center', background: '#ffffff', color: '#111827', minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', fontFamily: 'sans-serif' }}>
          <h2 style={{ fontSize: '1.4rem', marginBottom: '0.5rem' }}>Unable to Display Menu</h2>
          <p style={{ color: '#64748b', marginBottom: '1.5rem', maxWidth: '400px', fontSize: '0.9rem', lineHeight: 1.5 }}>
            We encountered an unexpected display issue. Please reload to refresh the live digital menu.
          </p>
          <button
            type="button"
            onClick={() => window.location.reload()}
            style={{ padding: '0.7rem 1.6rem', borderRadius: '999px', background: '#1c2826', color: '#ffffff', border: 'none', cursor: 'pointer', fontWeight: 700, fontSize: '0.9rem' }}
          >
            Reload Menu
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

const container = document.getElementById('root');
if (container) {
  const root = createRoot(container);
  root.render(
    <ErrorBoundary>
      <MenuApp />
    </ErrorBoundary>
  );
}
