
import React from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Users, Plus, Edit2, Trash, Check } from "lucide-react";
import { UseFormReturn } from "react-hook-form";
import { Team, TeamFormInput } from "./types";

interface TeamsTabProps {
  teams: Team[];
  currentTeam: Team | null;
  teamDialogOpen: boolean;
  setTeamDialogOpen: (open: boolean) => void;
  editingTeamId: string | null;
  setEditingTeamId: (id: string | null) => void;
  form: UseFormReturn<TeamFormInput>;
  onTeamSubmit: (data: TeamFormInput) => void;
  deleteTeam: (teamId: string) => void;
  editTeam: (team: Team) => void;
  selectTeam: (team: Team) => void;
}

const TeamsTab: React.FC<TeamsTabProps> = ({
  teams,
  currentTeam,
  teamDialogOpen,
  setTeamDialogOpen,
  editingTeamId,
  setEditingTeamId,
  form,
  onTeamSubmit,
  deleteTeam,
  editTeam,
  selectTeam
}) => {
  return (
    <div className="space-y-4 pt-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">Registered teams</h3>
        
        <Dialog open={teamDialogOpen} onOpenChange={setTeamDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              New Team
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{editingTeamId ? "Edit Team" : "New Team"}</DialogTitle>
              <DialogDescription>
                {editingTeamId 
                  ? "Update the team information below"
                  : "Fill in the information to create a new team"
                }
              </DialogDescription>
            </DialogHeader>
            
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onTeamSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Team name</FormLabel>
                      <FormControl>
                        <Input placeholder="Ex: Corporate Sales" {...field} />
                      </FormControl>
                      <FormDescription>
                        Provide a clear and descriptive name for the team.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <DialogFooter>
                  <Button variant="outline" onClick={() => {
                    setTeamDialogOpen(false);
                    form.reset();
                    setEditingTeamId(null);
                  }}>
                    Cancel
                  </Button>
                  <Button type="submit">
                    {editingTeamId ? "Update" : "Create"}
                  </Button>
                </DialogFooter>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>
      
      {teams.length === 0 ? (
        <div className="text-center py-10 border-2 border-dashed border-gray-200 rounded-lg">
          <Users className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">No teams registered</h3>
          <p className="mt-1 text-sm text-gray-500">Start by creating a new team.</p>
          <div className="mt-6">
            <Button onClick={() => setTeamDialogOpen(true)}>
              <Plus className="h-4 w-4 mr-2" />
              New Team
            </Button>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {teams.map((team) => (
            <div key={team.id} className="border rounded-lg p-4 flex flex-col">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="font-medium text-lg">{team.name}</h3>
                  <p className="text-sm text-muted-foreground">
                    {team.habitos.length} habits configured
                  </p>
                </div>
                <div className="flex space-x-2">
                  <Button variant="ghost" size="sm" onClick={() => editTeam(team)}>
                    <Edit2 className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="sm" className="text-red-500" onClick={() => deleteTeam(team.id)}>
                    <Trash className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              
              <div className="mt-auto">
                <Button
                  variant="outline" 
                  className="w-full"
                  onClick={() => selectTeam(team)}
                >
                  {currentTeam?.id === team.id ? (
                    <>
                      <Check className="mr-2 h-4 w-4" /> 
                      Selected
                    </>
                  ) : (
                    "Configure"
                  )}
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default TeamsTab;
