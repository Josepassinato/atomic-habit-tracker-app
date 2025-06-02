
import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft } from "lucide-react";
import { toast } from "sonner";

const RecuperarSenha = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [enviado, setEnviado] = useState(false);

  const handleBack = () => {
    navigate(-1);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Simulate password recovery email
      await new Promise(resolve => setTimeout(resolve, 1000));
      setEnviado(true);
      toast.success("Email de recuperação enviado!");
    } catch (error) {
      toast.error("Erro ao enviar email de recuperação");
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
            <CardTitle className="text-2xl">Recuperar senha</CardTitle>
            <CardDescription>
              {enviado 
                ? "Verifique seu email para redefinir sua senha"
                : "Digite seu email para receber as instruções"
              }
            </CardDescription>
          </CardHeader>
          <CardContent>
            {!enviado ? (
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
                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? "Enviando..." : "Enviar instruções"}
                </Button>
              </form>
            ) : (
              <div className="text-center space-y-4">
                <p className="text-sm text-muted-foreground">
                  Enviamos um email para <strong>{email}</strong> com as instruções 
                  para redefinir sua senha.
                </p>
                <Button
                  variant="outline"
                  onClick={() => setEnviado(false)}
                  className="w-full"
                >
                  Enviar novamente
                </Button>
              </div>
            )}
            
            <div className="mt-6 text-center">
              <Link to="/login" className="text-sm text-primary hover:underline">
                Voltar para o login
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default RecuperarSenha;
