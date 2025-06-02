
import React from "react";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="border-t bg-white py-6">
      <div className="container mx-auto px-4">
        <div className="flex flex-col items-center justify-between space-y-4 sm:flex-row sm:space-y-0">
          <div className="flex space-x-4">
            <Link to="/about" className="text-sm text-muted-foreground hover:text-foreground">
              About Us
            </Link>
            <Link to="/blog" className="text-sm text-muted-foreground hover:text-foreground">
              Blog
            </Link>
            <Link to="/contact" className="text-sm text-muted-foreground hover:text-foreground">
              Contact
            </Link>
          </div>
          <div className="text-center text-sm text-muted-foreground">
            Habitus © 2025 - The future of sales automation and performance
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
