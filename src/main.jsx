import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import { initClarity } from './analytics/clarity.js';
import { initGA } from './analytics/ga.js';
import './styles/global.css';
import './styles/button.css';

initClarity(); // Microsoft Clarity — heatmaps + recordings
initGA(); // GA4 — behavioural events (no-op until a Measurement ID is set)

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
