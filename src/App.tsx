
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import LandingPage from "./pages/LandingPage";
import Login from "./pages/Login";
import Registro from "./pages/Registro";
import Onboarding from "./pages/Onboarding";
import Dashboard from "./pages/Dashboard";
import Admin from "./pages/Admin";
import Habitos from "./pages/Habitos";
import Metas from "./pages/Metas";
import Relatorios from "./pages/Relatorios";
import Tutorial from "./pages/Tutorial";
import Configuracoes from "./pages/Configuracoes";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import { SidebarProvider } from "@/components/ui/sidebar";
import AppSidebar from "@/components/AppSidebar";
import { Toaster } from "sonner";
import { getCurrentUser, hasPermission } from "./utils/permissions";
import { UserRole } from "./types/auth";

// Componente para proteger rotas com base em permissão
const ProtectedRoute = ({ 
  children, 
  requiredRole = 'vendedor' 
}: { 
  children: React.ReactNode;
  requiredRole?: UserRole;
}) => {
  const user = getCurrentUser();
  const isAuthenticated = user !== null;
  const hasAccess = isAuthenticated && hasPermission(user, requiredRole);
  
  return isAuthenticated && hasAccess ? (
    <>{children}</>
  ) : (
    <Navigate to={isAuthenticated ? "/dashboard" : "/login"} replace />
  );
};

// Componente para aplicar o layout da aplicação com sidebar
const AppLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full bg-background">
        <AppSidebar />
        <div className="flex-1">
          {children}
        </div>
      </div>
    </SidebarProvider>
  );
};

function App() {
  return (
    <BrowserRouter>
      <Toaster richColors closeButton position="top-right" />
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/registro" element={<Registro />} />
        <Route 
          path="/onboarding" 
          element={
            <ProtectedRoute>
              <Onboarding />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/dashboard" 
          element={
            <ProtectedRoute>
              <AppLayout>
                <Dashboard />
              </AppLayout>
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/admin" 
          element={
            <ProtectedRoute requiredRole="admin">
              <AppLayout>
                <Admin />
              </AppLayout>
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/habitos" 
          element={
            <ProtectedRoute>
              <AppLayout>
                <Habitos />
              </AppLayout>
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/metas" 
          element={
            <ProtectedRoute requiredRole="gerente">
              <AppLayout>
                <Metas />
              </AppLayout>
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/relatorios" 
          element={
            <ProtectedRoute requiredRole="gerente">
              <AppLayout>
                <Relatorios />
              </AppLayout>
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/configuracoes" 
          element={
            <ProtectedRoute>
              <AppLayout>
                <Configuracoes />
              </AppLayout>
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/tutorial" 
          element={
            <ProtectedRoute>
              <Tutorial />
            </ProtectedRoute>
          } 
        />
        {/* Rota legada - para compatibilidade durante desenvolvimento */}
        <Route path="/index" element={<Index />} />
        
        {/* Rota para páginas não encontradas */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
