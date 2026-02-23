import React from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import GameBoard from './components/GameBoard';

createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <GameBoard />
  </React.StrictMode>,
);
