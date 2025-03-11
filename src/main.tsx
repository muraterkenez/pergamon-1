import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { Toaster } from 'react-hot-toast';
import App from './App.tsx';
import { SupabaseProvider } from './contexts/SupabaseContext';
import './index.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <SupabaseProvider>
      <App />
      <Toaster position="top-right" />
    </SupabaseProvider>
  </StrictMode>
);