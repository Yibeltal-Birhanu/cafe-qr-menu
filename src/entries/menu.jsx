import React from 'react';
import { createRoot } from 'react-dom/client';
import MenuApp from '../components/menu/MenuApp.jsx';

const container = document.getElementById('root');
if (container) {
  const root = createRoot(container);
  root.render(<MenuApp />);
}
