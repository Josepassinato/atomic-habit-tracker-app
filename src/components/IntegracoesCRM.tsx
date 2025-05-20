
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useIntegracoes } from "./integracoes/useIntegracoes";
import IntegracaoItem from "./integracoes/IntegracaoItem";
import IntegracaoDialog from "./integracoes/IntegracaoDialog";
import LoadingIntegracoes from "./integracoes/LoadingIntegracoes";

const IntegracoesCRM = () => {
  const {
    crmList,
    selectedCrm,
    isDialogOpen,
    setIsDialogOpen,
    apiUrl,
    setApiUrl,
    apiKey,
    setApiKey,
    isConnecting,
    isLoading,
    handleConfigClick,
    handleSaveConfig,
    handleDisconnect
  } = useIntegracoes();

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Integrações</CardTitle>
          <CardDescription>Conecte seu CRM e ferramentas de comunicação</CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <LoadingIntegracoes />
          ) : (
            <div className="grid gap-3">
              {crmList.map((integracao) => (
                <IntegracaoItem 
                  key={integracao.id} 
                  integracao={integracao} 
                  onConfigClick={handleConfigClick} 
                />
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <IntegracaoDialog 
        isOpen={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        selectedCrm={selectedCrm}
        apiUrl={apiUrl}
        setApiUrl={setApiUrl}
        apiKey={apiKey}
        setApiKey={setApiKey}
        onSave={handleSaveConfig}
        onDisconnect={handleDisconnect}
        isConnecting={isConnecting}
      />
    </>
  );
};

export default IntegracoesCRM;
