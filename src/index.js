import React from 'react';
import { createRoot } from 'react-dom/client';  // ✅ React 18 API
import './index.css';
import App from './App';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min';

// Grab the root div
const container = document.getElementById('root');

// Create a root
const root = createRoot(container);

// Render App inside StrictMode
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
