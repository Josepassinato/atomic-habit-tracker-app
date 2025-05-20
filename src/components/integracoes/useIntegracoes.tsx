
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { useSupabase } from "@/hooks/use-supabase";
import { Integracao, integracoesIniciais } from "./types";

export const useIntegracoes = () => {
  const [crmList, setCrmList] = useState<Integracao[]>([]);
  const [selectedCrm, setSelectedCrm] = useState<Integracao | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [apiUrl, setApiUrl] = useState("");
  const [apiKey, setApiKey] = useState("");
  const [isConnecting, setIsConnecting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  
  const { supabase } = useSupabase();
  
  useEffect(() => {
    fetchIntegracoes();
  }, []);
  
  const fetchIntegracoes = async () => {
    setIsLoading(true);
    
    try {
      if (supabase) {
        // Tenta buscar do Supabase
        const { data, error } = await supabase
          .from('integracoes')
          .select('*');
          
        if (error) {
          console.error("Erro ao buscar integrações:", error);
          throw error;
        }
        
        if (data && data.length > 0) {
          setCrmList(data);
        } else {
          // Se não houver dados no Supabase, inicializa com as integrações padrão
          if (supabase) {
            // Insere as integrações iniciais no Supabase
            await supabase.from('integracoes').upsert(
              integracoesIniciais.map(item => ({
                ...item,
                empresa_id: 'current' // Em um sistema real, usaríamos o ID da empresa do usuário
              }))
            );
          }
          setCrmList(integracoesIniciais);
        }
      } else {
        // Fallback para localStorage se não tiver Supabase
        const savedIntegracoes = localStorage.getItem('integracoes_crm');
        if (savedIntegracoes) {
          setCrmList(JSON.parse(savedIntegracoes));
        } else {
          setCrmList(integracoesIniciais);
          localStorage.setItem('integracoes_crm', JSON.stringify(integracoesIniciais));
        }
      }
    } catch (error) {
      console.error("Erro ao carregar integrações:", error);
      // Fallback para dados iniciais
      setCrmList(integracoesIniciais);
      toast.error("Não foi possível carregar as integrações. Usando dados locais.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleConfigClick = (integracao: Integracao) => {
    if (integracao.conectado) {
      // Abrir diálogo com dados pré-preenchidos
      setSelectedCrm(integracao);
      setApiUrl(integracao.apiUrl || "");
      setApiKey(integracao.apiKey || "");
      setIsDialogOpen(true);
    } else {
      // Abrir diálogo para nova conexão
      setSelectedCrm(integracao);
      setApiUrl("");
      setApiKey("");
      setIsDialogOpen(true);
    }
  };

  const handleSaveConfig = async () => {
    if (!selectedCrm) return;
    
    setIsConnecting(true);
    
    try {
      const updatedItem = {
        ...selectedCrm,
        conectado: true,
        apiUrl,
        apiKey
      };
      
      const updatedList = crmList.map(item => 
        item.id === selectedCrm.id ? updatedItem : item
      );
      
      if (supabase) {
        // Salvar no Supabase
        const { error } = await supabase
          .from('integracoes')
          .upsert({
            id: selectedCrm.id,
            nome: selectedCrm.nome,
            conectado: true,
            integracoes: selectedCrm.integracoes,
            apiUrl,
            apiKey,
            empresa_id: 'current' // Em um sistema real, usaríamos o ID da empresa do usuário
          });
          
        if (error) {
          console.error("Erro ao salvar integração:", error);
          throw error;
        }
      } else {
        // Fallback para localStorage
        localStorage.setItem('integracoes_crm', JSON.stringify(updatedList));
      }
      
      setCrmList(updatedList);
      setIsDialogOpen(false);
      toast.success(`Integração com ${selectedCrm.nome} ${selectedCrm.conectado ? 'atualizada' : 'conectada'} com sucesso!`);
    } catch (error) {
      console.error("Erro ao salvar configuração:", error);
      toast.error(`Erro ao configurar a integração com ${selectedCrm.nome}`);
    } finally {
      setIsConnecting(false);
    }
  };

  const handleDisconnect = async () => {
    if (!selectedCrm) return;
    
    setIsConnecting(true);
    
    try {
      const updatedItem = {
        ...selectedCrm,
        conectado: false,
        apiUrl: undefined,
        apiKey: undefined
      };
      
      const updatedList = crmList.map(item => 
        item.id === selectedCrm.id ? updatedItem : item
      );
      
      if (supabase) {
        // Atualizar no Supabase
        const { error } = await supabase
          .from('integracoes')
          .update({
            conectado: false,
            apiUrl: null,
            apiKey: null
          })
          .eq('id', selectedCrm.id);
          
        if (error) {
          console.error("Erro ao desconectar integração:", error);
          throw error;
        }
      } else {
        // Fallback para localStorage
        localStorage.setItem('integracoes_crm', JSON.stringify(updatedList));
      }
      
      setCrmList(updatedList);
      setIsDialogOpen(false);
      toast.success(`Integração com ${selectedCrm.nome} desconectada com sucesso!`);
    } catch (error) {
      console.error("Erro ao desconectar:", error);
      toast.error(`Erro ao desconectar a integração com ${selectedCrm.nome}`);
    } finally {
      setIsConnecting(false);
    }
  };

  return {
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
  };
};
