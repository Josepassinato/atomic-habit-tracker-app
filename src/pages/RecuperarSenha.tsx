
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { toast } from "sonner";
import { useLanguage } from "@/i18n";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft } from "lucide-react";

// Esquema de validação para o formulário
const formSchema = z.object({
  email: z.string().email()
});

type FormValues = z.infer<typeof formSchema>;

const RecuperarSenha = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [emailEnviado, setEmailEnviado] = useState(false);
  const { t } = useLanguage();
  
  // Configuração do formulário com React Hook Form e validação Zod
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: ""
    }
  });
  
  // Função para lidar com o envio do formulário
  const onSubmit = async (values: FormValues) => {
    setIsSubmitting(true);
    
    try {
      // Simula um delay de rede
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      console.log("Solicitação de recuperação de senha para:", values.email);
      
      // Aqui seria implementada a lógica real de recuperação de senha
      // Em uma implementação real, isso enviaria uma solicitação para um backend
      // que geraria um token de recuperação e enviaria um email ao usuário
      
      toast.success(t('passwordRecoveryEmailSent'), {
        description: t('passwordRecoveryCheckEmail'),
      });
      
      setEmailEnviado(true);
    } catch (error: any) {
      console.error("Erro ao solicitar recuperação de senha:", error);
      toast.error(t('passwordRecoveryError'), {
        description: error.message || t('passwordRecoveryTryAgain'),
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 dark:bg-gray-900 px-4 py-12">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1 text-center">
          <Link to="/login" className="inline-flex items-center text-sm text-primary hover:underline mb-2">
            <ArrowLeft size={16} className="mr-2" />
            {t('backToLogin')}
          </Link>
          <CardTitle className="text-2xl font-bold">{t('recoverPassword')}</CardTitle>
          <CardDescription>
            {emailEnviado ? t('passwordRecoveryEmailSentDesc') : t('passwordRecoveryEnterEmail')}
          </CardDescription>
        </CardHeader>
        
        {!emailEnviado ? (
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <CardContent className="space-y-4">
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t('email')}</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="seu@email.com" 
                          type="email"
                          {...field}
                          disabled={isSubmitting}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
              <CardFooter>
                <Button 
                  type="submit" 
                  className="w-full" 
                  disabled={isSubmitting}
                >
                  {isSubmitting ? t('sending') : t('sendRecoveryEmail')}
                </Button>
              </CardFooter>
            </form>
          </Form>
        ) : (
          <CardContent className="space-y-4 text-center">
            <p className="text-sm text-muted-foreground">
              {t('passwordRecoveryFollowInstructions')}
            </p>
            <Button 
              variant="outline" 
              onClick={() => setEmailEnviado(false)} 
              className="mt-4 w-full"
            >
              {t('tryAnotherEmail')}
            </Button>
          </CardContent>
        )}
        
        <CardFooter className="flex-col space-y-2 pt-0">
          <div className="text-center text-sm">
            <Link to="/login" className="text-primary hover:underline">
              {t('rememberPassword')}
            </Link>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
};

export default RecuperarSenha;
