
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
        const userData = {
          id: 1,
          nome: "Test User",
          email: email,
          role: "salesperson"
        };
        
        storageService.setItem('user', userData);
        toast.success("Login successful!");
        navigate("/dashboard");
      } else {
        toast.error("Please fill in all fields");
      }
    } catch (error) {
      toast.error("Login error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-slate-50 to-slate-100">
      <div className="p-4">
        <Button variant="ghost" size="sm" onClick={handleBack} className="flex items-center gap-2">
          <ArrowLeft size={16} />
          Back
        </Button>
      </div>
      
      <div className="flex-1 flex items-center justify-center px-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl">Access your account</CardTitle>
            <CardDescription>
              Enter to track your habits and goals
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="your@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
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
                {loading ? "Signing in..." : "Sign In"}
              </Button>
            </form>
            
            <div className="mt-6 text-center space-y-2">
              <Link 
                to="/recuperar-senha" 
                className="text-sm text-primary hover:underline"
              >
                Forgot your password?
              </Link>
              <div className="text-sm text-muted-foreground">
                Don't have an account?{" "}
                <Link to="/registro" className="text-primary hover:underline">
                  Create free account
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
