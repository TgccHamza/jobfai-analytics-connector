
import React, { useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Home } from "lucide-react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background p-4 animate-fade-in">
      <div className="text-center max-w-md">
        <div className="relative mx-auto w-24 h-24 mb-8">
          <div className="absolute inset-0 bg-primary/10 rounded-full animate-pulse-subtle"></div>
          <div className="absolute inset-0 flex items-center justify-center text-primary font-bold text-6xl">
            ?
          </div>
        </div>
        
        <h1 className="text-5xl font-bold mb-4">404</h1>
        <p className="text-xl text-muted-foreground mb-8">
          We couldn't find the page you're looking for.
        </p>
        
        <div className="bg-muted/40 p-4 rounded-lg mb-8 text-sm text-muted-foreground">
          <code className="font-mono">
            Attempted to access: {location.pathname}
          </code>
        </div>
        
        <Button asChild size="lg" className="gap-2">
          <Link to="/">
            <Home className="h-4 w-4" />
            Return to Home
          </Link>
        </Button>
      </div>
    </div>
  );
};

export default NotFound;
