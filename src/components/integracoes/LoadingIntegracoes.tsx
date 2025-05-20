
import React from "react";

const LoadingIntegracoes: React.FC = () => {
  return (
    <div className="py-8 text-center">
      <div className="inline-block h-6 w-6 animate-spin rounded-full border-2 border-solid border-primary border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]" />
      <p className="mt-2 text-sm text-muted-foreground">Carregando integrações...</p>
    </div>
  );
};

export default LoadingIntegracoes;
