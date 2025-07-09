import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/components/auth/AuthProvider';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { 
  Sparkles, 
  Users, 
  Target, 
  Zap, 
  Link, 
  Gift, 
  CheckCircle, 
  ArrowRight,
  ArrowLeft,
  Loader2 
} from 'lucide-react';
import OnboardingTemplateSelector from '@/components/onboarding/OnboardingTemplateSelector';

interface OnboardingTemplate {
  id: string;
  name: string;
  segment: string;
  description: string;
  default_habits: any[];
  default_goals: any[];
  suggested_integrations: string[];
}

interface Team {
  id: string;
  name: string;
  company_id?: string;
  total_goal?: number;
}

const OnboardingFlow: React.FC = () => {
  const { userProfile } = useAuth();
  const navigate = useNavigate();
  
  const [currentStep, setCurrentStep] = useState(0);
  const [selectedTemplate, setSelectedTemplate] = useState<OnboardingTemplate | null>(null);
  const [loading, setLoading] = useState(false);
  const [teams, setTeams] = useState<Team[]>([]);
  const [selectedTeam, setSelectedTeam] = useState<Team | null>(null);
  const [isApplyingTemplate, setIsApplyingTemplate] = useState(false);

  const steps = [
    { id: 'template', title: 'Escolher Template', icon: Sparkles },
    { id: 'team', title: 'Configurar Equipe', icon: Users },
    { id: 'apply', title: 'Aplicar Template', icon: Target },
    { id: 'complete', title: 'Finalizar', icon: CheckCircle }
  ];

  useEffect(() => {
    fetchUserTeams();
  }, [userProfile]);

  const fetchUserTeams = async () => {
    if (!userProfile?.empresa_id) return;

    try {
      const { data, error } = await supabase
        .from('teams')
        .select('*')
        .eq('company_id', userProfile.empresa_id);

      if (error) throw error;
      setTeams(data || []);
      
      // Auto-select first team if only one exists
      if (data && data.length === 1) {
        setSelectedTeam(data[0]);
      }
    } catch (error) {
      console.error('Erro ao buscar equipes:', error);
    }
  };

  const handleTemplateSelect = (template: OnboardingTemplate) => {
    setSelectedTemplate(template);
    toast.success(`Template "${template.name}" selecionado!`);
  };

  const createNewTeam = async () => {
    if (!userProfile?.empresa_id) return;

    setLoading(true);
    try {
      const newTeam = {
        name: `Equipe ${userProfile.nome}`,
        company_id: userProfile.empresa_id,
        total_goal: 100000
      };

      const { data, error } = await supabase
        .from('teams')
        .insert([newTeam])
        .select()
        .single();

      if (error) throw error;

      setTeams(prev => [...prev, data]);
      setSelectedTeam(data);
      toast.success('Nova equipe criada!');
    } catch (error) {
      console.error('Erro ao criar equipe:', error);
      toast.error('Erro ao criar equipe');
    } finally {
      setLoading(false);
    }
  };

  const applyTemplate = async () => {
    if (!selectedTemplate || !selectedTeam || !userProfile) return;

    setIsApplyingTemplate(true);
    try {
      // Apply habits
      if (selectedTemplate.default_habits.length > 0) {
        const habits = selectedTemplate.default_habits.map(habit => ({
          title: habit.title,
          description: habit.description,
          schedule: habit.schedule,
          team_id: selectedTeam.id,
          user_id: userProfile.id,
          recurrence: 'diario',
          completed: false,
          verified: false
        }));

        const { error: habitsError } = await supabase
          .from('habits')
          .insert(habits);

        if (habitsError) throw habitsError;
      }

      // Apply goals
      if (selectedTemplate.default_goals.length > 0) {
        const goals = selectedTemplate.default_goals.map(goal => ({
          name: goal.name,
          target_value: goal.target,
          current_value: 0,
          percentage: 0,
          type: goal.type,
          team_id: selectedTeam.id,
          user_id: userProfile.id
        }));

        const { error: goalsError } = await supabase
          .from('goals')
          .insert(goals);

        if (goalsError) throw goalsError;
      }

      toast.success('Template aplicado com sucesso! 🎉');
      setCurrentStep(3); // Complete step
    } catch (error) {
      console.error('Erro ao aplicar template:', error);
      toast.error('Erro ao aplicar template');
    } finally {
      setIsApplyingTemplate(false);
    }
  };

  const finishOnboarding = () => {
    toast.success('Onboarding concluído! Bem-vindo ao Habitus! 🚀');
    navigate('/dashboard');
  };

  const nextStep = () => {
    if (currentStep === 0 && !selectedTemplate) {
      toast.error('Selecione um template para continuar');
      return;
    }
    
    if (currentStep === 1 && !selectedTeam) {
      toast.error('Selecione ou crie uma equipe para continuar');
      return;
    }

    if (currentStep === 2) {
      applyTemplate();
      return;
    }

    setCurrentStep(prev => Math.min(prev + 1, steps.length - 1));
  };

  const prevStep = () => {
    setCurrentStep(prev => Math.max(prev - 1, 0));
  };

  const progressPercentage = ((currentStep + 1) / steps.length) * 100;

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-2">Bem-vindo ao Habitus!</h1>
          <p className="text-muted-foreground">
            Configure sua conta em poucos passos e comece a transformar seus hábitos em resultados
          </p>
        </div>

        {/* Progress */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-4">
            {steps.map((step, index) => {
              const Icon = step.icon;
              const isActive = index === currentStep;
              const isCompleted = index < currentStep;
              
              return (
                <div key={step.id} className="flex items-center">
                  <div className={`flex items-center justify-center w-10 h-10 rounded-full border-2 ${
                    isCompleted ? 'bg-primary border-primary text-primary-foreground' :
                    isActive ? 'border-primary text-primary' :
                    'border-muted-foreground text-muted-foreground'
                  }`}>
                    {isCompleted ? (
                      <CheckCircle className="h-5 w-5" />
                    ) : (
                      <Icon className="h-5 w-5" />
                    )}
                  </div>
                  {index < steps.length - 1 && (
                    <div className={`w-20 h-0.5 mx-4 ${
                      isCompleted ? 'bg-primary' : 'bg-muted'
                    }`} />
                  )}
                </div>
              );
            })}
          </div>
          <Progress value={progressPercentage} className="h-2" />
        </div>

        {/* Step Content */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              {React.createElement(steps[currentStep].icon, { className: "h-5 w-5" })}
              {steps[currentStep].title}
            </CardTitle>
            <CardDescription>
              Passo {currentStep + 1} de {steps.length}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {/* Step 0: Template Selection */}
            {currentStep === 0 && (
              <OnboardingTemplateSelector
                onTemplateSelect={handleTemplateSelect}
                selectedTemplateId={selectedTemplate?.id}
              />
            )}

            {/* Step 1: Team Selection */}
            {currentStep === 1 && (
              <div className="space-y-4">
                <div className="text-center mb-6">
                  <h3 className="text-lg font-semibold mb-2">Escolha sua Equipe</h3>
                  <p className="text-sm text-muted-foreground">
                    Selecione uma equipe existente ou crie uma nova
                  </p>
                </div>

                {teams.length > 0 && (
                  <div className="space-y-3">
                    <h4 className="font-medium">Equipes Existentes:</h4>
                    {teams.map((team) => (
                      <Card 
                        key={team.id}
                        className={`cursor-pointer transition-all hover:shadow-md ${
                          selectedTeam?.id === team.id 
                            ? 'ring-2 ring-primary border-primary' 
                            : 'hover:border-primary/50'
                        }`}
                        onClick={() => setSelectedTeam(team)}
                      >
                        <CardContent className="p-4">
                          <div className="flex items-center justify-between">
                            <div>
                              <h5 className="font-medium">{team.name}</h5>
                              <p className="text-sm text-muted-foreground">
                                Meta: R$ {(team.total_goal || 0).toLocaleString('pt-BR')}
                              </p>
                            </div>
                            {selectedTeam?.id === team.id && (
                              <CheckCircle className="h-5 w-5 text-primary" />
                            )}
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}

                <div className="border-t pt-4">
                  <Button 
                    onClick={createNewTeam} 
                    disabled={loading}
                    variant="outline"
                    className="w-full"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Criando...
                      </>
                    ) : (
                      <>
                        <Users className="mr-2 h-4 w-4" />
                        Criar Nova Equipe
                      </>
                    )}
                  </Button>
                </div>
              </div>
            )}

            {/* Step 2: Apply Template */}
            {currentStep === 2 && selectedTemplate && (
              <div className="space-y-6">
                <div className="text-center">
                  <h3 className="text-lg font-semibold mb-2">Aplicar Template</h3>
                  <p className="text-sm text-muted-foreground">
                    Pronto para aplicar o template "{selectedTemplate.name}"
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Card>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-base flex items-center gap-2">
                        <Target className="h-4 w-4" />
                        Hábitos
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-2xl font-bold text-primary mb-2">
                        {selectedTemplate.default_habits.length}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        hábitos serão criados
                      </p>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-base flex items-center gap-2">
                        <Zap className="h-4 w-4" />
                        Metas
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-2xl font-bold text-primary mb-2">
                        {selectedTemplate.default_goals.length}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        metas serão definidas
                      </p>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-base flex items-center gap-2">
                        <Link className="h-4 w-4" />
                        Integrações
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-2xl font-bold text-primary mb-2">
                        {selectedTemplate.suggested_integrations.length}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        integrações sugeridas
                      </p>
                    </CardContent>
                  </Card>
                </div>

                <div className="space-y-4">
                  <h4 className="font-medium">Prévia dos Hábitos:</h4>
                  <div className="space-y-2">
                    {selectedTemplate.default_habits.slice(0, 3).map((habit, index) => (
                      <div key={index} className="flex items-center gap-3 p-3 bg-muted rounded-lg">
                        <CheckCircle className="h-4 w-4 text-green-500" />
                        <div>
                          <p className="font-medium">{habit.title}</p>
                          <p className="text-sm text-muted-foreground">{habit.description}</p>
                        </div>
                      </div>
                    ))}
                    {selectedTemplate.default_habits.length > 3 && (
                      <p className="text-sm text-muted-foreground text-center">
                        +{selectedTemplate.default_habits.length - 3} hábitos adicionais...
                      </p>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Step 3: Complete */}
            {currentStep === 3 && (
              <div className="text-center space-y-6">
                <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                  <CheckCircle className="h-8 w-8 text-green-600" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-2">Onboarding Concluído! 🎉</h3>
                  <p className="text-muted-foreground">
                    Sua conta foi configurada com sucesso. Você já pode começar a usar o Habitus!
                  </p>
                </div>
                <div className="grid grid-cols-2 gap-4 max-w-md mx-auto">
                  <Card>
                    <CardContent className="p-4 text-center">
                      <Target className="h-6 w-6 mx-auto mb-2 text-primary" />
                      <p className="text-sm font-medium">Hábitos</p>
                      <p className="text-xs text-muted-foreground">Configurados</p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-4 text-center">
                      <Zap className="h-6 w-6 mx-auto mb-2 text-primary" />
                      <p className="text-sm font-medium">Metas</p>
                      <p className="text-xs text-muted-foreground">Definidas</p>
                    </CardContent>
                  </Card>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Navigation */}
        <div className="flex justify-between">
          <Button 
            variant="outline" 
            onClick={prevStep}
            disabled={currentStep === 0}
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Anterior
          </Button>

          {currentStep === 3 ? (
            <Button onClick={finishOnboarding} className="bg-green-600 hover:bg-green-700">
              <Gift className="mr-2 h-4 w-4" />
              Começar a Usar!
            </Button>
          ) : (
            <Button 
              onClick={nextStep}
              disabled={(currentStep === 0 && !selectedTemplate) || 
                       (currentStep === 1 && !selectedTeam) ||
                       isApplyingTemplate}
            >
              {isApplyingTemplate ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Aplicando...
                </>
              ) : (
                <>
                  {currentStep === 2 ? 'Aplicar Template' : 'Próximo'}
                  <ArrowRight className="ml-2 h-4 w-4" />
                </>
              )}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default OnboardingFlow;