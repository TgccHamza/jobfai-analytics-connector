
import React, { useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useMutation, useQuery } from "@apollo/client";
import { ASSIGN_METRIC_TO_STAGE } from "@/graphql/mutations";
import { GET_STAGE_BY_ID, GET_METRICS_BY_GAME } from "@/graphql/queries";
import { PageHeader } from "@/components/ui/page-header";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { 
  ChevronRight, 
  Info, 
  Target,
  Scale,
  FileText
} from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Skeleton } from "@/components/ui/skeleton";

const assignMetricFormSchema = z.object({
  metricId: z.string().min(1, "Please select a metric"),
});

type AssignMetricFormValues = z.infer<typeof assignMetricFormSchema>;

const AddMetricToStage = () => {
  const { gameId, stageId } = useParams<{ gameId: string; stageId: string }>();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Get stage details
  const { data: stageData, loading: stageLoading, error: stageError } = useQuery(GET_STAGE_BY_ID, {
    variables: { stageId },
  });

  // Get available metrics for this game
  const { data: metricsData, loading: metricsLoading, error: metricsError } = useQuery(GET_METRICS_BY_GAME, {
    variables: { gameId },
  });

  const [assignMetricToStage] = useMutation(ASSIGN_METRIC_TO_STAGE, {
    onCompleted: () => {
      toast.success("Metric assigned to stage successfully");
      navigate(`/games/${gameId}/stages/${stageId}`);
    },
    onError: (error) => {
      toast.error(`Failed to assign metric: ${error.message}`);
      console.error("Assign metric error:", error);
      setIsSubmitting(false);
    },
    refetchQueries: [
      { query: GET_STAGE_BY_ID, variables: { stageId } }
    ]
  });

  const form = useForm<AssignMetricFormValues>({
    resolver: zodResolver(assignMetricFormSchema),
    defaultValues: {
      metricId: "",
    },
  });

  const onSubmit = async (data: AssignMetricFormValues) => {
    setIsSubmitting(true);
    
    try {
      await assignMetricToStage({
        variables: {
          input: {
            stageId,
            metricId: data.metricId,
          },
        },
      });
    } catch (error) {
      // Error is handled in the mutation onError callback
      console.error("Form submission error:", error);
    }
  };

  const stage = stageData?.getStageById;
  const metrics = metricsData?.getMetricsByGame || [];
  
  // Filter out metrics that are already assigned to this stage
  const assignedMetricIds = stage?.metrics?.map((m: any) => m.metricId) || [];
  const availableMetrics = metrics.filter((m: any) => !assignedMetricIds.includes(m.metricId));

  const loading = stageLoading || metricsLoading;
  const error = stageError || metricsError;

  if (error) {
    console.error("Error loading data:", error);
    toast.error("Failed to load required data");
  }

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
        <Link to={`/games/${gameId}/stages/${stageId}`} className="hover:text-primary transition-colors">
          {loading ? "Loading..." : stage?.stageName || "Stage"}
        </Link>
        <ChevronRight className="h-4 w-4" />
        <span className="text-foreground font-medium">Add Metric</span>
      </div>

      <PageHeader
        heading="Add Metric to Stage"
        description="Assign an existing metric to this stage"
      />

      {loading ? (
        <Card>
          <CardHeader>
            <Skeleton className="h-8 w-1/3" />
            <Skeleton className="h-4 w-1/2" />
          </CardHeader>
          <CardContent>
            <Skeleton className="h-10 w-full mb-4" />
            <Skeleton className="h-32 w-full" />
          </CardContent>
          <CardFooter>
            <Skeleton className="h-10 w-1/4 ml-auto" />
          </CardFooter>
        </Card>
      ) : availableMetrics.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-8">
            <Info className="h-12 w-12 text-muted-foreground opacity-30 mb-4" />
            <p className="text-lg font-medium mb-2">No available metrics</p>
            <p className="text-muted-foreground mb-4 text-center max-w-md">
              All existing metrics are already assigned to this stage or there are no metrics created for this game yet.
            </p>
            <div className="flex gap-4">
              <Button variant="outline" onClick={() => navigate(`/games/${gameId}/competencies`)}>
                Manage Competencies
              </Button>
              <Button onClick={() => navigate(`/games/${gameId}/stages/${stageId}`)}>
                Back to Stage
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>Assign Metric</CardTitle>
            <CardDescription>
              Select a metric to assign to this stage
            </CardDescription>
          </CardHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <CardContent className="space-y-4">
                <FormField
                  control={form.control}
                  name="metricId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Select Metric*</FormLabel>
                      <FormControl>
                        <Select 
                          onValueChange={field.onChange} 
                          value={field.value}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select a metric" />
                          </SelectTrigger>
                          <SelectContent>
                            {availableMetrics.map((metric: any) => (
                              <SelectItem 
                                key={metric.metricId} 
                                value={metric.metricId}
                              >
                                <div className="flex items-center gap-2">
                                  <span>{metric.metricName}</span>
                                  <span className="text-muted-foreground text-xs">
                                    ({metric.metricKey})
                                  </span>
                                </div>
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </FormControl>
                      <FormDescription>
                        Choose a metric to track in this stage
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                {form.watch("metricId") && (
                  <div className="bg-muted/50 p-4 rounded-md">
                    <h3 className="font-medium mb-2">Selected Metric Details</h3>
                    {(() => {
                      const selectedMetric = metrics.find(
                        (m: any) => m.metricId === form.watch("metricId")
                      );
                      return selectedMetric ? (
                        <div className="space-y-2">
                          <div className="flex items-center gap-2">
                            <FileText className="h-4 w-4 text-muted-foreground" />
                            <span className="text-sm">
                              <span className="font-medium">Description: </span>
                              {selectedMetric.metricDescription || "No description provided"}
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Target className="h-4 w-4 text-muted-foreground" />
                            <span className="text-sm">
                              <span className="font-medium">Benchmark: </span>
                              {selectedMetric.benchmark ?? "N/A"}
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Scale className="h-4 w-4 text-muted-foreground" />
                            <span className="text-sm">
                              <span className="font-medium">Weight: </span>
                              {selectedMetric.weight ?? 1.0}
                            </span>
                          </div>
                        </div>
                      ) : <p className="text-sm text-muted-foreground">Loading metric details...</p>;
                    })()}
                  </div>
                )}
              </CardContent>
              <CardFooter className="flex justify-end space-x-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => navigate(`/games/${gameId}/stages/${stageId}`)}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? "Assigning..." : "Assign Metric"}
                </Button>
              </CardFooter>
            </form>
          </Form>
        </Card>
      )}
    </div>
  );
};

export default AddMetricToStage;
