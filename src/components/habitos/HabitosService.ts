
import { Habito, ModeloNegocio } from "./types";

export const habitosIniciais: Habito[] = [
  {
    id: 1,
    titulo: "Verify if contacts were registered in CRM",
    descricao: "Check registration and data quality",
    cumprido: false,
    verificado: false,
    verificacaoNecessaria: true,
    horario: "09:00",
    recorrencia: "daily"
  },
  {
    id: 2,
    titulo: "Micro Dose Training",
    descricao: "Read content and validate learning",
    cumprido: false,
    verificado: false,
    verificacaoNecessaria: true,
    horario: "15:00",
    recorrencia: "daily"
  },
  {
    id: 3,
    titulo: "CRM Insights Registration",
    descricao: "Document important interactions",
    cumprido: false,
    verificado: false,
    verificacaoNecessaria: true,
    horario: "16:30",
    recorrencia: "daily"
  },
  {
    id: 4,
    titulo: "End of Day",
    descricao: "Reflection on achievements and improvements",
    cumprido: false,
    verificado: false,
    verificacaoNecessaria: false,
    horario: "18:00",
    recorrencia: "daily"
  }
];

export const getFeedbackIA = async (habitos: Habito[]): Promise<string> => {
  const habitosCumpridos = habitos.filter(h => h.cumprido).length;
  const totalHabitos = habitos.length;
  const percentualCumprimento = (habitosCumpridos / totalHabitos) * 100;

  await new Promise(resolve => setTimeout(resolve, 2000));

  if (percentualCumprimento === 100) {
    return "Excellent! You completed all your habits today. This consistency will drive exceptional results in your sales performance.";
  } else if (percentualCumprimento >= 75) {
    return "Great progress! You're on the right track. Try to maintain this consistency to maximize your sales results.";
  } else if (percentualCumprimento >= 50) {
    return "Good start! To boost your sales performance, focus on completing more daily habits. Small consistent actions generate big results.";
  } else {
    return "There's room for improvement. Start with one habit at a time and build momentum gradually. Consistency is key to sales success.";
  }
};

export const gerarHabitosSugeridos = async (modelo: ModeloNegocio): Promise<Habito[]> => {
  await new Promise(resolve => setTimeout(resolve, 3000));

  const habitosPorSegmento: Record<string, Habito[]> = {
    "SaaS": [
      {
        id: Date.now() + 1,
        titulo: "Daily Product Demo",
        descricao: "Conduct live product demonstrations",
        cumprido: false,
        verificado: false,
        verificacaoNecessaria: true,
        horario: "10:00",
        recorrencia: "daily"
      },
      {
        id: Date.now() + 2,
        titulo: "Customer Success Follow-up",
        descricao: "Contact existing customers about satisfaction",
        cumprido: false,
        verificado: false,
        verificacaoNecessaria: false,
        horario: "14:00",
        recorrencia: "daily"
      }
    ],
    "E-commerce": [
      {
        id: Date.now() + 3,
        titulo: "Marketplace Updates",
        descricao: "Update product listings and promotions",
        cumprido: false,
        verificado: false,
        verificacaoNecessaria: true,
        horario: "08:00",
        recorrencia: "daily"
      },
      {
        id: Date.now() + 4,
        titulo: "Conversion Analysis",
        descricao: "Analyze conversion metrics and optimize",
        cumprido: false,
        verificado: false,
        verificacaoNecessaria: false,
        horario: "17:00",
        recorrencia: "daily"
      }
    ],
    "Consulting": [
      {
        id: Date.now() + 5,
        titulo: "Expertise Content",
        descricao: "Create content demonstrating expertise",
        cumprido: false,
        verificado: false,
        verificacaoNecessaria: true,
        horario: "11:00",
        recorrencia: "daily"
      },
      {
        id: Date.now() + 6,
        titulo: "Network Building",
        descricao: "Connect with potential partners and clients",
        cumprido: false,
        verificado: false,
        verificacaoNecessaria: false,
        horario: "16:00",
        recorrencia: "daily"
      }
    ]
  };

  return habitosPorSegmento[modelo.segmento] || [
    {
      id: Date.now() + 7,
      titulo: "Daily Prospecting",
      descricao: "Research and contact new prospects",
      cumprido: false,
      verificado: false,
      verificacaoNecessaria: true,
      horario: "09:00",
      recorrencia: "daily"
    },
    {
      id: Date.now() + 8,
      titulo: "Skills Development",
      descricao: "Study sales techniques and market trends",
      cumprido: false,
      verificado: false,
      verificacaoNecessaria: false,
      horario: "13:00",
      recorrencia: "daily"
    }
  ];
};
