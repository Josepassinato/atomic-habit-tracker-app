
import React from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useLanguage } from "@/i18n";
import { getCurrentUser } from "@/utils/permissions";
import { TrendingUp, Target, Zap, Users, Check, Star, Award } from "lucide-react";

const Hero = () => {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const user = getCurrentUser();

  return (
    <section className="relative bg-gradient-to-br from-background via-background to-primary/5 py-20 overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0 bg-grid-white/[0.02] bg-[size:60px_60px]" />
      
      <div className="container mx-auto px-4 relative">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Main content */}
          <div className="text-center lg:text-left animate-fade-in">
            {/* Badge with concept */}
            <Badge variant="outline" className="mb-6 px-4 py-2 text-sm font-medium">
              <TrendingUp className="mr-2 h-4 w-4" />
              {t('onePercentBetter')}
            </Badge>
            
            <h1 className="mb-4 text-4xl font-extrabold tracking-tight sm:text-5xl lg:text-6xl">
              {t('transformHabitsIntoResults')}{" "}
              <span className="text-primary bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent">
                {t('dailyHabits')}
              </span>
              {" "}{t('intoSalesResults')}
            </h1>
            
            <p className="mb-6 text-xl text-muted-foreground max-w-2xl font-medium">
              {t('completeSystemDescription')}
            </p>
            
            {/* Value proposition highlights */}
            <div className="mb-8 flex flex-wrap gap-4 text-sm">
              <div className="flex items-center gap-2 bg-primary/10 px-4 py-2 rounded-full">
                <Check className="h-4 w-4 text-primary" />
                <span className="font-medium">{t('noComplexSetup')}</span>
              </div>
              <div className="flex items-center gap-2 bg-primary/10 px-4 py-2 rounded-full">
                <Check className="h-4 w-4 text-primary" />
                <span className="font-medium">{t('resultsIn30Days')}</span>
              </div>
              <div className="flex items-center gap-2 bg-primary/10 px-4 py-2 rounded-full">
                <Check className="h-4 w-4 text-primary" />
                <span className="font-medium">{t('integratesWithCRM')}</span>
              </div>
            </div>

            {/* Key concepts grid */}
            <div className="grid grid-cols-2 gap-4 mb-10 max-w-lg mx-auto lg:mx-0">
              <div className="flex items-center space-x-2 p-3 rounded-lg bg-primary/5 border">
                <Target className="h-5 w-5 text-primary" />
                <span className="text-sm font-medium">{t('systemsOverGoals')}</span>
              </div>
              <div className="flex items-center space-x-2 p-3 rounded-lg bg-primary/5 border">
                <Zap className="h-5 w-5 text-primary" />
                <span className="text-sm font-medium">{t('compoundEffect')}</span>
              </div>
              <div className="flex items-center space-x-2 p-3 rounded-lg bg-primary/5 border">
                <Users className="h-5 w-5 text-primary" />
                <span className="text-sm font-medium">{t('identityBasedHabits')}</span>
              </div>
              <div className="flex items-center space-x-2 p-3 rounded-lg bg-primary/5 border">
                <TrendingUp className="h-5 w-5 text-primary" />
                <span className="text-sm font-medium">{t('performanceMultiplier')}</span>
              </div>
            </div>
            
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4">
              <div className="flex flex-col items-center gap-2">
                <Button size="lg" className="hover-scale" onClick={() => navigate("/auth")}>
                  {t('startNow')}
                </Button>
                <span className="text-sm text-muted-foreground font-medium">
                  ✨ Teste Grátis 15 Dias
                </span>
              </div>
              <Button variant="outline" size="lg" className="hover-scale" onClick={() => navigate("/schedule-demo")}>
                {t('scheduleDemo')}
              </Button>
            </div>
          </div>

          {/* Dashboard Preview */}
          <div className="flex justify-center lg:justify-end">
            <div className="w-full max-w-md">
              <Card className="overflow-hidden border-2 shadow-2xl animate-scale-in relative">
                <div className="bg-gradient-to-br from-primary/5 to-primary/10 p-6">
                  {/* Header */}
                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <h3 className="text-xl font-bold">{t('dashboardTitle')}</h3>
                      <p className="text-xs text-muted-foreground">{t('liveView')}</p>
                    </div>
                    <Badge className="bg-green-500 animate-pulse">{t('live')}</Badge>
                  </div>

                  {/* Metrics Grid */}
                  <div className="grid grid-cols-2 gap-3 mb-6">
                    <div className="bg-card p-3 rounded-lg border">
                      <div className="flex items-center gap-1 mb-1">
                        <Target className="h-4 w-4 text-primary" />
                        <span className="text-xs text-muted-foreground">{t('monthlyGoal')}</span>
                      </div>
                      <div className="text-xl font-bold">R$ 45k</div>
                      <div className="text-xs text-green-500 flex items-center gap-1">
                        <TrendingUp className="h-3 w-3" />
                        +12%
                      </div>
                    </div>

                    <div className="bg-card p-3 rounded-lg border">
                      <div className="flex items-center gap-1 mb-1">
                        <Check className="h-4 w-4 text-primary" />
                        <span className="text-xs text-muted-foreground">{t('habitsToday')}</span>
                      </div>
                      <div className="text-xl font-bold">8/10</div>
                      <div className="text-xs text-muted-foreground">80%</div>
                    </div>
                  </div>

                  {/* Progress bar */}
                  <div className="space-y-2">
                    <div className="flex justify-between text-xs">
                      <span className="text-muted-foreground">{t('progress')}</span>
                      <span className="font-medium">73%</span>
                    </div>
                    <div className="h-2 bg-muted rounded-full overflow-hidden">
                      <div className="h-full bg-gradient-to-r from-primary to-primary/80 w-[73%] rounded-full animate-pulse" />
                    </div>
                  </div>
                </div>

                {/* Habits section */}
                <div className="p-4 bg-card border-t">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-2">
                        <Check className="h-4 w-4 text-green-500" />
                        <span className="text-xs">10 {t('calls')}</span>
                      </div>
                      <Badge variant="secondary" className="text-xs h-5">✓</Badge>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-2">
                        <Check className="h-4 w-4 text-green-500" />
                        <span className="text-xs">{t('updateCRM')}</span>
                      </div>
                      <Badge variant="secondary" className="text-xs h-5">✓</Badge>
                    </div>
                    <div className="flex items-center justify-between text-sm opacity-50">
                      <div className="flex items-center gap-2">
                        <div className="h-4 w-4 rounded-full border-2" />
                        <span className="text-xs">5 {t('proposals')}</span>
                      </div>
                      <Badge variant="outline" className="text-xs h-5">...</Badge>
                    </div>
                  </div>
                </div>

                {/* Floating badge */}
                <div className="absolute -top-3 -right-3 bg-primary rounded-full p-2 shadow-lg animate-bounce">
                  <Award className="h-5 w-5 text-primary-foreground" />
                </div>
              </Card>
            </div>
          </div>
        </div>
        
        {/* Additional concepts section */}
        <div className="mt-20 animate-fade-in">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">{t('whyItWorks')}</h2>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
              {t('scientificApproach')}
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center p-6 rounded-lg bg-card border hover-scale">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Target className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">{t('identityFirst')}</h3>
              <p className="text-muted-foreground">{t('identityFirstDesc')}</p>
            </div>
            
            <div className="text-center p-6 rounded-lg bg-card border hover-scale">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <TrendingUp className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">{t('compoundGrowth')}</h3>
              <p className="text-muted-foreground">{t('compoundGrowthDesc')}</p>
            </div>
            
            <div className="text-center p-6 rounded-lg bg-card border hover-scale">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Zap className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">{t('environmentDesign')}</h3>
              <p className="text-muted-foreground">{t('environmentDesignDesc')}</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
