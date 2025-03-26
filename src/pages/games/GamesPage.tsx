
import React, { useState } from "react";
import { useQuery } from "@apollo/client";
import { Link, useNavigate } from "react-router-dom";
import { GET_GAMES } from "@/graphql/queries";
import { PageHeader } from "@/components/ui/page-header";
import { Button } from "@/components/ui/button";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { 
  Calendar, 
  ChevronDown,
  Filter, 
  Game, 
  Plus, 
  Search, 
  SlidersHorizontal 
} from "lucide-react";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { EmptyState } from "@/components/ui/empty-state";
import { Skeleton } from "@/components/ui/skeleton";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface Game {
  gameId: string;
  gameName: string;
  description: string;
  active: boolean;
  createdAt: string;
  updatedAt: string;
}

const GamesPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const { loading, error, data } = useQuery(GET_GAMES);

  if (error) {
    console.error("Error fetching games:", error);
  }

  const filteredGames = data?.getGames
    ? data.getGames.filter((game: Game) =>
        game.gameName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (game.description && game.description.toLowerCase().includes(searchQuery.toLowerCase()))
      )
    : [];

  const activeGames = filteredGames.filter((game: Game) => game.active);
  const inactiveGames = filteredGames.filter((game: Game) => !game.active);

  return (
    <div className="space-y-6 animate-fade-in">
      <PageHeader
        heading="Games Management"
        description="Create and manage your assessment games"
      >
        <Button onClick={() => navigate("/games/new")} size="sm">
          <Plus className="mr-2 h-4 w-4" />
          New Game
        </Button>
      </PageHeader>

      <div className="flex flex-col md:flex-row gap-3 justify-between">
        <div className="relative w-full md:w-72">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search games..."
            className="w-full pl-8 bg-background"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="flex gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="h-10">
                <Filter className="mr-2 h-4 w-4" />
                Filter
                <ChevronDown className="ml-2 h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-[200px]">
              <DropdownMenuItem>Active Games</DropdownMenuItem>
              <DropdownMenuItem>Inactive Games</DropdownMenuItem>
              <DropdownMenuItem>Recently Updated</DropdownMenuItem>
              <DropdownMenuItem>Recently Created</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <Button variant="outline" size="sm" className="h-10">
            <SlidersHorizontal className="mr-2 h-4 w-4" />
            View Options
          </Button>
        </div>
      </div>

      <Tabs defaultValue="all" className="w-full">
        <TabsList className="grid w-full grid-cols-3 md:w-[400px]">
          <TabsTrigger value="all">All Games</TabsTrigger>
          <TabsTrigger value="active">Active</TabsTrigger>
          <TabsTrigger value="inactive">Inactive</TabsTrigger>
        </TabsList>
        
        <TabsContent value="all" className="animate-fade-in">
          <GamesList 
            games={filteredGames} 
            loading={loading} 
            onCreateNew={() => navigate("/games/new")}
          />
        </TabsContent>
        
        <TabsContent value="active" className="animate-fade-in">
          <GamesList 
            games={activeGames} 
            loading={loading} 
            onCreateNew={() => navigate("/games/new")}
            emptyStateTitle="No active games"
            emptyStateDescription="You don't have any active games at the moment."
          />
        </TabsContent>
        
        <TabsContent value="inactive" className="animate-fade-in">
          <GamesList 
            games={inactiveGames} 
            loading={loading} 
            onCreateNew={() => navigate("/games/new")}
            emptyStateTitle="No inactive games"
            emptyStateDescription="You don't have any inactive games at the moment."
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};

interface GamesListProps {
  games: Game[];
  loading: boolean;
  onCreateNew: () => void;
  emptyStateTitle?: string;
  emptyStateDescription?: string;
}

const GamesList: React.FC<GamesListProps> = ({ 
  games, 
  loading, 
  onCreateNew,
  emptyStateTitle = "No games found",
  emptyStateDescription = "You haven't created any games yet."
}) => {
  if (loading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="space-y-4">
            {Array(5).fill(0).map((_, i) => (
              <div key={i} className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <Skeleton className="h-12 w-12 rounded-md" />
                  <div>
                    <Skeleton className="h-5 w-[200px] mb-2" />
                    <Skeleton className="h-4 w-[300px]" />
                  </div>
                </div>
                <div className="flex gap-2">
                  <Skeleton className="h-9 w-16 rounded-md" />
                  <Skeleton className="h-9 w-16 rounded-md" />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!games.length) {
    return (
      <EmptyState
        title={emptyStateTitle}
        description={emptyStateDescription}
        icon={<Game className="h-12 w-12 opacity-20" />}
        action={{
          label: "Create Game",
          onClick: onCreateNew,
        }}
        className="min-h-[300px]"
      />
    );
  }

  return (
    <Card className="overflow-hidden border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Created</TableHead>
            <TableHead>Last Updated</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {games.map((game: Game) => (
            <TableRow key={game.gameId} className="hover-scale hover:bg-muted/30">
              <TableCell className="font-medium">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-md bg-primary/10 flex items-center justify-center text-primary">
                    <Game className="h-5 w-5" />
                  </div>
                  <div>
                    <div className="font-medium">{game.gameName}</div>
                    <div className="text-xs text-muted-foreground line-clamp-1 max-w-[300px]">
                      {game.description || "No description provided"}
                    </div>
                  </div>
                </div>
              </TableCell>
              <TableCell>
                <Badge variant={game.active ? "default" : "secondary"} className="capitalize">
                  {game.active ? "Active" : "Inactive"}
                </Badge>
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">
                    {new Date(game.createdAt).toLocaleDateString()}
                  </span>
                </div>
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">
                    {new Date(game.updatedAt).toLocaleDateString()}
                  </span>
                </div>
              </TableCell>
              <TableCell className="text-right">
                <div className="flex justify-end gap-2">
                  <Button 
                    variant="outline" 
                    size="sm"
                    asChild
                  >
                    <Link to={`/games/${game.gameId}/competencies`}>
                      Competencies
                    </Link>
                  </Button>
                  <Button 
                    variant="default" 
                    size="sm"
                    asChild
                  >
                    <Link to={`/games/${game.gameId}`}>
                      Manage
                    </Link>
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Card>
  );
};

export default GamesPage;
