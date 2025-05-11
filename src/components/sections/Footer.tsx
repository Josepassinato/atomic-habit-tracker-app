
import React from "react";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="border-t bg-white py-6">
      <div className="container mx-auto px-4">
        <div className="flex flex-col items-center justify-between space-y-4 sm:flex-row sm:space-y-0">
          <div className="flex space-x-4">
            <Link to="/sobre" className="text-sm text-muted-foreground hover:text-foreground">
              Sobre nós
            </Link>
            <Link to="/blog" className="text-sm text-muted-foreground hover:text-foreground">
              Blog
            </Link>
            <Link to="/contato" className="text-sm text-muted-foreground hover:text-foreground">
              Contato
            </Link>
          </div>
          <div className="text-center text-sm text-muted-foreground">
            Habitus © 2025 - O futuro da automação de vendas e performance
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
