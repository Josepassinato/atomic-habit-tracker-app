
import { toast } from "sonner";
import { PlanType, PlansConfiguration } from "@/types/admin";
import { storageService } from "./storage-service";

class PlansLimitService {
  private plansConfig: PlansConfiguration | null = null;
  
  constructor() {
    // Tenta carregar a configuração dos planos do armazenamento local
    const savedConfig = storageService.getItem<PlansConfiguration>("admin-plans-config");
    if (savedConfig) {
      this.plansConfig = savedConfig;
    } else {
      // Configuração padrão
      this.plansConfig = this.getDefaultPlansConfig();
      this.savePlansConfig();
    }
  }

  private getDefaultPlansConfig(): PlansConfiguration {
    return {
      starter: {
        tokensLimit: 50000,
        usersLimit: 5,
        price: 197,
        features: {
          aiConsulting: false,
          crmIntegrations: 1,
          advancedReports: false,
          prioritySupport: false,
          customApi: false
        }
      },
      professional: {
        tokensLimit: 100000,
        usersLimit: 15,
        price: 497,
        features: {
          aiConsulting: true,
          crmIntegrations: 3,
          advancedReports: true,
          prioritySupport: false,
          customApi: false
        }
      },
      enterprise: {
        tokensLimit: 500000,
        usersLimit: 50,
        price: 997,
        features: {
          aiConsulting: true,
          crmIntegrations: 10,
          advancedReports: true,
          prioritySupport: true,
          customApi: true
        }
      },
      trial: {
        tokensLimit: 25000,
        usersLimit: 3,
        price: 0,
        features: {
          aiConsulting: false,
          crmIntegrations: 1,
          advancedReports: false,
          prioritySupport: false,
          customApi: false
        }
      }
    };
  }

  public getPlansConfig(): PlansConfiguration {
    if (!this.plansConfig) {
      this.plansConfig = this.getDefaultPlansConfig();
    }
    return this.plansConfig;
  }

  public savePlansConfig(config?: PlansConfiguration) {
    if (config) {
      this.plansConfig = config;
    }
    
    if (this.plansConfig) {
      storageService.setItem("admin-plans-config", this.plansConfig);
    }
  }

  public updatePlanConfig(plan: PlanType, limits: Partial<PlanLimits>) {
    if (!this.plansConfig) {
      this.plansConfig = this.getDefaultPlansConfig();
    }
    
    const planKey = plan.toLowerCase() as keyof PlansConfiguration;
    
    if (this.plansConfig[planKey]) {
      this.plansConfig[planKey] = {
        ...this.plansConfig[planKey],
        ...limits
      };
      
      this.savePlansConfig();
      return true;
    }
    
    return false;
  }

  public getPlanLimits(plan: PlanType) {
    if (!this.plansConfig) {
      this.plansConfig = this.getDefaultPlansConfig();
    }
    
    const planKey = plan.toLowerCase() as keyof PlansConfiguration;
    return this.plansConfig[planKey];
  }

  // Verifica se uma empresa atingiu o limite de tokens
  public checkTokenLimit(companyPlan: PlanType, tokensUsed: number): boolean {
    const planLimits = this.getPlanLimits(companyPlan);
    return tokensUsed < planLimits.tokensLimit;
  }

  // Verifica se uma empresa atingiu o limite de usuários
  public checkUsersLimit(companyPlan: PlanType, usersCount: number): boolean {
    const planLimits = this.getPlanLimits(companyPlan);
    return usersCount < planLimits.usersLimit;
  }

  // Verifica se uma feature está disponível para um plano
  public checkFeatureAvailability(companyPlan: PlanType, feature: keyof PlanFeatures): boolean | number {
    const planLimits = this.getPlanLimits(companyPlan);
    return planLimits.features[feature];
  }

  // Calcula quanto resta do limite de tokens (em percentual)
  public getTokensRemainingPercentage(companyPlan: PlanType, tokensUsed: number): number {
    const planLimits = this.getPlanLimits(companyPlan);
    const remainingPercentage = 100 - (tokensUsed / planLimits.tokensLimit * 100);
    return Math.max(0, Math.min(100, remainingPercentage));
  }

  // Obtém uma mensagem amigável sobre o limite de tokens
  public getTokenLimitMessage(companyPlan: PlanType, tokensUsed: number): string {
    const planLimits = this.getPlanLimits(companyPlan);
    const remaining = planLimits.tokensLimit - tokensUsed;
    
    if (remaining <= 0) {
      return `Você atingiu seu limite de tokens. Faça upgrade para o plano ${this.getNextPlanSuggestion(companyPlan)}.`;
    } else if (remaining < planLimits.tokensLimit * 0.1) {
      return `Atenção! Você tem apenas ${remaining.toLocaleString()} tokens restantes. Considere fazer upgrade para o plano ${this.getNextPlanSuggestion(companyPlan)}.`;
    } else if (remaining < planLimits.tokensLimit * 0.3) {
      return `Você tem ${remaining.toLocaleString()} tokens restantes no seu plano.`;
    } else {
      return `Você tem ${remaining.toLocaleString()} tokens disponíveis de ${planLimits.tokensLimit.toLocaleString()}.`;
    }
  }

  // Sugere o próximo plano para upgrade
  private getNextPlanSuggestion(currentPlan: PlanType): string {
    switch (currentPlan) {
      case 'Free':
      case 'Trial':
        return 'Starter';
      case 'Starter':
        return 'Professional';
      case 'Professional':
        return 'Enterprise';
      case 'Enterprise':
        return 'Enterprise com limites personalizados';
      default:
        return 'superior';
    }
  }
}

// Exporta uma instância única do serviço
export const plansLimitService = new PlansLimitService();
