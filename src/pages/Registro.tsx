
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { UserAuth, UserRole } from "@/types/auth";

const Registro = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [nome, setNome] = useState("");
  const [nomeEmpresa, setNomeEmpresa] = useState("");
  const [tamanhoEquipe, setTamanhoEquipe] = useState("");
  const [segmento, setSegmento] = useState("");
  const [cargo, setCargo] = useState<UserRole>("vendedor");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      // Aqui seria integrado com Supabase ou outro provedor de autenticação
      console.log("Registrando:", { email, password, nome, nomeEmpresa, tamanhoEquipe, segmento, cargo });
      
      // Simula um atraso de rede
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Simulação de sucesso
      toast({
        title: "Conta criada com sucesso!",
        description: "Vamos configurar seu espaço agora.",
      });
      
      // Para demonstração, armazenamos no localStorage
      const userId = "user-" + Math.random().toString(36).substring(2, 9);
      const empresaId = "emp-" + Math.random().toString(36).substring(2, 7);
      const equipeId = "eqp-" + Math.random().toString(36).substring(2, 7);
      
      const userData: UserAuth = {
        id: userId,
        email,
        nome,
        role: cargo,
        empresa_id: empresaId,
        equipe_id: equipeId
      };
      
      localStorage.setItem("user", JSON.stringify(userData));
      
      navigate("/onboarding");
    } catch (error: any) {
      toast({
        title: "Erro no registro",
        description: error.message || "Ocorreu um erro ao criar sua conta. Tente novamente.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const segmentos = [
    "Tecnologia", 
    "Saúde", 
    "Educação", 
    "Finanças", 
    "Varejo", 
    "Serviços", 
    "Imobiliário",
    "Outros"
  ];

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 px-4 py-12">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1 text-center">
          <CardTitle className="text-3xl font-bold text-primary">Habitus</CardTitle>
          <CardDescription>
            Crie sua conta e comece a transformar sua equipe de vendas
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input 
                id="email" 
                type="email" 
                placeholder="seu@empresa.com" 
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
                placeholder="Mínimo 6 caracteres"
                value={password}
                onChange={(e) => setPassword(e.target.value)} 
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="nome">Seu Nome</Label>
              <Input 
                id="nome" 
                type="text"
                placeholder="Seu nome completo"
                value={nome}
                onChange={(e) => setNome(e.target.value)} 
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="cargo">Seu Cargo</Label>
              <Select value={cargo} onValueChange={(v) => setCargo(v as UserRole)} required>
                <SelectTrigger id="cargo">
                  <SelectValue placeholder="Selecione seu cargo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="gerente">Gerente de Vendas</SelectItem>
                  <SelectItem value="vendedor">Vendedor</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="nomeEmpresa">Nome da Empresa</Label>
              <Input 
                id="nomeEmpresa" 
                type="text"
                placeholder="Sua Empresa S.A."
                value={nomeEmpresa}
                onChange={(e) => setNomeEmpresa(e.target.value)} 
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="tamanhoEquipe">Tamanho da Equipe de Vendas</Label>
              <Select value={tamanhoEquipe} onValueChange={setTamanhoEquipe} required>
                <SelectTrigger id="tamanhoEquipe">
                  <SelectValue placeholder="Selecione o tamanho da equipe" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1-5">1-5 vendedores</SelectItem>
                  <SelectItem value="6-15">6-15 vendedores</SelectItem>
                  <SelectItem value="16-50">16-50 vendedores</SelectItem>
                  <SelectItem value="51+">Mais de 50 vendedores</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="segmento">Segmento de Atuação</Label>
              <Select value={segmento} onValueChange={setSegmento} required>
                <SelectTrigger id="segmento">
                  <SelectValue placeholder="Selecione o segmento" />
                </SelectTrigger>
                <SelectContent>
                  {segmentos.map((seg) => (
                    <SelectItem key={seg} value={seg.toLowerCase()}>
                      {seg}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardContent>
          
          <CardFooter className="flex flex-col space-y-4">
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Criando conta..." : "Criar conta"}
            </Button>
            <div className="text-center text-sm">
              Já tem uma conta?{" "}
              <Link to="/login" className="text-primary hover:underline">
                Faça login
              </Link>
            </div>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
};

export default Registro;
