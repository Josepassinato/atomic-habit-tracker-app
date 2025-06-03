
import React from "react";
import HabitosPage from "./habitos/HabitosPage";
import PageNavigation from "@/components/PageNavigation";

const Habitos = () => {
  return (
    <div className="min-h-screen bg-background">
      <PageNavigation />
      <HabitosPage />
    </div>
  );
};

export default Habitos;
