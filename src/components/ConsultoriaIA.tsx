
import React, { useState, useRef, useEffect } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { openAIService } from "@/services/openai-service";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { useSupabase } from "@/hooks/use-supabase";

interface Mensagem {
  role: 'user' | 'assistant';
  content: string;
}

const ConsultoriaIA = () => {
  const { supabase } = useSupabase();
  const [mensagens, setMensagens] = useState<Mensagem[]>([
    { 
      role: 'assistant', 
      content: 'Olá! Sou o assistente IA do Habitus. Como posso ajudar você hoje? Posso auxiliar com definição de metas, sugestão de hábitos atômicos ou análise do seu desempenho atual.' 
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
          console.error("Erro ao buscar histórico de chat:", error);
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
      console.error("Erro ao processar histórico de chat:", error);
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
      // Criar contexto com histórico de conversa para a API
      const historico = mensagens
        .slice(-5) // Limitar contexto para as últimas 5 mensagens
        .map(msg => `${msg.role === 'user' ? 'Usuário' : 'Assistente'}: ${msg.content}`)
        .join('\n\n');
        
      const prompt = `
        Histórico da conversa:
        ${historico}
        
        Usuário: ${inputMensagem}
        
        Responda como um assistente de vendas especializado em hábitos atômicos e produtividade para equipes comerciais.
      `;
      
      const respostaIA = await openAIService.generateText(prompt);
      
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
      console.error("Erro ao obter resposta do assistente:", error);
      toast.error("Erro ao obter resposta do assistente.");
    } finally {
      setCarregando(false);
    }
  };

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle>Consultoria IA</CardTitle>
        <CardDescription>
          Receba recomendações personalizadas para suas metas e hábitos
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
              <p className="font-medium">{msg.role === 'assistant' ? 'Assistente Habitus:' : 'Você:'}</p>
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
            placeholder="Digite sua pergunta para a IA..." 
            value={inputMensagem}
            onChange={(e) => setInputMensagem(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && enviarMensagem()}
          />
          <Button 
            onClick={enviarMensagem}
            disabled={carregando || !inputMensagem.trim()}
          >
            {carregando ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Enviar'}
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
};

export default ConsultoriaIA;
