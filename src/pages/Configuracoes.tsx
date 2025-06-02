
import React, { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { KeyRound, Bell, Shield } from "lucide-react";
import APIConfigTab from "@/components/configuracoes/APIConfigTab";
import NotificationsTab from "@/components/configuracoes/NotificationsTab";
import PrivacyTab from "@/components/configuracoes/PrivacyTab";
import { useLanguage } from "@/i18n";

const Configuracoes = () => {
  const [activeTab, setActiveTab] = useState("api");
  const { t, language } = useLanguage();
  
  // Footer tagline based on language
  const getFooterTagline = () => {
    switch(language) {
      case 'pt':
        return 'O futuro da automação de vendas e performance';
      case 'es':
        return 'El futuro de la automatización de ventas y rendimiento';
      case 'en':
      default:
        return 'The future of sales automation and performance';
    }
  };
  
  return (
    <>
      <main className="container py-6">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold">{t('settings')}</h1>
        </div>
        
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="mb-6">
            <TabsTrigger value="api" className="flex items-center gap-2">
              <KeyRound size={16} />
              <span>{t('apisAndIntegrations')}</span>
            </TabsTrigger>
            <TabsTrigger value="notificacoes" className="flex items-center gap-2">
              <Bell size={16} />
              <span>{t('notifications')}</span>
            </TabsTrigger>
            <TabsTrigger value="privacidade" className="flex items-center gap-2">
              <Shield size={16} />
              <span>{t('privacy')}</span>
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="api" className="space-y-6">
            <APIConfigTab />
          </TabsContent>
          
          <TabsContent value="notificacoes" className="space-y-6">
            <NotificationsTab />
          </TabsContent>
          
          <TabsContent value="privacidade" className="space-y-6">
            <PrivacyTab />
          </TabsContent>
        </Tabs>
      </main>
      <footer className="border-t bg-white py-4">
        <div className="container text-center text-sm text-muted-foreground">
          Habitus © 2025 - {getFooterTagline()}
        </div>
      </footer>
    </>
  );
};

export default Configuracoes;
