
export type Language = 'en' | 'es' | 'pt';

export interface Translations {
  // Common
  dashboard: string;
  habits: string;
  goals: string;
  reports: string;
  settings: string;
  onboarding: string;
  logout: string;
  back: string;
  
  // Auth & User
  login: string;
  register: string;
  email: string;
  password: string;
  forgotPassword: string;
  entering: string;
  enter: string;
  dontHaveAccount: string;
  signUp: string;
  adminInfo: string;
  loginSuccess: string;
  welcomeMessage: string;
  invalidCredentials: string;
  loginError: string;
  checkCredentials: string;
  loginTitle: string; // Added missing key
  
  // Password Recovery
  recoverPassword: string;
  passwordRecoveryEnterEmail: string;
  passwordRecoveryEmailSent: string;
  passwordRecoveryCheckEmail: string;
  passwordRecoveryEmailSentDesc: string;
  passwordRecoveryFollowInstructions: string;
  passwordRecoveryError: string;
  passwordRecoveryTryAgain: string;
  sendRecoveryEmail: string;
  sending: string;
  tryAnotherEmail: string;
  rememberPassword: string;
  backToLogin: string;
  
  // Landing Page
  heroTitle: string;
  heroTitleHighlight: string;
  heroDescription: string;
  startNow: string;
  scheduleDemo: string;
  
  // Features
  featuresTitle: string;
  smartGoalsTitle: string;
  smartGoalsDesc: string;
  atomicHabitsTitle: string;
  atomicHabitsDesc: string;
  autoRewardsTitle: string;
  autoRewardsDesc: string;
  
  // Testimonials
  testimonialsTitle: string;
  testimonialsDesc: string;
  
  // Pricing
  pricingTitle: string;
  startupPlan: string;
  businessPlan: string;
  enterprisePlan: string;
  month: string;
  startupDesc: string;
  businessDesc: string;
  enterpriseDesc: string;
  popular: string;
  chooseBusiness: string;
  talkToSales: string;
  
  // CTA
  ctaTitle: string;
  ctaDesc: string;
  createAccount: string;
  
  // Footer
  aboutUs: string;
  contact: string;
  
  // Admin
  adminDashboard: string;
  adminUsers: string;
  adminPlans: string;
  adminSettings: string;
  adminAnalytics: string;
  
  // Not Found
  notFoundTitle: string;
  notFoundDesc: string;
  backToHome: string;
  
  // Language
  language: string;
  
  // Teams
  teams: string;
  newTeam: string;
  editTeam: string;
  deleteTeam: string;
  teamName: string;
  teamDescription: string;
  noTeams: string;
  createTeam: string;
  updateTeam: string;
  teamCreated: string;
  teamUpdated: string;
  teamDeleted: string;
  selectTeam: string;
  configureTeam: string;
}

export type TranslationKey = keyof Translations;

