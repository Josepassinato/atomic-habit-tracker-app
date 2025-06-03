
import { supabase } from "@/integrations/supabase/client";

class OpenAIService {
  private apiKey: string | null = null;
  private readonly ADMIN_SETTINGS_ID = '00000000-0000-0000-0000-000000000001';

  constructor() {
    // Load API key from Supabase on initialization
    this.loadApiKeyFromDatabase();
  }

  // Load API key from Supabase database
  private async loadApiKeyFromDatabase(): Promise<void> {
    try {
      const { data, error } = await supabase
        .from('admin_settings')
        .select('openai_api_key')
        .eq('id', this.ADMIN_SETTINGS_ID)
        .single();

      if (error) {
        console.error('Erro ao carregar chave da API do banco:', error);
        return;
      }

      if (data?.openai_api_key) {
        this.apiKey = data.openai_api_key;
        console.log('Chave da API OpenAI carregada do banco de dados');
      }
    } catch (error) {
      console.error('Erro ao conectar com o banco:', error);
    }
  }

  // Save API key to Supabase database
  async setApiKey(apiKey: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('admin_settings')
        .update({ 
          openai_api_key: apiKey,
          updated_at: new Date().toISOString()
        })
        .eq('id', this.ADMIN_SETTINGS_ID);

      if (error) {
        console.error('Erro ao salvar chave da API no banco:', error);
        return false;
      }

      this.apiKey = apiKey;
      console.log('Chave da API OpenAI salva no banco de dados');
      return true;
    } catch (error) {
      console.error('Erro ao conectar com o banco:', error);
      return false;
    }
  }

  // Get API key (reload from database if not cached)
  async getApiKey(): Promise<string | null> {
    if (!this.apiKey) {
      await this.loadApiKeyFromDatabase();
    }
    return this.apiKey;
  }

  // Get API key synchronously (returns cached value)
  getApiKeySync(): string | null {
    return this.apiKey;
  }

  // Test connection with OpenAI API
  async testConnection(): Promise<boolean> {
    const apiKey = await this.getApiKey();
    
    if (!apiKey) {
      console.log('API key não configurada');
      return false;
    }

    try {
      const response = await fetch('https://api.openai.com/v1/models', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        console.log('Conexão com OpenAI estabelecida com sucesso');
        return true;
      } else {
        console.error('Falha na conexão com OpenAI:', response.status, response.statusText);
        return false;
      }
    } catch (error) {
      console.error('Erro ao testar conexão com OpenAI:', error);
      return false;
    }
  }

  // Generate AI feedback for habits
  async generateHabitFeedback(habitData: any): Promise<string> {
    const apiKey = await this.getApiKey();
    
    if (!apiKey) {
      return "Para receber feedback personalizado de IA, configure a chave da API da OpenAI no painel administrativo.";
    }

    try {
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'gpt-4o-mini',
          messages: [
            {
              role: 'system',
              content: 'Você é um coach de vendas especializado em hábitos produtivos. Forneça feedback construtivo e motivacional sobre os hábitos do usuário.'
            },
            {
              role: 'user',
              content: `Analise este hábito: ${JSON.stringify(habitData)}`
            }
          ],
          max_tokens: 200,
          temperature: 0.7,
        }),
      });

      if (!response.ok) {
        throw new Error(`Erro na API: ${response.status}`);
      }

      const data = await response.json();
      return data.choices[0]?.message?.content || 'Não foi possível gerar feedback no momento.';
    } catch (error) {
      console.error('Erro ao gerar feedback de IA:', error);
      return 'Erro ao conectar com o serviço de IA. Verifique sua configuração.';
    }
  }
}

export const openAIService = new OpenAIService();
