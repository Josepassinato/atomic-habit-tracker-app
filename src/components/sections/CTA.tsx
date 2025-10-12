
import React from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/i18n";

const CTA = () => {
  const navigate = useNavigate();
  const { t } = useLanguage();

  return (
    <section className="py-20">
      <div className="container mx-auto px-4 text-center">
        <h2 className="mb-6 text-3xl font-bold">{t('ctaTitle')}</h2>
        <p className="mx-auto mb-10 max-w-2xl text-xl text-muted-foreground">
          {t('ctaDesc')}
        </p>
        <div className="flex flex-wrap items-center justify-center gap-4">
          <div className="flex flex-col items-center gap-2">
            <Button size="lg" onClick={() => navigate("/auth")}>
              {t('createAccount')}
            </Button>
            <span className="text-sm text-muted-foreground font-medium">
              ✨ Teste Grátis 15 Dias
            </span>
          </div>
          <Button size="lg" variant="outline" onClick={() => navigate("/schedule-demo")}>
            {t('scheduleDemo')}
          </Button>
        </div>
      </div>
    </section>
  );
};

export default CTA;
