
import React from "react";
import { PageHeader } from "@/components/ui/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { AreaChart, BarChart, BarChart3, PieChart } from "lucide-react";

const AnalyticsPage: React.FC = () => {
  return (
    <div className="space-y-6 animate-fade-in">
      <PageHeader
        heading="Performance Analytics"
        description="View and analyze player performance across all games"
      >
        <Select defaultValue="7days">
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select Period" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="today">Today</SelectItem>
            <SelectItem value="7days">Last 7 Days</SelectItem>
            <SelectItem value="30days">Last 30 Days</SelectItem>
            <SelectItem value="90days">Last 90 Days</SelectItem>
            <SelectItem value="custom">Custom Range</SelectItem>
          </SelectContent>
        </Select>
      </PageHeader>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <MetricCard
          title="Total Players"
          value="2,856"
          icon={<BarChart3 className="h-5 w-5" />}
          change={12}
        />
        <MetricCard
          title="Avg. Completion Time"
          value="14.2 min"
          icon={<BarChart3 className="h-5 w-5" />}
          change={-3}
        />
        <MetricCard
          title="Avg. Score"
          value="78.5%"
          icon={<BarChart3 className="h-5 w-5" />}
          change={5}
        />
        <MetricCard
          title="Games Played"
          value="5,432"
          icon={<BarChart3 className="h-5 w-5" />}
          change={22}
        />
      </div>

      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-full grid-cols-4 lg:w-[400px]">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="games">Games</TabsTrigger>
          <TabsTrigger value="competencies">Competencies</TabsTrigger>
          <TabsTrigger value="players">Players</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview" className="animate-fade-in space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <ChartCard 
              title="Performance Trends" 
              icon={<AreaChart className="h-5 w-5" />} 
            />
            <ChartCard 
              title="Game Completion Rate" 
              icon={<PieChart className="h-5 w-5" />} 
            />
          </div>
          <ChartCard 
            title="Competence Scores Distribution" 
            icon={<BarChart3 className="h-5 w-5" />} 
            height="lg"
          />
        </TabsContent>
        
        <TabsContent value="games" className="animate-fade-in">
          <ChartCard 
            title="Game Performance Comparison" 
            icon={<BarChart3 className="h-5 w-5" />} 
            height="lg"
          />
        </TabsContent>
        
        <TabsContent value="competencies" className="animate-fade-in">
          <ChartCard 
            title="Competency Analysis" 
            icon={<BarChart3 className="h-5 w-5" />} 
            height="lg"
          />
        </TabsContent>
        
        <TabsContent value="players" className="animate-fade-in">
          <ChartCard 
            title="Player Performance" 
            icon={<BarChart3 className="h-5 w-5" />} 
            height="lg"
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};

interface MetricCardProps {
  title: string;
  value: string;
  icon: React.ReactNode;
  change: number;
}

const MetricCard: React.FC<MetricCardProps> = ({ title, value, icon, change }) => {
  const isPositive = change >= 0;
  
  return (
    <Card className="hover-scale">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        {icon}
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        <p className={`text-xs ${isPositive ? 'text-green-500' : 'text-red-500'} flex items-center gap-1 mt-1`}>
          <span>{isPositive ? '↑' : '↓'} {Math.abs(change)}%</span>
          <span className="text-muted-foreground">from previous period</span>
        </p>
      </CardContent>
    </Card>
  );
};

interface ChartCardProps {
  title: string;
  icon: React.ReactNode;
  height?: 'md' | 'lg';
}

const ChartCard: React.FC<ChartCardProps> = ({ title, icon, height = 'md' }) => {
  const heightClass = height === 'lg' ? 'h-[500px]' : 'h-[300px]';
  
  return (
    <Card className="hover-scale">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium flex items-center gap-2">
          {icon}
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className={`${heightClass} flex items-center justify-center`}>
          <div className="text-muted-foreground">
            Chart visualization will appear here
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default AnalyticsPage;
