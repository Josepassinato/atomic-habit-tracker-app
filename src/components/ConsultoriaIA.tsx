
import React from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const ConsultoriaIA = () => {
  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle>Consultoria IA</CardTitle>
        <CardDescription>
          Receba recomendações personalizadas para suas metas e hábitos
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="rounded-md bg-muted p-3">
            <p className="font-medium">Assistente Habitus:</p>
            <p className="mt-1 text-sm">
              Olá! Sou o assistente IA do Habitus. Como posso ajudar você hoje? Posso auxiliar com definição de metas, 
              sugestão de hábitos atômicos ou análise do seu desempenho atual.
            </p>
          </div>

          <div className="rounded-md bg-primary/10 p-3 text-right">
            <p className="font-medium">Você:</p>
            <p className="mt-1 text-sm">
              Como posso melhorar minha taxa de conversão de leads para clientes?
            </p>
          </div>

          <div className="rounded-md bg-muted p-3">
            <p className="font-medium">Assistente Habitus:</p>
            <p className="mt-1 text-sm">
              Com base nos seus dados atuais, sugiro implementar os seguintes hábitos atômicos:
            </p>
            <ul className="mt-2 list-disc space-y-1 pl-5 text-sm">
              <li>Realizar follow-up em até 24h após o primeiro contato</li>
              <li>Documentar objeções específicas de cada cliente</li>
              <li>Revisar diariamente seu funil de vendas</li>
            </ul>
            <p className="mt-2 text-sm">
              Esses hábitos têm demonstrado um aumento médio de 27% na taxa de conversão para empresas do seu setor.
            </p>
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <div className="flex w-full items-center space-x-2">
          <Input 
            className="flex-1" 
            placeholder="Digite sua pergunta para a IA..." 
          />
          <Button>Enviar</Button>
        </div>
      </CardFooter>
    </Card>
  );
};

export default ConsultoriaIA;
