import React, { useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useQuery, useMutation } from "@apollo/client";
import { GET_GAME_BY_ID, GET_COMPETENCE_BY_ID } from "@/graphql/queries";
import { UPDATE_GAME, ASSIGN_METRIC_TO_COMPETENCE } from "@/graphql/mutations";
import { PageHeader } from "@/components/ui/page-header";
import { Button } from "@/components/ui/button";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle, 
  CardFooter
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import {
  ChevronRight,
  Edit,
  Gauge,
  PlusCircle,
  Scale,
  Trash2,
  Target,
  Calculator,
} from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { formatDistanceToNow } from "date-fns";
import { toast } from "sonner";

const CompetencyDetail = () => {
  const { gameId, competenceId } = useParams<{ gameId: string; competenceId: string }>();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("overview");
  
  const { 
    loading: gameLoading, 
    error: gameError, 
    data: gameData 
  } = useQuery(GET_GAME_BY_ID, {
    variables: { gameId }
  });
  
  const { 
    loading: competenceLoading, 
    error: competenceError, 
    data: competenceData,
    refetch: refetchCompetence
  } = useQuery(GET_COMPETENCE_BY_ID, {
    variables: { competenceId },
    onError: (error) => {
      console.error("Error loading competence data:", error);
      toast.error("Failed to load competency details");
    }
  });

  const loading = gameLoading || competenceLoading;
  const error = gameError || competenceError;

  const game = gameData?.getGameById;
  const competence = competenceData?.getCompetenceById;

  const [assignMetricToCompetence, { loading: assigningMetric }] = useMutation(ASSIGN_METRIC_TO_COMPETENCE, {
    onCompleted: () => {
      toast.success("Metric assigned successfully");
      refetchCompetence();
    },
    onError: (error) => {
      console.error("Error assigning metric:", error);
      toast.error("Failed to assign metric");
    }
  });

  const handleAddMetric = () => {
    navigate(`/games/${gameId}/competencies/${competenceId}/metrics/new`);
  };

  const handleEditCompetency = () => {
    navigate(`/games/${gameId}/competencies/${competenceId}/edit`);
  };

  const handleDeleteCompetency = () => {
    toast.error("Delete functionality not implemented yet");
  };

  if (error) {
    console.error("Error loading data:", error);
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
        <Link to="/games" className="hover:text-primary transition-colors">
          Games
        </Link>
        <ChevronRight className="h-4 w-4" />
        <Link 
          to={`/games/${gameId}`} 
          className="hover:text-primary transition-colors"
        >
          {loading ? "Loading..." : game?.gameName}
        </Link>
        <ChevronRight className="h-4 w-4" />
        <Link 
          to={`/games/${gameId}/competencies`} 
          className="hover:text-primary transition-colors"
        >
          Competencies
        </Link>
        <ChevronRight className="h-4 w-4" />
        <span className="text-foreground font-medium">
          {loading ? "Loading..." : competence?.competenceName}
        </span>
      </div>

      <PageHeader
        heading={loading ? <Skeleton className="h-8 w-[300px]" /> : competence?.competenceName}
        description={loading ? <Skeleton className="h-4 w-[500px]" /> : competence?.description || "No description provided"}
      >
        <Button 
          variant="outline" 
          size="sm" 
          className="gap-2"
          onClick={handleEditCompetency}
        >
          <Edit className="h-4 w-4" />
          Edit Competency
        </Button>
        <Button 
          variant="destructive" 
          size="sm" 
          className="gap-2"
          onClick={handleDeleteCompetency}
        >
          <Trash2 className="h-4 w-4" />
          Delete
        </Button>
      </PageHeader>

      <div className="grid gap-6 md:grid-cols-3">
        <InfoCard
          title="Competency Info"
          icon={<Target className="h-5 w-5" />}
          loading={loading}
        >
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Key</p>
                {loading ? (
                  <Skeleton className="h-6 w-16" />
                ) : (
                  <p className="text-sm font-mono">{competence?.competenceKey}</p>
                )}
              </div>
              
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">ID</p>
                {loading ? (
                  <Skeleton className="h-5 w-[120px]" />
                ) : (
                  <p className="text-sm font-mono">{competence?.competenceId.substring(0, 8)}...</p>
                )}
              </div>
            </div>
            
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Weight</p>
              {loading ? (
                <Skeleton className="h-5 w-full" />
              ) : (
                <div className="flex items-center gap-2">
                  <Scale className="h-4 w-4 text-muted-foreground" />
                  <p className="text-sm">{competence?.weight || 1.0}</p>
                </div>
              )}
            </div>
            
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Benchmark</p>
              {loading ? (
                <Skeleton className="h-5 w-full" />
              ) : (
                <div className="flex items-center gap-2">
                  <Gauge className="h-4 w-4 text-muted-foreground" />
                  <p className="text-sm">{competence?.benchmark || "Not set"}</p>
                </div>
              )}
            </div>
            
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Created</p>
              {loading ? (
                <Skeleton className="h-5 w-full" />
              ) : (
                <p className="text-sm">
                  {competence?.createdAt 
                    ? `${formatDistanceToNow(new Date(competence.createdAt))} ago` 
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
                  {competence?.updatedAt 
                    ? `${formatDistanceToNow(new Date(competence.updatedAt))} ago` 
                    : "Unknown"}
                </p>
              )}
            </div>
          </div>
        </InfoCard>
        
        <InfoCard
          title="Associated Metrics"
          icon={<Calculator className="h-5 w-5" />}
          actionBtn={
            <Button
              variant="ghost"
              size="sm"
              className="gap-1"
              onClick={handleAddMetric}
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
            ) : competence?.metrics && competence.metrics.length > 0 ? (
              <>
                <div className="text-sm font-medium">{competence.metrics.length} Metrics</div>
                <div className="space-y-2 mt-3">
                  {competence.metrics.slice(0, 4).map((metric: any) => (
                    <div 
                      key={metric.metricId} 
                      className="flex items-center justify-between rounded-md p-2 hover:bg-secondary/50 transition-colors cursor-pointer"
                      onClick={() => navigate(`/games/${gameId}/metrics/${metric.metricId}`)}
                    >
                      <div className="flex items-center gap-3">
                        <div className="flex items-center justify-center w-6 h-6 rounded-full bg-primary/10 text-primary">
                          <Calculator className="h-3 w-3" />
                        </div>
                        <span className="text-sm font-medium">{metric.metricName}</span>
                      </div>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <Scale className="h-3 w-3" />
                        <span>Weight: {metric.weight || 1.0}</span>
                      </div>
                    </div>
                  ))}
                  
                  {competence.metrics.length > 4 && (
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="w-full text-xs mt-1"
                    >
                      View all {competence.metrics.length} metrics
                    </Button>
                  )}
                </div>
              </>
            ) : (
              <div className="flex flex-col items-center justify-center py-6 text-center">
                <Calculator className="h-8 w-8 text-muted-foreground opacity-20 mb-2" />
                <p className="text-sm text-muted-foreground mb-3">No metrics assigned yet</p>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={handleAddMetric}
                >
                  <PlusCircle className="mr-2 h-3 w-3" />
                  Add First Metric
                </Button>
              </div>
            )}
          </div>
        </InfoCard>
        
        <InfoCard
          title="Calculation"
          icon={<Gauge className="h-5 w-5" />}
          loading={loading}
        >
          {loading ? (
            <Skeleton className="h-24 w-full" />
          ) : (
            <div className="space-y-4">
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Formula</p>
                <div className="bg-muted p-3 rounded-md font-mono text-sm">
                  {competence?.formula || "No formula defined"}
                </div>
              </div>
              
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Benchmark</p>
                <div className="flex items-center gap-2">
                  <p className="text-sm">{competence?.benchmark || "Not set"}</p>
                </div>
              </div>
            </div>
          )}
        </InfoCard>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="w-full sm:w-[400px]">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="metrics">Metrics</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview" className="animate-fade-in">
          <Card>
            <CardHeader>
              <CardTitle>Competency Overview</CardTitle>
              <CardDescription>
                Complete view of competency structure and metrics
              </CardDescription>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="space-y-4">
                  <Skeleton className="h-20 w-full" />
                  <Skeleton className="h-[300px] w-full" />
                </div>
              ) : (
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-medium mb-2">Description</h3>
                    <p className="text-sm text-muted-foreground">
                      {competence?.description || "No description provided for this competency."}
                    </p>
                  </div>
                  
                  <Separator />
                  
                  <div>
                    <h3 className="text-lg font-medium mb-3">Metrics</h3>
                    {competence?.metrics && competence.metrics.length > 0 ? (
                      <div className="space-y-3">
                        {competence.metrics.map((metric: any) => (
                          <Card key={metric.metricId} className="overflow-hidden">
                            <CardHeader className="bg-muted/50 py-3">
                              <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                  <Calculator className="h-4 w-4 text-primary" />
                                  <CardTitle className="text-base">{metric.metricName}</CardTitle>
                                </div>
                                <Badge variant="outline" className="font-mono text-xs">
                                  {metric.metricKey}
                                </Badge>
                              </div>
                            </CardHeader>
                            <CardContent className="py-3">
                              <div className="space-y-3">
                                <p className="text-sm">{metric.metricDescription || "No description provided"}</p>
                                
                                <div className="grid grid-cols-2 gap-4 text-sm">
                                  <div>
                                    <span className="text-muted-foreground">Weight:</span> {metric.weight || 1.0}
                                  </div>
                                  <div>
                                    <span className="text-muted-foreground">Benchmark:</span> {metric.benchmark || "Not set"}
                                  </div>
                                </div>
                                
                                {metric.formula && (
                                  <div>
                                    <span className="text-sm text-muted-foreground">Formula:</span>
                                    <div className="bg-muted p-2 rounded-md font-mono text-xs mt-1">
                                      {metric.formula}
                                    </div>
                                  </div>
                                )}
                              </div>
                            </CardContent>
                            <CardFooter className="bg-muted/30 py-2 border-t">
                              <div className="flex items-center justify-end w-full gap-2">
                                <Button 
                                  variant="ghost" 
                                  size="sm"
                                  onClick={() => navigate(`/games/${gameId}/metrics/${metric.metricId}`)}
                                >
                                  View Details
                                </Button>
                                <Button 
                                  variant="outline" 
                                  size="sm"
                                  onClick={() => navigate(`/games/${gameId}/metrics/${metric.metricId}/edit`)}
                                >
                                  <Edit className="h-3 w-3 mr-1" />
                                  Edit
                                </Button>
                              </div>
                            </CardFooter>
                          </Card>
                        ))}
                      </div>
                    ) : (
                      <div className="flex flex-col items-center justify-center py-12 text-center border rounded-lg">
                        <Calculator className="h-12 w-12 text-muted-foreground opacity-20 mb-2" />
                        <p className="text-muted-foreground mb-4">This competency doesn't have any metrics yet</p>
                        <Button onClick={handleAddMetric}>
                          <PlusCircle className="mr-2 h-4 w-4" />
                          Add Metric
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="metrics" className="animate-fade-in">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Metrics</CardTitle>
                <CardDescription>
                  Manage the metrics used to calculate this competency
                </CardDescription>
              </div>
              <Button size="sm" onClick={handleAddMetric}>
                <PlusCircle className="mr-2 h-4 w-4" />
                Add Metric
              </Button>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="space-y-4">
                  <Skeleton className="h-[200px] w-full" />
                </div>
              ) : competence?.metrics && competence.metrics.length > 0 ? (
                <div className="rounded-md border">
                  <div className="grid grid-cols-5 bg-muted/50 p-3 text-sm font-medium">
                    <div>Name</div>
                    <div>Key</div>
                    <div>Weight</div>
                    <div>Benchmark</div>
                    <div className="text-right">Actions</div>
                  </div>
                  <div className="divide-y">
                    {competence.metrics.map((metric: any) => (
                      <div key={metric.metricId} className="grid grid-cols-5 p-3 text-sm items-center">
                        <div>{metric.metricName}</div>
                        <div className="font-mono">{metric.metricKey}</div>
                        <div>{metric.weight || 1.0}</div>
                        <div>{metric.benchmark || "—"}</div>
                        <div className="flex items-center justify-end gap-2">
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            onClick={() => navigate(`/games/${gameId}/metrics/${metric.metricId}`)}
                          >
                            View
                          </Button>
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => navigate(`/games/${gameId}/metrics/${metric.metricId}/edit`)}
                          >
                            Edit
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="text-center py-12">
                  <p className="text-sm text-muted-foreground mb-4">
                    No metrics defined for this competency yet.
                  </p>
                  <Button size="sm" onClick={handleAddMetric}>
                    <PlusCircle className="mr-2 h-4 w-4" />
                    Add First Metric
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="analytics" className="animate-fade-in">
          <Card>
            <CardHeader>
              <CardTitle>Competency Analytics</CardTitle>
              <CardDescription>
                Player performance analytics for this competency
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-20">
                <Gauge className="h-16 w-16 mx-auto text-muted-foreground opacity-20 mb-4" />
                <h3 className="text-lg font-medium mb-2">No Analytics Data</h3>
                <p className="text-sm text-muted-foreground max-w-md mx-auto">
                  Analytics for this competency will appear here once player data is available.
                </p>
              </div>
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

export default CompetencyDetail;
