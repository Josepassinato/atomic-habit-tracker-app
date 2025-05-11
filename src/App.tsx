
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import LandingPage from "./pages/LandingPage";
import Login from "./pages/Login";
import Registro from "./pages/Registro";
import Onboarding from "./pages/Onboarding";
import Dashboard from "./pages/Dashboard";
import Tutorial from "./pages/Tutorial";
import Index from "./pages/Index";
import Relatorios from "./pages/Relatorios";

// Componente para proteger rotas
const PrivateRoute = ({ children }: { children: React.ReactNode }) => {
  const isAuthenticated = localStorage.getItem("user") !== null;
  return isAuthenticated ? <>{children}</> : <Navigate to="/login" replace />;
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
              <Dashboard />
            </PrivateRoute>
          } 
        />
        <Route 
          path="/relatorios" 
          element={
            <PrivateRoute>
              <Relatorios />
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
