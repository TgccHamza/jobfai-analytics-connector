
import React from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import { SidebarProvider } from "@/components/ui/sidebar";
import { useIsMobile } from "@/hooks/use-mobile";

const MainLayout = () => {
  const isMobile = useIsMobile();

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-background">
        <Sidebar />
        <main className="flex-1 flex flex-col min-h-screen">
          <div className="flex-1 container py-6 md:py-10 px-4 md:px-6 transition-all duration-300 animate-fade-in">
            <Outlet />
          </div>
          <footer className="py-6 px-8 border-t border-border bg-background/50 backdrop-blur-sm">
            <div className="container flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-muted-foreground">
              <p>© 2023 JobFai Analytics. All rights reserved.</p>
              <div className="flex items-center gap-4">
                <a href="#" className="story-link hover:text-foreground transition-colors">Privacy</a>
                <a href="#" className="story-link hover:text-foreground transition-colors">Terms</a>
                <a href="#" className="story-link hover:text-foreground transition-colors">Documentation</a>
              </div>
            </div>
          </footer>
        </main>
      </div>
    </SidebarProvider>
  );
};

export default MainLayout;
