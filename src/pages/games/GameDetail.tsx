
import React from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useQuery } from "@apollo/client";
import { GET_GAME_BY_ID } from "@/graphql/queries";
import { PageHeader } from "@/components/ui/page-header";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  ChevronRight,
  Clock,
  Edit,
  FileText,
  Gauge,
  Layers,
  Settings,
  Target,
  CheckCircle2,
  BrainCircuit,
  Hash,
  BarChart3,
  Calculator
} from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { format } from "date-fns";
import { toast } from "sonner";

const GameDetail = () => {
  const { gameId } = useParams<{ gameId: string }>();
  const navigate = useNavigate();
  
  const { loading, error, data } = useQuery(GET_GAME_BY_ID, {
    variables: { gameId },
  });

  if (error) {
    console.error("Error loading game:", error);
    toast.error("Failed to load game details");
  }

  const game = data?.getGameById;

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <Link to="/games" className="hover:text-primary transition-colors">
          Games
        </Link>
        <ChevronRight className="h-4 w-4" />
        <span className="text-foreground font-medium">
          {loading ? "Loading..." : game?.gameName}
        </span>
      </div>

      <PageHeader
        heading={loading ? <Skeleton className="h-8 w-64" /> : game?.gameName}
        description={loading ? <Skeleton className="h-4 w-96" /> : game?.description || "Game details and components"}
      >
        {!loading && (
          <Button variant="outline" onClick={() => navigate(`/games/${gameId}/edit`)}>
            <Edit className="mr-2 h-4 w-4" />
            Edit Game
          </Button>
        )}
      </PageHeader>

      {loading ? (
        <div className="space-y-4">
          <Skeleton className="h-[200px] w-full" />
          <Skeleton className="h-[400px] w-full" />
        </div>
      ) : game ? (
        <div className="space-y-8">
          <Card>
            <CardHeader>
              <CardTitle>Game Information</CardTitle>
              <CardDescription>Basic details about this game</CardDescription>
            </CardHeader>
            <CardContent className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <div className="space-y-2">
                <h3 className="text-sm font-medium text-muted-foreground">Game ID</h3>
                <p className="font-mono text-sm">{game.gameId}</p>
              </div>
              <div className="space-y-2">
                <h3 className="text-sm font-medium text-muted-foreground">Status</h3>
                <div className="flex items-center">
                  {game.active ? (
                    <>
                      <div className="h-2 w-2 rounded-full bg-green-500 mr-2" />
                      <p>Active</p>
                    </>
                  ) : (
                    <>
                      <div className="h-2 w-2 rounded-full bg-gray-300 mr-2" />
                      <p>Inactive</p>
                    </>
                  )}
                </div>
              </div>
              <div className="space-y-2">
                <h3 className="text-sm font-medium text-muted-foreground">Created</h3>
                <p>{game.createdAt ? format(new Date(game.createdAt), "PPP") : "Unknown"}</p>
              </div>
              <div className="space-y-2">
                <h3 className="text-sm font-medium text-muted-foreground">Last Updated</h3>
                <p>{game.updatedAt ? format(new Date(game.updatedAt), "PPP") : "Unknown"}</p>
              </div>
            </CardContent>
          </Card>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <Card className="hover-scale cursor-pointer" onClick={() => navigate(`/games/${gameId}/competencies`)}>
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center text-base">
                  <BrainCircuit className="h-5 w-5 mr-2 text-primary" />
                  Competencies
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">Manage skills and abilities being assessed in this game</p>
              </CardContent>
              <CardFooter className="pt-0">
                <Button variant="secondary" size="sm" onClick={(e) => {
                  e.stopPropagation();
                  navigate(`/games/${gameId}/competencies/new`);
                }}>
                  Add Competency
                </Button>
              </CardFooter>
            </Card>

            <Card className="hover-scale cursor-pointer" onClick={() => navigate(`/games/${gameId}/stages`)}>
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center text-base">
                  <Layers className="h-5 w-5 mr-2 text-primary" />
                  Stages
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">Configure the different phases and levels of the game</p>
              </CardContent>
              <CardFooter className="pt-0">
                <Button variant="secondary" size="sm" onClick={(e) => {
                  e.stopPropagation();
                  navigate(`/games/${gameId}/stages/new`);
                }}>
                  Add Stage
                </Button>
              </CardFooter>
            </Card>

            <Card className="hover-scale cursor-pointer" onClick={() => navigate(`/games/${gameId}/metrics`)}>
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center text-base">
                  <Calculator className="h-5 w-5 mr-2 text-primary" />
                  Game Metrics
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">Define game-wide calculations and metrics</p>
              </CardContent>
              <CardFooter className="pt-0">
                <Button variant="secondary" size="sm" onClick={(e) => {
                  e.stopPropagation();
                  navigate(`/games/${gameId}/metrics/new`);
                }}>
                  Add Game Metric
                </Button>
              </CardFooter>
            </Card>

            <Card className="hover-scale cursor-pointer" onClick={() => navigate(`/games/${gameId}/constants`)}>
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center text-base">
                  <Hash className="h-5 w-5 mr-2 text-primary" />
                  Constants
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">Define reusable values for calculations and formulas</p>
              </CardContent>
              <CardFooter className="pt-0">
                <Button variant="secondary" size="sm" onClick={(e) => {
                  e.stopPropagation();
                  navigate(`/games/${gameId}/constants/new`);
                }}>
                  Add Constant
                </Button>
              </CardFooter>
            </Card>

            <Card className="hover-scale cursor-pointer" onClick={() => navigate(`/analytics?gameId=${gameId}`)}>
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center text-base">
                  <BarChart3 className="h-5 w-5 mr-2 text-primary" />
                  Analytics
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">View performance statistics and insights</p>
              </CardContent>
              <CardFooter className="pt-0">
                <Button variant="secondary" size="sm" onClick={(e) => {
                  e.stopPropagation();
                  navigate(`/analytics?gameId=${gameId}`);
                }}>
                  View Analytics
                </Button>
              </CardFooter>
            </Card>

            <Card className="hover-scale cursor-pointer" onClick={() => navigate(`/games/${gameId}/settings`)}>
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center text-base">
                  <Settings className="h-5 w-5 mr-2 text-primary" />
                  Game Settings
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">Configure game-wide settings and parameters</p>
              </CardContent>
              <CardFooter className="pt-0">
                <Button variant="secondary" size="sm" onClick={(e) => {
                  e.stopPropagation();
                  navigate(`/games/${gameId}/edit`);
                }}>
                  Edit Settings
                </Button>
              </CardFooter>
            </Card>
          </div>

          <Tabs defaultValue="constants">
            <TabsList className="grid w-full grid-cols-2 md:grid-cols-4">
              <TabsTrigger value="constants">Constants</TabsTrigger>
              <TabsTrigger value="benchmarks">Benchmarks</TabsTrigger>
              <TabsTrigger value="formulas">Formulas</TabsTrigger>
              <TabsTrigger value="parameters">Parameters</TabsTrigger>
            </TabsList>
            
            <TabsContent value="constants" className="space-y-4">
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle>Game Constants</CardTitle>
                      <CardDescription>Constants available for use in metric formulas</CardDescription>
                    </div>
                    <Button size="sm" onClick={() => navigate(`/games/${gameId}/constants/new`)}>Add Constant</Button>
                  </div>
                </CardHeader>
                <CardContent>
                  {game.constantParameters && game.constantParameters.length > 0 ? (
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                      {game.constantParameters.map((constant: any) => (
                        <Card key={constant.constId}>
                          <CardHeader className="py-3">
                            <CardTitle className="text-base">{constant.constName}</CardTitle>
                            <CardDescription className="text-xs">
                              <code>{constant.constKey}</code>
                            </CardDescription>
                          </CardHeader>
                          <CardContent className="py-2">
                            <div className="flex items-center justify-between">
                              <div className="font-mono text-lg font-bold">{constant.constValue}</div>
                              {constant.constDescription && (
                                <div className="text-xs text-muted-foreground truncate max-w-[150px]">
                                  {constant.constDescription}
                                </div>
                              )}
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center py-8">
                      <p className="text-muted-foreground mb-4">No constants defined for this game yet.</p>
                      <Button onClick={() => navigate(`/games/${gameId}/constants/new`)}>
                        Add Constant
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="benchmarks">
              <Card>
                <CardHeader>
                  <CardTitle>Benchmark Data</CardTitle>
                  <CardDescription>Target performance values for game components</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-center py-8">
                    <p className="text-muted-foreground">Benchmark data will be displayed here</p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="formulas">
              <Card>
                <CardHeader>
                  <CardTitle>Game Formulas</CardTitle>
                  <CardDescription>Overview of all calculation formulas used</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-center py-8">
                    <p className="text-muted-foreground">Formula documentation will be displayed here</p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="parameters">
              <Card>
                <CardHeader>
                  <CardTitle>Required Parameters</CardTitle>
                  <CardDescription>Input parameters needed for game calculations</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-center py-8">
                    <p className="text-muted-foreground">Parameter information will be displayed here</p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-12">
          <FileText className="h-16 w-16 text-muted-foreground mb-4" />
          <h2 className="text-2xl font-bold mb-2">Game Not Found</h2>
          <p className="text-muted-foreground mb-6 text-center max-w-md">
            We couldn't find the game you're looking for. It may have been deleted or you may not have permission to view it.
          </p>
          <Button onClick={() => navigate("/games")}>
            Back to Games
          </Button>
        </div>
      )}
    </div>
  );
};

export default GameDetail;
