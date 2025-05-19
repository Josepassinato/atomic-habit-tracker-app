
import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";

// Define available languages
export type Language = "en" | "es" | "pt";

// Define translations for the app
export const translations = {
  en: {
    // Header
    dashboard: "Dashboard",
    habits: "Habits",
    goals: "Goals",
    reports: "Reports",
    settings: "Settings",
    login: "Login",
    register: "Register",
    back: "Back",
    logout: "Logout",
    
    // Landing page
    heroTitle: "Transform your",
    heroTitleHighlight: "sales team",
    heroDescription: "Monitor goals, develop atomic habits and increase your team's performance with intelligent automation and AI consulting.",
    startNow: "Start now",
    scheduleDemo: "Schedule demo",
    
    // Features
    featuresTitle: "How Habitus transforms your team",
    smartGoalsTitle: "Smart Goals",
    smartGoalsDesc: "Set and monitor realistic goals based on your market data",
    atomicHabitsTitle: "Atomic Habits",
    atomicHabitsDesc: "Cultivate daily habits that lead to your team's success",
    autoRewardsTitle: "Automatic Rewards",
    autoRewardsDesc: "Calculate and distribute incentives transparently",
    
    // Testimonials
    testimonialsTitle: "What our customers say",
    testimonialsDesc: "See how Habitus is transforming sales teams across the world",
    
    // Pricing
    pricingTitle: "Habitus Plans",
    startupPlan: "Startup",
    businessPlan: "Business",
    enterprisePlan: "Enterprise",
    month: "/month",
    startupDesc: "For small teams starting their sales journey",
    businessDesc: "For growing teams looking to scale sales",
    enterpriseDesc: "For large teams with complex needs",
    popular: "POPULAR",
    chooseBusiness: "Choose Business",
    talkToSales: "Talk to sales",
    
    // CTA
    ctaTitle: "Ready to transform your sales team?",
    ctaDesc: "Start today the journey to a more efficient and motivated sales team",
    createAccount: "Create your account",
    
    // Footer
    aboutUs: "About us",
    contact: "Contact",
    
    // Login page
    loginTitle: "Enter your credentials to access your account",
    email: "Email",
    password: "Password",
    forgotPassword: "Forgot password?",
    entering: "Entering...",
    enter: "Enter",
    dontHaveAccount: "Don't have an account?",
    signUp: "Sign up",
    adminInfo: "Use admin@habitus.com for admin access, gerente@exemplo.com for manager, or any other email for seller.",
    
    // Not found
    notFoundTitle: "Oops! Page not found",
    notFoundDesc: "The page you are looking for does not exist or has been moved.",
    backToHome: "Back to Home",
    
    // Language selector
    language: "Language",
  },
  es: {
    // Header
    dashboard: "Panel",
    habits: "Hábitos",
    goals: "Metas",
    reports: "Informes",
    settings: "Configuración",
    login: "Iniciar Sesión",
    register: "Registrarse",
    back: "Regresar",
    logout: "Cerrar Sesión",
    
    // Landing page
    heroTitle: "Transforma tu",
    heroTitleHighlight: "equipo de ventas",
    heroDescription: "Monitorea metas, desarrolla hábitos atómicos y aumenta el rendimiento de tu equipo con automatización inteligente y consultoría por IA.",
    startNow: "Comienza ahora",
    scheduleDemo: "Agendar demostración",
    
    // Features
    featuresTitle: "Cómo Habitus transforma tu equipo",
    smartGoalsTitle: "Metas Inteligentes",
    smartGoalsDesc: "Establece y monitorea metas realistas basadas en datos de tu mercado",
    atomicHabitsTitle: "Hábitos Atómicos",
    atomicHabitsDesc: "Cultiva hábitos diarios que llevan al éxito de tu equipo",
    autoRewardsTitle: "Bonificaciones Automáticas",
    autoRewardsDesc: "Calcula y distribuye incentivos de forma transparente",
    
    // Testimonials
    testimonialsTitle: "Lo que dicen nuestros clientes",
    testimonialsDesc: "Ve cómo Habitus está transformando equipos de ventas en todo el mundo",
    
    // Pricing
    pricingTitle: "Planes Habitus",
    startupPlan: "Startup",
    businessPlan: "Business",
    enterprisePlan: "Enterprise",
    month: "/mes",
    startupDesc: "Para equipos pequeños comenzando su viaje de ventas",
    businessDesc: "Para equipos en crecimiento buscando escalar ventas",
    enterpriseDesc: "Para grandes equipos con necesidades complejas",
    popular: "POPULAR",
    chooseBusiness: "Elegir Business",
    talkToSales: "Hablar con ventas",
    
    // CTA
    ctaTitle: "¿Listo para transformar tu equipo de ventas?",
    ctaDesc: "Comienza hoy el camino hacia un equipo de ventas más eficiente y motivado",
    createAccount: "Crear tu cuenta",
    
    // Footer
    aboutUs: "Sobre nosotros",
    contact: "Contacto",
    
    // Login page
    loginTitle: "Ingresa tus credenciales para acceder a tu cuenta",
    email: "Correo electrónico",
    password: "Contraseña",
    forgotPassword: "¿Olvidaste tu contraseña?",
    entering: "Ingresando...",
    enter: "Ingresar",
    dontHaveAccount: "¿No tienes una cuenta?",
    signUp: "Regístrate",
    adminInfo: "Usa admin@habitus.com para acceso admin, gerente@exemplo.com para gerente, o cualquier otro correo para vendedor.",
    
    // Not found
    notFoundTitle: "¡Ups! Página no encontrada",
    notFoundDesc: "La página que estás buscando no existe o ha sido movida.",
    backToHome: "Volver al Inicio",
    
    // Language selector
    language: "Idioma",
  },
  pt: {
    // Header
    dashboard: "Dashboard",
    habits: "Hábitos",
    goals: "Metas",
    reports: "Relatórios",
    settings: "Configurações",
    login: "Entrar",
    register: "Registrar",
    back: "Voltar",
    logout: "Sair",
    
    // Landing page
    heroTitle: "Transforme sua",
    heroTitleHighlight: "equipe de vendas",
    heroDescription: "Monitore metas, desenvolva hábitos atômicos e aumente o desempenho da sua equipe com automação inteligente e consultoria por IA.",
    startNow: "Comece agora",
    scheduleDemo: "Agendar demonstração",
    
    // Features
    featuresTitle: "Como o Habitus transforma sua equipe",
    smartGoalsTitle: "Metas Inteligentes",
    smartGoalsDesc: "Defina e monitore metas realistas baseadas em dados do seu mercado",
    atomicHabitsTitle: "Hábitos Atômicos",
    atomicHabitsDesc: "Cultive hábitos diários que levam ao sucesso da sua equipe",
    autoRewardsTitle: "Bônus Automáticos",
    autoRewardsDesc: "Calcule e distribua incentivos de forma transparente",
    
    // Testimonials
    testimonialsTitle: "O que nossos clientes dizem",
    testimonialsDesc: "Veja como o Habitus está transformando equipes de vendas em todo o Brasil",
    
    // Pricing
    pricingTitle: "Planos Habitus",
    startupPlan: "Startup",
    businessPlan: "Business",
    enterprisePlan: "Enterprise",
    month: "/mês",
    startupDesc: "Para pequenas equipes começando sua jornada de vendas",
    businessDesc: "Para equipes em crescimento buscando escalar vendas",
    enterpriseDesc: "Para grandes equipes com necessidades complexas",
    popular: "POPULAR",
    chooseBusiness: "Escolher Business",
    talkToSales: "Falar com vendas",
    
    // CTA
    ctaTitle: "Pronto para transformar sua equipe de vendas?",
    ctaDesc: "Comece hoje a jornada para um time de vendas mais eficiente e motivado",
    createAccount: "Criar sua conta",
    
    // Footer
    aboutUs: "Sobre nós",
    contact: "Contato",
    
    // Login page
    loginTitle: "Entre com suas credenciais para acessar sua conta",
    email: "Email",
    password: "Senha",
    forgotPassword: "Esqueceu a senha?",
    entering: "Entrando...",
    enter: "Entrar",
    dontHaveAccount: "Não tem uma conta?",
    signUp: "Registre-se",
    adminInfo: "Use admin@habitus.com para acesso admin, gerente@exemplo.com para gerente, ou qualquer outro email para vendedor.",
    
    // Not found
    notFoundTitle: "Ops! Página não encontrada",
    notFoundDesc: "A página que você está procurando não existe ou foi movida.",
    backToHome: "Voltar para o Início",
    
    // Language selector
    language: "Idioma",
  },
};

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: keyof typeof translations.en) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

interface LanguageProviderProps {
  children: ReactNode;
}

export const LanguageProvider: React.FC<LanguageProviderProps> = ({ children }) => {
  // Get language from localStorage or use browser language or default to Portuguese
  const [language, setLanguage] = useState<Language>(() => {
    const savedLanguage = localStorage.getItem('language') as Language;
    if (savedLanguage && ['en', 'es', 'pt'].includes(savedLanguage)) {
      return savedLanguage;
    }
    
    const browserLang = navigator.language.split('-')[0];
    if (browserLang === 'en') return 'en';
    if (browserLang === 'es') return 'es';
    return 'pt'; // Default to Portuguese
  });
  
  // Save language preference to localStorage when it changes
  useEffect(() => {
    localStorage.setItem('language', language);
  }, [language]);
  
  // Translation function
  const t = (key: keyof typeof translations.en): string => {
    return translations[language][key] || translations.en[key] || key;
  };
  
  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

// Custom hook to use the language context
export const useLanguage = (): LanguageContextType => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
