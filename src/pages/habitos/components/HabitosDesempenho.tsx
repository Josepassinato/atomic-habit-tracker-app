
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import GamificacaoCard from "@/components/habitos/GamificacaoCard";
import { Habito } from "@/components/habitos/types";
import { useLanguage } from "@/i18n";

interface HabitosDesempenhoProps {
  habitos: Habito[];
  conquistasRecentes: any[];
  pontos: number;
  nivel: number;
}

const HabitosDesempenho: React.FC<HabitosDesempenhoProps> = ({
  habitos,
  conquistasRecentes,
  pontos,
  nivel
}) => {
  const { t } = useLanguage();
  
  return (
    <div className="grid gap-6 md:grid-cols-3">
      <div className="md:col-span-2">
        <Card>
          <CardHeader>
            <CardTitle>{t('habitsProgress')}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-medium mb-2">{t('overview')}</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Card>
                    <CardContent className="p-4">
                      <div className="text-4xl font-bold mb-1">67%</div>
                      <div className="text-sm text-muted-foreground">{t('averageCompletion')}</div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-4">
                      <div className="text-4xl font-bold mb-1">15</div>
                      <div className="text-sm text-muted-foreground">{t('consistentDays')}</div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-4">
                      <div className="text-4xl font-bold mb-1">3</div>
                      <div className="text-sm text-muted-foreground">{t('currentStreak')}</div>
                    </CardContent>
                  </Card>
                </div>
              </div>
              
              <EffectiveHabits habitos={habitos} />
            </div>
          </CardContent>
        </Card>
      </div>
      <div>
        <GamificacaoCard 
          pontos={pontos}
          nivel={nivel}
          proximoNivel={250}
          conquistasRecentes={conquistasRecentes}
        />
      </div>
    </div>
  );
};

// Most effective habits component extracted
const EffectiveHabits: React.FC<{ habitos: Habito[] }> = ({ habitos }) => {
  const { t } = useLanguage();
  
  return (
    <div>
      <h3 className="text-lg font-medium mb-2">{t('mostEffectiveHabits')}</h3>
      <div className="space-y-2">
        {habitos.slice(0, 3).map((habito) => (
          <div key={habito.id} className="flex items-center justify-between border p-3 rounded-md">
            <div>
              <h4 className="font-medium">{habito.title}</h4>
              <p className="text-sm text-muted-foreground">{t('completionRate')}: 85%</p>
            </div>
            <div className="text-sm font-bold text-green-600">+15% {t('inSales')}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default HabitosDesempenho;
