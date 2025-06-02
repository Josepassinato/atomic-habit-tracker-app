
import { Habito, BusinessModel, ModeloNegocio } from "./types";

export const initialHabits: Habito[] = [
  {
    id: 1,
    title: "Verify if contacts were registered in CRM",
    description: "Check registration and data quality",
    completed: false,
    verified: false,
    verificationRequired: true,
    schedule: "09:00",
    recurrence: "daily"
  },
  {
    id: 2,
    title: "Micro Dose Training",
    description: "Read content and validate learning",
    completed: false,
    verified: false,
    verificationRequired: true,
    schedule: "15:00",
    recurrence: "daily"
  },
  {
    id: 3,
    title: "CRM Insights Registration",
    description: "Document important interactions",
    completed: false,
    verified: false,
    verificationRequired: true,
    schedule: "16:30",
    recurrence: "daily"
  },
  {
    id: 4,
    title: "End of Day",
    description: "Reflection on achievements and improvements",
    completed: false,
    verified: false,
    verificationRequired: false,
    schedule: "18:00",
    recurrence: "daily"
  }
];

// Portuguese alias
export const habitosIniciais = initialHabits;

export const getAIFeedback = async (habits: Habito[]): Promise<string> => {
  const completedHabits = habits.filter(h => h.completed).length;
  const totalHabits = habits.length;
  const completionPercentage = (completedHabits / totalHabits) * 100;

  await new Promise(resolve => setTimeout(resolve, 2000));

  if (completionPercentage === 100) {
    return "Excellent! You completed all your habits today. This consistency will drive exceptional results in your sales performance.";
  } else if (completionPercentage >= 75) {
    return "Great progress! You're on the right track. Try to maintain this consistency to maximize your sales results.";
  } else if (completionPercentage >= 50) {
    return "Good start! To boost your sales performance, focus on completing more daily habits. Small consistent actions generate big results.";
  } else {
    return "There's room for improvement. Start with one habit at a time and build momentum gradually. Consistency is key to sales success.";
  }
};

// Portuguese alias
export const getFeedbackIA = getAIFeedback;

export const generateSuggestedHabits = async (model: BusinessModel): Promise<Habito[]> => {
  await new Promise(resolve => setTimeout(resolve, 3000));

  const habitsBySegment: Record<string, Habito[]> = {
    "SaaS": [
      {
        id: Date.now() + 1,
        title: "Daily Product Demo",
        description: "Conduct live product demonstrations",
        completed: false,
        verified: false,
        verificationRequired: true,
        schedule: "10:00",
        recurrence: "daily"
      },
      {
        id: Date.now() + 2,
        title: "Customer Success Follow-up",
        description: "Contact existing customers about satisfaction",
        completed: false,
        verified: false,
        verificationRequired: false,
        schedule: "14:00",
        recurrence: "daily"
      }
    ],
    "E-commerce": [
      {
        id: Date.now() + 3,
        title: "Marketplace Updates",
        description: "Update product listings and promotions",
        completed: false,
        verified: false,
        verificationRequired: true,
        schedule: "08:00",
        recurrence: "daily"
      },
      {
        id: Date.now() + 4,
        title: "Conversion Analysis",
        description: "Analyze conversion metrics and optimize",
        completed: false,
        verified: false,
        verificationRequired: false,
        schedule: "17:00",
        recurrence: "daily"
      }
    ],
    "Consulting": [
      {
        id: Date.now() + 5,
        title: "Expertise Content",
        description: "Create content demonstrating expertise",
        completed: false,
        verified: false,
        verificationRequired: true,
        schedule: "11:00",
        recurrence: "daily"
      },
      {
        id: Date.now() + 6,
        title: "Network Building",
        description: "Connect with potential partners and clients",
        completed: false,
        verified: false,
        verificationRequired: false,
        schedule: "16:00",
        recurrence: "daily"
      }
    ]
  };

  return habitsBySegment[model.segment] || [
    {
      id: Date.now() + 7,
      title: "Daily Prospecting",
      description: "Research and contact new prospects",
      completed: false,
      verified: false,
      verificationRequired: true,
      schedule: "09:00",
      recurrence: "daily"
    },
    {
      id: Date.now() + 8,
      title: "Skills Development",
      description: "Study sales techniques and market trends",
      completed: false,
      verified: false,
      verificationRequired: false,
      schedule: "13:00",
      recurrence: "daily"
    }
  ];
};

// Portuguese alias
export const gerarHabitosSugeridos = generateSuggestedHabits;
