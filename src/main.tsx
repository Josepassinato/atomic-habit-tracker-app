
import React from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { SupabaseProvider } from './hooks/use-supabase.tsx'

createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <SupabaseProvider>
      <App />
    </SupabaseProvider>
  </React.StrictMode>
);
