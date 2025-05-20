
import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { UserAuth, UserRole } from "@/types/auth";
import { getCurrentUser } from "@/utils/permissions";
import { useLanguage } from "@/i18n";
import { storageService } from "@/services/storage-service";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { t } = useLanguage();
  
  // Check if user is already logged in
  useEffect(() => {
    const user = getCurrentUser();
    if (user) {
      // If already logged in, redirect to appropriate page
      if (user.role === 'admin') {
        navigate("/admin");
      } else {
        navigate("/dashboard");
      }
    }
  }, [navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      console.log("Attempting login with:", email, password);
      
      // Simulates a network delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Determine user role based on email for demo
      let role: UserRole = 'vendedor'; // Default is seller
      let userId = "user-" + Math.random().toString(36).substring(2, 9);
      
      if (email === "admin@habitus.com") {
        role = 'admin';
      } else if (email.includes("gerente")) {
        role = 'gerente';
      }

      // Define some demo IDs
      const empresaId = "emp-" + Math.random().toString(36).substring(2, 7);
      const equipeId = role !== 'admin' ? "eqp-" + Math.random().toString(36).substring(2, 7) : undefined;
      
      // Basic credential check
      if (email.includes("@") && password.length > 5) {
        // Successful login
        const userData: UserAuth = {
          id: userId,
          email,
          nome: email.split('@')[0],
          role,
          empresa_id: role !== 'admin' ? empresaId : undefined,
          equipe_id: equipeId
        };
        
        // Store user in localStorage using the storage service
        storageService.setItem("user", userData);
        
        toast.success(t('loginSuccess'), {
          description: t('welcomeMessage').replace('{{role}}', role),
        });
        
        console.log("Login successful, redirecting to:", role === 'admin' ? "/admin" : "/dashboard");
        
        // Redirect based on role with a small delay to ensure storage is complete
        setTimeout(() => {
          if (role === 'admin') {
            navigate("/admin");
          } else {
            navigate("/dashboard");
          }
        }, 100);
      } else {
        throw new Error(t('invalidCredentials'));
      }
    } catch (error: any) {
      toast.error(t('loginError'), {
        description: error.message || t('checkCredentials'),
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 dark:bg-gray-900 px-4 py-12">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1 text-center">
          <CardTitle className="text-3xl font-bold text-primary">Habitus</CardTitle>
          <CardDescription>
            {t('loginTitle')}
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">{t('email')}</Label>
              <Input 
                id="email" 
                type="email" 
                placeholder="seu@email.com" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <p className="text-xs text-muted-foreground">
                {t('adminInfo')}
              </p>
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password">{t('password')}</Label>
                <Link to="/recuperar-senha" className="text-xs text-primary hover:underline">
                  {t('forgotPassword')}
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
              {loading ? t('entering') : t('enter')}
            </Button>
            <div className="text-center text-sm">
              {t('dontHaveAccount')}{" "}
              <Link to="/registro" className="text-primary hover:underline">
                {t('signUp')}
              </Link>
            </div>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
};

export default Login;
