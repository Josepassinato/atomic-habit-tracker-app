
import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/contexts/LanguageContext";

const NotFound = () => {
  const location = useLocation();
  const { t } = useLanguage();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 dark:bg-gray-900 px-4">
      <div className="max-w-md w-full bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8 text-center">
        <h1 className="text-6xl font-bold text-primary mb-4">404</h1>
        <p className="text-xl text-gray-600 dark:text-gray-300 mb-6">
          {t('notFoundTitle')}
        </p>
        <p className="text-gray-500 dark:text-gray-400 mb-8">
          {t('notFoundDesc')}
        </p>
        <div className="flex flex-col space-y-2 sm:flex-row sm:space-y-0 sm:space-x-2 justify-center">
          <Button asChild variant="default">
            <Link to="/">{t('backToHome')}</Link>
          </Button>
          <Button asChild variant="outline">
            <Link to="/dashboard">{t('dashboard')}</Link>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
