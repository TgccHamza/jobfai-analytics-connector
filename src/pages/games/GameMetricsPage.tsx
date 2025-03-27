
import React from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useQuery } from "@apollo/client";
import { GET_GAME_BY_ID, GET_GAME_METRICS_BY_GAME } from "@/graphql/queries";
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
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import {
  ChevronRight,
  Plus,
  Code,
  PlusCircle,
  Info,
  Target,
  Eye
} from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { formatDistanceToNow } from "date-fns";
import { toast } from "sonner";

const GameMetricsPage = () => {
  const { gameId } = useParams<{ gameId: string }>();
  const navigate = useNavigate();
  
  const { 
    loading, 
    error, 
    data 
  } = useQuery(GET_GAME_METRICS_BY_GAME, {
    variables: { gameId },
  });

  const { data: gameData } = useQuery(GET_GAME_BY_ID, {
    variables: { gameId },
  });

  const game = gameData?.getGameById;
  const metrics = data?.getGameMetricsByGame;

  if (error) {
    console.error("Error loading game metrics:", error);
    toast.error("Failed to load game metrics");
  }

  const handleViewMetric = (metricId: string) => {
    navigate(`/games/${gameId}/metrics/${metricId}`);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <Link to="/games" className="hover:text-primary transition-colors">
          Games
        </Link>
        <ChevronRight className="h-4 w-4" />
        <Link to={`/games/${gameId}`} className="hover:text-primary transition-colors">
          {loading ? "Loading..." : game?.gameName || "Game"}
        </Link>
        <ChevronRight className="h-4 w-4" />
        <span className="text-foreground font-medium">Game Metrics</span>
      </div>

      <PageHeader
        heading="Game Metrics"
        description="Manage game-wide metrics and calculations"
      >
        <Button onClick={() => navigate(`/games/${gameId}/metrics/new`)}>
          <PlusCircle className="mr-2 h-4 w-4" />
          Add Game Metric
        </Button>
      </PageHeader>
      
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Game Metrics</CardTitle>
            <CardDescription>
              These metrics are applied across the entire game
            </CardDescription>
          </div>
          <Button onClick={() => navigate(`/games/${gameId}/metrics/new`)}>
            <PlusCircle className="mr-2 h-4 w-4" />
            Add Game Metric
          </Button>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="space-y-3">
              {Array.from({ length: 5 }).map((_, i) => (
                <Skeleton key={i} className="h-12 w-full" />
              ))}
            </div>
          ) : metrics && metrics.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Key</TableHead>
                  <TableHead>Formula</TableHead>
                  <TableHead>Parameters</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {metrics.map((metric: any) => (
                  <TableRow 
                    key={metric.metricId}
                    className="cursor-pointer hover:bg-muted/50"
                    onClick={() => handleViewMetric(metric.metricId)}
                  >
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
                        <Code className="h-4 w-4 mr-2 text-muted-foreground" />
                        <span className="font-mono text-xs truncate max-w-[150px]">{metric.formula}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center">
                        <Target className="h-4 w-4 mr-2 text-muted-foreground" />
                        <span>{metric.parameters?.length || 0}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      {metric.createdAt ? (
                        formatDistanceToNow(new Date(metric.createdAt), { addSuffix: true })
                      ) : (
                        "Unknown"
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleViewMetric(metric.metricId);
                        }}
                      >
                        <Eye className="h-4 w-4 mr-2" />
                        View
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <div className="flex flex-col items-center justify-center py-8">
              <Info className="h-12 w-12 text-muted-foreground opacity-30 mb-4" />
              <p className="text-sm text-muted-foreground">
                No game metrics defined yet.
              </p>
              <p className="text-sm text-muted-foreground mb-4">
                Game metrics apply to the entire game and can aggregate data from multiple stages.
              </p>
              <Button onClick={() => navigate(`/games/${gameId}/metrics/new`)}>
                <PlusCircle className="mr-2 h-4 w-4" />
                Add Game Metric
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default GameMetricsPage;
