import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/components/auth/AuthProvider';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { useLanguage } from '@/i18n';
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
import { OnboardingProgress } from '@/pages/onboarding/OnboardingProgress';
import { TemplateSelection } from '@/pages/onboarding/TemplateSelection';
import { Template } from '@/pages/onboarding/templates';

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
  const { t } = useLanguage();
  
  const [currentStep, setCurrentStep] = useState('teams');
  const [completedSteps, setCompletedSteps] = useState<string[]>([]);
  const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(null);
  const [loading, setLoading] = useState(false);
  const [teams, setTeams] = useState<Team[]>([]);
  const [selectedTeam, setSelectedTeam] = useState<Team | null>(null);
  const [isApplyingTemplate, setIsApplyingTemplate] = useState(false);
  const [showTemplateSelection, setShowTemplateSelection] = useState(true);

  const steps = ['teams', 'goals', 'habits', 'rewards', 'integrations'];

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

  const handleTemplateSelect = (template: Template) => {
    setSelectedTemplate(template);
    setShowTemplateSelection(false);
    toast.success(t('templateSelected'));
  };

  const handleSkipTemplate = () => {
    setShowTemplateSelection(false);
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
      toast.success(t('teamCreated'));
    } catch (error) {
      console.error('Erro ao criar equipe:', error);
      toast.error(t('errorCreatingTeam'));
    } finally {
      setLoading(false);
    }
  };

  const applyTemplate = async () => {
    if (!selectedTemplate || !selectedTeam || !userProfile) return;

    setIsApplyingTemplate(true);
    try {
      // Apply habits
      if (selectedTemplate.defaultHabits.length > 0) {
        const habits = selectedTemplate.defaultHabits.map(habit => ({
          title: habit,
          description: habit,
          schedule: 'daily',
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

      // Apply goals from template
      const monthlyGoal = parseInt(selectedTemplate.defaultGoals.monthly);
      const dailyGoal = parseInt(selectedTemplate.defaultGoals.daily);
      
      if (monthlyGoal > 0) {
        const { error: goalsError } = await supabase
          .from('goals')
          .insert([
            {
              name: 'Monthly Sales Goal',
              target_value: monthlyGoal,
              current_value: 0,
              percentage: 0,
              type: 'monthly',
              team_id: selectedTeam.id,
              user_id: userProfile.id
            },
            {
              name: 'Daily Sales Goal',
              target_value: dailyGoal,
              current_value: 0,
              percentage: 0,
              type: 'daily',
              team_id: selectedTeam.id,
              user_id: userProfile.id
            }
          ]);

        if (goalsError) throw goalsError;
      }

      toast.success(t('templateApplied'));
      setCompletedSteps([...steps]);
      setCurrentStep('integrations');
    } catch (error) {
      console.error('Erro ao aplicar template:', error);
      toast.error(t('errorApplyingTemplate'));
    } finally {
      setIsApplyingTemplate(false);
    }
  };

  const finishOnboarding = () => {
    toast.success(t('onboardingComplete'));
    navigate('/dashboard');
  };

  const nextStep = () => {
    const currentIndex = steps.indexOf(currentStep);
    if (currentIndex < steps.length - 1) {
      if (!completedSteps.includes(currentStep)) {
        setCompletedSteps([...completedSteps, currentStep]);
      }
      setCurrentStep(steps[currentIndex + 1]);
    } else {
      finishOnboarding();
    }
  };

  const prevStep = () => {
    const currentIndex = steps.indexOf(currentStep);
    if (currentIndex > 0) {
      setCurrentStep(steps[currentIndex - 1]);
    }
  };

  if (showTemplateSelection) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background to-muted p-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold mb-2">{t('welcomeToHabitus')}</h1>
            <p className="text-muted-foreground">
              {t('setupYourAccount')}
            </p>
          </div>
          <TemplateSelection 
            onSelectTemplate={handleTemplateSelect}
            onSkip={handleSkipTemplate}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted p-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-2">{t('welcomeToHabitus')}</h1>
          <p className="text-muted-foreground">
            {t('setupYourAccount')}
          </p>
        </div>

        <OnboardingProgress 
          currentStep={currentStep}
          completedSteps={completedSteps}
        />

        <Card className="mb-8">
          <CardContent className="pt-6">
            {currentStep === 'teams' && (
              <div className="space-y-4">
                <div className="text-center mb-6">
                  <h3 className="text-lg font-semibold mb-2">{t('chooseYourTeam')}</h3>
                  <p className="text-sm text-muted-foreground">
                    {t('selectOrCreateTeam')}
                  </p>
                </div>

                {teams.length > 0 && (
                  <div className="space-y-3">
                    <h4 className="font-medium">{t('existingTeams')}:</h4>
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
                                {t('goal')}: R$ {(team.total_goal || 0).toLocaleString('pt-BR')}
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
                        {t('creating')}...
                      </>
                    ) : (
                      <>
                        <Users className="mr-2 h-4 w-4" />
                        {t('createNewTeam')}
                      </>
                    )}
                  </Button>
                </div>
              </div>
            )}

            {currentStep === 'goals' && (
              <div className="text-center p-8">
                <h3 className="text-lg font-semibold mb-2">{t('defineGoals')}</h3>
                <p className="text-muted-foreground">{t('goalsStepContent')}</p>
              </div>
            )}

            {currentStep === 'habits' && selectedTemplate && (
              <div className="space-y-6">
                <div className="text-center">
                  <h3 className="text-lg font-semibold mb-2">{t('applyTemplate')}</h3>
                  <p className="text-sm text-muted-foreground">
                    {t('readyToApply')} "{t(selectedTemplate.name.toLowerCase().replace(/\s+/g, ''))}"
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Card>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-base flex items-center gap-2">
                        <Target className="h-4 w-4" />
                        {t('habits')}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-2xl font-bold text-primary mb-2">
                        {selectedTemplate.defaultHabits.length}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {t('habitsWillBeCreated')}
                      </p>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-base flex items-center gap-2">
                        <Zap className="h-4 w-4" />
                        {t('goals')}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-2xl font-bold text-primary mb-2">
                        2
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {t('goalsWillBeSet')}
                      </p>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-base flex items-center gap-2">
                        <Link className="h-4 w-4" />
                        {t('rewards')}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-2xl font-bold text-primary mb-2">
                        {selectedTemplate.defaultRewards.length}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {t('rewardsWillBeAdded')}
                      </p>
                    </CardContent>
                  </Card>
                </div>

                <div className="space-y-4">
                  <h4 className="font-medium">{t('habitsPreview')}:</h4>
                  <div className="space-y-2">
                    {selectedTemplate.defaultHabits.slice(0, 3).map((habit, index) => (
                      <div key={index} className="flex items-center gap-3 p-3 bg-muted rounded-lg">
                        <CheckCircle className="h-4 w-4 text-green-500" />
                        <p className="font-medium">{habit}</p>
                      </div>
                    ))}
                    {selectedTemplate.defaultHabits.length > 3 && (
                      <p className="text-sm text-muted-foreground text-center">
                        +{selectedTemplate.defaultHabits.length - 3} {t('additionalHabits')}...
                      </p>
                    )}
                  </div>
                </div>
              </div>
            )}

            {currentStep === 'rewards' && (
              <div className="text-center p-8">
                <h3 className="text-lg font-semibold mb-2">{t('configureRewards')}</h3>
                <p className="text-muted-foreground">{t('rewardsStepContent')}</p>
              </div>
            )}

            {currentStep === 'integrations' && (
              <div className="text-center p-8">
                <h3 className="text-lg font-semibold mb-2">{t('connectCRM')}</h3>
                <p className="text-muted-foreground">{t('integrationsStepContent')}</p>
              </div>
            )}
          </CardContent>
        </Card>

        <div className="flex justify-between">
          <Button 
            variant="outline" 
            onClick={prevStep}
            disabled={currentStep === 'teams'}
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            {t('back')}
          </Button>

          {currentStep === 'integrations' ? (
            <Button onClick={finishOnboarding} className="bg-green-600 hover:bg-green-700">
              <Gift className="mr-2 h-4 w-4" />
              {t('startUsing')}!
            </Button>
          ) : (
            <Button 
              onClick={nextStep}
              disabled={(currentStep === 'teams' && !selectedTeam) || isApplyingTemplate}
            >
              {isApplyingTemplate ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {t('applying')}...
                </>
              ) : (
                <>
                  {currentStep === 'habits' && selectedTemplate ? t('applyTemplate') : t('next')}
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