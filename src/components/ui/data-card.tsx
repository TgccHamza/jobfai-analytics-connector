
import React from "react";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { BarChart3, LineChart, PieChart, ArrowRight, ArrowUpRight, ArrowDownRight } from "lucide-react";

interface DataCardProps {
  title: string;
  value: string | number;
  description?: string;
  icon?: "bar" | "line" | "pie" | "none";
  change?: {
    value: number;
    type: "increase" | "decrease" | "neutral";
  };
  className?: string;
  children?: React.ReactNode;
}

export function DataCard({
  title,
  value,
  description,
  icon = "bar",
  change,
  className,
  children,
}: DataCardProps) {
  const getIcon = () => {
    switch (icon) {
      case "bar":
        return <BarChart3 className="h-6 w-6 opacity-75" />;
      case "line":
        return <LineChart className="h-6 w-6 opacity-75" />;
      case "pie":
        return <PieChart className="h-6 w-6 opacity-75" />;
      default:
        return null;
    }
  };

  const getChangeIcon = () => {
    switch (change?.type) {
      case "increase":
        return <ArrowUpRight className="h-4 w-4 text-green-500" />;
      case "decrease":
        return <ArrowDownRight className="h-4 w-4 text-red-500" />;
      default:
        return <ArrowRight className="h-4 w-4 text-gray-400" />;
    }
  };

  const getChangeColor = () => {
    switch (change?.type) {
      case "increase":
        return "text-green-500";
      case "decrease":
        return "text-red-500";
      default:
        return "text-gray-500";
    }
  };

  return (
    <Card className={cn("overflow-hidden hover-scale", className)}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        {getIcon()}
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        {change && (
          <div className="flex items-center gap-1 mt-1">
            {getChangeIcon()}
            <span className={cn("text-xs font-medium", getChangeColor())}>
              {Math.abs(change.value)}%
            </span>
            <span className="text-xs text-muted-foreground ml-1">from previous period</span>
          </div>
        )}
        {description && (
          <p className="text-xs text-muted-foreground mt-2">{description}</p>
        )}
      </CardContent>
      {children && <CardFooter className="px-4 pt-0">{children}</CardFooter>}
    </Card>
  );
}
