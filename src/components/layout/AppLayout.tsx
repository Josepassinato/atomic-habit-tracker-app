
import React from "react";
import Header from "@/components/Header";
import { SidebarProvider } from "@/components/ui/sidebar";
import AppSidebar from "@/components/AppSidebar";
import PageNavigation from "@/components/PageNavigation";

interface AppLayoutProps {
  children: React.ReactNode;
  showBackButton?: boolean;
  showLogout?: boolean;
}

const AppLayout: React.FC<AppLayoutProps> = ({ 
  children, 
  showBackButton = true, 
  showLogout = true 
}) => {
  return (
    <div className="flex min-h-screen w-full bg-background">
      <Header />
      <SidebarProvider>
        <div className="flex min-h-screen w-full bg-background pt-16">
          <AppSidebar />
          <div className="flex-1 overflow-auto">
            {showBackButton && <PageNavigation showLogout={showLogout} />}
            {children}
          </div>
        </div>
      </SidebarProvider>
    </div>
  );
};

export default AppLayout;
