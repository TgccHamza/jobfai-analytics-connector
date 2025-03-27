import React, { useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useQuery, useMutation } from "@apollo/client";
import { GET_GAME_BY_ID, GET_COMPETENCE_BY_ID } from "@/graphql/queries";
import { CREATE_METRIC, CREATE_PARAMETER } from "@/graphql/mutations";
import { PageHeader } from "@/components/ui/page-header";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { ChevronRight, Calculator, PlusCircle, X } from "lucide-react";
import { toast } from "sonner";

// Form schemas
const metricFormSchema = z.object({
  metricKey: z.string().min(1, "Metric key is required"),
  metricName: z.string().min(1, "Metric name is required"),
  metricDescription: z.string().optional(),
  benchmark: z.coerce.number().optional(),
  formula: z.string().optional(),
  weight: z.coerce.number().default(1.0),
});

const parameterFormSchema = z.object({
  paramKey: z.string().min(1, "Parameter key is required"),
  paramName: z.string().min(1, "Parameter name is required"),
  paramDescription: z.string().optional(),
  paramType: z.enum(["STRING", "NUMBER", "BOOLEAN", "DATE"]),
  isRequired: z.boolean().default(true),
  defaultValue: z.string().optional(),
});

type MetricFormValues = z.infer<typeof metricFormSchema>;
type ParameterFormValues = z.infer<typeof parameterFormSchema>;

