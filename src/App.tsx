
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
import EditGame from "./pages/games/EditGame";
import CompetenciesPage from "./pages/games/CompetenciesPage";
import CreateCompetency from "./pages/games/CreateCompetency";
import CompetencyDetail from "./pages/games/CompetencyDetail";
import AddMetricToCompetency from "./pages/games/AddMetricToCompetency";
import StagesPage from "./pages/games/StagesPage";
import StageDetail from "./pages/games/StageDetail";
import CreateStage from "./pages/games/CreateStage";
import AddMetricToStage from "./pages/games/AddMetricToStage";
import ConstantsPage from "./pages/games/ConstantsPage";
import CreateConstant from "./pages/games/CreateConstant";
import GameMetricsPage from "./pages/games/GameMetricsPage";
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
              
              {/* Games Routes */}
              <Route path="/games" element={<GamesPage />} />
              <Route path="/games/new" element={<CreateGame />} />
              <Route path="/games/:gameId" element={<GameDetail />} />
              <Route path="/games/:gameId/edit" element={<EditGame />} />
              
              {/* Competencies Routes */}
              <Route path="/games/:gameId/competencies" element={<CompetenciesPage />} />
              <Route path="/games/:gameId/competencies/new" element={<CreateCompetency />} />
              <Route path="/games/:gameId/competencies/:competenceId" element={<CompetencyDetail />} />
              <Route path="/games/:gameId/competencies/:competenceId/metrics/new" element={<AddMetricToCompetency />} />
              
              {/* Stages Routes */}
              <Route path="/games/:gameId/stages" element={<StagesPage />} />
              <Route path="/games/:gameId/stages/new" element={<CreateStage />} />
              <Route path="/games/:gameId/stages/:stageId" element={<StageDetail />} />
              <Route path="/games/:gameId/stages/:stageId/metrics/new" element={<AddMetricToStage />} />
              
              {/* Constants Routes */}
              <Route path="/games/:gameId/constants" element={<ConstantsPage />} />
              <Route path="/games/:gameId/constants/new" element={<CreateConstant />} />
              
              {/* Game Metrics Routes */}
              <Route path="/games/:gameId/metrics" element={<GameMetricsPage />} />
              
              {/* Analytics Routes */}
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
