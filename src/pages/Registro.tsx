
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { UserAuth, UserRole } from "@/types/auth";
import { useLanguage } from "@/i18n";

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
  const { t } = useLanguage();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      // Integration with Supabase or other authentication provider would go here
      console.log("Registering:", { email, password, nome, nomeEmpresa, tamanhoEquipe, segmento, cargo });
      
      // Simulates network delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Success simulation
      toast({
        title: "Account created successfully!",
        description: "Let's set up your workspace now.",
      });
      
      // For demo purposes, store in localStorage
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
        title: "Registration error",
        description: error.message || "An error occurred while creating your account. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const segments = [
    "Technology", 
    "Healthcare", 
    "Education", 
    "Finance", 
    "Retail", 
    "Services", 
    "Real Estate",
    "Others"
  ];

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 px-4 py-12">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1 text-center">
          <CardTitle className="text-3xl font-bold text-primary">Habitus</CardTitle>
          <CardDescription>
            Create your account and start transforming your sales team
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">{t('email')}</Label>
              <Input 
                id="email" 
                type="email" 
                placeholder="your@company.com" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="password">{t('password')}</Label>
              <Input 
                id="password" 
                type="password"
                placeholder="Minimum 6 characters"
                value={password}
                onChange={(e) => setPassword(e.target.value)} 
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="nome">Your Name</Label>
              <Input 
                id="nome" 
                type="text"
                placeholder="Your full name"
                value={nome}
                onChange={(e) => setNome(e.target.value)} 
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="cargo">Your Role</Label>
              <Select value={cargo} onValueChange={(v) => setCargo(v as UserRole)} required>
                <SelectTrigger id="cargo">
                  <SelectValue placeholder="Select your role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="gerente">Sales Manager</SelectItem>
                  <SelectItem value="vendedor">Sales Representative</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="nomeEmpresa">Company Name</Label>
              <Input 
                id="nomeEmpresa" 
                type="text"
                placeholder="Your Company Inc."
                value={nomeEmpresa}
                onChange={(e) => setNomeEmpresa(e.target.value)} 
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="tamanhoEquipe">Sales Team Size</Label>
              <Select value={tamanhoEquipe} onValueChange={setTamanhoEquipe} required>
                <SelectTrigger id="tamanhoEquipe">
                  <SelectValue placeholder="Select team size" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1-5">1-5 sales reps</SelectItem>
                  <SelectItem value="6-15">6-15 sales reps</SelectItem>
                  <SelectItem value="16-50">16-50 sales reps</SelectItem>
                  <SelectItem value="51+">More than 50 sales reps</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="segmento">Industry Segment</Label>
              <Select value={segmento} onValueChange={setSegmento} required>
                <SelectTrigger id="segmento">
                  <SelectValue placeholder="Select industry" />
                </SelectTrigger>
                <SelectContent>
                  {segments.map((seg) => (
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
              {loading ? "Creating account..." : "Create account"}
            </Button>
            <div className="text-center text-sm">
              Already have an account?{" "}
              <Link to="/login" className="text-primary hover:underline">
                {t('login')}
              </Link>
            </div>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
};

export default Registro;