export const translations: { [key in Language]: Translations } = {
  en: {
    // Common
    dashboard: 'Dashboard',
    habits: 'Habits',
    goals: 'Goals',
    reports: 'Reports',
    settings: 'Settings',
    onboarding: 'Onboarding',
    logout: 'Logout',
    back: 'Back',

    // Auth & User
    login: 'Login',
    register: 'Register',
    email: 'Email',
    password: 'Password',
    forgotPassword: 'Forgot password?',
    entering: 'Entering...',
    enter: 'Enter',
    dontHaveAccount: 'Don\'t have an account?',
    signUp: 'Sign up',
    adminInfo: 'Use admin@habitus.com for admin access, gerente@exemplo.com for manager, or any other email for seller.',
    loginSuccess: 'Login successful',
    welcomeMessage: 'Welcome to Habitus! You are logged in as {{role}}.',
    invalidCredentials: 'Invalid credentials',
    loginError: 'Error logging in',
    checkCredentials: 'Check your credentials and try again.',
    loginTitle: 'Enter your credentials to access your account',
    
    // Password Recovery
    recoverPassword: 'Recover password',
    passwordRecoveryEnterEmail: 'Enter your email and we\'ll send you instructions to reset your password',
    passwordRecoveryEmailSent: 'Recovery email sent',
    passwordRecoveryCheckEmail: 'Please check your email for instructions on how to reset your password',
    passwordRecoveryEmailSentDesc: 'We\'ve sent recovery instructions to your email',
    passwordRecoveryFollowInstructions: 'Follow the link in the email to reset your password. If you don\'t see the email, check your spam folder.',
    passwordRecoveryError: 'Error requesting password recovery',
    passwordRecoveryTryAgain: 'Please try again or contact support if the problem persists.',
    sendRecoveryEmail: 'Send recovery email',
    sending: 'Sending...',
    tryAnotherEmail: 'Try with another email',
    rememberPassword: 'Remember your password? Sign in',
    backToLogin: 'Back to login',
    
    // Landing Page
    heroTitle: 'Transform your',
    heroTitleHighlight: 'sales team',
    heroDescription: 'Monitor goals, develop atomic habits and increase your team\'s performance with intelligent automation and AI consulting.',
    startNow: 'Start now',
    scheduleDemo: 'Schedule demo',
    
    // Features
    featuresTitle: 'How Habitus transforms your team',
    smartGoalsTitle: 'Smart Goals',
    smartGoalsDesc: 'Set and monitor realistic goals based on your market data',
    atomicHabitsTitle: 'Atomic Habits',
    atomicHabitsDesc: 'Cultivate daily habits that lead to your team\'s success',
    autoRewardsTitle: 'Automatic Rewards',
    autoRewardsDesc: 'Calculate and distribute incentives transparently',
    
    // Testimonials
    testimonialsTitle: 'What our customers say',
    testimonialsDesc: 'See how Habitus is transforming sales teams across the world',
    
    // Pricing
    pricingTitle: 'Habitus Plans',
    startupPlan: 'Startup',
    businessPlan: 'Business',
    enterprisePlan: 'Enterprise',
    month: '/month',
    startupDesc: 'For small teams starting their sales journey',
    businessDesc: 'For growing teams looking to scale sales',
    enterpriseDesc: 'For large teams with complex needs',
    popular: 'POPULAR',
    chooseBusiness: 'Choose Business',
    talkToSales: 'Talk to sales',
    
    // CTA
    ctaTitle: 'Ready to transform your sales team?',
    ctaDesc: 'Start today the journey to a more efficient and motivated sales team',
    createAccount: 'Create your account',
    
    // Footer
    aboutUs: 'About us',
    contact: 'Contact',
    
    // Admin
    adminDashboard: 'Admin Dashboard',
    adminUsers: 'Users',
    adminPlans: 'Plans',
    adminSettings: 'Settings',
    adminAnalytics: 'Analytics',
    
    // Not Found
    notFoundTitle: 'Oops! Page not found',
    notFoundDesc: 'The page you are looking for does not exist or has been moved.',
    backToHome: 'Back to Home',
    
    // Language
    language: 'Language',
    
    // Teams
    teams: 'Teams',
    newTeam: 'New Team',
    editTeam: 'Edit Team',
    deleteTeam: 'Delete Team',
    teamName: 'Team Name',
    teamDescription: 'Team Description',
    noTeams: 'No teams registered',
    createTeam: 'Create Team',
    updateTeam: 'Update Team',
    teamCreated: 'Team created',
    teamUpdated: 'Team updated',
    teamDeleted: 'Team deleted',
    selectTeam: 'Select a team',
    configureTeam: 'Configure',
  },
  es: {
    // Common
    dashboard: 'Panel',
    habits: 'Hábitos',
    goals: 'Metas',
    reports: 'Informes',
    settings: 'Ajustes',
    onboarding: 'Incorporación',
    logout: 'Cerrar sesión',
    back: 'Regresar',
    
    // Auth & User
    login: 'Iniciar Sesión',
    register: 'Registrarse',
    email: 'Correo electrónico',
    password: 'Contraseña',
    forgotPassword: '¿Olvidaste tu contraseña?',
    entering: 'Ingresando...',
    enter: 'Ingresar',
    dontHaveAccount: '¿No tienes una cuenta?',
    signUp: 'Regístrate',
    adminInfo: 'Usa admin@habitus.com para acceso admin, gerente@exemplo.com para gerente, o cualquier otro correo para vendedor.',
    loginSuccess: 'Inicio de sesión exitoso',
    welcomeMessage: '¡Bienvenido a Habitus! Has iniciado sesión como {{role}}.',
    invalidCredentials: 'Credenciales inválidas',
    loginError: 'Error al iniciar sesión',
    checkCredentials: 'Verifica tus credenciales e intenta nuevamente.',
    loginTitle: 'Ingresa tus credenciales para acceder a tu cuenta',
    
    // Password Recovery
    recoverPassword: 'Recuperar contraseña',
    passwordRecoveryEnterEmail: 'Ingresa tu correo electrónico y te enviaremos instrucciones para restablecer tu contraseña',
    passwordRecoveryEmailSent: 'Correo de recuperación enviado',
    passwordRecoveryCheckEmail: 'Por favor revisa tu correo electrónico para obtener instrucciones sobre cómo restablecer tu contraseña',
    passwordRecoveryEmailSentDesc: 'Hemos enviado instrucciones de recuperación a tu correo electrónico',
    passwordRecoveryFollowInstructions: 'Sigue el enlace en el correo electrónico para restablecer tu contraseña. Si no ves el correo, revisa tu carpeta de spam.',
    passwordRecoveryError: 'Error al solicitar recuperación de contraseña',
    passwordRecoveryTryAgain: 'Por favor intenta nuevamente o contacta al soporte si el problema persiste.',
    sendRecoveryEmail: 'Enviar correo de recuperación',
    sending: 'Enviando...',
    tryAnotherEmail: 'Intentar con otro correo',
    rememberPassword: '¿Recuerdas tu contraseña? Inicia sesión',
    backToLogin: 'Volver al inicio de sesión',
    
    // Landing Page
    heroTitle: 'Transforma tu',
    heroTitleHighlight: 'equipo de ventas',
    heroDescription: 'Monitorea metas, desarrolla hábitos atómicos y aumenta el rendimiento de tu equipo con automatización inteligente y consultoría por IA.',
    startNow: 'Comienza ahora',
    scheduleDemo: 'Agendar demostración',
    
    // Features
    featuresTitle: 'Cómo Habitus transforma tu equipo',
    smartGoalsTitle: 'Metas Inteligentes',
    smartGoalsDesc: 'Establece y monitorea metas realistas basadas en datos de tu mercado',
    atomicHabitsTitle: 'Hábitos Atómicos',
    atomicHabitsDesc: 'Cultiva hábitos diarios que llevan al éxito de tu equipo',
    autoRewardsTitle: 'Bonificaciones Automáticas',
    autoRewardsDesc: 'Calcula y distribuye incentivos de forma transparente',
    
    // Testimonials
    testimonialsTitle: 'Lo que dicen nuestros clientes',
    testimonialsDesc: 'Ve cómo Habitus está transformando equipos de ventas en todo el mundo',
    
    // Pricing
    pricingTitle: 'Planes Habitus',
    startupPlan: 'Startup',
    businessPlan: 'Business',
    enterprisePlan: 'Enterprise',
    month: '/mes',
    startupDesc: 'Para equipos pequeños comenzando su viaje de ventas',
    businessDesc: 'Para equipos en crecimiento buscando escalar ventas',
    enterpriseDesc: 'Para grandes equipos con necesidades complejas',
    popular: 'POPULAR',
    chooseBusiness: 'Elegir Business',
    talkToSales: 'Hablar con ventas',
    
    // CTA
    ctaTitle: '¿Listo para transformar tu equipo de ventas?',
    ctaDesc: 'Comienza hoy el camino hacia un equipo de ventas más eficiente y motivado',
    createAccount: 'Crear tu cuenta',
    
    // Footer
    aboutUs: 'Sobre nosotros',
    contact: 'Contacto',
    
    // Admin
    adminDashboard: 'Panel de Administrador',
    adminUsers: 'Usuarios',
    adminPlans: 'Planes',
    adminSettings: 'Ajustes',
    adminAnalytics: 'Analítica',
    
    // Not Found
    notFoundTitle: '¡Ups! Página no encontrada',
    notFoundDesc: 'La página que estás buscando no existe o ha sido movida.',
    backToHome: 'Volver al Inicio',
    
    // Language
    language: 'Idioma',
    
    // Teams
    teams: 'Equipos',
    newTeam: 'Nuevo Equipo',
    editTeam: 'Editar Equipo',
    deleteTeam: 'Eliminar Equipo',
    teamName: 'Nombre del Equipo',
    teamDescription: 'Descripción del Equipo',
    noTeams: 'No hay equipos registrados',
    createTeam: 'Crear Equipo',
    updateTeam: 'Actualizar Equipo',
    teamCreated: 'Equipo creado',
    teamUpdated: 'Equipo actualizado',
    teamDeleted: 'Equipo eliminado',
    selectTeam: 'Seleccione un equipo',
    configureTeam: 'Configurar',
  },
  pt: {
    // Common
    dashboard: 'Painel',
    habits: 'Hábitos',
    goals: 'Metas',
    reports: 'Relatórios',
    settings: 'Configurações',
    onboarding: 'Integração',
    logout: 'Sair',
    back: 'Voltar',
    
    // Auth & User
    login: 'Entrar',
    register: 'Cadastrar',
    email: 'Email',
    password: 'Senha',
    forgotPassword: 'Esqueceu a senha?',
    entering: 'Entrando...',
    enter: 'Entrar',
    dontHaveAccount: 'Não tem uma conta?',
    signUp: 'Cadastre-se',
    adminInfo: 'Use admin@habitus.com para acesso de administrador, gerente@exemplo.com para gerente, ou qualquer outro email para vendedor.',
    loginSuccess: 'Login realizado com sucesso',
    welcomeMessage: 'Bem-vindo ao Habitus! Você está logado como {{role}}.',
    invalidCredentials: 'Credenciais inválidas',
    loginError: 'Erro ao fazer login',
    checkCredentials: 'Verifique suas credenciais e tente novamente.',
    loginTitle: 'Digite suas credenciais para acessar sua conta',
    
    // Password Recovery
    recoverPassword: 'Recuperar senha',
    passwordRecoveryEnterEmail: 'Digite seu email e enviaremos instruções para redefinir sua senha',
    passwordRecoveryEmailSent: 'Email de recuperação enviado',
    passwordRecoveryCheckEmail: 'Por favor, verifique seu email para obter instruções sobre como redefinir sua senha',
    passwordRecoveryEmailSentDesc: 'Enviamos instruções de recuperação para seu email',
    passwordRecoveryFollowInstructions: 'Siga o link no email para redefinir sua senha. Se você não ver o email, verifique sua pasta de spam.',
    passwordRecoveryError: 'Erro ao solicitar recuperação de senha',
    passwordRecoveryTryAgain: 'Por favor, tente novamente ou entre em contato com o suporte se o problema persistir.',
    sendRecoveryEmail: 'Enviar email de recuperação',
    sending: 'Enviando...',
    tryAnotherEmail: 'Tentar com outro email',
    rememberPassword: 'Lembra da sua senha? Entre',
    backToLogin: 'Voltar para login',
    
    // Landing Page
    heroTitle: 'Transforme seu',
    heroTitleHighlight: 'time de vendas',
    heroDescription: 'Monitore metas, desenvolva hábitos atômicos e aumente o desempenho da sua equipe com automação inteligente e consultoria por IA.',
    startNow: 'Começar agora',
    scheduleDemo: 'Agendar demonstração',
    
    // Features
    featuresTitle: 'Como o Habitus transforma seu time',
    smartGoalsTitle: 'Metas Inteligentes',
    smartGoalsDesc: 'Defina e monitore metas realistas baseadas nos dados do seu mercado',
    atomicHabitsTitle: 'Hábitos Atômicos',
    atomicHabitsDesc: 'Cultive hábitos diários que levam ao sucesso da sua equipe',
    autoRewardsTitle: 'Bonificações Automáticas',
    autoRewardsDesc: 'Calcule e distribua incentivos de forma transparente',
    
    // Testimonials
    testimonialsTitle: 'O que nossos clientes dizem',
    testimonialsDesc: 'Veja como o Habitus está transformando times de vendas em todo o mundo',
    
    // Pricing
    pricingTitle: 'Planos Habitus',
    startupPlan: 'Startup',
    businessPlan: 'Business',
    enterprisePlan: 'Enterprise',
    month: '/mês',
    startupDesc: 'Para times pequenos começando sua jornada de vendas',
    businessDesc: 'Para times em crescimento buscando escalar vendas',
    enterpriseDesc: 'Para grandes equipes com necessidades complexas',
    popular: 'POPULAR',
    chooseBusiness: 'Escolher Business',
    talkToSales: 'Falar com vendas',
    
    // CTA
    ctaTitle: 'Pronto para transformar seu time de vendas?',
    ctaDesc: 'Comece hoje a jornada para um time de vendas mais eficiente e motivado',
    createAccount: 'Crie sua conta',
    
    // Footer
    aboutUs: 'Sobre nós',
    contact: 'Contato',
    
    // Admin
    adminDashboard: 'Painel de Administração',
    adminUsers: 'Usuários',
    adminPlans: 'Planos',
    adminSettings: 'Configurações',
    adminAnalytics: 'Análise',
    
    // Not Found
    notFoundTitle: 'Ops! Página não encontrada',
    notFoundDesc: 'A página que você está procurando não existe ou foi movida.',
    backToHome: 'Voltar para o Início',
    
    // Language
    language: 'Idioma',
    
    // Teams
    teams: 'Times',
    newTeam: 'Novo Time',
    editTeam: 'Editar Time',
    deleteTeam: 'Excluir Time',
    teamName: 'Nome do Time',
    teamDescription: 'Descrição do Time',
    noTeams: 'Nenhum time registrado',
    createTeam: 'Criar Time',
    updateTeam: 'Atualizar Time',
    teamCreated: 'Time criado',
    teamUpdated: 'Time atualizado',
    teamDeleted: 'Time excluído',
    selectTeam: 'Selecione um time',
    configureTeam: 'Configurar',
  },
};

