
import React from "react";
import { useQuery } from "@apollo/client";
import { GET_GAMES } from "@/graphql/queries";
import { PageHeader } from "@/components/ui/page-header";
import { DataCard } from "@/components/ui/data-card";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useNavigate } from "react-router-dom";
import { AreaChart, BarChart3, Game, Plus, User, Users } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

interface Game {
  gameId: string;
  gameName: string;
  description: string;
  active: boolean;
  createdAt: string;
  updatedAt: string;
}

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const { loading, error, data } = useQuery(GET_GAMES);

  const activeGames = data?.getGames.filter((game: Game) => game.active).length || 0;
  const totalGames = data?.getGames.length || 0;

  if (error) {
    console.error("Error fetching games:", error);
  }

  return (
    <div className="space-y-8">
      <PageHeader
        heading="Analytics Dashboard"
        description="Overview of your games and performance metrics"
        separator={false}
      >
        <Button
          onClick={() => navigate("/games/new")}
          className="ml-auto"
        >
          <Plus className="mr-2 h-4 w-4" />
          New Game
        </Button>
      </PageHeader>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <DataCard
          title="Total Games"
          value={loading ? "—" : totalGames}
          icon="bar"
          change={{ value: 12, type: "increase" }}
          description="Total games in the platform"
        />
        <DataCard
          title="Active Games"
          value={loading ? "—" : activeGames}
          icon="bar"
          change={{ value: 8, type: "increase" }}
          description="Currently active games"
        />
        <DataCard
          title="Total Players"
          value="1,234"
          icon="line"
          change={{ value: 5, type: "increase" }}
          description="Players who participated"
        />
        <DataCard
          title="Avg. Performance"
          value="78.5%"
          icon="pie"
          change={{ value: 3, type: "decrease" }}
          description="Average player performance"
        />
      </div>

      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-full grid-cols-3 lg:w-[400px]">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="performance">Performance</TabsTrigger>
          <TabsTrigger value="metrics">Metrics</TabsTrigger>
        </TabsList>
        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <Card className="col-span-2">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Game className="h-5 w-5" />
                  Recent Games
                </CardTitle>
              </CardHeader>
              <CardContent>
                {loading ? (
                  Array(5)
                    .fill(0)
                    .map((_, i) => (
                      <div key={i} className="flex items-center py-2">
                        <Skeleton className="h-12 w-12 rounded-md" />
                        <div className="ml-4 space-y-2">
                          <Skeleton className="h-4 w-[200px]" />
                          <Skeleton className="h-3 w-[150px]" />
                        </div>
                      </div>
                    ))
                ) : data?.getGames?.length > 0 ? (
                  <div className="space-y-4">
                    {data.getGames.slice(0, 5).map((game: Game) => (
                      <div
                        key={game.gameId}
                        className="flex items-center justify-between rounded-md p-3 hover:bg-secondary/40 transition-colors cursor-pointer"
                        onClick={() => navigate(`/games/${game.gameId}`)}
                      >
                        <div className="flex items-center">
                          <div className="w-10 h-10 rounded-md bg-primary/10 flex items-center justify-center text-primary">
                            <Game className="h-5 w-5" />
                          </div>
                          <div className="ml-4">
                            <p className="text-sm font-medium">{game.gameName}</p>
                            <p className="text-xs text-muted-foreground">
                              {new Date(game.createdAt).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                        <div className={`text-xs font-medium px-2 py-1 rounded-full ${
                          game.active ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"
                        }`}>
                          {game.active ? "Active" : "Inactive"}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center py-6">
                    <p className="text-sm text-muted-foreground">No games found</p>
                    <Button
                      variant="outline"
                      size="sm"
                      className="mt-2"
                      onClick={() => navigate("/games/new")}
                    >
                      <Plus className="mr-2 h-3 w-3" />
                      Create Game
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  Top Performers
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {["Alice Smith", "Bob Johnson", "Carol Williams", "Dave Brown", "Eve Garcia"].map((name, index) => (
                    <div key={index} className="flex items-center">
                      <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center text-xs font-medium">
                        {name.split(" ").map(n => n[0]).join("")}
                      </div>
                      <div className="ml-3 flex-1">
                        <p className="text-sm font-medium">{name}</p>
                        <div className="mt-1 h-2 w-full rounded-full bg-secondary overflow-hidden">
                          <div 
                            className="h-full bg-primary rounded-full animate-pulse-subtle" 
                            style={{ width: `${95 - index * 5}%` }}
                          />
                        </div>
                      </div>
                      <p className="text-sm font-medium ml-2">{95 - index * 5}%</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AreaChart className="h-5 w-5" />
                Performance Trends
              </CardTitle>
            </CardHeader>
            <CardContent className="h-[300px] flex items-center justify-center">
              <p className="text-sm text-muted-foreground">Trend visualization will appear here</p>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="performance">
          <Card>
            <CardHeader>
              <CardTitle>Player Performance</CardTitle>
            </CardHeader>
            <CardContent className="h-[400px] flex items-center justify-center">
              <p className="text-sm text-muted-foreground">Performance data visualization will appear here</p>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="metrics">
          <Card>
            <CardHeader>
              <CardTitle>Key Metrics</CardTitle>
            </CardHeader>
            <CardContent className="h-[400px] flex items-center justify-center">
              <p className="text-sm text-muted-foreground">Metrics data visualization will appear here</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Dashboard;
