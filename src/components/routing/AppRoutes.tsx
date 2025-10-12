
import React, { Suspense } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import ProtectedRoute from "./ProtectedRoute";
import { AuthPage } from "@/components/auth/AuthPage";
import AppLayout from "@/components/layout/AppLayout";

// Lazy load components for better performance
const LandingPage = React.lazy(() => import("@/pages/LandingPage"));
const RecuperarSenha = React.lazy(() => import("@/pages/RecuperarSenha"));
const Onboarding = React.lazy(() => import("@/pages/Onboarding"));
const Dashboard = React.lazy(() => import("@/pages/Dashboard"));
const Admin = React.lazy(() => import("@/pages/Admin"));
const AdminDashboard = React.lazy(() => import("@/pages/AdminDashboard"));
const Habitos = React.lazy(() => import("@/pages/Habitos"));
const Metas = React.lazy(() => import("@/pages/Metas"));
const GerenciarMetas = React.lazy(() => import("@/pages/GerenciarMetas"));
const Vendedores = React.lazy(() => import("@/pages/Vendedores"));
const Premiacoes = React.lazy(() => import("@/pages/Premiacoes"));
const Relatorios = React.lazy(() => import("@/pages/Relatorios"));
const Tutorial = React.lazy(() => import("@/pages/Tutorial"));
const Configuracoes = React.lazy(() => import("@/pages/Configuracoes"));
const Analytics = React.lazy(() => import("@/pages/Analytics"));
const Index = React.lazy(() => import("@/pages/Index"));
const NotFound = React.lazy(() => import("@/pages/NotFound"));

// Loading component
const PageLoader = () => (
  <div className="min-h-screen flex items-center justify-center">
    <Card className="w-full max-w-md">
      <CardContent className="p-6 space-y-4">
        <Skeleton className="h-8 w-3/4" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-2/3" />
        <div className="flex gap-2">
          <Skeleton className="h-10 flex-1" />
          <Skeleton className="h-10 flex-1" />
        </div>
      </CardContent>
    </Card>
  </div>
);

const AppRoutes: React.FC = () => {
  return (
    <Suspense fallback={<PageLoader />}>
      <Routes>
      {/* Rotas públicas */}
      <Route path="/" element={<LandingPage />} />
      <Route path="/auth" element={<AuthPage />} />
      <Route path="/login" element={<Navigate to="/auth" replace />} />
      <Route path="/registro" element={<Navigate to="/auth" replace />} />
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
        path="/analytics" 
        element={
          <ProtectedRoute requiredRole="gerente">
            <Analytics />
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
  </Suspense>
  );
};

export default AppRoutes;
