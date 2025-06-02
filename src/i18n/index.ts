
import React from 'react';

// Enhanced i18n system with comprehensive English translations
export const useLanguage = () => {
  return {
    t: (key: string) => {
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
        
        // Notifications
        'notifications': 'Notifications',
        'welcomeMessage': 'Welcome back, {{role}}!',
        'dailyCompletion': 'You have 3 habits to complete today.',
        
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
        
        // Landing page
        'heroTitle': 'Transform Your Sales Performance with',
        'heroTitleHighlight': 'Smart AI',
        'heroDescription': 'Automate goals, track atomic habits, and receive intelligent rewards based on real performance',
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
        'privacy': 'Privacy'
      };
      return translations[key] || key;
    },
    language: 'en' as 'en' | 'pt' | 'es'
  };
};

export const LanguageProvider = ({ children }: { children: React.ReactNode }) => {
  return React.createElement(React.Fragment, null, children);
};
