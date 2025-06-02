
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Users, TrendingUp, Target, Plus, Edit, Trash2 } from "lucide-react";
import Header from "@/components/Header";
import { toast } from "sonner";
import { useTeams, useSalesReps } from "@/hooks/use-supabase";

const Vendedores = () => {
  const [selectedSalesRep, setSelectedSalesRep] = useState<string>("");
  const [teamFilter, setTeamFilter] = useState<string>("");
  const [newSalesRep, setNewSalesRep] = useState({
    name: "",
    email: "",
    teamId: "",
    goal: 100000
  });

  const { teams, loading: loadingTeams } = useTeams();
  const { salesReps, loading: loadingSalesReps } = useSalesReps();

  const filteredSalesReps = teamFilter
    ? salesReps.filter((salesRep) => salesRep.team_id === teamFilter)
    : salesReps;

  const [editMode, setEditMode] = useState(false);
  const [editingSalesRepId, setEditingSalesRepId] = useState<string | null>(null);
  const [editingSalesRep, setEditingSalesRep] = useState({
    name: "",
    email: "",
    teamId: "",
    goal: 100000
  });

  useEffect(() => {
    if (selectedSalesRep) {
      const salesRep = salesReps.find((rep) => rep.id === selectedSalesRep);
      if (salesRep) {
        setEditingSalesRep({
          name: salesRep.name,
          email: salesRep.email,
          teamId: salesRep.team_id,
          goal: salesRep.current_goal
        });
      }
    }
  }, [selectedSalesRep, salesReps]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewSalesRep({
      ...newSalesRep,
      [e.target.name]: e.target.value
    });
  };

  const handleEditInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEditingSalesRep({
      ...editingSalesRep,
      [e.target.name]: e.target.value
    });
  };

  const handleTeamChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setNewSalesRep({
      ...newSalesRep,
      teamId: e.target.value
    });
  };

  const handleEditTeamChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setEditingSalesRep({
      ...editingSalesRep,
      teamId: e.target.value
    });
  };

  const handleGoalChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewSalesRep({
      ...newSalesRep,
      goal: parseInt(e.target.value)
    });
  };

  const handleEditGoalChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEditingSalesRep({
      ...editingSalesRep,
      goal: parseInt(e.target.value)
    });
  };

  const handleTeamFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setTeamFilter(e.target.value);
  };

  const addSalesRep = () => {
    toast.success("Sales rep added successfully!");
  };

  const saveSalesRep = () => {
    toast.success("Sales rep saved successfully!");
  };

  const deleteSalesRep = () => {
    toast.success("Sales rep deleted successfully!");
  };

  return (
    <div className="flex min-h-screen flex-col bg-slate-50">
      <Header />
      <main className="container flex-1 py-6">
        <div className="mx-auto max-w-7xl space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold">Manage Sales Reps</h1>
              <p className="text-muted-foreground">
                Track performance and manage your sales team
              </p>
            </div>
            <Button className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              Add Sales Rep
            </Button>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Add New Sales Rep</CardTitle>
              <CardDescription>
                Fill in the fields below to add a new sales rep to your team.
              </CardDescription>
            </CardHeader>
            <CardContent className="grid gap-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="name">Name</Label>
                  <Input
                    type="text"
                    id="name"
                    name="name"
                    value={newSalesRep.name}
                    onChange={handleInputChange}
                  />
                </div>
                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input
                    type="email"
                    id="email"
                    name="email"
                    value={newSalesRep.email}
                    onChange={handleInputChange}
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="team">Team</Label>
                  <select
                    id="team"
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    value={newSalesRep.teamId}
                    onChange={handleTeamChange}
                  >
                    <option value="">Select a team</option>
                    {teams.map((team) => (
                      <option key={team.id} value={team.id}>
                        {team.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <Label htmlFor="goal">Monthly Goal</Label>
                  <Input
                    type="number"
                    id="goal"
                    name="goal"
                    value={newSalesRep.goal}
                    onChange={handleGoalChange}
                  />
                </div>
              </div>
              <Button onClick={addSalesRep}>Add Sales Rep</Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Sales Reps List</CardTitle>
                <select
                  className="flex h-10 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  value={teamFilter}
                  onChange={handleTeamFilterChange}
                >
                  <option value="">All Teams</option>
                  {teams.map((team) => (
                    <option key={team.id} value={team.id}>
                      {team.name}
                    </option>
                  ))}
                </select>
              </div>
              <CardDescription>
                Track individual performance of each sales rep.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead>
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Name
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Email
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Team
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Goal
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Progress
                      </th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredSalesReps.map((salesRep) => (
                      <tr key={salesRep.id}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">
                            {salesRep.name}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-500">
                            {salesRep.email}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-500">
                            {teams.find((team) => team.id === salesRep.team_id)?.name}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-500">
                            ${salesRep.current_goal.toLocaleString()}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="w-24">
                              <Progress value={60} />
                            </div>
                            <div className="ml-2 text-sm text-gray-500">
                              60%
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => {
                              setEditMode(true);
                              setSelectedSalesRep(salesRep.id);
                            }}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="icon" onClick={deleteSalesRep}>
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default Vendedores;
