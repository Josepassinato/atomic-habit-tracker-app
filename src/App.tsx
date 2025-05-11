
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import LandingPage from "./pages/LandingPage";
import Login from "./pages/Login";
import Registro from "./pages/Registro";
import Onboarding from "./pages/Onboarding";
import Dashboard from "./pages/Dashboard";
import Habitos from "./pages/Habitos";
import Metas from "./pages/Metas";
import Relatorios from "./pages/Relatorios";
import Tutorial from "./pages/Tutorial";
import Configuracoes from "./pages/Configuracoes";
import Index from "./pages/Index";
import { SidebarProvider } from "@/components/ui/sidebar";
import AppSidebar from "@/components/AppSidebar";
import { Toaster } from "@/components/ui/sonner";

// Componente para proteger rotas
const PrivateRoute = ({ children }: { children: React.ReactNode }) => {
  const isAuthenticated = localStorage.getItem("user") !== null;
  return isAuthenticated ? <>{children}</> : <Navigate to="/login" replace />;
};

// Componente para aplicar o layout da aplicação com sidebar
const AppLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full bg-slate-50">
        <AppSidebar />
        <div className="flex-1">
          <Toaster />
          {children}
        </div>
      </div>
    </SidebarProvider>
  );
};

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/registro" element={<Registro />} />
        <Route 
          path="/onboarding" 
          element={
            <PrivateRoute>
              <Onboarding />
            </PrivateRoute>
          } 
        />
        <Route 
          path="/dashboard" 
          element={
            <PrivateRoute>
              <AppLayout>
                <Dashboard />
              </AppLayout>
            </PrivateRoute>
          } 
        />
        <Route 
          path="/habitos" 
          element={
            <PrivateRoute>
              <AppLayout>
                <Habitos />
              </AppLayout>
            </PrivateRoute>
          } 
        />
        <Route 
          path="/metas" 
          element={
            <PrivateRoute>
              <AppLayout>
                <Metas />
              </AppLayout>
            </PrivateRoute>
          } 
        />
        <Route 
          path="/relatorios" 
          element={
            <PrivateRoute>
              <AppLayout>
                <Relatorios />
              </AppLayout>
            </PrivateRoute>
          } 
        />
        <Route 
          path="/configuracoes" 
          element={
            <PrivateRoute>
              <AppLayout>
                <Configuracoes />
              </AppLayout>
            </PrivateRoute>
          } 
        />
        <Route 
          path="/tutorial" 
          element={
            <PrivateRoute>
              <Tutorial />
            </PrivateRoute>
          } 
        />
        {/* Rota legada - para compatibilidade durante desenvolvimento */}
        <Route path="/index" element={<Index />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
