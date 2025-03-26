
import React from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useQuery } from "@apollo/client";
import { GET_GAME_BY_ID, GET_STAGES_BY_GAME, GET_COMPETENCIES_BY_GAME } from "@/graphql/queries";
import { PageHeader } from "@/components/ui/page-header";
import { Button } from "@/components/ui/button";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import {
  ChevronRight,
  Clock,
  Edit,
  Focus,
  Gauge,
  Layers,
  PlusCircle,
  Scale,
  Settings,
  SlidersHorizontal,
  Tag,
  Target,
} from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { formatDistanceToNow } from "date-fns";

const GameDetail: React.FC = () => {
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
    loading: stagesLoading, 
    error: stagesError, 
    data: stagesData 
  } = useQuery(GET_STAGES_BY_GAME, {
    variables: { gameId }
  });
  
  const { 
    loading: competenciesLoading, 
    error: competenciesError, 
    data: competenciesData 
  } = useQuery(GET_COMPETENCIES_BY_GAME, {
    variables: { gameId }
  });

  const loading = gameLoading || stagesLoading || competenciesLoading;
  const error = gameError || stagesError || competenciesError;

  if (error) {
    console.error("Error loading game data:", error);
  }

  const game = gameData?.getGameById;
  const stages = stagesData?.getStagesByGame || [];
  const competencies = competenciesData?.getCompetenciesByGame || [];

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
        <Link to="/games" className="hover:text-primary transition-colors">
          Games
        </Link>
        <ChevronRight className="h-4 w-4" />
        <span className="text-foreground font-medium">
          {loading ? "Loading..." : game?.gameName}
        </span>
      </div>

      <PageHeader
        heading={loading ? <Skeleton className="h-8 w-[300px]" /> : game?.gameName}
        description={loading ? <Skeleton className="h-4 w-[500px]" /> : game?.description || "No description provided"}
      >
        <Button variant="outline" size="sm" className="gap-2">
          <Settings className="h-4 w-4" />
          Settings
        </Button>
        <Button size="sm" className="gap-2">
          <Edit className="h-4 w-4" />
          Edit Game
        </Button>
      </PageHeader>

      <div className="grid gap-6 md:grid-cols-3">
        <InfoCard
          title="Game Info"
          icon={<Tag className="h-5 w-5" />}
          loading={loading}
        >
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Status</p>
                {loading ? (
                  <Skeleton className="h-6 w-16" />
                ) : (
                  <Badge variant={game?.active ? "default" : "secondary"}>
                    {game?.active ? "Active" : "Inactive"}
                  </Badge>
                )}
              </div>
              
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">ID</p>
                {loading ? (
                  <Skeleton className="h-5 w-[120px]" />
                ) : (
                  <p className="text-sm font-mono">{game?.gameId.substring(0, 8)}...</p>
                )}
              </div>
            </div>
            
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Created</p>
              {loading ? (
                <Skeleton className="h-5 w-full" />
              ) : (
                <p className="text-sm">
                  {game?.createdAt 
                    ? `${formatDistanceToNow(new Date(game.createdAt))} ago` 
                    : "Unknown"}
                </p>
              )}
            </div>
            
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Last Updated</p>
              {loading ? (
                <Skeleton className="h-5 w-full" />
              ) : (
                <p className="text-sm">
                  {game?.updatedAt 
                    ? `${formatDistanceToNow(new Date(game.updatedAt))} ago` 
                    : "Unknown"}
                </p>
              )}
            </div>
            
            <Separator />
            
            <div className="pt-2">
              <Button variant="outline" size="sm" className="w-full gap-2">
                <SlidersHorizontal className="h-4 w-4" />
                Manage Configuration
              </Button>
            </div>
          </div>
        </InfoCard>
        
        <InfoCard
          title="Stages"
          icon={<Layers className="h-5 w-5" />}
          actionBtn={
            <Button
              variant="ghost"
              size="sm"
              className="gap-1"
              onClick={() => navigate(`/games/${gameId}/stages/new`)}
            >
              <PlusCircle className="h-4 w-4" />
              Add
            </Button>
          }
          loading={loading}
        >
          <div className="space-y-1">
            {loading ? (
              Array(3).fill(0).map((_, i) => (
                <Skeleton key={i} className="h-10 w-full" />
              ))
            ) : stages.length > 0 ? (
              <>
                <div className="text-sm font-medium">{stages.length} Stages</div>
                <div className="space-y-2 mt-3">
                  {stages.slice(0, 4).map((stage: any) => (
                    <div 
                      key={stage.stageId} 
                      className="flex items-center justify-between rounded-md p-2 hover:bg-secondary/50 transition-colors cursor-pointer"
                      onClick={() => navigate(`/games/${gameId}/stages/${stage.stageId}`)}
                    >
                      <div className="flex items-center gap-3">
                        <div className="flex items-center justify-center w-6 h-6 rounded-full bg-primary/10 text-primary text-xs font-medium">
                          {stage.stageOrder || "?"}
                        </div>
                        <span className="text-sm font-medium">{stage.stageName}</span>
                      </div>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <Clock className="h-3 w-3" />
                        <span>{stage.optimalTime || "?"} sec</span>
                      </div>
                    </div>
                  ))}
                  
                  {stages.length > 4 && (
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="w-full text-xs mt-1"
                      onClick={() => navigate(`/games/${gameId}/stages`)}
                    >
                      View all {stages.length} stages
                    </Button>
                  )}
                </div>
              </>
            ) : (
              <div className="flex flex-col items-center justify-center py-6 text-center">
                <Layers className="h-8 w-8 text-muted-foreground opacity-20 mb-2" />
                <p className="text-sm text-muted-foreground mb-3">No stages defined yet</p>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => navigate(`/games/${gameId}/stages/new`)}
                >
                  <PlusCircle className="mr-2 h-3 w-3" />
                  Add First Stage
                </Button>
              </div>
            )}
          </div>
        </InfoCard>
        
        <InfoCard
          title="Competencies"
          icon={<Target className="h-5 w-5" />}
          actionBtn={
            <Button
              variant="ghost"
              size="sm"
              className="gap-1"
              onClick={() => navigate(`/games/${gameId}/competencies/new`)}
            >
              <PlusCircle className="h-4 w-4" />
              Add
            </Button>
          }
          loading={loading}
        >
          <div className="space-y-1">
            {loading ? (
              Array(3).fill(0).map((_, i) => (
                <Skeleton key={i} className="h-10 w-full" />
              ))
            ) : competencies.length > 0 ? (
              <>
                <div className="text-sm font-medium">{competencies.length} Competencies</div>
                <div className="space-y-2 mt-3">
                  {competencies.slice(0, 4).map((comp: any) => (
                    <div 
                      key={comp.competenceId} 
                      className="flex items-center justify-between rounded-md p-2 hover:bg-secondary/50 transition-colors cursor-pointer"
                      onClick={() => navigate(`/games/${gameId}/competencies/${comp.competenceId}`)}
                    >
                      <div className="flex items-center gap-3">
                        <div className="flex items-center justify-center w-6 h-6 rounded-full bg-primary/10 text-primary">
                          <Focus className="h-3 w-3" />
                        </div>
                        <span className="text-sm font-medium">{comp.competenceName}</span>
                      </div>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <Scale className="h-3 w-3" />
                        <span>Weight: {comp.weight || 1.0}</span>
                      </div>
                    </div>
                  ))}
                  
                  {competencies.length > 4 && (
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="w-full text-xs mt-1"
                      onClick={() => navigate(`/games/${gameId}/competencies`)}
                    >
                      View all {competencies.length} competencies
                    </Button>
                  )}
                </div>
              </>
            ) : (
              <div className="flex flex-col items-center justify-center py-6 text-center">
                <Target className="h-8 w-8 text-muted-foreground opacity-20 mb-2" />
                <p className="text-sm text-muted-foreground mb-3">No competencies defined yet</p>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => navigate(`/games/${gameId}/competencies/new`)}
                >
                  <PlusCircle className="mr-2 h-3 w-3" />
                  Add First Competency
                </Button>
              </div>
            )}
          </div>
        </InfoCard>
      </div>

      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="w-full sm:w-[400px]">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="metrics">Metrics</TabsTrigger>
          <TabsTrigger value="constants">Constants</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview" className="animate-fade-in">
          <Card>
            <CardHeader>
              <CardTitle>Game Overview</CardTitle>
              <CardDescription>
                Complete view of game structure and performance metrics
              </CardDescription>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="space-y-4">
                  <Skeleton className="h-20 w-full" />
                  <Skeleton className="h-[300px] w-full" />
                </div>
              ) : (
                <div className="text-center py-20">
                  <Gauge className="h-16 w-16 mx-auto text-muted-foreground opacity-20 mb-4" />
                  <h3 className="text-lg font-medium mb-2">Game Overview</h3>
                  <p className="text-sm text-muted-foreground max-w-md mx-auto">
                    Performance metrics and game structure visualization will appear here once you have player data.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="metrics" className="animate-fade-in">
          <Card>
            <CardHeader>
              <CardTitle>Game Metrics</CardTitle>
              <CardDescription>
                Performance metrics for this game
              </CardDescription>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="space-y-4">
                  <Skeleton className="h-[300px] w-full" />
                </div>
              ) : (
                <div className="text-center py-20">
                  <p className="text-sm text-muted-foreground">
                    Game metrics will appear here once you have player data.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="constants" className="animate-fade-in">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Constant Parameters</CardTitle>
                <CardDescription>
                  Global constants used in game calculations
                </CardDescription>
              </div>
              <Button size="sm">
                <PlusCircle className="mr-2 h-4 w-4" />
                Add Constant
              </Button>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="space-y-4">
                  <Skeleton className="h-[200px] w-full" />
                </div>
              ) : game?.constantParameters?.length > 0 ? (
                <div className="rounded-md border">
                  <div className="grid grid-cols-4 bg-muted/50 p-3 text-sm font-medium">
                    <div>Name</div>
                    <div>Key</div>
                    <div>Value</div>
                    <div>Description</div>
                  </div>
                  <div className="divide-y">
                    {game.constantParameters.map((constant: any) => (
                      <div key={constant.constId} className="grid grid-cols-4 p-3 text-sm">
                        <div>{constant.constName}</div>
                        <div className="font-mono">{constant.constKey}</div>
                        <div>{constant.constValue}</div>
                        <div className="text-muted-foreground line-clamp-1">
                          {constant.constDescription || "—"}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="text-center py-12">
                  <p className="text-sm text-muted-foreground mb-4">
                    No constant parameters defined for this game yet.
                  </p>
                  <Button size="sm">
                    <PlusCircle className="mr-2 h-4 w-4" />
                    Add First Constant
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="analytics" className="animate-fade-in">
          <Card>
            <CardHeader>
              <CardTitle>Analytics</CardTitle>
              <CardDescription>
                Player performance analytics
              </CardDescription>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="space-y-4">
                  <Skeleton className="h-[300px] w-full" />
                </div>
              ) : (
                <div className="text-center py-20">
                  <p className="text-sm text-muted-foreground">
                    Analytics will appear here once you have player data.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

interface InfoCardProps {
  title: string;
  icon: React.ReactNode;
  children: React.ReactNode;
  actionBtn?: React.ReactNode;
  loading?: boolean;
}

const InfoCard: React.FC<InfoCardProps> = ({ 
  title, 
  icon, 
  children, 
  actionBtn,
  loading = false 
}) => (
  <Card className="overflow-hidden hover-scale">
    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
      <div className="flex items-center space-x-2">
        {icon}
        <CardTitle className="text-sm font-medium">
          {loading ? <Skeleton className="h-5 w-20" /> : title}
        </CardTitle>
      </div>
      {actionBtn}
    </CardHeader>
    <CardContent>{children}</CardContent>
  </Card>
);

export default GameDetail;
