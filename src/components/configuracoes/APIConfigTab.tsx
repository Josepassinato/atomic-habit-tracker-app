
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import IntegracoesCRM from "@/components/IntegracoesCRM";
import { useLanguage } from "@/i18n";

const APIConfigTab: React.FC = () => {
  const { t } = useLanguage();
  
  return (
    <div className="space-y-6">
      <IntegracoesCRM />
      
      <Card>
        <CardHeader>
          <CardTitle>{t('aiFeatures')}</CardTitle>
          <CardDescription>
            {t('aiResourcesInfo')}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="p-4 bg-blue-50 border border-blue-200 rounded-md">
            <p className="text-sm text-blue-800">
              {t('aiManagedBySaas')}
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default APIConfigTab;
