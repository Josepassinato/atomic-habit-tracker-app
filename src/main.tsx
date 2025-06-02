
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { ThemeProvider } from "@/components/ui/theme-provider";
import { LanguageProvider } from "@/i18n";
import { NotificacoesProvider } from "@/components/notificacoes/NotificacoesProvider";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <LanguageProvider>
      <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
        <NotificacoesProvider>
          <App />
        </NotificacoesProvider>
      </ThemeProvider>
    </LanguageProvider>
  </StrictMode>,
);
