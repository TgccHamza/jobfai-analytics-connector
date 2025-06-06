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
  Target,
  ArrowUpDown,
  PlusCircle,
  Info,
  Scale,
  Eye
} from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { formatDistanceToNow } from "date-fns";
import { toast } from "sonner";

const CompetenciesPage = () => {
  const { gameId } = useParams<{ gameId: string }>();
  const navigate = useNavigate();
  
  const { 
    loading, 
    error, 
    data,
    refetch 
  } = useQuery(GET_COMPETENCIES_BY_GAME, {
    variables: { gameId },
  });

  const { data: gameData } = useQuery(GET_GAME_BY_ID, {
    variables: { gameId },
  });

  const game = gameData?.getGameById;
  const competencies = data?.getCompetenciesByGame;

  if (error) {
    console.error("Error loading competencies:", error);
    toast.error("Failed to load competencies");
  }

  // Add this to ensure users can click to view competency details
  const handleViewCompetency = (competenceId: string) => {
    navigate(`/games/${gameId}/competencies/${competenceId}`);
  };

  // Update the table rows to include click handlers and view buttons
  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <Link to="/games" className="hover:text-primary transition-colors">
          Games
        </Link>
        <ChevronRight className="h-4 w-4" />
        <span className="text-foreground font-medium">
          {loading ? "Loading..." : game?.gameName} - Competencies
        </span>
      </div>

      <PageHeader
        heading="Competencies"
        description="Manage competencies and their associated metrics"
      >
        <Button onClick={() => navigate(`/games/${gameId}/competencies/new`)}>
          <PlusCircle className="mr-2 h-4 w-4" />
          Add Competency
        </Button>
      </PageHeader>
      
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Competencies</CardTitle>
            <CardDescription>
              View and manage all competencies for this game
            </CardDescription>
          </div>
          <Button onClick={() => navigate(`/games/${gameId}/competencies/new`)}>
            <PlusCircle className="mr-2 h-4 w-4" />
            Add Competency
          </Button>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="space-y-3">
              {Array.from({ length: 5 }).map((_, i) => (
                <Skeleton key={i} className="h-12 w-full" />
              ))}
            </div>
          ) : competencies && competencies.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Key</TableHead>
                  <TableHead>Metrics</TableHead>
                  <TableHead>Weight</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {competencies.map((competence: any) => (
                  <TableRow 
                    key={competence.competenceId}
                    className="cursor-pointer hover:bg-muted/50"
                    onClick={() => handleViewCompetency(competence.competenceId)}
                  >
                    <TableCell>
                      <div className="font-medium">{competence.competenceName}</div>
                      {competence.description && (
                        <div className="text-sm text-muted-foreground truncate max-w-[300px]">
                          {competence.description}
                        </div>
                      )}
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className="font-mono">
                        {competence.competenceKey}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center">
                        <Target className="h-4 w-4 mr-2 text-muted-foreground" />
                        <span>{competence.metrics?.length || 0}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center">
                        <Scale className="h-4 w-4 mr-2 text-muted-foreground" />
                        <span>{competence.weight || 1.0}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      {competence.createdAt ? (
                        formatDistanceToNow(new Date(competence.createdAt), { addSuffix: true })
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
                          handleViewCompetency(competence.competenceId);
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
                No competencies found for this game.
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default CompetenciesPage;
