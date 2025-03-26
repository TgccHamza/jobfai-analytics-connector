
import React from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useQuery } from "@apollo/client";
import { GET_GAME_BY_ID, GET_COMPETENCIES_BY_GAME } from "@/graphql/queries";
import { PageHeader } from "@/components/ui/page-header";
import { Button } from "@/components/ui/button";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import {
  ChevronRight,
  Focus,
  PlusCircle,
  Scale,
  Target,
} from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";

const CompetenciesPage = () => {
  const { gameId } = useParams<{ gameId: string }>();
  const navigate = useNavigate();
  
  const { 
    loading: gameLoading, 
    error: gameError, 
    data: gameData 
  } = useQuery(GET_GAME_BY_ID, {
    variables: { gameId }
  });
  
  const { 
    loading: competenciesLoading, 
    error: competenciesError, 
    data: competenciesData 
  } = useQuery(GET_COMPETENCIES_BY_GAME, {
    variables: { gameId }
  });

  const loading = gameLoading || competenciesLoading;
  const error = gameError || competenciesError;

  if (error) {
    console.error("Error loading competencies data:", error);
  }

  const game = gameData?.getGameById;
  const competencies = competenciesData?.getCompetenciesByGame || [];

  const handleAddCompetency = () => {
    navigate(`/games/${gameId}/competencies/new`);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
        <Link to="/games" className="hover:text-primary transition-colors">
          Games
        </Link>
        <ChevronRight className="h-4 w-4" />
        <Link to={`/games/${gameId}`} className="hover:text-primary transition-colors">
          {loading ? "Loading..." : game?.gameName}
        </Link>
        <ChevronRight className="h-4 w-4" />
        <span className="text-foreground font-medium">
          Competencies
        </span>
      </div>

      <PageHeader
        heading={loading ? <Skeleton className="h-8 w-[300px]" /> : `${game?.gameName} - Competencies`}
        description="Manage and configure competencies evaluated in this game"
      >
        <Button size="sm" className="gap-2" onClick={handleAddCompetency}>
          <PlusCircle className="h-4 w-4" />
          Add Competency
        </Button>
      </PageHeader>

      <Card>
        <CardHeader>
          <CardTitle>Game Competencies</CardTitle>
          <CardDescription>
            Competencies are the skills and abilities evaluated in this game
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="space-y-4">
              {Array(3).fill(0).map((_, i) => (
                <Skeleton key={i} className="h-16 w-full" />
              ))}
            </div>
          ) : competencies.length > 0 ? (
            <div className="space-y-4">
              {competencies.map((comp) => (
                <div 
                  key={comp.competenceId} 
                  className="p-4 border rounded-lg hover:bg-muted/50 transition-colors cursor-pointer"
                  onClick={() => navigate(`/games/${gameId}/competencies/${comp.competenceId}`)}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="flex items-center justify-center w-10 h-10 rounded-full bg-primary/10 text-primary">
                        <Target className="h-5 w-5" />
                      </div>
                      <div>
                        <h3 className="font-medium">{comp.competenceName}</h3>
                        <p className="text-sm text-muted-foreground">
                          {comp.description || "No description provided"}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-2">
                      <Badge variant="outline">
                        {comp.metrics?.length || 0} Metrics
                      </Badge>
                      <div className="flex items-center gap-1 text-sm text-muted-foreground">
                        <Scale className="h-4 w-4" />
                        <span>Weight: {comp.weight || 1.0}</span>
                      </div>
                    </div>
                  </div>
                  
                  <Separator className="my-3" />
                  
                  <div className="flex items-center justify-between">
                    <div className="text-sm text-muted-foreground">
                      <span className="font-medium">Benchmark: </span>
                      {comp.benchmark || "Not set"}
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm">
                        View Metrics
                      </Button>
                      <Button variant="default" size="sm">
                        Edit
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <Focus className="h-12 w-12 text-muted-foreground opacity-20 mb-4" />
              <h3 className="text-lg font-medium mb-2">No Competencies Found</h3>
              <p className="text-sm text-muted-foreground max-w-md mb-6">
                This game doesn't have any competencies defined yet. Competencies represent the skills and abilities that are evaluated during gameplay.
              </p>
              <Button onClick={handleAddCompetency}>
                <PlusCircle className="mr-2 h-4 w-4" />
                Add First Competency
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default CompetenciesPage;
