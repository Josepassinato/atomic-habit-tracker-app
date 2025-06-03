
import { useState, useEffect } from "react";
import { Team } from "./types";

export const useOnboardingData = (currentTeam: Team | null) => {
  // State for goals and habits
  const [metaMensal, setMetaMensal] = useState("");
  const [metaDiaria, setMetaDiaria] = useState("");
  const [habitosSelecionados, setHabitosSelecionados] = useState<string[]>([]);
  
  // State for rewards
  const [recompensaTipo, setRecompensaTipo] = useState("individual");
  const [recompensaDescricao, setRecompensaDescricao] = useState("");
  const [recompensasMetas, setRecompensasMetas] = useState<{descricao: string; tipo: string}[]>([
    { descricao: "Special breakfast for the team", tipo: "equipe" },
    { descricao: "Day off on birthday", tipo: "individual" }
  ]);
  
  // State for commissions
  const [comissaoBase, setComissaoBase] = useState("3");
  const [comissaoHabitos, setComissaoHabitos] = useState("2");
  const [isComissaoAberta, setIsComissaoAberta] = useState(false);

  // When a team is selected, load its data
  useEffect(() => {
    if (currentTeam) {
      setMetaMensal(currentTeam.metas.mensal);
      setMetaDiaria(currentTeam.metas.diaria);
      setHabitosSelecionados(currentTeam.habitos);
      setRecompensasMetas(currentTeam.recompensas);
      setComissaoBase(currentTeam.comissoes.base);
      setComissaoHabitos(currentTeam.comissoes.habitos);
    } else {
      // Reset form if no team is selected
      setMetaMensal("");
      setMetaDiaria("");
      setHabitosSelecionados([]);
      setRecompensasMetas([
        { descricao: "Special breakfast for the team", tipo: "equipe" },
        { descricao: "Day off on birthday", tipo: "individual" }
      ]);
      setComissaoBase("3");
      setComissaoHabitos("2");
    }
  }, [currentTeam]);

  const handleHabitoToggle = (habito: string) => {
    if (habitosSelecionados.includes(habito)) {
      setHabitosSelecionados(habitosSelecionados.filter(h => h !== habito));
    } else {
      setHabitosSelecionados([...habitosSelecionados, habito]);
    }
  };

  const adicionarRecompensa = () => {
    if (recompensaDescricao.trim() === "") {
      return false;
    }
    
    setRecompensasMetas([
      ...recompensasMetas, 
      { descricao: recompensaDescricao, tipo: recompensaTipo }
    ]);
    setRecompensaDescricao("");
    return true;
  };
  
  const removerRecompensa = (index: number) => {
    const novasRecompensas = [...recompensasMetas];
    novasRecompensas.splice(index, 1);
    setRecompensasMetas(novasRecompensas);
  };

  const getCurrentTeamData = () => {
    if (!currentTeam) return null;
    
    return {
      ...currentTeam,
      metas: { mensal: metaMensal, diaria: metaDiaria },
      habitos: habitosSelecionados,
      recompensas: recompensasMetas,
      comissoes: { base: comissaoBase, habitos: comissaoHabitos }
    };
  };

  return {
    metaMensal,
    setMetaMensal,
    metaDiaria,
    setMetaDiaria,
    habitosSelecionados,
    handleHabitoToggle,
    recompensaTipo,
    setRecompensaTipo,
    recompensaDescricao,
    setRecompensaDescricao,
    recompensasMetas,
    adicionarRecompensa,
    removerRecompensa,
    comissaoBase,
    setComissaoBase,
    comissaoHabitos,
    setComissaoHabitos,
    isComissaoAberta,
    setIsComissaoAberta,
    getCurrentTeamData
  };
};
