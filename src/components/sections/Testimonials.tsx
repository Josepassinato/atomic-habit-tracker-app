
import React from "react";
import { 
  Carousel, 
  CarouselContent, 
  CarouselItem, 
  CarouselNext, 
  CarouselPrevious 
} from "@/components/ui/carousel";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import { MessageSquareQuote } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

interface TestimonialProps {
  quote: string;
  name: string;
  role: string;
  company: string;
  avatarUrl?: string;
}

const Testimonials = () => {
  const { t, language } = useLanguage();
  
  // Define testimonials for each language
  const testimonialsByLanguage = {
    en: [
      {
        quote: "Habitus transformed how our sales team works. Our results improved by 40% in just 3 months!",
        name: "Ana Silva",
        role: "Sales Director",
        company: "TechBrasil",
        avatarUrl: "https://images.unsplash.com/photo-1649972904349-6e44c42644a7?auto=format&fit=crop&q=80&w=200&h=200"
      },
      {
        quote: "The platform helped us identify the most impactful habits for our team and track progress effectively.",
        name: "Carlos Mendes",
        role: "Commercial Manager",
        company: "Inova Solutions",
        avatarUrl: "https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&q=80&w=200&h=200"
      },
      {
        quote: "AI integration for habit suggestions based on our business model was a game changer for our productivity.",
        name: "Marina Costa",
        role: "VP of Sales",
        company: "Global Connect",
        avatarUrl: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&q=80&w=200&h=200"
      }
    ],
    es: [
      {
        quote: "Habitus transformó la manera en que nuestro equipo de ventas trabaja. ¡Nuestros resultados mejoraron un 40% en solo 3 meses!",
        name: "Ana Silva",
        role: "Directora de Ventas",
        company: "TechBrasil",
        avatarUrl: "https://images.unsplash.com/photo-1649972904349-6e44c42644a7?auto=format&fit=crop&q=80&w=200&h=200"
      },
      {
        quote: "La plataforma nos ayudó a identificar los hábitos más impactantes para nuestro equipo y a seguir el progreso de manera efectiva.",
        name: "Carlos Mendes",
        role: "Gerente Comercial",
        company: "Inova Soluciones",
        avatarUrl: "https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&q=80&w=200&h=200"
      },
      {
        quote: "La integración con IA para sugerencias de hábitos basadas en nuestro modelo de negocio fue un cambio radical para nuestra productividad.",
        name: "Marina Costa",
        role: "VP de Ventas",
        company: "Global Connect",
        avatarUrl: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&q=80&w=200&h=200"
      }
    ],
    pt: [
      {
        quote: "O Habitus transformou a maneira como nossa equipe de vendas trabalha. Nossos resultados melhoraram 40% em apenas 3 meses!",
        name: "Ana Silva",
        role: "Diretora de Vendas",
        company: "TechBrasil",
        avatarUrl: "https://images.unsplash.com/photo-1649972904349-6e44c42644a7?auto=format&fit=crop&q=80&w=200&h=200"
      },
      {
        quote: "A plataforma nos ajudou a identificar os hábitos mais impactantes para nossa equipe e a acompanhar o progresso de forma efetiva.",
        name: "Carlos Mendes",
        role: "Gerente Comercial",
        company: "Inova Soluções",
        avatarUrl: "https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&q=80&w=200&h=200"
      },
      {
        quote: "A integração com IA para sugestões de hábitos baseados no nosso modelo de negócio foi um divisor de águas para nossa produtividade.",
        name: "Marina Costa",
        role: "VP de Vendas",
        company: "Global Connect",
        avatarUrl: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&q=80&w=200&h=200"
      }
    ]
  };

  const testimonials = testimonialsByLanguage[language];

  const TestimonialCard = ({ quote, name, role, company, avatarUrl }: TestimonialProps) => (
    <Card className="border-none shadow-md">
      <CardContent className="p-6">
        <div className="mb-4 flex justify-center">
          <div className="rounded-full bg-primary/10 p-2">
            <MessageSquareQuote className="h-6 w-6 text-primary" />
          </div>
        </div>
        <p className="mb-6 text-center text-muted-foreground">"{quote}"</p>
        <div className="flex items-center justify-center gap-4">
          <Avatar className="h-12 w-12 border-2 border-primary/20">
            <AvatarImage src={avatarUrl} alt={name} />
            <AvatarFallback>{name.charAt(0)}</AvatarFallback>
          </Avatar>
          <div>
            <p className="font-medium">{name}</p>
            <p className="text-sm text-muted-foreground">
              {role}, {company}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <section className="bg-muted/30 py-20">
      <div className="container mx-auto px-4">
        <div className="mb-10 text-center">
          <h2 className="mb-2 text-3xl font-bold">{t('testimonialsTitle')}</h2>
          <p className="mx-auto max-w-2xl text-muted-foreground">
            {t('testimonialsDesc')}
          </p>
        </div>

        <div className="mx-auto max-w-4xl">
          <Carousel className="mx-auto">
            <CarouselContent>
              {testimonials.map((testimonial, index) => (
                <CarouselItem key={index} className="md:basis-1/1 p-4">
                  <TestimonialCard {...testimonial} />
                </CarouselItem>
              ))}
            </CarouselContent>
            <div className="flex justify-center gap-2 mt-6">
              <CarouselPrevious className="relative inset-0 translate-y-0" />
              <CarouselNext className="relative inset-0 translate-y-0" />
            </div>
          </Carousel>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
