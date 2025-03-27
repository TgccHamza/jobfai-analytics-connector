
import React from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useQuery } from "@apollo/client";
import { GET_GAME_BY_ID, GET_STAGES_BY_GAME } from "@/graphql/queries";
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
  Clock,
  ArrowUpDown,
  PlusCircle,
  Info,
  LayoutList,
  Eye
} from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { formatDistanceToNow } from "date-fns";
import { toast } from "sonner";

const StagesPage = () => {
  const { gameId } = useParams<{ gameId: string }>();
  const navigate = useNavigate();
  
  const { 
    loading, 
    error, 
    data 
  } = useQuery(GET_STAGES_BY_GAME, {
    variables: { gameId },
  });

  const { data: gameData } = useQuery(GET_GAME_BY_ID, {
    variables: { gameId },
  });

  const game = gameData?.getGameById;
  const stages = data?.getStagesByGame;

  if (error) {
    console.error("Error loading stages:", error);
    toast.error("Failed to load stages");
  }

  const handleViewStage = (stageId: string) => {
    navigate(`/games/${gameId}/stages/${stageId}`);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <Link to="/games" className="hover:text-primary transition-colors">
          Games
        </Link>
        <ChevronRight className="h-4 w-4" />
        <span className="text-foreground font-medium">
          {loading ? "Loading..." : game?.gameName} - Stages
        </span>
      </div>

      <PageHeader
        heading="Stages"
        description="Manage game stages and their associated metrics"
      >
        <Button onClick={() => navigate(`/games/${gameId}/stages/new`)}>
          <PlusCircle className="mr-2 h-4 w-4" />
          Add Stage
        </Button>
      </PageHeader>
      
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Stages</CardTitle>
            <CardDescription>
              View and manage all stages for this game
            </CardDescription>
          </div>
          <Button onClick={() => navigate(`/games/${gameId}/stages/new`)}>
            <PlusCircle className="mr-2 h-4 w-4" />
            Add Stage
          </Button>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="space-y-3">
              {Array.from({ length: 5 }).map((_, i) => (
                <Skeleton key={i} className="h-12 w-full" />
              ))}
            </div>
          ) : stages && stages.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Order</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Key</TableHead>
                  <TableHead>Optimal Time</TableHead>
                  <TableHead>Benchmark</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {stages.map((stage: any) => (
                  <TableRow 
                    key={stage.stageId}
                    className="cursor-pointer hover:bg-muted/50"
                    onClick={() => handleViewStage(stage.stageId)}
                  >
                    <TableCell>
                      <Badge variant="outline" className="font-mono">
                        {stage.stageOrder}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="font-medium">{stage.stageName}</div>
                      {stage.description && (
                        <div className="text-sm text-muted-foreground truncate max-w-[300px]">
                          {stage.description}
                        </div>
                      )}
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className="font-mono">
                        {stage.stageKey}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center">
                        <Clock className="h-4 w-4 mr-2 text-muted-foreground" />
                        <span>{stage.optimalTime || "N/A"} sec</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center">
                        <ArrowUpDown className="h-4 w-4 mr-2 text-muted-foreground" />
                        <span>{stage.benchmark || "N/A"}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      {stage.createdAt ? (
                        formatDistanceToNow(new Date(stage.createdAt), { addSuffix: true })
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
                          handleViewStage(stage.stageId);
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
                No stages found for this game.
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default StagesPage;
