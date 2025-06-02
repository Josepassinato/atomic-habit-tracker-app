
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/i18n";

const PrivacyTab: React.FC = () => {
  const { t } = useLanguage();
  
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>{t('privacySettings')}</CardTitle>
          <CardDescription>
            {t('managePrivacyPreferences')}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between rounded-lg border p-4">
              <div className="space-y-0.5">
                <div className="font-medium">{t('dataSharing')}</div>
                <div className="text-sm text-muted-foreground">
                  {t('controlDataSharing')}
                </div>
              </div>
              <Switch defaultChecked={true} />
            </div>
            
            <div className="flex items-center justify-between rounded-lg border p-4">
              <div className="space-y-0.5">
                <div className="font-medium">{t('activityHistory')}</div>
                <div className="text-sm text-muted-foreground">
                  {t('keepActivityHistory')}
                </div>
              </div>
              <Switch defaultChecked={true} />
            </div>
          
            <Separator className="my-4" />
          
            <div className="space-y-2">
              <h3 className="font-medium">{t('accountSecurity')}</h3>
              <div className="grid gap-2">
                <Button variant="outline" className="justify-start">
                  {t('changePassword')}
                </Button>
                <Button variant="outline" className="justify-start">
                  {t('twoFactorAuth')}
                </Button>
                <Button variant="outline" className="justify-start text-destructive hover:bg-destructive/10">
                  {t('deleteAccount')}
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PrivacyTab;
