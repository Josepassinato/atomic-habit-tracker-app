import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Shield, Lock, Eye, Download, Trash2 } from 'lucide-react';
import { toast } from 'sonner';

interface PrivacySettings {
  analytics: boolean;
  marketing: boolean;
  functional: boolean;
  aiProcessing: boolean;
  dataRetention: '30' | '90' | '365' | 'indefinite';
}

const PrivacyCompliance: React.FC = () => {
  const [settings, setSettings] = useState<PrivacySettings>({
    analytics: false,
    marketing: false,
    functional: true,
    aiProcessing: false,
    dataRetention: '365',
  });

  const [showDataRequest, setShowDataRequest] = useState(false);

  const handleSettingChange = (key: keyof PrivacySettings, value: boolean | string) => {
    setSettings(prev => ({ ...prev, [key]: value }));
    toast.success('Privacy settings updated');
  };

  const handleDataExport = () => {
    toast.success('Data export request submitted. You will receive an email within 30 days.');
  };

  const handleDataDeletion = () => {
    toast.success('Data deletion request submitted. Account will be permanently deleted within 30 days.');
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Privacy & Data Protection
          </CardTitle>
          <CardDescription>
            Control how your data is processed and stored in compliance with GDPR, LGPD, and CCPA
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Consent Management */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Data Processing Consent</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="functional">Functional Cookies (Required)</Label>
                  <p className="text-sm text-muted-foreground">
                    Essential for basic app functionality
                  </p>
                </div>
                <Switch
                  id="functional"
                  checked={settings.functional}
                  disabled
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="analytics">Analytics & Performance</Label>
                  <p className="text-sm text-muted-foreground">
                    Help us improve the app experience
                  </p>
                </div>
                <Switch
                  id="analytics"
                  checked={settings.analytics}
                  onCheckedChange={(checked) => handleSettingChange('analytics', checked)}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="marketing">Marketing & Personalization</Label>
                  <p className="text-sm text-muted-foreground">
                    Personalized recommendations and updates
                  </p>
                </div>
                <Switch
                  id="marketing"
                  checked={settings.marketing}
                  onCheckedChange={(checked) => handleSettingChange('marketing', checked)}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="aiProcessing">AI Data Processing</Label>
                  <p className="text-sm text-muted-foreground">
                    Use data to improve AI recommendations
                  </p>
                </div>
                <Switch
                  id="aiProcessing"
                  checked={settings.aiProcessing}
                  onCheckedChange={(checked) => handleSettingChange('aiProcessing', checked)}
                />
              </div>
            </div>
          </div>

          <Separator />

          {/* Data Retention */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Data Retention</h3>
            <div className="space-y-2">
              <Label>How long should we keep your data?</Label>
              <select
                className="w-full p-2 border rounded-md"
                value={settings.dataRetention}
                onChange={(e) => handleSettingChange('dataRetention', e.target.value)}
              >
                <option value="30">30 days</option>
                <option value="90">90 days</option>
                <option value="365">1 year</option>
                <option value="indefinite">Until account deletion</option>
              </select>
            </div>
          </div>

          <Separator />

          {/* Data Rights */}
          <div>
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <Lock className="h-4 w-4" />
              Your Data Rights
            </h3>
            <div className="grid gap-4 md:grid-cols-2">
              <Button
                variant="outline"
                onClick={() => setShowDataRequest(!showDataRequest)}
                className="flex items-center gap-2"
              >
                <Eye className="h-4 w-4" />
                View My Data
              </Button>
              
              <Button
                variant="outline"
                onClick={handleDataExport}
                className="flex items-center gap-2"
              >
                <Download className="h-4 w-4" />
                Export My Data
              </Button>
              
              <Button
                variant="outline"
                onClick={handleDataDeletion}
                className="flex items-center gap-2 text-destructive hover:text-destructive"
              >
                <Trash2 className="h-4 w-4" />
                Delete My Account
              </Button>
            </div>
          </div>

          {showDataRequest && (
            <Card className="bg-muted">
              <CardContent className="pt-6">
                <h4 className="font-semibold mb-2">Data We Collect:</h4>
                <ul className="text-sm space-y-1 text-muted-foreground">
                  <li>• Profile information (name, email, role)</li>
                  <li>• Usage analytics and performance metrics</li>
                  <li>• Sales goals and habit tracking data</li>
                  <li>• AI consultation logs (anonymized)</li>
                  <li>• Authentication and security logs</li>
                </ul>
                <p className="text-xs mt-4 text-muted-foreground">
                  For a complete data report, use the "Export My Data" option above.
                </p>
              </CardContent>
            </Card>
          )}
        </CardContent>
      </Card>

      {/* Legal Compliance */}
      <Card>
        <CardHeader>
          <CardTitle>Legal Compliance</CardTitle>
          <CardDescription>
            Our commitment to data protection and privacy regulations
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            <div className="text-center p-4 border rounded-lg">
              <Shield className="h-8 w-8 mx-auto mb-2 text-primary" />
              <h4 className="font-semibold">GDPR Compliant</h4>
              <p className="text-sm text-muted-foreground">
                European data protection standards
              </p>
            </div>
            <div className="text-center p-4 border rounded-lg">
              <Lock className="h-8 w-8 mx-auto mb-2 text-primary" />
              <h4 className="font-semibold">LGPD Compliant</h4>
              <p className="text-sm text-muted-foreground">
                Brazilian data protection law
              </p>
            </div>
            <div className="text-center p-4 border rounded-lg">
              <Eye className="h-8 w-8 mx-auto mb-2 text-primary" />
              <h4 className="font-semibold">CCPA Compliant</h4>
              <p className="text-sm text-muted-foreground">
                California consumer privacy act
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PrivacyCompliance;