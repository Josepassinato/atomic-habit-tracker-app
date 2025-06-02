
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import LandingPage from "./pages/LandingPage";
import Login from "./pages/Login";
import Registro from "./pages/Registro";
import RecuperarSenha from "./pages/RecuperarSenha";
import Onboarding from "./pages/Onboarding";
import Dashboard from "./pages/Dashboard";
import Admin from "./pages/Admin";
import AdminDashboard from "./pages/AdminDashboard";
import Habitos from "./pages/Habitos";
import Metas from "./pages/Metas";
import GerenciarMetas from "./pages/GerenciarMetas";
import Vendedores from "./pages/Vendedores";
import Premiacoes from "./pages/Premiacoes";
import Relatorios from "./pages/Relatorios";
import Tutorial from "./pages/Tutorial";
import Configuracoes from "./pages/Configuracoes";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Header from "./components/Header";
import { SidebarProvider } from "@/components/ui/sidebar";
import AppSidebar from "@/components/AppSidebar";
import { Toaster } from "sonner";
import { getCurrentUser, hasPermission } from "./utils/permissions";
import { UserRole } from "./types/auth";
import PageNavigation from "./components/PageNavigation";

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
  
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  
  if (isAuthenticated && !hasAccess) {
    return <Navigate to="/dashboard" replace />;
  }
  
  return <>{children}</>;
};

// Componente para aplicar o layout da aplicação com sidebar e header
const AppLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="flex min-h-screen w-full bg-background">
      <Header />
      <SidebarProvider>
        <div className="flex min-h-screen w-full bg-background pt-16">
          <AppSidebar />
          <div className="flex-1 overflow-auto">
            <PageNavigation />
            {children}
          </div>
        </div>
      </SidebarProvider>
    </div>
  );
};

function App() {
  return (
    <BrowserRouter>
      <Toaster richColors closeButton position="top-right" />
      <Routes>
        {/* Rotas públicas */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/registro" element={<Registro />} />
        <Route path="/recuperar-senha" element={<RecuperarSenha />} />
        
        {/* Rotas protegidas */}
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
          path="/admin-dashboard" 
          element={
            <ProtectedRoute requiredRole="admin">
              <AppLayout>
                <AdminDashboard />
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
          path="/gerenciar-metas" 
          element={
            <ProtectedRoute requiredRole="gerente">
              <AppLayout>
                <GerenciarMetas />
              </AppLayout>
            </ProtectedRoute>
          } 
        />
        
        <Route 
          path="/vendedores" 
          element={
            <ProtectedRoute requiredRole="gerente">
              <AppLayout>
                <Vendedores />
              </AppLayout>
            </ProtectedRoute>
          } 
        />
        
        <Route 
          path="/premiacoes" 
          element={
            <ProtectedRoute requiredRole="gerente">
              <AppLayout>
                <Premiacoes />
              </AppLayout>
            </ProtectedRoute>
          } 
        />
        
        <Route 
          path="/relatorios" 
          element={
            <ProtectedRoute requiredRole="gerente">
              <Relatorios />
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
