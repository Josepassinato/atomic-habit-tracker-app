
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { UserAuth, UserRole } from "@/types/auth";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    // Simulação de login para demonstração
    try {
      // Aqui seria integrado com Supabase ou outro provedor de autenticação
      console.log("Fazendo login com:", email, password);
      
      // Simula um atraso de rede
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Para demonstração, vamos verificar o tipo de usuário com base no email
      let role: UserRole = 'vendedor'; // Padrão é vendedor
      let userId = "user-" + Math.random().toString(36).substring(2, 9);
      
      if (email === "admin@habitus.com") {
        role = 'admin';
      } else if (email.includes("gerente")) {
        role = 'gerente';
      }

      // Para demonstração, definimos algumas IDs fictícias
      const empresaId = "emp-" + Math.random().toString(36).substring(2, 7);
      const equipeId = role !== 'admin' ? "eqp-" + Math.random().toString(36).substring(2, 7) : undefined;
      
      // Verificamos credenciais básicas
      if (email.includes("@") && password.length > 5) {
        // Login bem-sucedido
        const userData: UserAuth = {
          id: userId,
          email,
          nome: email.split('@')[0],
          role,
          empresa_id: role !== 'admin' ? empresaId : undefined,
          equipe_id: equipeId
        };
        
        localStorage.setItem("user", JSON.stringify(userData));
        
        toast({
          title: "Login realizado com sucesso",
          description: `Bem-vindo ao Habitus! Você está logado como ${role}.`,
        });
        
        // Redireciona com base no papel
        if (role === 'admin') {
          navigate("/admin");
        } else {
          navigate("/dashboard");
        }
      } else {
        throw new Error("Credenciais inválidas");
      }
    } catch (error: any) {
      toast({
        title: "Erro ao fazer login",
        description: error.message || "Verifique suas credenciais e tente novamente.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 px-4 py-12">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1 text-center">
          <CardTitle className="text-3xl font-bold text-primary">Habitus</CardTitle>
          <CardDescription>
            Entre com suas credenciais para acessar sua conta
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
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
              <p className="text-xs text-muted-foreground">
                Use admin@habitus.com para acesso admin, 
                gerente@exemplo.com para gerente, 
                ou qualquer outro email para vendedor.
              </p>
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password">Senha</Label>
                <Link to="/esqueci-senha" className="text-xs text-primary hover:underline">
                  Esqueceu a senha?
                </Link>
              </div>
              <Input 
                id="password" 
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)} 
                required
              />
            </div>
          </CardContent>
          <CardFooter className="flex flex-col space-y-4">
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Entrando..." : "Entrar"}
            </Button>
            <div className="text-center text-sm">
              Não tem uma conta?{" "}
              <Link to="/registro" className="text-primary hover:underline">
                Registre-se
              </Link>
            </div>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
};

export default Login;
