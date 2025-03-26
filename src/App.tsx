
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ApolloProvider } from "@apollo/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { apolloClient } from "./lib/apollo-client";
import MainLayout from "./components/layout/MainLayout";
import Dashboard from "./pages/Dashboard";
import GamesPage from "./pages/games/GamesPage";
import GameDetail from "./pages/games/GameDetail";
import CreateGame from "./pages/games/CreateGame";
import CompetenciesPage from "./pages/games/CompetenciesPage";
import AnalyticsPage from "./pages/analytics/AnalyticsPage";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <ApolloProvider client={apolloClient}>
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route element={<MainLayout />}>
              <Route path="/" element={<Dashboard />} />
              <Route path="/games" element={<GamesPage />} />
              <Route path="/games/new" element={<CreateGame />} />
              <Route path="/games/:gameId" element={<GameDetail />} />
              <Route path="/games/:gameId/competencies" element={<CompetenciesPage />} />
              <Route path="/analytics" element={<AnalyticsPage />} />
            </Route>
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  </ApolloProvider>
);

export default App;
