
import React, { useState, useRef, useEffect } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { openAIService } from "@/services/openai-service";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

interface Mensagem {
  role: 'user' | 'assistant';
  content: string;
}

const ConsultoriaIA = () => {
  const [mensagens, setMensagens] = useState<Mensagem[]>([
    { 
      role: 'assistant', 
      content: 'Olá! Sou o assistente IA do Habitus. Como posso ajudar você hoje? Posso auxiliar com definição de metas, sugestão de hábitos atômicos ou análise do seu desempenho atual.' 
    }
  ]);
  const [inputMensagem, setInputMensagem] = useState("");
  const [carregando, setCarregando] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);
  
  // Rolagem automática para a última mensagem
  useEffect(() => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [mensagens]);

  const verificarApiKey = () => {
    if (!openAIService.getApiKey()) {
      const apiKey = window.prompt("Por favor, insira sua chave da API da OpenAI para continuar:");
      
      if (apiKey) {
        openAIService.setApiKey(apiKey);
        toast.success("Chave da API configurada com sucesso!");
        return true;
      } else {
        toast.error("Chave da API necessária para usar o assistente.");
        return false;
      }
    }
    return true;
  };

  const enviarMensagem = async () => {
    if (!inputMensagem.trim()) return;
    
    if (!verificarApiKey()) return;
    
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
        .map(msg => `${msg.role === 'user' ? 'Usuário' : 'Assistente'}: ${msg.content}`)
        .join('\n\n');
        
      const prompt = `
        Histórico da conversa:
        ${historico}
        
        Usuário: ${inputMensagem}
        
        Responda como um assistente de vendas especializado em hábitos atômicos e produtividade para equipes comerciais.
      `;
      
      const respostaIA = await openAIService.generateText(prompt);
      
      setMensagens(prev => [
        ...prev, 
        { role: 'assistant', content: respostaIA }
      ]);
    } catch (error) {
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
