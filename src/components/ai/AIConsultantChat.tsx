import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { AIService } from '@/services/ai-service';
import { useAuth } from '@/components/auth/AuthProvider';
import { 
  Brain, 
  Send, 
  User, 
  Bot, 
  TrendingUp, 
  Target, 
  Lightbulb,
  MessageSquare,
  Loader2
} from 'lucide-react';

interface ChatMessage {
  id: string;
  type: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  consultationType?: string;
}

export const AIConsultantChat: React.FC = () => {
  const { userProfile } = useAuth();
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      type: 'assistant',
      content: 'Olá! Sou seu consultor de vendas especializado em IA. Posso ajudar com estratégias de vendas, otimização de hábitos, definição de metas e análise de performance. Como posso ajudá-lo hoje?',
      timestamp: new Date(),
      consultationType: 'general'
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [consultationType, setConsultationType] = useState<'sales' | 'habits' | 'goals' | 'general' | 'strategy'>('general');
  const [loading, setLoading] = useState(false);
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight;
    }
  }, [messages]);

  const sendMessage = async () => {
    if (!inputMessage.trim() || loading) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      type: 'user',
      content: inputMessage,
      timestamp: new Date(),
      consultationType
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setLoading(true);

    try {
      const response = await AIService.consultWithAI({
        message: inputMessage,
        consultationType,
        context: {
          sessionHistory: messages.slice(-5) // Last 5 messages for context
        }
      });

      const assistantMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        type: 'assistant',
        content: response.response || 'Desculpe, não consegui processar sua solicitação.',
        timestamp: new Date(),
        consultationType
      };

      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      console.error('Erro no chat:', error);
      toast.error('Erro ao enviar mensagem. Tente novamente.');
      
      const errorMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        type: 'assistant',
        content: 'Desculpe, ocorreu um erro. Tente novamente ou reformule sua pergunta.',
        timestamp: new Date(),
        consultationType: 'general'
      };
      
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const getConsultationTypeIcon = (type: string) => {
    switch (type) {
      case 'sales': return <TrendingUp className="h-4 w-4" />;
      case 'habits': return <Target className="h-4 w-4" />;
      case 'goals': return <Target className="h-4 w-4" />;
      case 'strategy': return <Lightbulb className="h-4 w-4" />;
      default: return <MessageSquare className="h-4 w-4" />;
    }
  };

  const getConsultationTypeLabel = (type: string) => {
    switch (type) {
      case 'sales': return 'Vendas';
      case 'habits': return 'Hábitos';
      case 'goals': return 'Metas';
      case 'strategy': return 'Estratégia';
      default: return 'Geral';
    }
  };

  const quickPrompts = [
    { type: 'sales', text: 'Como posso melhorar minha taxa de conversão?' },
    { type: 'habits', text: 'Que hábitos são mais eficazes para vendedores?' },
    { type: 'goals', text: 'Como definir metas SMART para minha equipe?' },
    { type: 'strategy', text: 'Qual estratégia de crescimento recomenda?' }
  ];

  return (
    <Card className="h-[600px] flex flex-col">
      <CardHeader className="flex-shrink-0">
        <CardTitle className="flex items-center gap-2">
          <Brain className="h-5 w-5" />
          Consultor de IA
        </CardTitle>
        <div className="flex items-center gap-2">
          <Select value={consultationType} onValueChange={(value: any) => setConsultationType(value)}>
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="Tipo de consultoria" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="general">Geral</SelectItem>
              <SelectItem value="sales">Vendas</SelectItem>
              <SelectItem value="habits">Hábitos</SelectItem>
              <SelectItem value="goals">Metas</SelectItem>
              <SelectItem value="strategy">Estratégia</SelectItem>
            </SelectContent>
          </Select>
          <Badge variant="outline" className="flex items-center gap-1">
            {getConsultationTypeIcon(consultationType)}
            {getConsultationTypeLabel(consultationType)}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="flex-1 flex flex-col p-0">
        {/* Messages */}
        <ScrollArea className="flex-1 p-4" ref={scrollAreaRef}>
          <div className="space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex gap-3 ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div className={`flex gap-3 max-w-[80%] ${message.type === 'user' ? 'flex-row-reverse' : ''}`}>
                  <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
                    message.type === 'user' 
                      ? 'bg-primary text-primary-foreground' 
                      : 'bg-muted text-muted-foreground'
                  }`}>
                    {message.type === 'user' ? <User className="h-4 w-4" /> : <Bot className="h-4 w-4" />}
                  </div>
                  <div className={`rounded-lg p-3 ${
                    message.type === 'user'
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-muted text-muted-foreground'
                  }`}>
                    <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                    <div className="flex items-center gap-2 mt-2">
                      <span className="text-xs opacity-70">
                        {message.timestamp.toLocaleTimeString()}
                      </span>
                      {message.consultationType && message.consultationType !== 'general' && (
                        <Badge variant="outline" className="text-xs">
                          {getConsultationTypeLabel(message.consultationType)}
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex gap-3 justify-start">
                <div className="flex gap-3 max-w-[80%]">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-muted text-muted-foreground flex items-center justify-center">
                    <Bot className="h-4 w-4" />
                  </div>
                  <div className="rounded-lg p-3 bg-muted text-muted-foreground">
                    <div className="flex items-center gap-2">
                      <Loader2 className="h-4 w-4 animate-spin" />
                      <span className="text-sm">Analisando e preparando resposta...</span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </ScrollArea>

        {/* Quick Prompts */}
        {messages.length === 1 && (
          <div className="px-4 py-2 border-t">
            <p className="text-xs text-muted-foreground mb-2">Perguntas rápidas:</p>
            <div className="flex flex-wrap gap-2">
              {quickPrompts.map((prompt, index) => (
                <Button
                  key={index}
                  variant="outline"
                  size="sm"
                  className="text-xs"
                  onClick={() => {
                    setConsultationType(prompt.type as any);
                    setInputMessage(prompt.text);
                  }}
                >
                  {getConsultationTypeIcon(prompt.type)}
                  <span className="ml-1">{prompt.text}</span>
                </Button>
              ))}
            </div>
          </div>
        )}

        {/* Input */}
        <div className="p-4 border-t">
          <div className="flex gap-2">
            <Input
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Digite sua pergunta ou descreva sua situação..."
              disabled={loading}
              className="flex-1"
            />
            <Button 
              onClick={sendMessage} 
              disabled={loading || !inputMessage.trim()}
              size="icon"
            >
              {loading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Send className="h-4 w-4" />
              )}
            </Button>
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            Pressione Enter para enviar, Shift+Enter para nova linha
          </p>
        </div>
      </CardContent>
    </Card>
  );
};