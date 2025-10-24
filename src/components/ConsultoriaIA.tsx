
import React, { useState, useRef, useEffect } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { AIService } from "@/services/ai-service";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { useSupabase } from "@/hooks/use-supabase";
import { useAuth } from "@/components/auth/AuthProvider";
import { useLanguage } from "@/i18n";

interface Mensagem {
  role: 'user' | 'assistant';
  content: string;
}

const ConsultoriaIA = () => {
  const { supabase } = useSupabase();
  const { userProfile } = useAuth();
  const { t } = useLanguage();
  const [mensagens, setMensagens] = useState<Mensagem[]>([
    { 
      role: 'assistant', 
      content: t('aiAssistantGreeting')
    }
  ]);
  const [inputMensagem, setInputMensagem] = useState("");
  const [carregando, setCarregando] = useState(false);
  const [historicoBuscado, setHistoricoBuscado] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);
  
  // Buscar histórico de mensagens ao carregar
  useEffect(() => {
    if (!historicoBuscado) {
      fetchChatHistory();
    }
  }, [historicoBuscado, supabase]);
  
  // Rolagem automática para a última mensagem
  useEffect(() => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [mensagens]);

  const fetchChatHistory = async () => {
    try {
      if (supabase) {
        const { data, error } = await supabase
          .from('mensagens_ia')
          .select('*')
          .order('created_at', { ascending: true })
          .limit(50);
        
        if (error) {
          console.error("Error fetching chat history:", error);
          return;
        }
        
        if (data && data.length > 0) {
          const historicoFormatado = data.map(msg => ({
            role: msg.role as 'user' | 'assistant',
            content: msg.content
          }));
          
          // Manter a mensagem de boas-vindas no início
          setMensagens([mensagens[0], ...historicoFormatado]);
        }
      } else {
        // Buscar do localStorage
        const historicoSalvo = localStorage.getItem('chat_history');
        if (historicoSalvo) {
          setMensagens([mensagens[0], ...JSON.parse(historicoSalvo)]);
        }
      }
    } catch (error) {
      console.error("Error processing chat history:", error);
    } finally {
      setHistoricoBuscado(true);
    }
  };

  const enviarMensagem = async () => {
    if (!inputMensagem.trim()) return;
    
    const novaMensagem: Mensagem = {
      role: 'user',
      content: inputMensagem
    };
    
    setMensagens(prev => [...prev, novaMensagem]);
    setInputMensagem("");
    setCarregando(true);
    
    try {
      // Usar o novo AIService
      const respostaData = await AIService.consultWithAI({
        message: inputMensagem,
        consultationType: 'general',
        context: {
          sessionHistory: mensagens.slice(-5), // Últimas 5 mensagens para contexto
          userId: userProfile?.id,
          companyId: userProfile?.empresa_id
        }
      });
      
      const respostaIA = respostaData.response;
      
      const respostaMensagem: Mensagem = { 
        role: 'assistant', 
        content: respostaIA 
      };
      
      setMensagens(prev => [...prev, respostaMensagem]);
      
      // Salvar mensagens no banco
      if (supabase) {
        await Promise.all([
          // Salvar a mensagem do usuário
          supabase.from('mensagens_ia').insert({
            role: novaMensagem.role,
            content: novaMensagem.content,
            created_at: new Date().toISOString()
          }),
          // Salvar a resposta da IA
          supabase.from('mensagens_ia').insert({
            role: respostaMensagem.role,
            content: respostaMensagem.content,
            created_at: new Date().toISOString()
          })
        ]);
      } else {
        // Salvar no localStorage
        const mensagensParaSalvar = [...mensagens.slice(1), novaMensagem, respostaMensagem];
        localStorage.setItem('chat_history', JSON.stringify(mensagensParaSalvar));
      }
    } catch (error) {
      console.error("Error getting assistant response:", error);
      toast.error(t('connectionError'));
    } finally {
      setCarregando(false);
    }
  };

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle>{t('aiConsultingSection')}</CardTitle>
        <CardDescription>
          {t('getPersonalizedRecommendations')}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4 max-h-[350px] overflow-y-auto">
          {mensagens.map((msg, index) => (
            <div 
              key={index} 
              className={`rounded-md p-3 ${
                msg.role === 'assistant' ? 'bg-muted' : 'bg-primary/10 text-right'
              }`}
            >
              <p className="font-medium">{msg.role === 'assistant' ? 'Habitus Assistant:' : 'You:'}</p>
              <p className="mt-1 text-sm">{msg.content}</p>
            </div>
          ))}
          
          {carregando && (
            <div className="flex justify-center py-2">
              <Loader2 className="h-6 w-6 animate-spin text-primary" />
            </div>
          )}
          
          <div ref={chatEndRef} />
        </div>
      </CardContent>
      <CardFooter>
        <div className="flex w-full items-center space-x-2">
          <Input 
            className="flex-1" 
            placeholder="Ask the AI a question..." 
            value={inputMensagem}
            onChange={(e) => setInputMensagem(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && enviarMensagem()}
          />
          <Button 
            onClick={enviarMensagem}
            disabled={carregando || !inputMensagem.trim()}
          >
            {carregando ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Send'}
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
};

export default ConsultoriaIA;
