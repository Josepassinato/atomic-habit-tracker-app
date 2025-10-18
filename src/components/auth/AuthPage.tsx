import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from './AuthProvider';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';

export const AuthPage: React.FC = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [role, setRole] = useState('vendedor');
  const [companyId, setCompanyId] = useState('');
  const [companies, setCompanies] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  
  const { signIn, signUp, user, userProfile } = useAuth();
  const navigate = useNavigate();

  // Redirect if already authenticated
  useEffect(() => {
    if (user) {
      navigate('/dashboard');
    }
  }, [user, navigate]);

  // Fetch companies for signup
  useEffect(() => {
    const fetchCompanies = async () => {
      const { data } = await supabase.from('companies').select('id, name');
      setCompanies(data || []);
    };
    
    if (!isLogin) {
      fetchCompanies();
    }
  }, [isLogin]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (isLogin) {
        const { error } = await signIn(email, password);
        if (error) {
          if (error.message.includes('Invalid login credentials')) {
            toast.error('Incorrect email or password');
          } else {
            toast.error('Login error: ' + error.message);
          }
        } else {
          toast.success('Login successful!');
          
          // Check if user needs onboarding
          // For new users or users without teams/habits, redirect to onboarding
          setTimeout(async () => {
            try {
              const { data: userTeams } = await supabase
                .from('teams')
                .select('id')
                .eq('company_id', userProfile?.empresa_id)
                .limit(1);
              
              const { data: userHabits } = await supabase
                .from('habits')
                .select('id')
                .eq('user_id', userProfile?.id)
                .limit(1);
              
              if (!userTeams?.length && !userHabits?.length) {
                navigate('/onboarding');
              } else {
                navigate('/dashboard');
              }
            } catch (error) {
              console.error('Error checking onboarding status:', error);
              navigate('/dashboard');
            }
          }, 1000);
        }
      } else {
        if (!name || !companyId) {
          toast.error('Please fill in all required fields');
          return;
        }

        const { error } = await signUp(email, password, {
          name,
          company_id: companyId
        });

        // Após criar o usuário, adiciona o role na tabela user_roles
        if (!error) {
          // O trigger handle_new_user já criou o perfil, agora adicionamos o role
          const { data: { user: newUser } } = await supabase.auth.getUser();
          if (newUser) {
            await supabase.from('user_roles').insert({
              user_id: newUser.id,
              role: role as 'admin' | 'gerente' | 'vendedor'
            });
          }
        }

        if (error) {
          if (error.message.includes('already registered')) {
            toast.error('This email is already registered');
          } else {
            toast.error('Account creation error: ' + error.message);
          }
        } else {
          toast.success('Account created successfully! Check your email.');
          setIsLogin(true);
        }
      }
    } catch (error) {
      toast.error('Unexpected error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background to-muted p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold">Habitus</CardTitle>
          <CardDescription>
            Sales management and atomic habits system
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs value={isLogin ? 'login' : 'signup'} onValueChange={(value) => setIsLogin(value === 'login')}>
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="login">Login</TabsTrigger>
              <TabsTrigger value="signup">Sign Up</TabsTrigger>
            </TabsList>
            
            <TabsContent value="login">
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    placeholder="seu@email.com"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    placeholder="••••••••"
                  />
                </div>
                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? 'Signing in...' : 'Sign In'}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  className="w-full"
                  onClick={() => {
                    setEmail('teste@habitus.com');
                    setPassword('Teste@123');
                    setTimeout(() => {
                      const form = document.querySelector('form');
                      form?.requestSubmit();
                    }, 100);
                  }}
                  disabled={loading}
                >
                  🚀 Login Rápido para Testes
                </Button>
              </form>
            </TabsContent>
            
            <TabsContent value="signup">
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="signup-name">Full name</Label>
                  <Input
                    id="signup-name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    placeholder="Your full name"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="signup-email">Email</Label>
                  <Input
                    id="signup-email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    placeholder="seu@email.com"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="signup-password">Password</Label>
                  <Input
                    id="signup-password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    placeholder="••••••••"
                    minLength={6}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="company">Company</Label>
                  <Select value={companyId} onValueChange={setCompanyId} required>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a company" />
                    </SelectTrigger>
                    <SelectContent>
                      {companies.map((company) => (
                        <SelectItem key={company.id} value={company.id}>
                          {company.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="role">Role</Label>
                  <Select value={role} onValueChange={setRole}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="vendedor">Salesperson</SelectItem>
                      <SelectItem value="gerente">Manager</SelectItem>
                      <SelectItem value="admin">Administrator</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? 'Creating account...' : 'Create Account'}
                </Button>
              </form>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};