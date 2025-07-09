
import React from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useLanguage } from "@/i18n";
import { getCurrentUser } from "@/utils/permissions";
import { TrendingUp, Target, Zap, Users } from "lucide-react";

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
            
            <h1 className="mb-6 text-4xl font-extrabold tracking-tight sm:text-5xl lg:text-6xl">
              {t('heroTitle')}{" "}
              <span className="text-primary bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent">
                {t('heroTitleHighlight')}
              </span>
            </h1>
            
            <p className="mb-6 text-xl text-muted-foreground max-w-2xl">
              {t('heroDescription')}
            </p>
            
            <p className="mb-10 text-lg font-medium text-foreground/80 max-w-2xl">
              {t('heroSubtitle')}
            </p>

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
              <Button size="lg" className="hover-scale" onClick={() => navigate("/auth")}>
                {t('startNow')}
              </Button>
              <Button variant="outline" size="lg" className="hover-scale">
                {t('scheduleDemo')}
              </Button>
            </div>
          </div>

          {/* Login area */}
          <div className="flex justify-center lg:justify-end animate-scale-in">
            {user ? (
              <Card className="w-full max-w-md shadow-lg hover-scale">
                <CardHeader className="text-center">
                  <CardTitle className="text-2xl">{t('welcomeBack')}</CardTitle>
                  <CardDescription>
                    {t('helloUser', { name: user.nome })}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Button 
                    className="w-full" 
                    size="lg"
                    onClick={() => navigate("/dashboard")}
                  >
                    {t('goToDashboard')}
                  </Button>
                  <div className="text-center">
                    <span className="text-sm text-muted-foreground">
                      {t('notYou')}{" "}
                      <button 
                        onClick={() => {
                          localStorage.removeItem("habitus-user");
                          window.location.reload();
                        }}
                        className="text-primary hover:underline story-link"
                      >
                        {t('logout')}
                      </button>
                    </span>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <Card className="w-full max-w-md shadow-lg hover-scale">
                <CardHeader className="text-center">
                  <CardTitle className="text-2xl">{t('accessAccount')}</CardTitle>
                  <CardDescription>
                    {t('signInToTrack')}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Button 
                    className="w-full" 
                    size="lg"
                    onClick={() => navigate("/auth")}
                  >
                    {t('signIn')}
                  </Button>
                  <Button 
                    variant="outline" 
                    className="w-full" 
                    size="lg"
                    onClick={() => navigate("/auth")}
                  >
                    {t('createFreeAccount')}
                  </Button>
                  <div className="text-center">
                    <button 
                      onClick={() => navigate("/recuperar-senha")}
                      className="text-sm text-primary hover:underline story-link"
                    >
                      {t('forgotPassword')}
                    </button>
                  </div>
                </CardContent>
              </Card>
            )}
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
