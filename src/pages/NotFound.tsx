
import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/contexts/LanguageContext";

const NotFound = () => {
  const location = useLocation();
  const { t, language } = useLanguage();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  // Direct translations for this component
  const getNotFoundTitle = () => {
    switch(language) {
      case 'en':
        return "Page not found";
      case 'es':
        return "Página no encontrada";
      case 'pt':
        return "Página não encontrada";
      default:
        return "Página não encontrada";
    }
  };

  const getNotFoundDesc = () => {
    switch(language) {
      case 'en':
        return "The page you're looking for doesn't exist or has been moved.";
      case 'es':
        return "La página que está buscando no existe o ha sido movida.";
      case 'pt':
        return "A página que você está procurando não existe ou foi movida.";
      default:
        return "A página que você está procurando não existe ou foi movida.";
    }
  };

  const getBackToHome = () => {
    switch(language) {
      case 'en':
        return "Back to Home";
      case 'es':
        return "Volver al Inicio";
      case 'pt':
        return "Voltar ao Início";
      default:
        return "Voltar ao Início";
    }
  };

  const getDashboard = () => {
    switch(language) {
      case 'en':
        return "Dashboard";
      case 'es':
        return "Panel";
      case 'pt':
        return "Painel";
      default:
        return "Painel";
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 dark:bg-gray-900 px-4">
      <div className="max-w-md w-full bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8 text-center">
        <h1 className="text-6xl font-bold text-primary mb-4">404</h1>
        <p className="text-xl text-gray-600 dark:text-gray-300 mb-6">
          {getNotFoundTitle()}
        </p>
        <p className="text-gray-500 dark:text-gray-400 mb-8">
          {getNotFoundDesc()}
        </p>
        <div className="flex flex-col space-y-2 sm:flex-row sm:space-y-0 sm:space-x-2 justify-center">
          <Button asChild variant="default">
            <Link to="/">{getBackToHome()}</Link>
          </Button>
          <Button asChild variant="outline">
            <Link to="/dashboard">{getDashboard()}</Link>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
