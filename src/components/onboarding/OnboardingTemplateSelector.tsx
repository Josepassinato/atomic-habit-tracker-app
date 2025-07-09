import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Check, Building, Laptop, ShoppingCart } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface OnboardingTemplate {
  id: string;
  name: string;
  segment: string;
  description: string;
  default_habits: any;
  default_goals: any;
  suggested_integrations: any;
}

interface OnboardingTemplateSelectorProps {
  onTemplateSelect: (template: OnboardingTemplate) => void;
  selectedTemplateId?: string;
}

const OnboardingTemplateSelector: React.FC<OnboardingTemplateSelectorProps> = ({
  onTemplateSelect,
  selectedTemplateId
}) => {
  const [templates, setTemplates] = useState<OnboardingTemplate[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTemplates();
  }, []);

  const fetchTemplates = async () => {
    try {
      const { data, error } = await supabase
        .from('onboarding_templates')
        .select('*')
        .order('segment');

      if (error) throw error;
      
      // Parse JSON fields
      const parsedTemplates = (data || []).map(template => ({
        ...template,
        default_habits: Array.isArray(template.default_habits) ? template.default_habits : [],
        default_goals: Array.isArray(template.default_goals) ? template.default_goals : [],
        suggested_integrations: Array.isArray(template.suggested_integrations) ? template.suggested_integrations : []
      }));
      
      setTemplates(parsedTemplates);
    } catch (error) {
      console.error('Erro ao carregar templates:', error);
      toast.error('Erro ao carregar templates de onboarding');
    } finally {
      setLoading(false);
    }
  };

  const getSegmentIcon = (segment: string) => {
    switch (segment) {
      case 'tecnologia':
        return <Laptop className="h-6 w-6" />;
      case 'consultoria':
        return <Building className="h-6 w-6" />;
      case 'varejo':
        return <ShoppingCart className="h-6 w-6" />;
      default:
        return <Building className="h-6 w-6" />;
    }
  };

  const getSegmentColor = (segment: string) => {
    switch (segment) {
      case 'tecnologia':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'consultoria':
        return 'bg-green-50 text-green-700 border-green-200';
      case 'varejo':
        return 'bg-purple-50 text-purple-700 border-purple-200';
      default:
        return 'bg-gray-50 text-gray-700 border-gray-200';
    }
  };

  if (loading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <Card key={i} className="animate-pulse">
            <CardHeader>
              <div className="h-4 bg-gray-200 rounded w-3/4"></div>
              <div className="h-3 bg-gray-200 rounded w-1/2"></div>
            </CardHeader>
            <CardContent>
              <div className="h-20 bg-gray-200 rounded"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="text-center mb-6">
        <h3 className="text-lg font-semibold mb-2">Escolha um Template de Onboarding</h3>
        <p className="text-sm text-muted-foreground">
          Começe com um template otimizado para o seu segmento e personalize conforme necessário
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-1 lg:grid-cols-1">
        {templates.map((template) => (
          <Card 
            key={template.id}
            className={`cursor-pointer transition-all hover:shadow-md ${
              selectedTemplateId === template.id 
                ? 'ring-2 ring-primary border-primary' 
                : 'hover:border-primary/50'
            }`}
            onClick={() => onTemplateSelect(template)}
          >
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-lg ${getSegmentColor(template.segment)}`}>
                    {getSegmentIcon(template.segment)}
                  </div>
                  <div>
                    <CardTitle className="text-base">{template.name}</CardTitle>
                    <Badge 
                      variant="outline" 
                      className={`mt-1 ${getSegmentColor(template.segment)}`}
                    >
                      {template.segment}
                    </Badge>
                  </div>
                </div>
                {selectedTemplateId === template.id && (
                  <Check className="h-5 w-5 text-primary" />
                )}
              </div>
            </CardHeader>
            
            <CardContent className="pt-0">
              <CardDescription className="mb-3">
                {template.description}
              </CardDescription>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
                <div>
                  <p className="font-medium text-gray-600 mb-1">Hábitos:</p>
                  <p className="text-gray-500">{template.default_habits.length} hábitos pré-configurados</p>
                </div>
                
                <div>
                  <p className="font-medium text-gray-600 mb-1">Metas:</p>
                  <p className="text-gray-500">{template.default_goals.length} metas sugeridas</p>
                </div>
                
                <div>
                  <p className="font-medium text-gray-600 mb-1">Integrações:</p>
                  <p className="text-gray-500">{template.suggested_integrations.length} integrações recomendadas</p>
                </div>
              </div>
              
              <div className="mt-3 flex flex-wrap gap-1">
                {template.suggested_integrations.slice(0, 3).map((integration) => (
                  <Badge key={integration} variant="secondary" className="text-xs">
                    {integration}
                  </Badge>
                ))}
                {template.suggested_integrations.length > 3 && (
                  <Badge variant="secondary" className="text-xs">
                    +{template.suggested_integrations.length - 3}
                  </Badge>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="border-dashed">
        <CardHeader className="text-center">
          <CardTitle className="text-base">Começar do Zero</CardTitle>
          <CardDescription>
            Prefere configurar tudo manualmente? Comece com um onboarding personalizado
          </CardDescription>
        </CardHeader>
        <CardContent className="text-center">
          <Button 
            variant="outline"
            onClick={() => onTemplateSelect({
              id: 'custom',
              name: 'Personalizado',
              segment: 'custom',
              description: 'Configuração manual',
              default_habits: [],
              default_goals: [],
              suggested_integrations: []
            })}
            className={selectedTemplateId === 'custom' ? 'ring-2 ring-primary' : ''}
          >
            {selectedTemplateId === 'custom' && <Check className="mr-2 h-4 w-4" />}
            Personalizar Onboarding
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default OnboardingTemplateSelector;