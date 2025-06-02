
import React from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useLanguage } from "@/i18n";
import { getCurrentUser } from "@/utils/permissions";

const Hero = () => {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const user = getCurrentUser();

  return (
    <section className="bg-slate-50 py-20">
      <div className="container mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Main content */}
          <div className="text-center lg:text-left">
            <h1 className="mb-6 text-4xl font-extrabold tracking-tight sm:text-5xl lg:text-6xl">
              {t('heroTitle')} <span className="text-primary">{t('heroTitleHighlight')}</span>
            </h1>
            <p className="mb-10 text-xl text-muted-foreground max-w-2xl">
              {t('heroDescription')}
            </p>
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4">
              <Button size="lg" onClick={() => navigate("/registro")}>
                {t('startNow')}
              </Button>
              <Button variant="outline" size="lg">
                {t('scheduleDemo')}
              </Button>
            </div>
          </div>

          {/* Login area */}
          <div className="flex justify-center lg:justify-end">
            {user ? (
              <Card className="w-full max-w-md">
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
                        className="text-primary hover:underline"
                      >
                        {t('logout')}
                      </button>
                    </span>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <Card className="w-full max-w-md">
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
                    onClick={() => navigate("/login")}
                  >
                    {t('signIn')}
                  </Button>
                  <Button 
                    variant="outline" 
                    className="w-full" 
                    size="lg"
                    onClick={() => navigate("/registro")}
                  >
                    {t('createFreeAccount')}
                  </Button>
                  <div className="text-center">
                    <button 
                      onClick={() => navigate("/recuperar-senha")}
                      className="text-sm text-primary hover:underline"
                    >
                      {t('forgotPassword')}
                    </button>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
