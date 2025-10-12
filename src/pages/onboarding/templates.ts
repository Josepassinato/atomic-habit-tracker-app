import { Team } from "./types";

export interface Template {
  id: string;
  name: string;
  segment: 'saas' | 'retail' | 'b2b';
  icon: string;
  description: string;
  defaultGoals: {
    monthly: string;
    daily: string;
  };
  defaultHabits: string[];
  defaultRewards: Array<{
    descricao: string;
    tipo: string;
  }>;
}

export const onboardingTemplates: Record<string, Template> = {
  saas: {
    id: 'saas',
    name: 'SaaS & Technology',
    segment: 'saas',
    icon: '💻',
    description: 'For software and technology sales teams',
    defaultGoals: {
      monthly: '50000',
      daily: '2000'
    },
    defaultHabits: [
      'Schedule 5 product demos',
      'Send 10 follow-up emails',
      'Update CRM with all interactions',
      'Post on LinkedIn about the product',
      'Study one feature/update'
    ],
    defaultRewards: [
      { descricao: 'Team lunch for hitting monthly goal', tipo: 'team' },
      { descricao: 'Gift card for top performer', tipo: 'individual' }
    ]
  },
  retail: {
    id: 'retail',
    name: 'Retail & E-commerce',
    segment: 'retail',
    icon: '🛍️',
    description: 'For retail and online store teams',
    defaultGoals: {
      monthly: '30000',
      daily: '1200'
    },
    defaultHabits: [
      'Greet 20 customers proactively',
      'Upsell to 5 customers',
      'Organize product display',
      'Check inventory levels',
      'Share customer testimonial'
    ],
    defaultRewards: [
      { descricao: 'Store discount for the team', tipo: 'team' },
      { descricao: 'Extra day off for top seller', tipo: 'individual' }
    ]
  },
  b2b: {
    id: 'b2b',
    name: 'B2B Sales',
    segment: 'b2b',
    icon: '🤝',
    description: 'For corporate and enterprise sales',
    defaultGoals: {
      monthly: '80000',
      daily: '3200'
    },
    defaultHabits: [
      'Make 15 prospect calls',
      'Send 3 proposals',
      'Schedule 2 meetings',
      'Research 5 new leads',
      'Update pipeline in CRM'
    ],
    defaultRewards: [
      { descricao: 'Team dinner for quarterly goal', tipo: 'team' },
      { descricao: 'Bonus for deal closer', tipo: 'individual' }
    ]
  }
};

export const getTemplateById = (id: string): Template | undefined => {
  return onboardingTemplates[id];
};

export const applyTemplate = (template: Template, teamName: string): Partial<Team> => {
  return {
    name: teamName,
    metas: {
      mensal: template.defaultGoals.monthly,
      diaria: template.defaultGoals.daily
    },
    habitos: template.defaultHabits,
    recompensas: template.defaultRewards,
    comissoes: {
      base: '3',
      habitos: '2'
    }
  };
};
