
import React from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useQuery } from "@apollo/client";
import { GET_GAME_BY_ID, GET_CONSTANTS_BY_GAME } from "@/graphql/queries";
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
  PlusCircle,
  Info,
  Hash,
  Edit
} from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { formatDistanceToNow } from "date-fns";
import { toast } from "sonner";

const ConstantsPage = () => {
  const { gameId } = useParams<{ gameId: string }>();
  const navigate = useNavigate();
  
  const { 
    loading, 
    error, 
    data 
  } = useQuery(GET_CONSTANTS_BY_GAME, {
    variables: { gameId },
  });

  const { data: gameData } = useQuery(GET_GAME_BY_ID, {
    variables: { gameId },
  });

  const game = gameData?.getGameById;
  const constants = data?.getConstantsByGame;

  if (error) {
    console.error("Error loading constants:", error);
    toast.error("Failed to load constants");
  }

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
        <span className="text-foreground font-medium">Constants</span>
      </div>

      <PageHeader
        heading="Game Constants"
        description="Manage constant values used in formulas and calculations"
      >
        <Button onClick={() => navigate(`/games/${gameId}/constants/new`)}>
          <PlusCircle className="mr-2 h-4 w-4" />
          Add Constant
        </Button>
      </PageHeader>
      
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Constants</CardTitle>
            <CardDescription>
              These values can be referenced in formulas and calculations
            </CardDescription>
          </div>
          <Button onClick={() => navigate(`/games/${gameId}/constants/new`)}>
            <PlusCircle className="mr-2 h-4 w-4" />
            Add Constant
          </Button>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="space-y-3">
              {Array.from({ length: 5 }).map((_, i) => (
                <Skeleton key={i} className="h-12 w-full" />
              ))}
            </div>
          ) : constants && constants.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Key</TableHead>
                  <TableHead>Value</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {constants.map((constant: any) => (
                  <TableRow key={constant.constId}>
                    <TableCell>
                      <div className="font-medium">{constant.constName}</div>
                      {constant.constDescription && (
                        <div className="text-sm text-muted-foreground truncate max-w-[300px]">
                          {constant.constDescription}
                        </div>
                      )}
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className="font-mono">
                        {constant.constKey}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center">
                        <Hash className="h-4 w-4 mr-2 text-muted-foreground" />
                        <span className="font-mono">{constant.constValue}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      {constant.createdAt ? (
                        formatDistanceToNow(new Date(constant.createdAt), { addSuffix: true })
                      ) : (
                        "Unknown"
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => navigate(`/games/${gameId}/constants/${constant.constId}/edit`)}
                      >
                        <Edit className="h-4 w-4 mr-2" />
                        Edit
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
                No constants defined for this game yet.
              </p>
              <p className="text-sm text-muted-foreground mb-4">
                Constants can be referenced in formulas by their key.
              </p>
              <Button onClick={() => navigate(`/games/${gameId}/constants/new`)}>
                <PlusCircle className="mr-2 h-4 w-4" />
                Add Constant
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ConstantsPage;
