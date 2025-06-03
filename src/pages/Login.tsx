
import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft } from "lucide-react";
import { toast } from "sonner";
import { storageService } from "@/services/storage-service";

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleBack = () => {
    navigate(-1);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Simulate login validation
      if (email && password) {
        // Determine user role based on email
        let userRole = "salesperson";
        if (email === "admin@habitus.com") {
          userRole = "admin";
        }
        
        const userData = {
          id: 1,
          nome: userRole === "admin" ? "Administrador" : "Test User",
          email: email,
          role: userRole
        };
        
        storageService.setItem('user', userData);
        toast.success(`Login realizado com sucesso! Papel: ${userRole}`);
        
        // Redirect based on role
        if (userRole === "admin") {
          navigate("/admin");
        } else {
          navigate("/dashboard");
        }
      } else {
        toast.error("Por favor, preencha todos os campos");
      }
    } catch (error) {
      toast.error("Erro no login");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-slate-50 to-slate-100">
      <div className="p-4">
        <Button variant="ghost" size="sm" onClick={handleBack} className="flex items-center gap-2">
          <ArrowLeft size={16} />
          Voltar
        </Button>
      </div>
      
      <div className="flex-1 flex items-center justify-center px-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl">Acesse sua conta</CardTitle>
            <CardDescription>
              Entre para acompanhar seus hábitos e metas
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="seu@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Senha</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? "Entrando..." : "Entrar"}
              </Button>
            </form>
            
            <div className="mt-6 p-3 bg-blue-50 border border-blue-200 rounded-md">
              <p className="text-sm text-blue-800 font-medium mb-2">Contas de teste:</p>
              <div className="text-xs text-blue-700 space-y-1">
                <p><strong>Admin:</strong> admin@habitus.com (qualquer senha)</p>
                <p><strong>Usuário:</strong> qualquer@email.com (qualquer senha)</p>
              </div>
            </div>
            
            <div className="mt-6 text-center space-y-2">
              <Link 
                to="/recuperar-senha" 
                className="text-sm text-primary hover:underline"
              >
                Esqueceu sua senha?
              </Link>
              <div className="text-sm text-muted-foreground">
                Não tem uma conta?{" "}
                <Link to="/registro" className="text-primary hover:underline">
                  Criar conta gratuita
                </Link>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Login;
