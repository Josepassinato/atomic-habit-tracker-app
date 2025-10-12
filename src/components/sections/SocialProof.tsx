import React from "react";
import { Card } from "@/components/ui/card";
import { TrendingUp, Users, Target, Award } from "lucide-react";
import { useLanguage } from "@/i18n";

export const SocialProof = () => {
  const { t } = useLanguage();
  
  const stats = [
    {
      icon: Users,
      value: "500+",
      label: t('activeTeams'),
      color: "text-blue-500"
    },
    {
      icon: TrendingUp,
      value: "+28%",
      label: t('avgSalesIncrease'),
      color: "text-green-500"
    },
    {
      icon: Target,
      value: "94%",
      label: t('habitCompletionRate'),
      color: "text-primary"
    },
    {
      icon: Award,
      value: "2.5x",
      label: t('avgROI6Months'),
      color: "text-purple-500"
    }
  ];

  return (
    <section className="py-12 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-8">
          <h3 className="text-2xl font-bold mb-2">{t('provenResults')}</h3>
          <p className="text-muted-foreground">{t('dataFromRealTeams')}</p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <Card key={index} className="p-6 text-center hover-scale">
                <div className={`w-12 h-12 rounded-full ${stat.color.replace('text-', 'bg-')}/10 flex items-center justify-center mx-auto mb-3`}>
                  <Icon className={`h-6 w-6 ${stat.color}`} />
                </div>
                <div className="text-3xl font-bold mb-1">{stat.value}</div>
                <div className="text-sm text-muted-foreground">{stat.label}</div>
              </Card>
            );
          })}
        </div>

        {/* Customer quotes */}
        <div className="mt-12 grid md:grid-cols-2 gap-6">
          <Card className="p-6">
            <div className="flex items-start gap-4">
              <div className="flex-1">
                <p className="text-muted-foreground mb-4">
                  &quot;{t('testimonial1')}&quot;
                </p>
                <div>
                  <div className="font-semibold">{t('testimonial1Author')}</div>
                  <div className="text-sm text-muted-foreground">{t('testimonial1Role')}</div>
                </div>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-start gap-4">
              <div className="flex-1">
                <p className="text-muted-foreground mb-4">
                  &quot;{t('testimonial2')}&quot;
                </p>
                <div>
                  <div className="font-semibold">{t('testimonial2Author')}</div>
                  <div className="text-sm text-muted-foreground">{t('testimonial2Role')}</div>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </section>
  );
};
