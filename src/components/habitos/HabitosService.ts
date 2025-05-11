
import { Habito, ModeloNegocio } from "./types";
import { HabitoEvidenciaType } from "./HabitoEvidencia";
import { toast } from "sonner";

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
    // Simulação de resposta da OpenAI (em produção, use a API real)
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    const habitosCumpridos = habitos.filter(h => h.cumprido).length;
    const percentualConcluido = (habitosCumpridos / habitos.length) * 100;
    
    let mensagemFeedback = "";
    
    if (percentualConcluido === 100) {
      mensagemFeedback = "Excelente trabalho hoje! Você completou todos os hábitos programados. Manter essa consistência trará resultados significativos para suas metas de vendas. Continue assim!";
    } else if (percentualConcluido >= 60) {
      mensagemFeedback = `Bom progresso! Você completou ${habitosCumpridos} de ${habitos.length} hábitos hoje. Para melhorar ainda mais, considere priorizar "${habitos.find(h => !h.cumprido)?.titulo}" amanhã, pois esse hábito tem impacto direto no fechamento de vendas.`;
    } else {
      mensagemFeedback = `Você completou ${habitosCumpridos} de ${habitos.length} hábitos hoje. Recomendo revisar sua rotina para priorizar esses hábitos atômicos, especialmente o "${habitos.find(h => !h.cumprido)?.titulo}" que pode ter impacto significativo no seu desempenho.`;
    }
    
    return mensagemFeedback;
    
    // Em produção, substituir por chamada real à API da OpenAI
    // const response = await fetch("https://api.openai.com/v1/chat/completions", { ... });
    // const data = await response.json();
    // return data.choices[0].message.content;
    
  } catch (error) {
    console.error("Erro ao obter feedback da IA:", error);
    toast.error("Não foi possível obter o feedback da IA. Tente novamente mais tarde.");
    return "";
  }
};

// Gerar sugestões de hábitos baseados no modelo de negócio
export const gerarHabitosSugeridos = async (modeloNegocio: ModeloNegocio): Promise<Habito[]> => {
  try {
    // Simulação de resposta da OpenAI (em produção, use a API real)
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Hábitos personalizados baseados no modelo de negócio
    let habitosPersonalizados: Habito[] = [];
    
    // Lógica básica de personalização baseada no setor/segmento
    if (modeloNegocio.segmento.toLowerCase().includes("saas") || 
        modeloNegocio.segmento.toLowerCase().includes("software")) {
      habitosPersonalizados = [
        {
          id: Date.now(),
          titulo: "Demonstração de Valor",
          descricao: "Preparar demonstrações personalizadas do produto para cada cliente",
          cumprido: false,
          horario: "10:00"
        },
        {
          id: Date.now() + 1,
          titulo: "Acompanhamento Pós-Demo",
          descricao: "Entrar em contato 24h após demonstrações",
          cumprido: false,
          horario: "09:00"
        },
        {
          id: Date.now() + 2,
          titulo: "Análise de Engajamento",
          descricao: "Verificar métricas de uso do trial/freemium",
          cumprido: false,
          horario: "14:00"
        }
      ];
    } else if (modeloNegocio.cicloVenda.toLowerCase().includes("longo") || 
              modeloNegocio.objetivoPrincipal.toLowerCase().includes("enterprise")) {
      habitosPersonalizados = [
        {
          id: Date.now(),
          titulo: "Mapeamento de Stakeholders",
          descricao: "Identificar e documentar todos os decisores do cliente",
          cumprido: false,
          horario: "09:30"
        },
        {
          id: Date.now() + 1,
          titulo: "Estudo de Caso",
          descricao: "Preparar estudo de caso relevante para o setor do cliente",
          cumprido: false,
          horario: "11:00"
        },
        {
          id: Date.now() + 2,
          titulo: "Análise de Objeções",
          descricao: "Documentar e preparar respostas para objeções recorrentes",
          cumprido: false,
          horario: "15:30"
        }
      ];
    } else {
      // Caso genérico baseado no tamanho da equipe
      const tamEquipeNum = parseInt(modeloNegocio.tamEquipe) || 5;
      
      habitosPersonalizados = [
        {
          id: Date.now(),
          titulo: "Qualificação de Leads",
          descricao: "Qualificar novos leads usando metodologia BANT",
          cumprido: false,
          horario: "09:00"
        },
        {
          id: Date.now() + 1,
          titulo: tamEquipeNum > 10 ? "Reunião de Alinhamento" : "Revisão de Pipeline",
          descricao: tamEquipeNum > 10 ? "Sincronizar prioridades com a equipe" : "Atualizar status de oportunidades no CRM",
          cumprido: false,
          horario: tamEquipeNum > 10 ? "09:30" : "16:00"
        },
        {
          id: Date.now() + 2,
          titulo: "Feedback de Mercado",
          descricao: "Documentar percepções dos clientes sobre produto/concorrência",
          cumprido: false,
          horario: "17:00"
        }
      ];
    }
    
    return habitosPersonalizados;
    
    // Em produção, substituir por chamada real à API da OpenAI
    // const response = await fetch("https://api.openai.com/v1/chat/completions", { ... });
    // const data = await response.json();
    // const habitosGerados = JSON.parse(data.choices[0].message.content);
    // return habitosGerados;
    
  } catch (error) {
    console.error("Erro ao obter sugestões da IA:", error);
    toast.error("Não foi possível gerar hábitos personalizados. Tente novamente mais tarde.");
    return [];
  }
};
