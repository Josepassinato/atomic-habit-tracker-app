
import { toast } from "sonner";

// Define o tipo para as respostas da OpenAI
interface OpenAIResponse {
  choices: {
    message: {
      content: string;
    };
  }[];
}

class OpenAIService {
  private apiKey: string | null = null;

  constructor() {
    // Tenta recuperar a chave da API do admin, se existir
    this.apiKey = localStorage.getItem("admin-openai-api-key") || null;
  }

  setApiKey(apiKey: string) {
    this.apiKey = apiKey;
    localStorage.setItem("admin-openai-api-key", apiKey);
  }

  getApiKey() {
    return this.apiKey;
  }

  async generateText(prompt: string, systemPrompt: string = "Você é um assistente especializado em vendas e produtividade para equipes comerciais."): Promise<string> {
    if (!this.apiKey) {
      toast.error("API da OpenAI não configurada pelo administrador");
      return "O administrador do sistema precisa configurar a chave da API da OpenAI para habilitar esta funcionalidade.";
    }

    try {
      const response = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${this.apiKey}`,
        },
        body: JSON.stringify({
          model: "gpt-4o",
          messages: [
            {
              role: "system",
              content: systemPrompt,
            },
            {
              role: "user",
              content: prompt,
            },
          ],
          temperature: 0.7,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error?.message || "Erro ao conectar com a OpenAI");
      }

      const data: OpenAIResponse = await response.json();
      return data.choices[0].message.content;
    } catch (error) {
      console.error("Erro ao gerar texto com OpenAI:", error);
      toast.error("Falha ao conectar com a API da OpenAI");
      return "Não foi possível obter uma resposta. Por favor, contate o administrador do sistema.";
    }
  }
}

// Exporta uma instância única do serviço
export const openAIService = new OpenAIService();
