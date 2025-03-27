
import React from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useQuery } from "@apollo/client";
import { GET_STAGE_BY_ID } from "@/graphql/queries";
import { PageHeader } from "@/components/ui/page-header";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger
} from "@/components/ui/tabs";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { 
  ChevronRight, 
  Clock, 
  File, 
  Info, 
  Link as LinkIcon, 
  PlusCircle,
  Target,
  Scale
} from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";

const StageDetail = () => {
  const { gameId, stageId } = useParams<{ gameId: string; stageId: string }>();
  const navigate = useNavigate();
  
  const { loading, error, data } = useQuery(GET_STAGE_BY_ID, {
    variables: { stageId },
  });

  if (error) {
    console.error("Error loading stage details:", error);
    toast.error("Failed to load stage details");
  }

  const stage = data?.getStageById;

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <Link to="/games" className="hover:text-primary transition-colors">
          Games
        </Link>
        <ChevronRight className="h-4 w-4" />
        <Link to={`/games/${gameId}`} className="hover:text-primary transition-colors">
          {loading ? "Loading..." : stage?.game?.gameName || "Game"}
        </Link>
        <ChevronRight className="h-4 w-4" />
        <Link to={`/games/${gameId}/stages`} className="hover:text-primary transition-colors">
          Stages
        </Link>
        <ChevronRight className="h-4 w-4" />
        <span className="text-foreground font-medium">
          {loading ? "Loading..." : stage?.stageName}
        </span>
      </div>

      <PageHeader
        heading={loading ? "Loading..." : stage?.stageName || "Stage Details"}
        description="View and manage stage details and metrics"
      >
        <Button onClick={() => navigate(`/games/${gameId}/stages/${stageId}/metrics/new`)}>
          <PlusCircle className="mr-2 h-4 w-4" />
          Add Metric
        </Button>
      </PageHeader>

      {loading ? (
        <div className="space-y-4">
          <Skeleton className="h-8 w-1/3" />
          <Skeleton className="h-32 w-full" />
          <Skeleton className="h-64 w-full" />
        </div>
      ) : stage ? (
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Stage Details</CardTitle>
              <CardDescription>Key information about this stage</CardDescription>
            </CardHeader>
            <CardContent className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              <div className="space-y-2">
                <h3 className="text-sm font-medium text-muted-foreground">Stage Key</h3>
                <div className="flex items-center">
                  <LinkIcon className="h-4 w-4 mr-2 text-muted-foreground" />
                  <p className="font-mono bg-muted px-2 py-1 rounded text-sm">{stage.stageKey}</p>
                </div>
              </div>
              <div className="space-y-2">
                <h3 className="text-sm font-medium text-muted-foreground">Order</h3>
                <p className="font-medium">{stage.stageOrder}</p>
              </div>
              <div className="space-y-2">
                <h3 className="text-sm font-medium text-muted-foreground">Optimal Time</h3>
                <div className="flex items-center">
                  <Clock className="h-4 w-4 mr-2 text-muted-foreground" />
                  <p className="font-medium">{stage.optimalTime || "N/A"} seconds</p>
                </div>
              </div>
              <div className="space-y-2">
                <h3 className="text-sm font-medium text-muted-foreground">Benchmark</h3>
                <div className="flex items-center">
                  <Target className="h-4 w-4 mr-2 text-muted-foreground" />
                  <p className="font-medium">{stage.benchmark || "N/A"}</p>
                </div>
              </div>
              {stage.description && (
                <div className="sm:col-span-2 space-y-2">
                  <h3 className="text-sm font-medium text-muted-foreground">Description</h3>
                  <p>{stage.description}</p>
                </div>
              )}
            </CardContent>
          </Card>

          <Tabs defaultValue="metrics" className="w-full">
            <TabsList className="grid w-full md:w-auto grid-cols-1 md:grid-cols-2">
              <TabsTrigger value="metrics">Metrics</TabsTrigger>
              <TabsTrigger value="performance">Performance Data</TabsTrigger>
            </TabsList>
            
            <TabsContent value="metrics" className="space-y-4">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-semibold">Associated Metrics</h2>
                <Button onClick={() => navigate(`/games/${gameId}/stages/${stageId}/metrics/new`)}>
                  <PlusCircle className="mr-2 h-4 w-4" />
                  Add Metric
                </Button>
              </div>
              
              {stage.metrics && stage.metrics.length > 0 ? (
                <Card>
                  <CardContent className="p-0">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Metric Name</TableHead>
                          <TableHead>Key</TableHead>
                          <TableHead>Weight</TableHead>
                          <TableHead>Benchmark</TableHead>
                          <TableHead>Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {stage.metrics.map((metric: any) => (
                          <TableRow key={metric.metricId}>
                            <TableCell>
                              <div className="font-medium">{metric.metricName}</div>
                              {metric.metricDescription && (
                                <div className="text-sm text-muted-foreground truncate max-w-[300px]">
                                  {metric.metricDescription}
                                </div>
                              )}
                            </TableCell>
                            <TableCell>
                              <Badge variant="outline" className="font-mono">
                                {metric.metricKey}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center">
                                <Scale className="h-4 w-4 mr-2 text-muted-foreground" />
                                <span>{metric.weight || 1.0}</span>
                              </div>
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center">
                                <Target className="h-4 w-4 mr-2 text-muted-foreground" />
                                <span>{metric.benchmark || "N/A"}</span>
                              </div>
                            </TableCell>
                            <TableCell>
                              <Button 
                                variant="ghost" 
                                size="sm"
                                onClick={() => navigate(`/games/${gameId}/competencies/metrics/${metric.metricId}`)}
                              >
                                <File className="h-4 w-4 mr-2" />
                                View
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </CardContent>
                </Card>
              ) : (
                <Card>
                  <CardContent className="flex flex-col items-center justify-center py-8">
                    <Info className="h-12 w-12 text-muted-foreground opacity-30 mb-4" />
                    <p className="text-muted-foreground mb-4">No metrics associated with this stage yet.</p>
                    <Button onClick={() => navigate(`/games/${gameId}/stages/${stageId}/metrics/new`)}>
                      <PlusCircle className="mr-2 h-4 w-4" />
                      Add Metric
                    </Button>
                  </CardContent>
                </Card>
              )}
            </TabsContent>
            
            <TabsContent value="performance" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Performance Data</CardTitle>
                  <CardDescription>
                    View performance statistics for this stage
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-center py-8">
                    <p className="text-muted-foreground">Performance data will be displayed here</p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      ) : (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-8">
            <Info className="h-12 w-12 text-muted-foreground opacity-30 mb-4" />
            <p className="text-lg font-medium mb-2">Stage not found</p>
            <p className="text-muted-foreground mb-4">The stage you're looking for doesn't exist or you don't have access.</p>
            <Button onClick={() => navigate(`/games/${gameId}/stages`)}>
              Go Back to Stages
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default StageDetail;
