
import { toast } from "sonner";

export const downloadRelatorio = (
  periodoSelecionado: string,
  equipeId: string,
  totalVendas: number,
  totalMetas: number,
  percentualMeta: number,
  mediaConversao: number,
  vendedoresFiltrados: any[],
  equipes: any[]
) => {
  // Simula o download de um relatório
  const relatorioData = {
    data: new Date().toLocaleDateString(),
    periodo: periodoSelecionado,
    equipe: equipeId === "todas" ? "Todas as equipes" : equipes.find(e => e.id === equipeId)?.nome,
    vendedores: vendedoresFiltrados,
    metricas: {
      totalVendas,
      totalMetas,
      percentualMeta,
      mediaConversao
    }
  };

  // Converte dados para JSON string
  const jsonString = JSON.stringify(relatorioData, null, 2);
  
  // Cria um blob com os dados
  const blob = new Blob([jsonString], { type: "application/json" });
  
  // Cria um URL do blob
  const url = URL.createObjectURL(blob);
  
  // Cria um link para download
  const a = document.createElement("a");
  a.href = url;
  a.download = `relatorio-vendas-${new Date().toISOString().split('T')[0]}.json`;
  
  // Simula um clique no link
  document.body.appendChild(a);
  a.click();
  
  // Limpa depois do download
  setTimeout(() => {
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }, 100);

  toast.success("Relatório baixado com sucesso!");
};
