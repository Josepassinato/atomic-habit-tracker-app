
import { useState, useEffect } from "react";
import { Widget } from "../types/widget.types";
import { toast } from "sonner";

const defaultWidgets: Widget[] = [
  {
    id: "1",
    titulo: "Atomic Habits",
    tipo: "habits",
    tamanho: "medio",
    ativo: true,
    ordem: 1
  },
  {
    id: "2", 
    titulo: "Sales Goals",
    tipo: "goals",
    tamanho: "medio",
    ativo: true,
    ordem: 2
  },
  {
    id: "3",
    titulo: "AI Consulting", 
    tipo: "ai",
    tamanho: "grande",
    ativo: true,
    ordem: 3
  },
  {
    id: "4",
    titulo: "CRM Integrations",
    tipo: "crm", 
    tamanho: "pequeno",
    ativo: true,
    ordem: 4
  },
  {
    id: "5",
    titulo: "Real-time Updates",
    tipo: "realtime", 
    tamanho: "medio",
    ativo: true,
    ordem: 5
  }
];

export const useDashboardWidgets = () => {
  const [widgets, setWidgets] = useState<Widget[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    carregarWidgets();
  }, []);

  const carregarWidgets = () => {
    try {
      const saved = localStorage.getItem('dashboard_widgets');
      if (saved) {
        const savedWidgets = JSON.parse(saved);
        // Translate any Portuguese titles to English
        const translatedWidgets = savedWidgets.map((widget: Widget) => ({
          ...widget,
          titulo: translateToEnglish(widget.titulo)
        }));
        setWidgets(translatedWidgets);
      } else {
        setWidgets(defaultWidgets);
        localStorage.setItem('dashboard_widgets', JSON.stringify(defaultWidgets));
      }
    } catch (error) {
      console.error("Error loading widgets:", error);
      setWidgets(defaultWidgets);
    } finally {
      setLoading(false);
    }
  };

  const translateToEnglish = (titulo: string) => {
    const translations: Record<string, string> = {
      'Hábitos Atômicos': 'Atomic Habits',
      'Metas de Vendas': 'Sales Goals', 
      'Consultoria IA': 'AI Consulting',
      'Integrações CRM': 'CRM Integrations',
      'Real-time Updates': 'Real-time Updates'
    };
    return translations[titulo] || titulo;
  };

  const salvarWidgets = (novosWidgets: Widget[]) => {
    try {
      localStorage.setItem('dashboard_widgets', JSON.stringify(novosWidgets));
      setWidgets(novosWidgets);
    } catch (error) {
      console.error("Error saving widgets:", error);
      toast.error("Error saving layout");
    }
  };

  const toggleWidget = (id: string) => {
    const novosWidgets = widgets.map(widget =>
      widget.id === id ? { ...widget, ativo: !widget.ativo } : widget
    );
    salvarWidgets(novosWidgets);
  };

  const moveWidgetUp = (id: string) => {
    const currentIndex = widgets.findIndex(w => w.id === id);
    if (currentIndex > 0) {
      const novosWidgets = [...widgets];
      [novosWidgets[currentIndex], novosWidgets[currentIndex - 1]] = 
        [novosWidgets[currentIndex - 1], novosWidgets[currentIndex]];
      
      // Update ordem
      novosWidgets.forEach((widget, index) => {
        widget.ordem = index + 1;
      });
      
      salvarWidgets(novosWidgets);
    }
  };

  const moveWidgetDown = (id: string) => {
    const currentIndex = widgets.findIndex(w => w.id === id);
    if (currentIndex < widgets.length - 1) {
      const novosWidgets = [...widgets];
      [novosWidgets[currentIndex], novosWidgets[currentIndex + 1]] = 
        [novosWidgets[currentIndex + 1], novosWidgets[currentIndex]];
      
      // Update ordem
      novosWidgets.forEach((widget, index) => {
        widget.ordem = index + 1;
      });
      
      salvarWidgets(novosWidgets);
    }
  };

  const reordenarWidgets = () => {
    const widgetsOrdenados = widgets
      .sort((a, b) => a.ordem - b.ordem)
      .map((widget, index) => ({
        ...widget,
        ordem: index + 1
      }));
    
    salvarWidgets(widgetsOrdenados);
    toast.success("Layout saved successfully!");
  };

  const widgetsAtivos = widgets
    .filter(widget => widget.ativo)
    .sort((a, b) => a.ordem - b.ordem);

  return {
    widgets,
    widgetsAtivos,
    loading,
    toggleWidget,
    reordenarWidgets,
    moveWidgetUp,
    moveWidgetDown
  };
};
