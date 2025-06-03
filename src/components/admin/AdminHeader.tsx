
import React from "react";

const AdminHeader: React.FC = () => {
  return (
    <div className="flex justify-between items-center mb-6">
      <h1 className="text-3xl font-bold">Painel Administrativo</h1>
      <div className="bg-orange-100 text-orange-800 px-3 py-1 rounded-full text-sm font-semibold">
        Acesso Restrito
      </div>
    </div>
  );
};

export default AdminHeader;
