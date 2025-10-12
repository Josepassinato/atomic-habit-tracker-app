import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { ShoppingBag, Save, ExternalLink, CheckCircle } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface AffiliateConfig {
  id: string;
  region: string;
  affiliate_tag: string;
  marketplace_domain: string;
  is_active: boolean;
}

export const AmazonAffiliateConfig: React.FC = () => {
  const [configs, setConfigs] = useState<AffiliateConfig[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState<string | null>(null);

  useEffect(() => {
    loadConfigs();
  }, []);

  const loadConfigs = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('amazon_affiliate_config')
      .select('*')
      .order('region');

    if (error) {
      console.error('Error loading configs:', error);
      toast.error('Erro ao carregar configurações');
    } else {
      setConfigs(data || []);
    }
    setLoading(false);
  };

  const handleSave = async (config: AffiliateConfig) => {
    setSaving(config.id);
    
    const { error } = await supabase
      .from('amazon_affiliate_config')
      .update({
        affiliate_tag: config.affiliate_tag,
        marketplace_domain: config.marketplace_domain,
        is_active: config.is_active
      })
      .eq('id', config.id);

    if (error) {
      console.error('Error saving config:', error);
      toast.error('Erro ao salvar configuração');
    } else {
      toast.success('Configuração salva com sucesso!');
    }
    setSaving(null);
  };

  const handleToggle = async (config: AffiliateConfig, isActive: boolean) => {
    const { error } = await supabase
      .from('amazon_affiliate_config')
      .update({ is_active: isActive })
      .eq('id', config.id);

    if (error) {
      console.error('Error toggling config:', error);
      toast.error('Erro ao atualizar status');
    } else {
      setConfigs(configs.map(c => 
        c.id === config.id ? { ...c, is_active: isActive } : c
      ));
      toast.success(isActive ? 'Região ativada' : 'Região desativada');
    }
  };

  const getRegionInfo = (region: string) => {
    const info: Record<string, { name: string; flag: string; color: string }> = {
      'BR': { name: 'Brasil', flag: '🇧🇷', color: 'bg-green-500' },
      'US': { name: 'Estados Unidos', flag: '🇺🇸', color: 'bg-blue-500' },
      'ES': { name: 'Espanha', flag: '🇪🇸', color: 'bg-red-500' }
    };
    return info[region] || { name: region, flag: '🌍', color: 'bg-gray-500' };
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ShoppingBag className="h-5 w-5" />
            Configuração Amazon Affiliates
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-32 bg-muted animate-pulse rounded-lg" />
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-start justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <ShoppingBag className="h-5 w-5" />
              Configuração Amazon Affiliates
            </CardTitle>
            <CardDescription>
              Configure suas tags de afiliado para cada região
            </CardDescription>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => window.open('https://affiliate-program.amazon.com/', '_blank')}
          >
            <ExternalLink className="h-4 w-4 mr-2" />
            Amazon Associates
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {configs.map((config) => {
            const regionInfo = getRegionInfo(config.region);
            
            return (
              <Card key={config.id} className="border-l-4" style={{ borderLeftColor: regionInfo.color.replace('bg-', '') }}>
                <CardContent className="pt-6">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <span className="text-3xl">{regionInfo.flag}</span>
                        <div>
                          <h3 className="font-semibold text-lg">{regionInfo.name}</h3>
                          <p className="text-sm text-muted-foreground">
                            Marketplace: {config.marketplace_domain}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Label htmlFor={`active-${config.id}`} className="text-sm">
                          {config.is_active ? 'Ativa' : 'Inativa'}
                        </Label>
                        <Switch
                          id={`active-${config.id}`}
                          checked={config.is_active}
                          onCheckedChange={(checked) => handleToggle(config, checked)}
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor={`tag-${config.id}`}>
                          Tag de Afiliado
                        </Label>
                        <Input
                          id={`tag-${config.id}`}
                          value={config.affiliate_tag}
                          onChange={(e) => {
                            setConfigs(configs.map(c => 
                              c.id === config.id 
                                ? { ...c, affiliate_tag: e.target.value }
                                : c
                            ));
                          }}
                          placeholder="seutag-20"
                          className="mt-1"
                        />
                        <p className="text-xs text-muted-foreground mt-1">
                          Sua tag do Amazon Associates para {regionInfo.name}
                        </p>
                      </div>

                      <div>
                        <Label htmlFor={`domain-${config.id}`}>
                          Domínio do Marketplace
                        </Label>
                        <Input
                          id={`domain-${config.id}`}
                          value={config.marketplace_domain}
                          onChange={(e) => {
                            setConfigs(configs.map(c => 
                              c.id === config.id 
                                ? { ...c, marketplace_domain: e.target.value }
                                : c
                            ));
                          }}
                          placeholder="amazon.com.br"
                          className="mt-1"
                        />
                        <p className="text-xs text-muted-foreground mt-1">
                          URL base da Amazon nesta região
                        </p>
                      </div>
                    </div>

                    <div className="flex justify-between items-center pt-2">
                      <div className="text-xs text-muted-foreground">
                        Exemplo de link: https://www.{config.marketplace_domain}/dp/ASIN?tag={config.affiliate_tag}
                      </div>
                      <Button
                        size="sm"
                        onClick={() => handleSave(config)}
                        disabled={saving === config.id}
                      >
                        {saving === config.id ? (
                          'Salvando...'
                        ) : (
                          <>
                            <Save className="h-4 w-4 mr-2" />
                            Salvar
                          </>
                        )}
                      </Button>
                    </div>

                    {config.is_active && (
                      <div className="bg-green-50 border border-green-200 rounded-md p-3 flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-green-600" />
                        <p className="text-sm text-green-700">
                          Esta região está ativa e gerando links de afiliado
                        </p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <h4 className="font-medium text-blue-900 mb-2">Como obter suas tags de afiliado:</h4>
          <ol className="list-decimal list-inside space-y-1 text-sm text-blue-800">
            <li>Acesse <a href="https://affiliate-program.amazon.com/" target="_blank" rel="noopener noreferrer" className="underline">Amazon Associates</a> para sua região</li>
            <li>Crie uma conta de afiliado (gratuito)</li>
            <li>Após aprovação, você receberá sua Affiliate Tag única</li>
            <li>Insira a tag acima para começar a ganhar comissões</li>
          </ol>
        </div>
      </CardContent>
    </Card>
  );
};
