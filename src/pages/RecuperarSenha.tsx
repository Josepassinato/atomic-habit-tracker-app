
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
      toast.success("Recovery email sent!");
    } catch (error) {
      toast.error("Error sending recovery email");
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
            <CardTitle className="text-2xl">Recover password</CardTitle>
            <CardDescription>
              {enviado 
                ? "Check your email to reset your password"
                : "Enter your email to receive instructions"
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
                    placeholder="your@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? "Sending..." : "Send instructions"}
                </Button>
              </form>
            ) : (
              <div className="text-center space-y-4">
                <p className="text-sm text-muted-foreground">
                  We sent an email to <strong>{email}</strong> with instructions 
                  to reset your password.
                </p>
                <Button
                  variant="outline"
                  onClick={() => setEnviado(false)}
                  className="w-full"
                >
                  Send again
                </Button>
              </div>
            )}
            
            <div className="mt-6 text-center">
              <Link to="/auth" className="text-sm text-primary hover:underline">
                Back to login
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default RecuperarSenha;