const AddMetricToCompetency = () => {
  const { gameId, competenceId } = useParams<{ gameId: string; competenceId: string }>();
  const navigate = useNavigate();
  const [parameters, setParameters] = useState<ParameterFormValues[]>([]);
  const [isParameterDialogOpen, setIsParameterDialogOpen] = useState(false);

  // Query game and competence data
  const { data: gameData, loading: gameLoading } = useQuery(GET_GAME_BY_ID, {
    variables: { gameId },
    onError: (error) => {
      console.error("Error loading game:", error);
      toast.error("Failed to load game data");
    },
  });

  const { data: competenceData, loading: competenceLoading } = useQuery(GET_COMPETENCE_BY_ID, {
    variables: { competenceId },
    onError: (error) => {
      console.error("Error loading competence:", error);
      toast.error("Failed to load competency data");
    },
  });

  // Mutations
  const [createMetric, { loading: creatingMetric }] = useMutation(CREATE_METRIC, {
    onCompleted: (data) => {
      const metricId = data.createCompetenceMetric.metricId;
      
      // Create parameters if any
      if (parameters.length > 0) {
        parameters.forEach((param) => {
          createParameter({
            variables: {
              input: {
                ...param,
                metricId,
              },
            },
          });
        });
      }
      
      toast.success("Metric created successfully");
      navigate(`/games/${gameId}/competencies/${competenceId}`);
    },
    onError: (error) => {
      console.error("Error creating metric:", error);
      toast.error("Failed to create metric");
    },
  });

  const [createParameter] = useMutation(CREATE_PARAMETER, {
    onError: (error) => {
      console.error("Error creating parameter:", error);
      toast.error("Failed to create parameter");
    },
  });

  // Metric form
  const metricForm = useForm<MetricFormValues>({
    resolver: zodResolver(metricFormSchema),
    defaultValues: {
      metricKey: "",
      metricName: "",
      metricDescription: "",
      formula: "",
      weight: 1.0,
    },
  });

  // Parameter form
  const parameterForm = useForm<ParameterFormValues>({
    resolver: zodResolver(parameterFormSchema),
    defaultValues: {
      paramKey: "",
      paramName: "",
      paramDescription: "",
      paramType: "NUMBER",
      isRequired: true,
      defaultValue: "",
    },
  });

  const onSubmitMetric = (values: MetricFormValues) => {
    createMetric({
      variables: {
        input: {
          ...values,
          competenceId,
        },
      },
    });
  };

  const onSubmitParameter = (values: ParameterFormValues) => {
    setParameters([...parameters, values]);
    parameterForm.reset();
    setIsParameterDialogOpen(false);
    toast.success("Parameter added to list");
  };

  const removeParameter = (index: number) => {
    const updatedParameters = [...parameters];
    updatedParameters.splice(index, 1);
    setParameters(updatedParameters);
  };

  const loading = gameLoading || competenceLoading;
  const game = gameData?.getGameById;
  const competence = competenceData?.getCompetenceById;

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
        <Link to="/games" className="hover:text-primary transition-colors">
          Games
        </Link>
        <ChevronRight className="h-4 w-4" />
        <Link to={`/games/${gameId}`} className="hover:text-primary transition-colors">
          {loading ? "Loading..." : game?.gameName}
        </Link>
        <ChevronRight className="h-4 w-4" />
        <Link to={`/games/${gameId}/competencies`} className="hover:text-primary transition-colors">
          Competencies
        </Link>
        <ChevronRight className="h-4 w-4" />
        <Link to={`/games/${gameId}/competencies/${competenceId}`} className="hover:text-primary transition-colors">
          {loading ? "Loading..." : competence?.competenceName}
        </Link>
        <ChevronRight className="h-4 w-4" />
        <span className="text-foreground font-medium">Add Metric</span>
      </div>

      <PageHeader
        heading="Add Metric to Competency"
        description={`Add a new metric to ${competence?.competenceName || "this competency"}`}
      />

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Metric Details</CardTitle>
            <CardDescription>
              Define the metric that will be used in this competency
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...metricForm}>
              <form id="metric-form" onSubmit={metricForm.handleSubmit(onSubmitMetric)} className="space-y-4">
                <FormField
                  control={metricForm.control}
                  name="metricKey"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Metric Key</FormLabel>
                      <FormControl>
                        <Input placeholder="time_spent" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={metricForm.control}
                  name="metricName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Metric Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Time Spent" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={metricForm.control}
                  name="metricDescription"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Measures the time spent by the player..."
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={metricForm.control}
                    name="benchmark"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Benchmark</FormLabel>
                        <FormControl>
                          <Input type="number" step="0.01" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={metricForm.control}
                    name="weight"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Weight</FormLabel>
                        <FormControl>
                          <Input type="number" step="0.1" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <FormField
                  control={metricForm.control}
                  name="formula"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Formula</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="(param1 + param2) / 100"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </form>
            </Form>
          </CardContent>
        </Card>

        <div className="space-y-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Parameters</CardTitle>
                <CardDescription>
                  Add parameters used in the metric formula
                </CardDescription>
              </div>
              <Dialog open={isParameterDialogOpen} onOpenChange={setIsParameterDialogOpen}>
                <DialogTrigger asChild>
                  <Button size="sm">
                    <PlusCircle className="h-4 w-4 mr-2" />
                    Add Parameter
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Add Parameter</DialogTitle>
                    <DialogDescription>
                      Define a new parameter for this metric
                    </DialogDescription>
                  </DialogHeader>
                  <Form {...parameterForm}>
                    <form
                      id="parameter-form"
                      onSubmit={parameterForm.handleSubmit(onSubmitParameter)}
                      className="space-y-4"
                    >
                      <FormField
                        control={parameterForm.control}
                        name="paramKey"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Parameter Key</FormLabel>
                            <FormControl>
                              <Input placeholder="completion_time" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={parameterForm.control}
                        name="paramName"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Parameter Name</FormLabel>
                            <FormControl>
                              <Input placeholder="Completion Time" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={parameterForm.control}
                        name="paramDescription"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Description</FormLabel>
                            <FormControl>
                              <Textarea
                                placeholder="Time taken to complete the task..."
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <div className="grid grid-cols-2 gap-4">
                        <FormField
                          control={parameterForm.control}
                          name="paramType"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Type</FormLabel>
                              <Select
                                onValueChange={field.onChange}
                                defaultValue={field.value}
                              >
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Select type" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  <SelectItem value="NUMBER">Number</SelectItem>
                                  <SelectItem value="STRING">String</SelectItem>
                                  <SelectItem value="BOOLEAN">Boolean</SelectItem>
                                  <SelectItem value="DATE">Date</SelectItem>
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={parameterForm.control}
                          name="defaultValue"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Default Value</FormLabel>
                              <FormControl>
                                <Input {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                      <FormField
                        control={parameterForm.control}
                        name="isRequired"
                        render={({ field }) => (
                          <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                            <div className="space-y-0.5">
                              <FormLabel>Required</FormLabel>
                            </div>
                            <FormControl>
                              <Switch
                                checked={field.value}
                                onCheckedChange={field.onChange}
                              />
                            </FormControl>
                          </FormItem>
                        )}
                      />
                    </form>
                  </Form>
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setIsParameterDialogOpen(false)}>
                      Cancel
                    </Button>
                    <Button type="submit" form="parameter-form">
                      Add Parameter
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </CardHeader>
            <CardContent>
              {parameters.length > 0 ? (
                <div className="space-y-2">
                  {parameters.map((param, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between bg-muted/50 p-3 rounded-md"
                    >
                      <div className="flex items-center space-x-3">
                        <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                          <Calculator className="h-4 w-4 text-primary" />
                        </div>
                        <div>
                          <div className="font-medium">{param.paramName}</div>
                          <div className="text-xs text-muted-foreground font-mono">
                            {param.paramKey}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-4">
                        <div className="text-sm text-muted-foreground">
                          {param.paramType}
                        </div>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => removeParameter(index)}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-8 text-center">
                  <Calculator className="h-12 w-12 text-muted-foreground opacity-20 mb-4" />
                  <p className="text-muted-foreground mb-4">No parameters added yet</p>
                  <Button 
                    variant="outline" 
                    onClick={() => setIsParameterDialogOpen(true)}
                  >
                    <PlusCircle className="mr-2 h-4 w-4" />
                    Add First Parameter
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Summary</CardTitle>
              <CardDescription>Review your metric details before saving</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <div className="text-sm font-medium">Metric Information</div>
                <div className="text-sm text-muted-foreground mt-1">
                  Make sure all required fields are filled correctly.
                </div>
              </div>
              <div>
                <div className="text-sm font-medium">Parameters</div>
                <div className="text-sm text-muted-foreground mt-1">
                  {parameters.length} parameter(s) added
                </div>
              </div>
              <Separator />
              <div className="text-sm">
                After saving, you'll return to the competency detail page.
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button
                variant="outline"
                onClick={() => navigate(`/games/${gameId}/competencies/${competenceId}`)}
              >
                Cancel
              </Button>
              <Button 
                type="submit" 
                form="metric-form" 
                disabled={creatingMetric}
              >
                {creatingMetric ? "Creating..." : "Create Metric"}
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default AddMetricToCompetency;
