
import React from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { SupabaseProvider } from './hooks/use-supabase.tsx'
import { ThemeProvider } from './components/ui/theme-provider.tsx'
import { NotificacoesProvider } from './components/notificacoes/NotificacoesProvider.tsx'
import { LanguageProvider } from './contexts/LanguageContext.tsx'

createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <ThemeProvider defaultTheme="light">
      <LanguageProvider>
        <NotificacoesProvider>
          <SupabaseProvider>
            <App />
          </SupabaseProvider>
        </NotificacoesProvider>
      </LanguageProvider>
    </ThemeProvider>
  </React.StrictMode>
);
