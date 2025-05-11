import { Habito, ModeloNegocio } from "./types";
import { HabitoEvidenciaType } from "./HabitoEvidencia";
import { toast } from "sonner";
import { openAIService } from "@/services/openai-service";

export const habitosIniciais = [
  {
    id: 1,
    titulo: "Check-in Matinal",
    descricao: "Definir metas diárias para vendas",
    cumprido: true,
    horario: "08:30",
    verificacaoNecessaria: true
  },
  {
    id: 2,
    titulo: "Follow-up Sistemático",
    descricao: "Verificar se contatos foram registrados no CRM",
    cumprido: true,
    horario: "12:00",
    verificacaoNecessaria: true
  },
  {
    id: 3,
    titulo: "Treinamento em Micro Doses",
    descricao: "Ler conteúdo e validar aprendizado",
    cumprido: false,
    horario: "15:00",
    verificacaoNecessaria: true
  },
  {
    id: 4,
    titulo: "Registro de Insights no CRM",
    descricao: "Documentar interações importantes",
    cumprido: false,
    horario: "16:30",
    verificacaoNecessaria: true
  },
  {
    id: 5,
    titulo: "Encerramento do Dia",
    descricao: "Reflexão sobre conquistas e melhorias",
    cumprido: false,
    horario: "18:00",
    verificacaoNecessaria: false
  },
];

// Obter feedback da IA com base nos hábitos concluídos
export const getFeedbackIA = async (habitos: Habito[]): Promise<string> => {
  try {
    if (!openAIService.getApiKey()) {
      return "Configure sua chave da API da OpenAI nas configurações para receber feedback personalizado.";
    }
    
    const habitosCumpridos = habitos.filter(h => h.cumprido).length;
    const percentualConcluido = (habitosCumpridos / habitos.length) * 100;
    
    // Criar o prompt para a API da OpenAI
    const prompt = `
      Analise o desempenho do usuário nos hábitos atômicos de vendas hoje:
      - Total de hábitos: ${habitos.length}
      - Hábitos concluídos: ${habitosCumpridos}
      - Percentual concluído: ${percentualConcluido.toFixed(2)}%

      Lista de hábitos:
      ${habitos.map(h => `- ${h.titulo}: ${h.cumprido ? 'Concluído' : 'Não concluído'}`).join('\n')}

      Forneça um feedback construtivo e motivador sobre o desempenho, incluindo:
      1. Avaliação geral do desempenho
      2. Sugestão específica para melhorar no(s) hábito(s) não concluído(s)
      3. Como isso pode impactar nos resultados de vendas
      
      Limite sua resposta a 3 ou 4 frases objetivas.
    `;

    // Usar o serviço da OpenAI para gerar o feedback
    return await openAIService.generateText(prompt);
    
  } catch (error) {
    console.error("Erro ao obter feedback da IA:", error);
    toast.error("Não foi possível obter o feedback da IA. Tente novamente mais tarde.");
    return "";
  }
};

// Gerar sugestões de hábitos baseados no modelo de negócio
export const gerarHabitosSugeridos = async (modeloNegocio: ModeloNegocio): Promise<Habito[]> => {
  try {
    if (!openAIService.getApiKey()) {
      toast.error("Configure sua chave da API da OpenAI nas configurações");
      
      // Retorna hábitos padrão se não houver API key
      return [
        {
          id: Date.now(),
          titulo: "Hábito Padrão 1",
          descricao: "Configure sua API key para hábitos personalizados",
          cumprido: false,
          horario: "09:00"
        },
        {
          id: Date.now() + 1,
          titulo: "Hábito Padrão 2",
          descricao: "Configure sua API key para hábitos personalizados",
          cumprido: false,
          horario: "11:00"
        }
      ];
    }
    
    const prompt = `
      Com base no modelo de negócio descrito abaixo, sugira 3 hábitos atômicos de vendas que teriam maior impacto na performance:

      Segmento/Indústria: ${modeloNegocio.segmento}
      Ciclo de Vendas: ${modeloNegocio.cicloVenda}
      Tamanho da Equipe de Vendas: ${modeloNegocio.tamEquipe}
      Objetivo Principal: ${modeloNegocio.objetivoPrincipal}

      Para cada hábito, forneça:
      - Um título conciso (máximo 5 palavras)
      - Uma descrição clara da ação (máximo 15 palavras)
      - Um horário recomendado para realizá-lo

      Retorne os dados APENAS no seguinte formato JSON (sem explicações adicionais):
      [
        {
          "titulo": "Título do Hábito 1",
          "descricao": "Descrição da ação específica",
          "horario": "09:00"
        },
        ...
      ]
    `;

    const systemPrompt = "Você é um consultor especializado em vendas B2B e hábitos atômicos para equipes comerciais. Seu objetivo é gerar hábitos altamente impactantes e específicos para o contexto do cliente. Responda APENAS no formato JSON solicitado.";

    // Usar o serviço da OpenAI para gerar as sugestões
    const openaiResponse = await openAIService.generateText(prompt, systemPrompt);
    
    try {
      const habitosGerados = JSON.parse(openaiResponse);
      
      // Adicionar IDs aos hábitos gerados
      return habitosGerados.map((habito: any, index: number) => ({
        id: Date.now() + index,
        titulo: habito.titulo,
        descricao: habito.descricao,
        cumprido: false,
        horario: habito.horario
      }));
    } catch (error) {
      console.error("Erro ao processar resposta da OpenAI:", error);
      toast.error("Erro ao processar a resposta da IA");
      return [];
    }
    
  } catch (error) {
    console.error("Erro ao obter sugestões da IA:", error);
    toast.error("Não foi possível gerar hábitos personalizados. Tente novamente mais tarde.");
    return [];
  }
};
