import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface CRMSyncConfig {
  crmType: 'hubspot' | 'pipedrive' | 'salesforce';
  apiKey: string;
  apiUrl: string;
  syncDirection: 'import' | 'export' | 'bidirectional';
}

interface SalesRepData {
  id: string;
  name: string;
  email: string;
  totalSales: number;
  currentGoal: number;
  conversionRate: number;
}

class CRMSyncService {
  private configs: Map<string, CRMSyncConfig> = new Map();

  // Configurar integração de CRM
  async configureCRM(teamId: string, config: CRMSyncConfig): Promise<boolean> {
    try {
      this.configs.set(teamId, config);
      
      // Salvar configuração no Supabase
      const { error } = await supabase
        .from('settings')
        .upsert({
          key: `crm_config_${teamId}`,
          value: config as any,
          user_id: 'current' // Em produção, usar o ID real do usuário
        });

      if (error) throw error;
      
      toast.success(`CRM ${config.crmType} configurado com sucesso!`);
      return true;
    } catch (error) {
      console.error('Erro ao configurar CRM:', error);
      toast.error('Erro ao configurar integração com CRM');
      return false;
    }
  }

  // Importar dados do CRM para a plataforma
  async importFromCRM(teamId: string): Promise<SalesRepData[]> {
    const config = this.configs.get(teamId);
    if (!config) {
      throw new Error('CRM não configurado para esta equipe');
    }

    try {
      // Chamar edge function para fazer a sincronização
      const { data, error } = await supabase.functions.invoke('crm-sync', {
        body: {
          action: 'import',
          teamId,
          crmType: config.crmType,
          apiKey: config.apiKey,
          apiUrl: config.apiUrl
        }
      });

      if (error) throw error;

      // Processar dados importados
      const salesRepsData = data.salesReps;
      
      // Atualizar dados locais
      for (const rep of salesRepsData) {
        await supabase
          .from('sales_reps')
          .upsert({
            id: rep.crmId || rep.id,
            name: rep.name,
            email: rep.email,
            total_sales: rep.totalSales,
            current_goal: rep.goal,
            conversion_rate: rep.conversionRate,
            team_id: teamId
          });
      }

      toast.success(`${salesRepsData.length} vendedores importados do CRM`);
      return salesRepsData;
    } catch (error) {
      console.error('Erro ao importar do CRM:', error);
      toast.error('Erro ao importar dados do CRM');
      throw error;
    }
  }

  // Exportar dados da plataforma para o CRM
  async exportToCRM(teamId: string, salesRepsData: SalesRepData[]): Promise<boolean> {
    const config = this.configs.get(teamId);
    if (!config) {
      throw new Error('CRM não configurado para esta equipe');
    }

    try {
      const { data, error } = await supabase.functions.invoke('crm-sync', {
        body: {
          action: 'export',
          teamId,
          crmType: config.crmType,
          apiKey: config.apiKey,
          apiUrl: config.apiUrl,
          salesRepsData
        }
      });

      if (error) throw error;

      toast.success(`Dados exportados para ${config.crmType} com sucesso!`);
      return true;
    } catch (error) {
      console.error('Erro ao exportar para CRM:', error);
      toast.error('Erro ao exportar dados para o CRM');
      return false;
    }
  }

  // Sincronização bidirecional automática
  async syncBidirectional(teamId: string): Promise<void> {
    const config = this.configs.get(teamId);
    if (!config || config.syncDirection !== 'bidirectional') {
      return;
    }

    try {
      // 1. Importar dados atualizados do CRM
      const crmData = await this.importFromCRM(teamId);
      
      // 2. Buscar dados locais
      const { data: localData, error } = await supabase
        .from('sales_reps')
        .select('*')
        .eq('team_id', teamId);

      if (error) throw error;

      // 3. Identificar diferenças e fazer merge
      const mergedData = this.mergeData(localData, crmData);
      
      // 4. Exportar dados mesclados de volta para o CRM
      await this.exportToCRM(teamId, mergedData);

      toast.success('Sincronização bidirecional concluída!');
    } catch (error) {
      console.error('Erro na sincronização bidirecional:', error);
      toast.error('Erro na sincronização automática');
    }
  }

  // Merge inteligente de dados
  private mergeData(localData: any[], crmData: SalesRepData[]): SalesRepData[] {
    const merged: SalesRepData[] = [];
    const crmMap = new Map(crmData.map(rep => [rep.email, rep]));
    
    // Processar dados locais
    for (const local of localData) {
      const crmVersion = crmMap.get(local.email);
      
      if (crmVersion) {
        // Merge: priorizar dados mais recentes
        merged.push({
          id: local.id,
          name: local.name,
          email: local.email,
          totalSales: Math.max(local.total_sales || 0, crmVersion.totalSales || 0),
          currentGoal: local.current_goal || crmVersion.currentGoal,
          conversionRate: Math.max(local.conversion_rate || 0, crmVersion.conversionRate || 0)
        });
        crmMap.delete(local.email);
      } else {
        // Apenas local
        merged.push({
          id: local.id,
          name: local.name,
          email: local.email,
          totalSales: local.total_sales || 0,
          currentGoal: local.current_goal || 0,
          conversionRate: local.conversion_rate || 0
        });
      }
    }
    
    // Adicionar vendedores que existem apenas no CRM
    for (const [, crmRep] of crmMap) {
      merged.push(crmRep);
    }
    
    return merged;
  }

  // Agendar sincronização automática
  async scheduleAutoSync(teamId: string, intervalMinutes: number = 30): Promise<void> {
    setInterval(() => {
      this.syncBidirectional(teamId);
    }, intervalMinutes * 60 * 1000);
  }
}

export const crmSyncService = new CRMSyncService();