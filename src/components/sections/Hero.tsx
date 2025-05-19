import React from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/i18n";

const Hero = () => {
  const navigate = useNavigate();
  const { t } = useLanguage();

  return (
    <section className="bg-slate-50 py-20">
      <div className="container mx-auto px-4 text-center">
        <h1 className="mb-6 text-4xl font-extrabold tracking-tight sm:text-5xl lg:text-6xl">
          {t('heroTitle')} <span className="text-primary">{t('heroTitleHighlight')}</span>
        </h1>
        <p className="mx-auto mb-10 max-w-2xl text-xl text-muted-foreground">
          {t('heroDescription')}
        </p>
        <div className="flex flex-wrap items-center justify-center gap-4">
          <Button size="lg" onClick={() => navigate("/registro")}>
            {t('startNow')}
          </Button>
          <Button variant="outline" size="lg">
            {t('scheduleDemo')}
          </Button>
        </div>
      </div>
    </section>
  );
};

export default Hero;
