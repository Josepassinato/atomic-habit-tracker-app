
import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const AdminPlans = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <Card>
        <CardHeader>
          <CardTitle>Starter</CardTitle>
          <CardDescription>
            Plano básico para pequenas equipes
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="starter-price">Preço mensal (R$)</Label>
            <Input id="starter-price" defaultValue="197" />
          </div>
          <div>
            <Label htmlFor="starter-tokens">Limite de tokens</Label>
            <Input id="starter-tokens" defaultValue="50000" />
          </div>
          <div>
            <Label htmlFor="starter-users">Limite de usuários</Label>
            <Input id="starter-users" defaultValue="5" />
          </div>
        </CardContent>
        <CardFooter>
          <Button className="w-full">Salvar alterações</Button>
        </CardFooter>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Professional</CardTitle>
          <CardDescription>
            Plano intermediário para empresas em crescimento
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="pro-price">Preço mensal (R$)</Label>
            <Input id="pro-price" defaultValue="497" />
          </div>
          <div>
            <Label htmlFor="pro-tokens">Limite de tokens</Label>
            <Input id="pro-tokens" defaultValue="100000" />
          </div>
          <div>
            <Label htmlFor="pro-users">Limite de usuários</Label>
            <Input id="pro-users" defaultValue="15" />
          </div>
        </CardContent>
        <CardFooter>
          <Button className="w-full">Salvar alterações</Button>
        </CardFooter>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Enterprise</CardTitle>
          <CardDescription>
            Plano avançado para grandes organizações
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="ent-price">Preço mensal (R$)</Label>
            <Input id="ent-price" defaultValue="997" />
          </div>
          <div>
            <Label htmlFor="ent-tokens">Limite de tokens</Label>
            <Input id="ent-tokens" defaultValue="500000" />
          </div>
          <div>
            <Label htmlFor="ent-users">Limite de usuários</Label>
            <Input id="ent-users" defaultValue="50" />
          </div>
        </CardContent>
        <CardFooter>
          <Button className="w-full">Salvar alterações</Button>
        </CardFooter>
      </Card>
      
      <Card className="md:col-span-3">
        <CardHeader>
          <CardTitle>Configurações de Trial</CardTitle>
          <CardDescription>
            Configure as opções para contas em período de avaliação
          </CardDescription>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <Label htmlFor="trial-days">Duração (dias)</Label>
            <Input id="trial-days" defaultValue="14" />
          </div>
          <div>
            <Label htmlFor="trial-tokens">Limite de tokens</Label>
            <Input id="trial-tokens" defaultValue="25000" />
          </div>
          <div>
            <Label htmlFor="trial-users">Limite de usuários</Label>
            <Input id="trial-users" defaultValue="3" />
          </div>
        </CardContent>
        <CardFooter>
          <Button className="w-full">Salvar configurações de trial</Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default AdminPlans;
