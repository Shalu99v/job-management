import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.tsx';
import { BrowserRouter } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';

createRoot(document.getElementById('root')!).render(
  <BrowserRouter>
    <StrictMode>
      <App />
<Toaster
  position="top-right"
  toastOptions={{
    // Default styles for all toasts
    style: {
      padding: '12px 18px',
      borderRadius: '6px',
      color: '#fff',
      fontSize: '15px',
      fontWeight: 500,
    },

    // SUCCESS TOAST
    success: {
      style: {
        background: '#61C454', // green
      },
      iconTheme: {
        primary: '#ffffff',
        secondary: '#61C454',
      },
    },

    // ERROR TOAST
    error: {
      style: {
        background: '#E84C4C', // red
      },
      iconTheme: {
        primary: '#ffffff',
        secondary: '#E84C4C',
      },
    },
  }}
/>
    </StrictMode>
  
  </BrowserRouter>
);
