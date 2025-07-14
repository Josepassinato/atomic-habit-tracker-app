
import { Habito, BusinessModel, ModeloNegocio } from "./types";
import { AIService } from '@/services/ai-service';

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
  try {
    const completedHabits = habits.filter(h => h.completed).length;
    const totalHabits = habits.length;
    const completionPercentage = (completedHabits / totalHabits) * 100;
    
    const response = await AIService.consultWithAI({
      message: `Analyze sales habit progress: ${completedHabits} of ${totalHabits} habits completed (${completionPercentage.toFixed(1)}%). Provide motivational and specific feedback on how to improve sales performance based on this progress.`,
      consultationType: 'habits',
      context: {
        habits: habits.map(h => ({
          title: h.title,
          completed: h.completed,
          verified: h.verified,
          verificationRequired: h.verificationRequired
        })),
        completionPercentage
      }
    });

    return response.response || 'Unable to generate feedback at the moment.';
  } catch (error) {
    console.error('Error generating AI feedback:', error);
    
    // Fallback to static feedback
    const completedHabits = habits.filter(h => h.completed).length;
    const totalHabits = habits.length;
    const completionPercentage = (completedHabits / totalHabits) * 100;
    
    if (completionPercentage === 100) {
      return "Excellent! You completed all your habits today. This consistency will drive exceptional results in your sales performance.";
    } else if (completionPercentage >= 75) {
      return "Great progress! You're on the right track. Try to maintain this consistency to maximize your sales results.";
    } else if (completionPercentage >= 50) {
      return "Good start! To boost your sales performance, focus on completing more daily habits. Small consistent actions generate big results.";
    } else {
      return "There's room for improvement. Start with one habit at a time and build momentum gradually. Consistency is key to sales success.";
    }
  }
};

// Portuguese alias
export const getFeedbackIA = getAIFeedback;

export const generateSuggestedHabits = async (model: BusinessModel): Promise<Habito[]> => {
  try {
    const response = await AIService.consultWithAI({
      message: `Generate 3-5 specific and personalized sales habits for a business in the "${model.segment}" segment with team size "${model.teamSize}" and main objective "${model.mainObjective}". 
      
      For each habit, provide:
      - Title: concise and actionable
      - Description: specific action to take
      - Schedule: suggested time (HH:MM format)
      - VerificationRequired: true for habits that need evidence, false otherwise
      - Recurrence: "daily" for all habits
      
      Format the response as a JSON array with objects containing: title, description, schedule, verificationRequired, recurrence`,
      consultationType: 'habits',
      context: {
        businessModel: model
      }
    });

    // Parse AI response to extract habits
    try {
      const aiHabits = JSON.parse(response.response);
      
      return aiHabits.map((habit: any, index: number) => ({
        id: Date.now() + index,
        title: habit.title || `Habit ${index + 1}`,
        description: habit.description || 'Description not available',
        completed: false,
        verified: false,
        verificationRequired: habit.verificationRequired || false,
        schedule: habit.schedule || "09:00",
        recurrence: habit.recurrence || "daily"
      }));
    } catch (parseError) {
      console.error('Error parsing AI response:', parseError);
      throw new Error('AI response in invalid format');
    }
  } catch (error) {
    console.error('Error generating suggested habits:', error);
    
    // Fallback to predefined habits based on segment
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
  }
};

// Portuguese alias
export const gerarHabitosSugeridos = generateSuggestedHabits;
