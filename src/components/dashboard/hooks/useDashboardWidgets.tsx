
import { useState, useEffect } from "react";
import { useSupabase } from "@/hooks/use-supabase";
import { toast } from "sonner";
import { Widget, defaultWidgets } from "../types/widget.types";

export const useDashboardWidgets = () => {
  const { supabase, isConfigured } = useSupabase();
  const [widgets, setWidgets] = useState<Widget[]>(defaultWidgets);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const fetchWidgets = async () => {
      try {
        setLoading(true);
        
        // Primeiro tenta carregar do localStorage
        const savedWidgets = localStorage.getItem("dashboard-widgets");
        if (savedWidgets) {
          setWidgets(JSON.parse(savedWidgets));
          setLoading(false);
          return;
        }
        
        // Se não houver dados no localStorage, busca do Supabase
        if (supabase && isConfigured) {
          const user = localStorage.getItem("user") 
            ? JSON.parse(localStorage.getItem("user")!) 
            : null;
            
          if (user) {
            const { data, error } = await supabase
              .from('user_dashboard_widgets')
              .select('*')
              .eq('user_id', user.id);
              
            if (error) throw error;
            
            if (data && data.length > 0) {
              setWidgets(data[0].widgets);
              localStorage.setItem("dashboard-widgets", JSON.stringify(data[0].widgets));
            } else {
              setWidgets(defaultWidgets);
              localStorage.setItem("dashboard-widgets", JSON.stringify(defaultWidgets));
            }
          } else {
            setWidgets(defaultWidgets);
            localStorage.setItem("dashboard-widgets", JSON.stringify(defaultWidgets));
          }
        } else {
          setWidgets(defaultWidgets);
          localStorage.setItem("dashboard-widgets", JSON.stringify(defaultWidgets));
        }
      } catch (error) {
        console.error("Erro ao carregar widgets do dashboard:", error);
        setWidgets(defaultWidgets);
        localStorage.setItem("dashboard-widgets", JSON.stringify(defaultWidgets));
      } finally {
        setLoading(false);
      }
    };
    
    fetchWidgets();
  }, [supabase, isConfigured]);
  
  const saveWidgets = async (updatedWidgets: Widget[]) => {
    try {
      localStorage.setItem("dashboard-widgets", JSON.stringify(updatedWidgets));
      
      if (supabase && isConfigured) {
        const user = localStorage.getItem("user") 
          ? JSON.parse(localStorage.getItem("user")!) 
          : null;
          
        if (user) {
          await supabase
            .from('user_dashboard_widgets')
            .upsert(
              { user_id: user.id, widgets: updatedWidgets },
              { onConflict: 'user_id' }
            );
        }
      }
    } catch (error) {
      console.error("Erro ao salvar widgets no armazenamento:", error);
    }
  };
  
  const toggleWidget = (id: string) => {
    const updatedWidgets = widgets.map(widget => 
      widget.id === id ? { ...widget, ativo: !widget.ativo } : widget
    );
    
    setWidgets(updatedWidgets);
    saveWidgets(updatedWidgets);
  };
  
  const reordenarWidgets = () => {
    // Reordena os widgets com base na propriedade 'ordem'
    // e atualiza os números de ordem corretamente
    let novaOrdem = [...widgets]
      .sort((a, b) => a.ordem - b.ordem)
      .map((widget, index) => ({
        ...widget,
        ordem: index + 1
      }));
    
    setWidgets(novaOrdem);
    saveWidgets(novaOrdem);
  };
  
  const moveWidgetUp = (id: string) => {
    const index = widgets.findIndex(w => w.id === id);
    if (index <= 0) return;
    
    const newWidgets = [...widgets];
    const tempOrdem = newWidgets[index].ordem;
    newWidgets[index].ordem = newWidgets[index - 1].ordem;
    newWidgets[index - 1].ordem = tempOrdem;
    
    setWidgets(newWidgets);
  };
  
  const moveWidgetDown = (id: string) => {
    const index = widgets.findIndex(w => w.id === id);
    if (index === -1 || index === widgets.length - 1) return;
    
    const newWidgets = [...widgets];
    const tempOrdem = newWidgets[index].ordem;
    newWidgets[index].ordem = newWidgets[index + 1].ordem;
    newWidgets[index + 1].ordem = tempOrdem;
    
    setWidgets(newWidgets);
  };

  // Widgets ativos ordenados
  const widgetsAtivos = [...widgets]
    .filter(widget => widget.ativo)
    .sort((a, b) => a.ordem - b.ordem);
  
  return {
    widgets,
    widgetsAtivos,
    loading,
    toggleWidget,
    reordenarWidgets,
    moveWidgetUp,
    moveWidgetDown,
    saveWidgets
  };
};
