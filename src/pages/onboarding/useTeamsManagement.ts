
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { useForm, SubmitHandler } from "react-hook-form";
import { Team, TeamFormInput } from "./types";

export const useTeamsManagement = () => {
  const { toast } = useToast();
  const [teams, setTeams] = useState<Team[]>([]);
  const [currentTeam, setCurrentTeam] = useState<Team | null>(null);
  const [teamDialogOpen, setTeamDialogOpen] = useState(false);
  const [editingTeamId, setEditingTeamId] = useState<string | null>(null);
  
  const form = useForm<TeamFormInput>({
    defaultValues: {
      name: "",
    },
  });

  // Load teams from localStorage on initial render
  useEffect(() => {
    const savedTeams = localStorage.getItem("teams");
    if (savedTeams) {
      try {
        const parsedTeams = JSON.parse(savedTeams);
        console.log("Teams loaded from localStorage:", parsedTeams);
        setTeams(parsedTeams);
      } catch (error) {
        console.error("Error loading teams:", error);
        toast({
          title: "Error loading teams",
          description: "Could not load saved teams.",
          variant: "destructive",
        });
      }
    }
  }, [toast]);

  // Save teams to localStorage when they change
  useEffect(() => {
    if (teams.length > 0) {
      console.log("Saving teams to localStorage:", teams);
      localStorage.setItem("teams", JSON.stringify(teams));
      
      // Also save as 'equipes' for compatibility with dashboard
      localStorage.setItem("equipes", JSON.stringify(teams.map(team => ({
        id: team.id,
        nome: team.name,
        empresa_id: '1',
        criado_em: new Date().toISOString()
      }))));
    }
  }, [teams]);

  const onTeamSubmit: SubmitHandler<TeamFormInput> = (data) => {
    if (editingTeamId) {
      // Update existing team
      const updatedTeams = teams.map(team => 
        team.id === editingTeamId 
          ? { ...team, name: data.name }
          : team
      );
      setTeams(updatedTeams);
      toast({
        title: "Team updated",
        description: `Team ${data.name} was updated successfully.`,
      });
      console.log("Team updated:", data.name, "ID:", editingTeamId);
      console.log("Teams after update:", updatedTeams);
    } else {
      // Create new team
      const newTeam: Team = {
        id: Date.now().toString(),
        name: data.name,
        metas: { mensal: "", diaria: "" },
        habitos: [],
        recompensas: [
          { descricao: "Special breakfast for the team", tipo: "equipe" },
          { descricao: "Day off on birthday", tipo: "individual" }
        ],
        comissoes: { base: "3", habitos: "2" }
      };
      
      const newTeams = [...teams, newTeam];
      setTeams(newTeams);
      toast({
        title: "Team created",
        description: `Team ${data.name} was created successfully.`,
      });
      console.log("New team created:", newTeam);
      console.log("Teams after creation:", newTeams);
    }
    
    setTeamDialogOpen(false);
    form.reset();
    setEditingTeamId(null);
  };

  const deleteTeam = (teamId: string) => {
    const updatedTeams = teams.filter(team => team.id !== teamId);
    setTeams(updatedTeams);
    
    if (currentTeam?.id === teamId) {
      setCurrentTeam(null);
    }
    
    toast({
      title: "Team removed",
      description: "Team was removed successfully.",
    });
    console.log("Team removed, ID:", teamId);
    console.log("Teams after removal:", updatedTeams);
  };

  const editTeam = (team: Team) => {
    form.setValue("name", team.name);
    setEditingTeamId(team.id);
    setTeamDialogOpen(true);
    console.log("Editing team:", team.name, "ID:", team.id);
  };

  const selectTeam = (team: Team) => {
    setCurrentTeam(team);
    console.log("Team selected:", team.name, "ID:", team.id);
  };

  const updateTeam = (updatedTeam: Team) => {
    const updatedTeams = teams.map(team => 
      team.id === updatedTeam.id ? updatedTeam : team
    );
    setTeams(updatedTeams);
    setCurrentTeam(updatedTeam);
    
    console.log("Team updated:", updatedTeam);
    console.log("Teams after update:", updatedTeams);
    
    // Save immediately to localStorage
    localStorage.setItem("teams", JSON.stringify(updatedTeams));
    
    // Also save as 'equipes' for compatibility with dashboard
    localStorage.setItem("equipes", JSON.stringify(updatedTeams.map(team => ({
      id: team.id,
      nome: team.name,
      empresa_id: '1',
      criado_em: new Date().toISOString()
    }))));
  };

  return {
    teams,
    currentTeam,
    setCurrentTeam,
    teamDialogOpen,
    setTeamDialogOpen,
    editingTeamId,
    setEditingTeamId,
    form,
    onTeamSubmit,
    deleteTeam,
    editTeam,
    selectTeam,
    updateTeam
  };
};
