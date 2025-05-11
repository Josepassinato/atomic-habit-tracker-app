
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
    // Tenta recuperar a chave da API do localStorage, se existir
    this.apiKey = localStorage.getItem("openai-api-key");
  }

  setApiKey(apiKey: string) {
    this.apiKey = apiKey;
    localStorage.setItem("openai-api-key", apiKey);
  }

  getApiKey() {
    return this.apiKey;
  }

  async generateText(prompt: string, systemPrompt: string = "Você é um assistente especializado em vendas e produtividade para equipes comerciais."): Promise<string> {
    if (!this.apiKey) {
      toast.error("Chave da API da OpenAI não configurada");
      return "Configure sua chave da API da OpenAI para receber respostas personalizadas.";
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
      return "Não foi possível obter uma resposta. Por favor, verifique sua conexão e a chave da API.";
    }
  }
}

// Exporta uma instância única do serviço
export const openAIService = new OpenAIService();
