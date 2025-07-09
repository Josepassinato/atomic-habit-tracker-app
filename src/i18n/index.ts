
import React from 'react';

// Enhanced i18n system with comprehensive English translations
export const useLanguage = () => {
  return {
    t: (key: string, options?: { name?: string }) => {
      // Comprehensive key-to-text mapping for English translations
      const translations: Record<string, string> = {
        // Navigation and general
        'dashboard': 'Dashboard',
        'habits': 'Habits',
        'goals': 'Goals',
        'reports': 'Reports',
        'settings': 'Settings',
        'onboarding': 'Onboarding',
        'logout': 'Logout',
        'signOut': 'Sign Out',
        'signIn': 'Sign In',
        'back': 'Back',
        'cancel': 'Cancel',
        'save': 'Save',
        'edit': 'Edit',
        'delete': 'Delete',
        'add': 'Add',
        'remove': 'Remove',
        'close': 'Close',
        'open': 'Open',
        'yes': 'Yes',
        'no': 'No',
        'loading': 'Loading...',
        
        // Progress and tracking
        'todayProgress': "Today's progress",
        'habitsOf': 'habits of',
        'verified': 'verified',
        'restartHabits': 'Restart Habits',
        'analyzing': 'Analyzing...',
        'requestAiFeedback': 'Request AI Feedback',
        'noHabitsYet': 'No habits created yet. Start building your success!',
        'suggestPersonalizedHabits': 'Suggest Personalized Habits',
        'atomicHabitsDaily': 'Daily Atomic Habits',
        'atomicHabits': 'Atomic Habits',
        'myHabits': 'My Habits',
        'newHabit': 'New Habit',
        'list': 'List',
        'calendar': 'Calendar',
        'performance': 'Performance',
        'statistics': 'Statistics',
        'completed': 'Completed',
        'total': 'Total',
        'weeklyProgress': 'Weekly Progress',
        
        // Gamification and achievements - NEW TRANSLATIONS
        'myPerformance': 'My Performance',
        'recentAchievements': 'Recent Achievements',
        'addEvidence': 'Add Evidence',
        'complete': 'Complete',
        'level': 'Level',
        'points': 'pts',
        'overview': 'Overview',
        'averageCompletion': 'Average Completion',
        'consistentDays': 'Consistent Days',
        'currentStreak': 'Current Streak',
        'mostEffectiveHabits': 'Most Effective Habits',
        'completionRate': 'Completion Rate',
        'inSales': 'in Sales',
        'habitsProgress': 'Habits Progress',
        
        // Notifications and warnings
        'notifications': 'Notifications',
        'welcomeMessage': 'Welcome back, {{role}}!',
        'dailyCompletion': 'You have 3 habits to complete today.',
        'configurationRequired': 'Configuration Required',
        'adminNeedsToConfigureApi': 'The system administrator needs to configure the OpenAI API to enable this functionality.',
        'configureOpenAiApi': 'Configure OpenAI API in Admin Panel',
        'aiFeedback': 'AI Feedback',
        'habitCompleted': 'Habit completed!',
        'evidenceSubmitted': 'Evidence submitted',
        'evidenceSubmittedMessage': 'Your evidence has been sent for verification. +5 points!',
        'newHabitAdded': 'New habit added',
        'newHabitAddedMessage': 'You added a new habit to your routine.',
        'habitCompletedMessage': 'You earned 10 points for completing a habit.',
        'buildingConsistency': "You're building consistency and improving your results!",
        'configureTitle': 'Configure the title and description by editing the habit.',
        'completingHabit': 'Completing...',
        'awaitingVerification': 'Awaiting manager verification',
        'verifiedByManager': 'Verified by manager',
        'evidenceSubmittedLabel': 'Evidence submitted',
        'markAsCompleted': 'Mark as completed',
        
        // Dashboard customization
        'customizeDashboard': 'Customize Dashboard',
        'selectWidgets': 'Select and reorder widgets to customize your dashboard',
        'layoutSaved': 'Layout saved successfully!',
        'saveLayout': 'Save Layout',
        
        // Dashboard sections
        'salesGoals': 'Sales Goals',
        'aiConsulting': 'AI Consulting',
        'crmIntegrations': 'CRM Integrations',
        
        // Settings
        'notificationPreferences': 'Notification Preferences',
        'configureNotifications': 'Configure how you receive notifications',
        'emailNotifications': 'Email Notifications',
        'receiveImportantUpdates': 'Receive important updates via email',
        'dailyReminders': 'Daily Reminders',
        'receiveDailyHabitsReminders': 'Receive daily habits reminders',
        'weeklyReport': 'Weekly Report',
        'receiveWeeklyPerformance': 'Receive weekly performance summary',
        'savePreferences': 'Save Preferences',
        'notificationPreferencesSaved': 'Notification preferences saved!',
        'privacySettings': 'Privacy Settings',
        'managePrivacyPreferences': 'Manage your data and privacy preferences',
        'dataSharing': 'Data Sharing',
        'controlDataSharing': 'Control how your data is shared with third parties',
        'activityHistory': 'Activity History',
        'keepActivityHistory': 'Keep a history of your activities',
        'accountSecurity': 'Account Security',
        'changePassword': 'Change Password',
        'twoFactorAuth': 'Two-Factor Authentication',
        'deleteAccount': 'Delete Account',
        
        // AI Features
        'aiFeatures': 'AI Features',
        'aiResourcesInfo': 'AI resources and integrations management',
        'aiManagedBySaas': 'AI features are managed by our SaaS platform and require no additional configuration.',
        'aiHabitsFeedback': 'Great progress on your habits! Keep maintaining consistency to achieve your sales goals.',
        
        // Landing page - Updated with our original concepts
        'heroTitle': 'Construa Excelência em Vendas com',
        'heroTitleHighlight': 'Micro-Melhorias Diárias',
        'heroDescription': 'Transforme pequenas ações consistentes em resultados extraordinários. Sistema baseado na ciência comportamental para alta performance comercial.',
        'heroSubtitle': 'Pequenas melhorias diárias geram grandes resultados',
        'microImprovementsDaily': 'Micro-melhorias diárias',
        'transformSmallActions': 'Transforme pequenas ações em grandes resultados',
        'consistentGrowth': 'Crescimento consistente',
        'exponentialResults': 'Resultados exponenciais',
        'identityBasedHabits': 'Hábitos baseados em identidade',
        'becomeWhoYouWant': 'Torne-se quem você quer ser',
        'systemsOverGoals': 'Foque no sistema, não apenas nas metas',
        'compoundEffect': 'Efeito cumulativo',
        'onePercentBetter': '1% melhor a cada dia',
        'buildingConsistentHabits': 'Construindo hábitos consistentes',
        'performanceMultiplier': 'Multiplicador de performance',
        'startNow': 'Start Now',
        'scheduleDemo': 'Schedule Demo',
        'ctaTitle': 'Ready to revolutionize your sales?',
        'ctaDesc': 'Join thousands of sales professionals who have already transformed their performance with Habitus',
        'createAccount': 'Create Account',
        'featuresTitle': 'Everything you need to excel in sales',
        'smartGoalsTitle': 'Smart Goals',
        'smartGoalsDesc': 'AI-powered goals that adapt to your performance',
        'atomicHabitsTitle': 'Atomic Habits',
        'atomicHabitsDesc': 'Small daily actions that generate big results',
        'autoRewardsTitle': 'Automatic Rewards',
        'autoRewardsDesc': 'Transparent rewards based on real performance',
        'apisAndIntegrations': 'APIs and Integrations',
        'privacy': 'Privacy',
        
        // Hero section translations
        'welcomeBack': 'Welcome back!',
        'helloUser': 'Hello, {{name}}. Continue where you left off.',
        'goToDashboard': 'Go to Dashboard',
        'notYou': 'Not you?',
        'accessAccount': 'Access your account',
        'signInToTrack': 'Sign in to track your habits and goals',
        'createFreeAccount': 'Create free account',
        'forgotPassword': 'Forgot your password?',
        
        // Additional Hero concepts
        'whyItWorks': 'Por que Funciona',
        'scientificApproach': 'Nossa abordagem é baseada em décadas de pesquisa em psicologia comportamental e neurociência aplicada ao desempenho comercial.',
        'identityFirst': 'Identidade em Primeiro Lugar',
        'identityFirstDesc': 'Construa hábitos baseados em quem você quer se tornar, não apenas no que quer alcançar.',
        'compoundGrowth': 'Crescimento Exponencial', 
        'compoundGrowthDesc': 'Pequenas melhorias diárias se acumulam em resultados extraordinários ao longo do tempo.',
        'environmentDesign': 'Design do Ambiente',
        'environmentDesignDesc': 'Criamos um ambiente digital que facilita bons hábitos e remove barreiras para o sucesso.',
        
        // Testimonials
        'testimonialsTitle': 'What our customers say',
        'testimonialsDesc': 'See how Habitus is transforming sales teams',
        
        // Pricing
        'pricingTitle': 'Choose the perfect plan for your team',
        'startupPlan': 'Startup',
        'businessPlan': 'Business',
        'enterprisePlan': 'Enterprise',
        'startupDesc': 'Perfect for small teams starting their journey',
        'businessDesc': 'Ideal for growing teams that need advanced features',
        'enterpriseDesc': 'Complete solution for large organizations',
        'month': '/month',
        'popular': 'Most Popular'
      };
      
      let translation = translations[key] || key;
      
      // Handle dynamic replacements like {{name}}
      if (options?.name) {
        translation = translation.replace('{{name}}', options.name);
      }
      
      return translation;
    },
    language: 'en' as 'en' | 'pt' | 'es'
  };
};

export const LanguageProvider = ({ children }: { children: React.ReactNode }) => {
  return React.createElement(React.Fragment, null, children);
};
